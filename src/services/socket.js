import { io } from 'socket.io-client';
import { receiveMessage, markMessagesRead, setUserOnline, setUserOffline, fetchOnlineUsers, fetchConversations, syncMessages, groupMemberJoinedRemote, groupMemberLeftRemote, groupMemberRemovedRemote, groupDeletedRemote, groupUpdatedRemote } from '../store/slices/messagesSlice';
import { seatsUpdated, attendingUpdated, commentReceived, commentLikeUpdated } from '../store/slices/eventsSlice';
import { fetchMe, updateFollowCounts, logout } from '../store/slices/authSlice';
import { setFriendStatus, addIncomingRequest } from '../store/slices/usersSlice';
import { setConnectionOnline, setConnectionOffline } from '../store/slices/profileSlice';
import { notificationReceived } from '../store/slices/notificationsSlice';
import { showToast } from '../store/slices/toastSlice';
import { showLogin } from '../store/slices/uiSlice';
import { addPostRealtime, removePostRealtime, updatePostLikeCount, addCommentRealtime, updateCommentLikeCount } from '../store/slices/postsSlice';

// Build a bell-ready notification object from a raw socket payload.
function buildNotif(data) {
  const actor = data.actor ?? data.from ?? data.by ?? {};
  const name = actor.name ?? actor.fullName ?? 'Someone';
  const byType = {
    like:                     { emoji: data.reaction === 'love' ? '❤️' : '👍', text: `${name} reacted to your post` },
    comment:                  { emoji: '💬', text: `${name} commented on your post` },
    mention:                  { emoji: '@',  text: `${name} mentioned you in a post` },
    follow:                   { emoji: '👤', text: `${name} started following you` },
    friend_request:           { emoji: '🤝', text: `${name} sent you a connection request` },
    friend_request_accepted:  { emoji: '🤝', text: `${name} accepted your connection request` },
  };
  const meta = byType[data.type] ?? { emoji: '🔔', text: 'New notification' };
  return {
    id: data.id ?? data._id,
    type: data.type,
    // Backend already sends ready-to-render emoji/text for socket
    // notifications — prefer those, fall back to building them locally.
    emoji: data.emoji ?? meta.emoji,
    text: data.text ?? meta.text,
    actor,
    relatedPost: data.postId ?? data.relatedPost ?? null,
    createdAt: data.createdAt ?? new Date().toISOString(),
    unread: true,
  };
}

const BASE_URL = 'https://kick-analyst-backend-production.jay886631.workers.dev';

let socket = null;
let storeRef = null; // full Redux store — gives us dispatch + getState

// A message can land for a conversation the user has soft-deleted locally
// (see messagesSlice.deleteConversation), which the backend un-deletes on its
// end but our `conversations` array no longer has an entry for — refetch the
// list under whatever tab/search the user is currently looking at so it
// reappears instead of silently vanishing until the next manual refresh.
function resurrectConversationIfMissing(conversationId) {
  const state = storeRef.getState();
  if (!state.messages.conversations.find(c => c.id === conversationId)) {
    storeRef.dispatch(fetchConversations(state.messages.lastFetchParams));
  }
}

// Toast for an incoming message, from anywhere in the app — skipped only when
// the user is already looking at this exact conversation (activeConvId is
// reliably null whenever MessagesPage isn't mounted, see its unmount cleanup).
// Only wired to `new_message_notification` (the personal-room broadcast that
// always fires for a genuine recipient) — `new_message` is room-scoped and
// only reaches users who've joined that conversation, i.e. have it open, so
// calling this from both would risk a duplicate toast for no benefit.
function notifyNewMessage(conversationId, message) {
  const state = storeRef.getState();
  if (state.messages.activeConvId === conversationId) return;
  const conv = state.messages.conversations.find(c => c.id === conversationId);
  const sender = conv?.name || 'New message';
  const preview = message.text?.trim()
    ? message.text.trim()
    : (Array.isArray(message.media) && message.media.length) || message.mediaUrl
      ? 'Sent an attachment'
      : 'Sent you a message';
  storeRef.dispatch(showToast({
    message: `${sender}: ${preview}`,
    type: 'info',
    meta: { section: 'messages', convId: conversationId },
  }));
}

