import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

export const fetchSuggestions = createAsyncThunk(
  'users/fetchSuggestions',
  async (limit = 5, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/users/suggestions?limit=${limit}`, { token });
      return (data.suggestions ?? []).map(s => {
        // Support both flat user objects (_id) and nested ({ user: { _id } }) formats
        const uid = s._id ?? s.userId ?? s.user?._id ?? s.user?.id ?? s.id ?? '';
        return {
          ...s,
          id: uid,
          _id: uid,
          name: s.name ?? s.fullName ?? s.user?.name ?? s.user?.fullName ?? '',
          avatar: (() => { const av = s.avatar ?? s.user?.avatar ?? ''; return av?.startsWith?.('http') ? av : ''; })(),
        };
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const followUser = createAsyncThunk(
  'users/follow',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/users/${userId}/follow`, { method: 'POST', token });
      return { userId };
    } catch (err) {
      return rejectWithValue({ userId, message: err.message });
    }
  }
);

export const dismissSuggestion = createAsyncThunk(
  'users/dismiss',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/users/${userId}/suggestion`, { method: 'DELETE', token });
      return { userId };
    } catch (err) {
      return rejectWithValue({ userId, message: err.message });
    }
  }
);

export const fetchGroups = createAsyncThunk(
  'users/fetchGroups',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/groups/my', { token });
      return data.groups ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    suggestions: [],
    suggestionsLoading: false,
    followingIds: [],
    dismissedIds: [],
    groups: [],
    groupsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Suggestions ───────────────────────
      .addCase(fetchSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.suggestionsLoading = false;
        state.error = action.payload;
      })

      // ── Follow ────────────────────────────
      .addCase(followUser.pending, (state, action) => {
        const userId = action.meta.arg;
        if (!state.followingIds.includes(userId)) {
          state.followingIds.push(userId);
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        const msg = action.payload?.message ?? '';
        // Keep disabled for permanent errors (user not found / self-follow); re-enable only for network errors
        if (!/user not found|cannot follow yourself/i.test(msg)) {
          const userId = action.meta.arg;
          state.followingIds = state.followingIds.filter(id => id !== userId);
        }
      })

      // ── Dismiss ───────────────────────────
      .addCase(dismissSuggestion.pending, (state, action) => {
        if (!state.dismissedIds.includes(action.meta.arg)) {
          state.dismissedIds.push(action.meta.arg);
        }
      })
      .addCase(dismissSuggestion.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.dismissedIds = state.dismissedIds.filter(id => id !== userId);
      })

      // ── Groups ────────────────────────────
      .addCase(fetchGroups.pending, (state) => {
        state.groupsLoading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
