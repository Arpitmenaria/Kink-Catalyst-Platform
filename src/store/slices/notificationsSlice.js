import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/notifications', { token });
      return { notifications: data.notifications ?? [], unreadCount: data.unreadCount ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationsRead = createAsyncThunk(
  'notifications/markRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/notifications/mark-read', { method: 'PUT', token });
      return { unreadCount: data?.unreadCount };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markOneRead',
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/notifications/${notificationId}/read`, { method: 'PATCH', token });
      return { notificationId, unreadCount: data?.unreadCount };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Prepend a live notification (from a socket event) and bump the bell count.
    notificationReceived(state, action) {
      const n = action.payload;
      const nid = n.id ?? n._id;
      const actorId = n.actor?._id ?? n.actor?.id;
      const nTime = new Date(n.createdAt ?? Date.now()).getTime();
      const isDup = state.notifications.some(x => {
        // Same id → duplicate.
        if (nid && (x.id ?? x._id) === nid) return true;
        // No id (socket payloads often omit it) → same type + actor + post
        // fired within 15s is the same event double-emitted.
        const xActor = x.actor?._id ?? x.actor?.id;
        if (x.type === n.type && actorId && xActor === actorId && (x.relatedPost ?? null) === (n.relatedPost ?? null)) {
          const xTime = new Date(x.createdAt ?? Date.now()).getTime();
          return Math.abs(xTime - nTime) < 15000;
        }
        return false;
      });
      if (isDup) return;
      state.notifications.unshift(n);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationsRead.fulfilled, (state, action) => {
        state.unreadCount = typeof action.payload.unreadCount === 'number' ? action.payload.unreadCount : 0;
        state.notifications = state.notifications.map(n => ({ ...n, unread: false }));
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const { notificationId, unreadCount } = action.payload;
        const n = state.notifications.find(x => (x.id ?? x._id) === notificationId);
        const wasUnread = !!n?.unread;
        if (n) n.unread = false;
        state.unreadCount = typeof unreadCount === 'number'
          ? unreadCount
          : Math.max(0, state.unreadCount - (wasUnread ? 1 : 0));
      });
  },
});

export const { notificationReceived } = notificationsSlice.actions;
export default notificationsSlice.reducer;
