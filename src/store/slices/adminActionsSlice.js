import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// FETCH USER NOTIFICATIONS (includes admin_action type)
export const fetchUserNotifications = createAsyncThunk(
  'adminActions/fetchUserNotifications',
  async ({ page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/users/me/notifications?page=${page}&limit=${limit}`,
        { token }
      );
      const adminActions = (data.notifications ?? []).filter((n) => n.type === 'admin_action');
      return {
        notifications: adminActions,
        total: adminActions.length,
        page,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH ALL ADMIN ACTIONS HISTORY
export const fetchAdminActionsHistory = createAsyncThunk(
  'adminActions/fetchAdminActionsHistory',
  async ({ page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/users/me/actions-taken?page=${page}&limit=${limit}`,
        { token }
      );
      return {
        actions: data.actions ?? [],
        total: data.total ?? 0,
        page,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// MARK NOTIFICATION AS READ
export const markNotificationAsRead = createAsyncThunk(
  'adminActions/markNotificationAsRead',
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(
        `/api/users/me/notifications/${notificationId}/read`,
        { method: 'POST', token }
      );
      return { notificationId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const adminActionsSlice = createSlice({
  name: 'adminActions',
  initialState: {
    notifications: [],
    notificationsTotal: 0,
    actionsHistory: [],
    actionsHistoryTotal: 0,
    loading: false,
    markingAsReadIds: [],
    error: null,
  },
  reducers: {
    addAdminActionNotification(s, a) {
      const notification = a.payload;
      s.notifications.unshift(notification);
      s.notificationsTotal = (s.notificationsTotal ?? 0) + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchUserNotifications.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchUserNotifications.fulfilled, (s, a) => {
        const { notifications, total } = a.payload;
        s.loading = false;
        s.notifications = notifications;
        s.notificationsTotal = total;
      })
      .addCase(fetchUserNotifications.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Fetch actions history
      .addCase(fetchAdminActionsHistory.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAdminActionsHistory.fulfilled, (s, a) => {
        const { actions, total } = a.payload;
        s.loading = false;
        s.actionsHistory = actions;
        s.actionsHistoryTotal = total;
      })
      .addCase(fetchAdminActionsHistory.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Mark as read
      .addCase(markNotificationAsRead.pending, (s, a) => {
        const id = a.meta.arg;
        if (!s.markingAsReadIds.includes(id)) {
          s.markingAsReadIds.push(id);
        }
      })
      .addCase(markNotificationAsRead.fulfilled, (s, a) => {
        const { notificationId } = a.payload;
        s.markingAsReadIds = s.markingAsReadIds.filter((id) => id !== notificationId);
        s.notifications = s.notifications.map((n) =>
          (n._id ?? n.id) === notificationId ? { ...n, read: true } : n
        );
      })
      .addCase(markNotificationAsRead.rejected, (s, a) => {
        const id = a.meta.arg;
        s.markingAsReadIds = s.markingAsReadIds.filter((id) => id !== id);
        s.error = a.payload;
      });
  },
});

export const { addAdminActionNotification } = adminActionsSlice.actions;
export default adminActionsSlice.reducer;
