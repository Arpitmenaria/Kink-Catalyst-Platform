import { io } from 'socket.io-client';
import { receiveMessage, markMessagesRead, setUserOnline, setUserOffline } from '../store/slices/messagesSlice';
import { seatsUpdated, attendingUpdated, commentReceived, commentLikeUpdated } from '../store/slices/eventsSlice';
import { fetchMe, updateFollowCounts } from '../store/slices/authSlice';

const BASE_URL = 'https://kick-analyst-backend-production.up.railway.app';

let socket = null;
let storeRef = null; // full Redux store — gives us dispatch + getState

export function initSocket(token, store) {
  if (socket?.connected) return;
  storeRef = store;

  socket = io(BASE_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
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