export function initSocket(token, store) {
  // Guard on the instance existing (not just `.connected`) — otherwise React
  // StrictMode's double-mount in dev creates a 2nd socket while the 1st is
  // still connecting, and every event fires twice.
  if (socket) return;
  storeRef = store;

  socket = io(BASE_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    upgrade: true,
    forceNew: false,
  });

  socket.on('connect', () => {
    // Fires on initial connect AND every reconnect — resync presence so
    // online/offline events missed while disconnected don't leave stale state.
    storeRef.dispatch(fetchOnlineUsers());

    // Subscribe to feed real-time updates
    const userId = storeRef.getState().auth.user?._id;
    if (userId) {
      socket.emit('feed:subscribe', { userId });
      console.log('[socket] subscribed to feed:', userId);
    }
  });

  // Backend sends this right after connect: the list of users already online
  // at the moment we joined, so we don't have to wait on the REST resync
  // above (or a live user_online push) to know who's already present.
  socket.on('users_online_sync', ({ onlineUsers } = {}) => {
    (onlineUsers ?? []).forEach(u => {
      const userId = u.id ?? u.userId ?? u._id;
      if (!userId) return;
      storeRef.dispatch(setUserOnline({ userId }));
      storeRef.dispatch(setConnectionOnline({ userId }));
    });
  });

  socket.on('new_message', ({ conversationId, message }) => {
    // TEMP DIAGNOSTIC — remove after inspecting the payload shape.
    console.log('[socket] new_message raw payload', JSON.stringify(message));
    const state = storeRef.getState();
    const msgId = message.id ?? message._id;
    const convMessages = state.messages.messages[conversationId] ?? [];

    // Already in state (added by sendMessage.fulfilled or notification) — skip
    if (msgId && convMessages.find(m => m.id === msgId)) return;

    // We have a pending (optimistic) message in this conversation → we are the sender.
    // sendMessage.fulfilled will confirm it; skip processing new_message for the sender.
    if (convMessages.some(m => m.pending)) return;

    // No pending message from us → we are the recipient
    storeRef.dispatch(receiveMessage({ convId: conversationId, message: { ...message, from: 'them' } }));
    resurrectConversationIfMissing(conversationId);
  });

  socket.on('new_message_notification', ({ conversationId, message }) => {
    // Personal room (user:<id>) — always a message from someone else
    storeRef.dispatch(receiveMessage({ convId: conversationId, message: { ...message, from: 'them' } }));
    resurrectConversationIfMissing(conversationId);
    notifyNewMessage(conversationId, message);
  });

  socket.on('messages_read', ({ conversationId }) => {
    storeRef.dispatch(markMessagesRead({ convId: conversationId }));
  });

  socket.on('user_online', ({ userId }) => {
    storeRef.dispatch(setUserOnline({ userId }));
    storeRef.dispatch(setConnectionOnline({ userId }));
  });

  socket.on('user_offline', ({ userId }) => {
    storeRef.dispatch(setUserOffline({ userId }));
    storeRef.dispatch(setConnectionOffline({ userId }));
  });

  socket.on('follow_update', (data) => {
    const myId = storeRef.getState().auth.user?._id ?? storeRef.getState().auth.user?.id;
    if (!myId) return;
    if (data.followerId === myId) {
      // I followed/unfollowed someone → my followingCount changed
      storeRef.dispatch(updateFollowCounts({ followingCount: data.followingCount }));
    } else if (data.followingId === myId) {
      // Someone followed/unfollowed me → my followerCount changed
      storeRef.dispatch(updateFollowCounts({ followerCount: data.followerCount }));
    }
  });

  socket.on('connection_count_update', (data) => {
    // Targeted only at the user who was followed/unfollowed — update both counts
    storeRef.dispatch(updateFollowCounts({
      followerCount: data.followerCount,
      followingCount: data.followingCount,
    }));
  });

  // Like / comment / follow → bell feed + toast.
  socket.on('notification', (data) => {
    const notif = buildNotif(data);
    storeRef.dispatch(notificationReceived(notif));
    storeRef.dispatch(showToast({ message: notif.text, type: 'info' }));
  });

  // Someone sent me a connection request → show it as incoming everywhere + bell.
  socket.on('friend_request', (data) => {
    const from = data.from ?? data.fromUser ?? data;
    const userId = from?._id ?? from?.id;
    if (!userId) return;
    const name = from.name ?? from.fullName ?? 'Someone';
    storeRef.dispatch(addIncomingRequest({
      requestId: data._id ?? data.requestId,
      userId,
      name,
      avatar: from.avatar?.startsWith?.('http') ? from.avatar : '',
      createdAt: data.createdAt ?? new Date().toISOString(),
    }));
    storeRef.dispatch(notificationReceived(buildNotif({ ...data, type: 'friend_request', actor: from })));
    storeRef.dispatch(showToast({ message: `${name} sent you a connection request`, type: 'info' }));
  });

  // Someone accepted my request → we're now connected + bell + toast.
  socket.on('friend_request_accepted', (data) => {
    const by = data.by ?? data.byUser ?? data.user ?? data;
    const userId = by?._id ?? by?.id;
    if (!userId) return;
    const name = by.name ?? by.fullName ?? 'Someone';
    storeRef.dispatch(setFriendStatus({ userId, status: 'connected' }));
    storeRef.dispatch(notificationReceived(buildNotif({ ...data, type: 'friend_request_accepted', actor: by })));
    storeRef.dispatch(showToast({ message: `${name} accepted your connection request`, type: 'success' }));
  });

  socket.on('friend_request_sent', (data) => {
    console.log('🔔 [socket] friend_request_sent:', data);
    // This event fires when current user sends a request to someone
    // Used to update sent requests list in real-time
  });

  socket.on('friend_request_cancelled', (data) => {
    console.log('🔔 [socket] friend_request_cancelled:', data);
    const { fromUserId, toUserId } = data ?? {};
    const currentUserId = storeRef.getState().auth.user?._id;
    // If current user cancelled their own request, this will be handled by component
    // If someone else cancelled to us, we don't need to do anything here
  });

  socket.on('friend_request_rejected', (data) => {
    console.log('🔔 [socket] friend_request_rejected:', data);
    const { fromUserId, toUserId } = data ?? {};
    const currentUserId = storeRef.getState().auth.user?._id;
    // If current user rejected someone's request, component handles removal from friendRequests
    // If someone rejected our sent request, component should remove from sent requests
  });

  socket.on('connection_auto_followed', (data) => {
    console.log('🔥 [socket] connection_auto_followed - AUTO-FOLLOW EVENT:', data);
    const { user1Id, user2Id, bothFollowingEachOther } = data ?? {};
    const currentUserId = storeRef.getState().auth.user?._id;

    if (!bothFollowingEachOther) return;

    // Update follow status for both users
    if (user1Id === currentUserId) {
      console.log('✅ [socket] Auto-followed user:', user2Id);
      storeRef.dispatch(showToast({ message: 'You are now following each other!', type: 'success' }));
    } else if (user2Id === currentUserId) {
      console.log('✅ [socket] Auto-followed user:', user1Id);
      storeRef.dispatch(showToast({ message: 'You are now following each other!', type: 'success' }));
    }
  });

  socket.on('event:seats_updated', data => {
    storeRef.dispatch(seatsUpdated(data));
  });

  socket.on('event:attending_updated', data => {
    storeRef.dispatch(attendingUpdated(data));
  });

  socket.on('event:new_comment', ({ eventId, comment }) => {
    storeRef.dispatch(commentReceived({ eventId, comment }));
  });

  socket.on('event:comment_liked', data => {
    storeRef.dispatch(commentLikeUpdated(data));
  });

  // Real-time feed updates
  socket.on('post:created', (postData) => {
    console.log('[socket] post:created', postData);
    storeRef.dispatch(addPostRealtime(postData));
  });

  socket.on('post:deleted', ({ postId }) => {
    console.log('[socket] post:deleted', postId);
    storeRef.dispatch(removePostRealtime(postId));
  });

  socket.on('post:liked', (data) => {
    console.log('🔥 [socket] post:liked EVENT RECEIVED:', JSON.stringify(data));
    const { postId, likeCount } = data ?? {};
    console.log('🔥 [socket] post:liked EXTRACTED:', { postId, likeCount, dataType: typeof data });
    if (postId && likeCount !== undefined) {
      console.log('✅ [socket] post:liked DISPATCHING to Redux');
      storeRef.dispatch(updatePostLikeCount({ postId, likeCount }));
    } else {
      console.warn('❌ [socket] post:liked FAILED - Missing fields:', { postId, likeCount, fullData: data });
    }
  });

  socket.on('comment:created', ({ postId, comment }) => {
    console.log('[socket] comment:created', postId, comment);
    storeRef.dispatch(addCommentRealtime({ postId, comment }));
  });

  socket.on('comment:liked', ({ postId, commentId, likeCount }) => {
    console.log('[socket] comment:liked', postId, commentId, likeCount);
    storeRef.dispatch(updateCommentLikeCount({ postId, commentId, likeCount }));
  });

  socket.on('reconnect', () => {
    // Resync authoritative counts after reconnect (per API contract)
    storeRef.dispatch(fetchMe());
    // Whatever the open chat missed while disconnected won't arrive via
    // socket now (it already happened) — pull it from the API immediately
    // instead of waiting for the next background poll.
    const activeConvId = storeRef.getState().messages.activeConvId;
    if (activeConvId) storeRef.dispatch(syncMessages({ convId: activeConvId }));
  });

  socket.on('error', ({ event, message }) => {
    console.warn('[socket] error:', event, message);
  });

  // DEBUG: Log when post room is joined
  const originalEmit = socket.emit.bind(socket);
  socket.emit = function(eventName, data) {
    if (eventName.includes('post') || eventName.includes('room')) {
      console.log(`[socket.emit] ${eventName}:`, data);
    }
    return originalEmit(eventName, data);
  };

  // Backend killed this session (e.g. account suspended) — log out immediately
  // rather than leaving a dead connection the user thinks is still live.
  socket.on('force_logout', ({ reason, message }) => {
    console.warn('[socket] force_logout:', reason, message);
    storeRef.dispatch(showToast({ message: message || 'You have been logged out.', type: 'error' }));
    storeRef.dispatch(logout());
    storeRef.dispatch(showLogin());
    disconnectSocket();
  });

  // The backend only interleaves "X joined"/"X left" system messages into the
  // REST GET /:id/messages response — it doesn't push their text over the
  // socket. So a membership event for the conversation the user has open
  // right now needs a fresh page-1 fetch to actually show that line; for any
  // other conversation, the lightweight reducer below (count/member-list only)
  // is enough, and the system message will show next time it's opened.
  function refetchIfOpen(conversationId) {
    if (storeRef.getState().messages.activeConvId === conversationId) {
      storeRef.dispatch(syncMessages({ convId: conversationId }));
    }
  }

  // Group membership changed elsewhere (someone joined/left/was removed) —
  // keep the member count (and the open member-list panel, if any) live.
  socket.on('group:member_joined', ({ conversationId, member, memberCount }) => {
    console.log('[socket] group:member_joined', conversationId, member, memberCount);
    storeRef.dispatch(groupMemberJoinedRemote({ convId: conversationId, member, memberCount }));
    refetchIfOpen(conversationId);
  });

  // `newAdmin` is only present when the departing member WAS the admin —
  // the backend auto-promotes whoever joined earliest.
  socket.on('group:member_left', ({ conversationId, userId, newAdmin, memberCount }) => {
    console.log('[socket] group:member_left', conversationId, userId, newAdmin, memberCount);
    const myUserId = storeRef.getState().auth.user?._id ?? storeRef.getState().auth.user?.id;
    storeRef.dispatch(groupMemberLeftRemote({ convId: conversationId, userId, newAdmin, memberCount, myUserId }));
    if (newAdmin?.id && newAdmin.id === myUserId) {
      storeRef.dispatch(showToast({ message: "You're now the admin of this group", type: 'info' }));
    }
    refetchIfOpen(conversationId);
  });

  // Admin kicked someone — emitted to the room AND the removed user's personal
  // room, so the removed user's own client hears about it even after leaving.
  socket.on('group:member_removed', ({ conversationId, userId, removedBy, memberCount }) => {
    console.log('[socket] group:member_removed', conversationId, userId, removedBy, memberCount);
    const myUserId = storeRef.getState().auth.user?._id ?? storeRef.getState().auth.user?.id;
    storeRef.dispatch(groupMemberRemovedRemote({ convId: conversationId, userId, removedBy, memberCount, myUserId }));
    if (userId === myUserId) {
      storeRef.dispatch(showToast({ message: 'You were removed from this group', type: 'info' }));
    } else {
      refetchIfOpen(conversationId);
    }
  });

  // Group admin deleted it — drop it from every other member's list immediately.
  socket.on('group:deleted', ({ conversationId }) => {
    storeRef.dispatch(groupDeletedRemote({ convId: conversationId }));
    storeRef.dispatch(showToast({ message: 'This group was deleted', type: 'info' }));
  });

  // Group name/photo/description edited by another member.
  socket.on('group:updated', (data) => {
    storeRef.dispatch(groupUpdatedRemote({
      convId: data.conversationId,
      name: data.name,
      avatarUrl: data.avatarUrl,
      description: data.description,
    }));
  });
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function joinConversation(convId) {
  socket?.emit('join_conversation', convId);
}

export function leaveConversation(convId) {
  socket?.emit('leave_conversation', convId);
}

export function emitTypingStart(convId) {
  socket?.emit('typing_start', { conversationId: convId });
}

export function emitTypingStop(convId) {
  socket?.emit('typing_stop', { conversationId: convId });
}

export function onUserTyping(cb) {
  socket?.on('user_typing', cb);
  return () => socket?.off('user_typing', cb);
}

export function onUserStoppedTyping(cb) {
  socket?.on('user_stopped_typing', cb);
  return () => socket?.off('user_stopped_typing', cb);
}

export function joinEventRoom(eventId) {
  socket?.emit('join:event', { eventId });
}

export function leaveEventRoom(eventId) {
  socket?.emit('leave:event', { eventId });
}

export function joinPostRoom(postId) {
  socket?.emit('join:post', { postId });
}

export function leavePostRoom(postId) {
  socket?.emit('leave:post', { postId });
}

export function getSocket() {
  return socket;
}
