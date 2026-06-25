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
      await apiRequest('/api/notifications/mark-read', { method: 'PUT', token });
      return {};
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
  reducers: {},
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

      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notifications = state.notifications.map(n => ({ ...n, unread: false }));
      });
  },
});

export default notificationsSlice.reducer;
