import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// FETCH USER NOTIFICATION PREFERENCES
export const fetchNotificationPrefs = createAsyncThunk(
  'notificationPrefs/fetchNotificationPrefs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/users/me/notification-prefs', { token });
      return data.prefs ?? {};
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE NOTIFICATION PREFERENCES
export const updateNotificationPrefs = createAsyncThunk(
  'notificationPrefs/updateNotificationPrefs',
  async (prefs, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/users/me/notification-prefs', {
        method: 'PATCH',
        token,
        body: prefs,
      });
      return data.prefs ?? prefs;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH GROUP NOTIFICATION PREFERENCES
export const fetchGroupNotificationPrefs = createAsyncThunk(
  'notificationPrefs/fetchGroupNotificationPrefs',
  async (groupId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/notification-prefs`, { token });
      return { groupId, prefs: data.prefs ?? {} };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE GROUP NOTIFICATION PREFERENCES
export const updateGroupNotificationPrefs = createAsyncThunk(
  'notificationPrefs/updateGroupNotificationPrefs',
  async ({ groupId, prefs }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/notification-prefs`, {
        method: 'PATCH',
        token,
        body: prefs,
      });
      return { groupId, prefs: data.prefs ?? prefs };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationPrefsSlice = createSlice({
  name: 'notificationPrefs',
  initialState: {
    global: {
      emailOnComment: true,
      emailOnLike: false,
      emailOnInvite: true,
      emailOnMention: true,
      emailDigest: 'weekly', // 'immediate', 'daily', 'weekly', 'never'
      loading: false,
    },
    byGroup: {}, // { groupId: { emailOnPost: true, emailOnModeration: true, ... } }
    loading: false,
    error: null,
  },
  reducers: {
    setLocalPref(s, a) {
      const { key, value } = a.payload;
      s.global[key] = value;
    },
    setGroupPref(s, a) {
      const { groupId, key, value } = a.payload;
      if (!s.byGroup[groupId]) s.byGroup[groupId] = {};
      s.byGroup[groupId][key] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationPrefs.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchNotificationPrefs.fulfilled, (s, a) => {
        s.loading = false;
        s.global = { ...s.global, ...a.payload };
      })
      .addCase(fetchNotificationPrefs.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(updateNotificationPrefs.pending, (s) => {
        s.loading = true;
      })
      .addCase(updateNotificationPrefs.fulfilled, (s, a) => {
        s.loading = false;
        s.global = { ...s.global, ...a.payload };
      })
      .addCase(updateNotificationPrefs.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchGroupNotificationPrefs.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchGroupNotificationPrefs.fulfilled, (s, a) => {
        const { groupId, prefs } = a.payload;
        s.loading = false;
        s.byGroup[groupId] = prefs;
      })
      .addCase(fetchGroupNotificationPrefs.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(updateGroupNotificationPrefs.pending, (s) => {
        s.loading = true;
      })
      .addCase(updateGroupNotificationPrefs.fulfilled, (s, a) => {
        const { groupId, prefs } = a.payload;
        s.loading = false;
        s.byGroup[groupId] = prefs;
      })
      .addCase(updateGroupNotificationPrefs.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { setLocalPref, setGroupPref } = notificationPrefsSlice.actions;
export default notificationPrefsSlice.reducer;
