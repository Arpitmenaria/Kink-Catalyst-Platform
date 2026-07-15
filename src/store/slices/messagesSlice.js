import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import { showToast } from './toastSlice';

function normalizeConversation(c) {
  return {
    id: c.id ?? c._id ?? '',
    type: c.type ?? 'dm',
    name: c.name ?? '',
    role: c.role ?? '',
    color: c.color ?? '#3b82f6',
    avatarUrl: c.avatarUrl?.startsWith?.('http') ? c.avatarUrl : '',
    online: c.online ?? false,
    lastMessage: c.lastMessage ?? null,
    unreadCount: c.unreadCount ?? 0,
    participantId: c.participantId ?? c.participant?.id ?? c.participant?._id ?? null,
    location: c.location ?? '',
  };
}

function normalizeMessage(m) {
  // Backend always sends `media` now (synthesised from the legacy single-mediaUrl
  // shape for old messages, [] for text-only) — but stay defensive in case an
  // older cached payload or a not-yet-migrated response is missing it.
  const media = Array.isArray(m.media)
    ? m.media.filter(it => it?.url?.startsWith?.('http')).map(it => ({
        url: it.url,
        type: it.type ?? 'file',
        fileName: it.fileName ?? it.name ?? decodeURIComponent(it.url.split('/').pop()),
        fileSize: it.fileSize ?? null,
        fileType: it.fileType ?? null,
      }))
    : (m.mediaUrl?.startsWith?.('http')
        ? [{ url: m.mediaUrl, type: m.type ?? 'file', fileName: m.fileName ?? m.name ?? decodeURIComponent(m.mediaUrl.split('/').pop()), fileSize: null, fileType: null }]
        : []);
  return {
    id: m.id ?? m._id ?? '',
    from: m.from ?? 'them',
    type: m.type ?? 'text',
    text: m.text ?? '',
    media,
    time: m.time ?? '',
    read: m.read ?? false,
    createdAt: m.createdAt ?? '',
  };
}

