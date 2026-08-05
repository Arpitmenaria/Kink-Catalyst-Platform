import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// SEARCH GROUPS
export const searchGroups = createAsyncThunk(
  'search/searchGroups',
  async ({ q, page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
        { token }
      );
      return { type: 'groups', results: data.groups ?? [], total: data.total ?? 0, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// SEARCH GROUP POSTS
export const searchGroupPosts = createAsyncThunk(
  'search/searchGroupPosts',
  async ({ groupId, q, page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/posts/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
        { token }
      );
      return { groupId, type: 'posts', results: data.posts ?? [], total: data.total ?? 0, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// SEARCH GROUP MEMBERS
export const searchGroupMembers = createAsyncThunk(
  'search/searchGroupMembers',
  async ({ groupId, q, page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/members/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
        { token }
      );
      return { groupId, type: 'members', results: data.members ?? [], total: data.total ?? 0, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GLOBAL SEARCH (groups, users, posts)
export const globalSearch = createAsyncThunk(
  'search/globalSearch',
  async ({ q, page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
        { token }
      );
      return {
        type: 'global',
        groups: data.groups ?? [],
        users: data.users ?? [],
        posts: data.posts ?? [],
        total: data.total ?? 0,
        page,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    groups: { results: [], total: 0, loading: false },
    groupPosts: {}, // { groupId: { results: [], total: 0, loading: false } }
    groupMembers: {}, // { groupId: { results: [], total: 0, loading: false } }
    global: { groups: [], users: [], posts: [], total: 0, loading: false },
    query: '',
    error: null,
  },
  reducers: {
    setSearchQuery(s, a) {
      s.query = a.payload;
    },
    clearSearch(s) {
      s.groups = { results: [], total: 0, loading: false };
      s.groupPosts = {};
      s.groupMembers = {};
      s.global = { groups: [], users: [], posts: [], total: 0, loading: false };
      s.query = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Search groups
      .addCase(searchGroups.pending, (s) => {
        s.groups.loading = true;
      })
      .addCase(searchGroups.fulfilled, (s, a) => {
        const { results, total, page } = a.payload;
        s.groups.loading = false;
        s.groups.results = page === 1 ? results : [...s.groups.results, ...results];
        s.groups.total = total;
      })
      .addCase(searchGroups.rejected, (s, a) => {
        s.groups.loading = false;
        s.error = a.payload;
      })

      // Search group posts
      .addCase(searchGroupPosts.pending, (s, a) => {
        const groupId = a.meta.arg.groupId;
        if (!s.groupPosts[groupId]) {
          s.groupPosts[groupId] = { results: [], total: 0, loading: false };
        }
        s.groupPosts[groupId].loading = true;
      })
      .addCase(searchGroupPosts.fulfilled, (s, a) => {
        const { groupId, results, total, page } = a.payload;
        s.groupPosts[groupId].loading = false;
        s.groupPosts[groupId].results = page === 1 ? results : [...(s.groupPosts[groupId].results ?? []), ...results];
        s.groupPosts[groupId].total = total;
      })
      .addCase(searchGroupPosts.rejected, (s, a) => {
        const groupId = a.meta.arg.groupId;
        if (s.groupPosts[groupId]) {
          s.groupPosts[groupId].loading = false;
        }
        s.error = a.payload;
      })

      // Search group members
      .addCase(searchGroupMembers.pending, (s, a) => {
        const groupId = a.meta.arg.groupId;
        if (!s.groupMembers[groupId]) {
          s.groupMembers[groupId] = { results: [], total: 0, loading: false };
        }
        s.groupMembers[groupId].loading = true;
      })
      .addCase(searchGroupMembers.fulfilled, (s, a) => {
        const { groupId, results, total, page } = a.payload;
        s.groupMembers[groupId].loading = false;
        s.groupMembers[groupId].results = page === 1 ? results : [...(s.groupMembers[groupId].results ?? []), ...results];
        s.groupMembers[groupId].total = total;
      })
      .addCase(searchGroupMembers.rejected, (s, a) => {
        const groupId = a.meta.arg.groupId;
        if (s.groupMembers[groupId]) {
          s.groupMembers[groupId].loading = false;
        }
        s.error = a.payload;
      })

      // Global search
      .addCase(globalSearch.pending, (s) => {
        s.global.loading = true;
      })
      .addCase(globalSearch.fulfilled, (s, a) => {
        const { groups, users, posts, total, page } = a.payload;
        s.global.loading = false;
        s.global.groups = page === 1 ? groups : [...s.global.groups, ...groups];
        s.global.users = page === 1 ? users : [...s.global.users, ...users];
        s.global.posts = page === 1 ? posts : [...s.global.posts, ...posts];
        s.global.total = total;
      })
      .addCase(globalSearch.rejected, (s, a) => {
        s.global.loading = false;
        s.error = a.payload;
      });
  },
});

export const { setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
