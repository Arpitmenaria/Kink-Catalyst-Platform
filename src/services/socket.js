import { io } from 'socket.io-client';
import { receiveMessage, markMessagesRead, setUserOnline, setUserOffline, fetchOnlineUsers } from '../store/slices/messagesSlice';
import { seatsUpdated, attendingUpdated, commentReceived, commentLikeUpdated } from '../store/slices/eventsSlice';
import { fetchMe, updateFollowCounts } from '../store/slices/authSlice';
import { setFriendStatus, addIncomingRequest } from '../store/slices/usersSlice';
import { notificationReceived } from '../store/slices/notificationsSlice';
import { showToast } from '../store/slices/toastSlice';

// Build a bell-ready notification object from a raw socket payload.
function buildNotif(data) {
  const actor = data.actor ?? data.from ?? data.by ?? {};
  const name = actor.name ?? actor.fullName ?? 'Someone';
  const byType = {
    like:                     { emoji: data.reaction === 'love' ? '❤️' : '👍', text: `${name} reacted to your post` },
    comment:                  { emoji: '💬', text: `${name} commented on your post` },
    follow:                   { emoji: '👤', text: `${name} started following you` },
    friend_request:           { emoji: '🤝', text: `${name} sent you a connection request` },
    friend_request_accepted:  { emoji: '🤝', text: `${name} accepted your connection request` },
  };
  const meta = byType[data.type] ?? { emoji: '🔔', text: 'New notification' };
  return {
    id: data.id ?? data._id,
    type: data.type,
    emoji: meta.emoji,
    text: meta.text,
    actor,
    relatedPost: data.postId ?? data.relatedPost ?? null,
    createdAt: data.createdAt ?? new Date().toISOString(),
    unread: true,
  };
}

const BASE_URL = 'https://kick-analyst-backend-production.up.railway.app';

let socket = null;
let storeRef = null; // full Redux store — gives us dispatch + getState

export function initSocket(token, store) {
  // Guard on the instance existing (not just `.connected`) — otherwise React
  // StrictMode's double-mount in dev creates a 2nd socket while the 1st is
  // still connecting, and every event fires twice.
  if (socket) return;
  storeRef = store;

  socket = io(BASE_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    // Fires on initial connect AND every reconnect — resync presence so
    // online/offline events missed while disconnected don't leave stale state.
    storeRef.dispatch(fetchOnlineUsers());
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
  });

  socket.on('new_message_notification', ({ conversationId, message }) => {
    // Personal room (user:<id>) — always a message from someone else
    storeRef.dispatch(receiveMessage({ convId: conversationId, message: { ...message, from: 'them' } }));
  });

  socket.on('messages_read', ({ conversationId }) => {
    storeRef.dispatch(markMessagesRead({ convId: conversationId }));
  });

  socket.on('user_online', ({ userId }) => {
    storeRef.dispatch(setUserOnline({ userId }));
  });

  socket.on('user_offline', ({ userId }) => {
    storeRef.dispatch(setUserOffline({ userId }));
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

  socket.on('reconnect', () => {
    // Resync authoritative counts after reconnect (per API contract)
    storeRef.dispatch(fetchMe());
  });

  socket.on('error', ({ event, message }) => {
    console.warn('[socket] error:', event, message);
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