// 1. GET /api/conversations
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async ({ tab = 'all', search = '', page = 1, limit = 30 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const params = new URLSearchParams({ page, limit });
      if (tab !== 'all') params.set('tab', tab);
      if (search) params.set('search', search);
      const data = await apiRequest(`/api/conversations?${params}`, { token });
      return {
        conversations: (data.conversations ?? []).map(normalizeConversation),
        total: data.total ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 2. GET /api/conversations/:id/messages
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ convId, page = 1, limit = 50 }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/conversations/${convId}/messages?page=${page}&limit=${limit}`, { token });
      return {
        convId,
        messages: (data.messages ?? []).map(normalizeMessage),
        page: data.page ?? page,
        hasMore: data.hasMore ?? false,
        // The list endpoint doesn't echo the other participant's profile or the
        // requester's persisted block/report state — this one does.
        otherUserId: data.otherUser?.userId ?? data.otherUser?._id ?? null,
        otherUserLocation: data.otherUser?.location ?? '',
        isBlocked: typeof data.isBlocked === 'boolean' ? data.isBlocked : null,
        isReported: typeof data.isReported === 'boolean' ? data.isReported : null,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 3. POST /api/conversations/:id/messages
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ convId, type = 'text', text, file, files }, { getState, dispatch, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      // API always expects multipart/form-data
      const form = new FormData();
      form.append('type', type);
      if (text) form.append('text', text);
      // `files[]` (new, up to 20) for a multi-select send; `file` (legacy, single)
      // still works standalone — never send both for the same call.
      if (files?.length) files.forEach(f => form.append('files[]', f));
      else if (file) form.append('file', file);
      const body = form; const isFormData = true;
      const data = await apiRequest(`/api/conversations/${convId}/messages`, { method: 'POST', token, body, isFormData });
      return { convId, message: normalizeMessage(data.message ?? {}) };
    } catch (err) {
      if (err.status === 403) dispatch(showToast({ message: err.message || 'You can only message your connections.', type: 'error' }));
      return rejectWithValue(err.message);
    }
  }
);

// 4. PUT /api/conversations/:id/read
export const markRead = createAsyncThunk(
  'messages/markRead',
  async (convId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/conversations/${convId}/read`, { method: 'PUT', token });
      return { convId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 5. POST /api/conversations — start DM
export const startDM = createAsyncThunk(
  'messages/startDM',
  async (userId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/conversations', { method: 'POST', token, body: { userId } });
      const conv = normalizeConversation(data);
      // The create/get-or-create response doesn't always echo back a `participant`
      // object — fall back to the userId we know we started this DM with, so
      // "click avatar to view profile" never ends up with a null participantId.
      return { ...conv, participantId: conv.participantId ?? userId };
    } catch (err) {
      if (err.status === 403) dispatch(showToast({ message: err.message || 'You can only message your connections.', type: 'error' }));
      return rejectWithValue(err.message);
    }
  }
);

// 6. POST /api/conversations/group — create group
export const createGroup = createAsyncThunk(
  'messages/createGroup',
  async ({ name, description, memberIds, image }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const form = new FormData();
      form.append('name', name);
      if (description) form.append('description', description);
      (memberIds ?? []).forEach(id => form.append('memberIds', id));
      if (image) form.append('image', image);
      const data = await apiRequest('/api/conversations/group', { method: 'POST', token, body: form, isFormData: true });
      return normalizeConversation({ ...data, id: data.id ?? data._id });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 7. GET /api/conversations/:id/assets
export const fetchAssets = createAsyncThunk(
  'messages/fetchAssets',
  async ({ convId, tab = 'media', page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/conversations/${convId}/assets?tab=${tab}&page=${page}&limit=${limit}`, { token });
      return { convId, tab, items: data.items ?? [], total: data.total ?? 0, storage: data.storage ?? null };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 8. POST /api/conversations/:id/assets — upload files
export const uploadAssets = createAsyncThunk(
  'messages/uploadAssets',
  async ({ convId, files }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const form = new FormData();
      Array.from(files).forEach(f => form.append('files[]', f));
      const data = await apiRequest(`/api/conversations/${convId}/assets`, { method: 'POST', token, body: form, isFormData: true });
      return { convId, uploaded: data.uploaded ?? [], storageUsedGB: data.storageUsedGB ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 9. POST /api/conversations/:id/block — toggle block
export const toggleBlock = createAsyncThunk(
  'messages/toggleBlock',
  async (convId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/conversations/${convId}/block`, { method: 'POST', token });
      return { convId, blocked: data.blocked ?? false };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 9b. DELETE /api/conversations/:id — soft-delete for the current user only
export const deleteConversation = createAsyncThunk(
  'messages/deleteConversation',
  async (convId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/conversations/${convId}`, { method: 'DELETE', token });
      return { convId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 10. POST /api/conversations/:id/report
export const reportConversation = createAsyncThunk(
  'messages/reportConversation',
  async ({ convId, reason }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/conversations/${convId}/report`, { method: 'POST', token, body: { reason } });
      return { convId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 11. GET /api/users/online
export const fetchOnlineUsers = createAsyncThunk(
  'messages/fetchOnlineUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/users/online', { token });
      return (data.users ?? []).map(u => ({
        id: u.id ?? u._id ?? '',
        name: u.name ?? u.fullName ?? '',
        color: u.color ?? '#3b82f6',
        avatarUrl: u.avatarUrl?.startsWith?.('http') ? u.avatarUrl : '',
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    conversationsTotal: 0,
    conversationsLoading: false,
    messages: {},         // { [convId]: message[] }
    messagesLoading: false,
    messagesHasMore: {},  // { [convId]: boolean }
    sending: false,
    onlineUsers: [],
    onlineLoading: false,
    assets: {},           // { [convId]: { media|docs|links: [], storage, totals: { media, links, docs } } }
    assetsLoading: false,
    blockedConvIds: {},   // { [convId]: boolean }
    reportedConvIds: {},  // { [convId]: boolean }
    pendingOpenConvId: null, // set by startDM so MessagesPage auto-opens that conversation
    lastFetchParams: { tab: 'all', search: '' }, // last args passed to fetchConversations, so a resurrected conversation (see receiveMessage in socket.js) refetches under the filter the user is actually looking at
    error: null,
  },
  reducers: {
    // Immediately clear unread badge when user opens a conversation (before API responds)
    clearUnread(state, action) {
      const { convId } = action.payload;
      const conv = state.conversations.find(c => c.id === convId);
      if (conv) conv.unreadCount = 0;
    },
    clearPendingOpenConv(state) {
      state.pendingOpenConvId = null;
    },
    // Socket: push incoming message
    receiveMessage(state, action) {
      const { convId, message } = action.payload;
      const normalized = normalizeMessage(message);
      if (!state.messages[convId]) state.messages[convId] = [];
      // Normalize before dedup so both _id and id fields resolve to the same key
      if (normalized.id && !state.messages[convId].find(m => m.id === normalized.id)) {
        state.messages[convId].push(normalized);
      }
      const conv = state.conversations.find(c => c.id === convId);
      if (conv) {
        conv.lastMessage = { text: normalized.text, time: normalized.time, fromMe: normalized.from === 'me' };
        if (normalized.from !== 'me') conv.unreadCount = (conv.unreadCount ?? 0) + 1;
      }
    },
    // Socket: messages read
    markMessagesRead(state, action) {
      const { convId } = action.payload;
      if (state.messages[convId]) state.messages[convId].forEach(m => { m.read = true; });
      const conv = state.conversations.find(c => c.id === convId);
      if (conv) conv.unreadCount = 0;
    },
    // Socket: user came online
    setUserOnline(state, action) {
      const { userId } = action.payload;
      state.conversations.forEach(c => { if (c.participantId === userId) c.online = true; });
      if (!state.onlineUsers.find(u => u.id === userId)) {
        state.onlineUsers.push({ id: userId, name: '', color: '#3b82f6', avatarUrl: '' });
      }
    },
    // Socket: user went offline
    setUserOffline(state, action) {
      const { userId } = action.payload;
      state.conversations.forEach(c => { if (c.participantId === userId) c.online = false; });
      state.onlineUsers = state.onlineUsers.filter(u => u.id !== userId);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchConversations.pending, (s, a) => {
        s.conversationsLoading = true;
        s.lastFetchParams = { tab: a.meta.arg?.tab ?? 'all', search: a.meta.arg?.search ?? '' };
      })
      .addCase(fetchConversations.fulfilled, (s, a) => {
        s.conversationsLoading = false;
        s.conversations = a.payload.conversations;
        s.conversationsTotal = a.payload.total;
      })
      .addCase(fetchConversations.rejected, (s, a) => { s.conversationsLoading = false; s.error = a.payload; })

      .addCase(fetchMessages.pending, s => { s.messagesLoading = true; })
      .addCase(fetchMessages.fulfilled, (s, a) => {
        const { convId, messages, page, hasMore, otherUserId, otherUserLocation, isBlocked, isReported } = a.payload;
        s.messagesLoading = false;
        s.messages[convId] = page === 1 ? messages : [...messages, ...(s.messages[convId] ?? [])];
        s.messagesHasMore[convId] = hasMore;
        if (otherUserId) {
          const conv = s.conversations.find(c => c.id === convId);
          if (conv) {
            if (!conv.participantId) conv.participantId = otherUserId;
            if (otherUserLocation) conv.location = otherUserLocation;
          }
        }
        // Persisted truth from the server overrides whatever the client guessed
        // (or never knew) after a hard refresh.
        if (isBlocked !== null) s.blockedConvIds[convId] = isBlocked;
        if (isReported !== null) s.reportedConvIds[convId] = isReported;
      })
      .addCase(fetchMessages.rejected, s => { s.messagesLoading = false; })

      .addCase(sendMessage.pending, (s, a) => {
        s.sending = true;
        // Optimistic: add a temp message immediately so UI feels instant. No
        // preview thumbnails yet (nothing's uploaded), just a placeholder line —
        // `media` fills in for real once sendMessage.fulfilled swaps this out.
        const { convId, text, type, file, files } = a.meta.arg;
        const tempId = `temp_${a.meta.requestId}`;
        if (!s.messages[convId]) s.messages[convId] = [];
        const msgType = type ?? 'text';
        const fileCount = files?.length ?? (file ? 1 : 0);
        const previewText = text ?? (
          msgType === 'image' ? (fileCount > 1 ? `📷 ${fileCount} Photos` : '📷 Photo')
          : msgType === 'video' ? (fileCount > 1 ? `🎥 ${fileCount} Videos` : '🎥 Video')
          : msgType === 'file' ? (fileCount > 1 ? `📎 ${fileCount} Files` : '📎 File')
          : ''
        );
        s.messages[convId].push({
          id: tempId,
          from: 'me',
          type: msgType,
          text: previewText,
          media: [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          pending: true,
        });
        const conv = s.conversations.find(c => c.id === convId);
        if (conv) conv.lastMessage = { text: previewText, time: '', fromMe: true };
      })
      .addCase(sendMessage.fulfilled, (s, a) => {
        const { convId, message } = a.payload;
        const normalized = normalizeMessage({ ...message, from: 'me' });
        s.sending = false;
        if (!s.messages[convId]) s.messages[convId] = [];
        // Remove the optimistic temp message
        const tempId = `temp_${a.meta.requestId}`;
        s.messages[convId] = s.messages[convId].filter(m => m.id !== tempId);
        // Add confirmed message (dedup in case socket already pushed it)
        if (!normalized.id || !s.messages[convId].find(m => m.id === normalized.id)) {
          s.messages[convId].push(normalized);
        }
        const conv = s.conversations.find(c => c.id === convId);
        if (conv) conv.lastMessage = { text: normalized.text, time: normalized.time, fromMe: true };
      })
      .addCase(sendMessage.rejected, (s, a) => {
        s.sending = false;
        // Roll back optimistic message
        const { convId } = a.meta.arg;
        const tempId = `temp_${a.meta.requestId}`;
        if (s.messages[convId]) s.messages[convId] = s.messages[convId].filter(m => m.id !== tempId);
      })

      .addCase(markRead.fulfilled, (s, a) => {
        const { convId } = a.payload;
        const conv = s.conversations.find(c => c.id === convId);
        if (conv) conv.unreadCount = 0;
        if (s.messages[convId]) s.messages[convId].forEach(m => { m.read = true; });
      })

      .addCase(startDM.fulfilled, (s, a) => {
        const conv = a.payload;
        if (!s.conversations.find(c => c.id === conv.id)) s.conversations.unshift(conv);
        s.pendingOpenConvId = conv.id;
      })

      .addCase(createGroup.fulfilled, (s, a) => { s.conversations.unshift(a.payload); })

      .addCase(fetchAssets.pending, s => { s.assetsLoading = true; })
      .addCase(fetchAssets.fulfilled, (s, a) => {
        const { convId, tab, items, total, storage } = a.payload;
        s.assetsLoading = false;
        if (!s.assets[convId]) s.assets[convId] = {};
        if (!s.assets[convId].totals) s.assets[convId].totals = {};
        s.assets[convId][tab] = items;
        s.assets[convId].totals[tab] = total;
        if (storage) s.assets[convId].storage = storage;
      })
      .addCase(fetchAssets.rejected, s => { s.assetsLoading = false; })

      .addCase(uploadAssets.fulfilled, (s, a) => {
        const { convId, storageUsedGB } = a.payload;
        if (s.assets[convId]?.storage) s.assets[convId].storage.usedGB = storageUsedGB;
      })

      .addCase(toggleBlock.fulfilled, (s, a) => {
        s.blockedConvIds[a.payload.convId] = a.payload.blocked;
      })

      .addCase(reportConversation.fulfilled, (s, a) => {
        s.reportedConvIds[a.payload.convId] = true;
      })

      .addCase(deleteConversation.fulfilled, (s, a) => {
        const { convId } = a.payload;
        s.conversations = s.conversations.filter(c => c.id !== convId);
        delete s.messages[convId];
        delete s.blockedConvIds[convId];
        delete s.reportedConvIds[convId];
        delete s.assets[convId];
      })

      .addCase(fetchOnlineUsers.pending, s => { s.onlineLoading = true; })
      .addCase(fetchOnlineUsers.fulfilled, (s, a) => {
        s.onlineLoading = false;
        s.onlineUsers = a.payload;
        // Resync conversation-list online dots against the authoritative REST snapshot
        const onlineIds = new Set(a.payload.map(u => u.id));
        s.conversations.forEach(c => { c.online = onlineIds.has(c.participantId); });
      })
      .addCase(fetchOnlineUsers.rejected, s => { s.onlineLoading = false; });
  },
});

export const { clearUnread, clearPendingOpenConv, receiveMessage, markMessagesRead, setUserOnline, setUserOffline } = messagesSlice.actions;
export default messagesSlice.reducer;
