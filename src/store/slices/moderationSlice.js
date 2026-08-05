import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// FETCH MODERATION QUEUE
export const fetchModerationQueue = createAsyncThunk(
  'moderation/fetchModerationQueue',
  async ({ groupId, page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/moderation/queue?page=${page}&limit=${limit}`, {
        token,
      });
      return {
        groupId,
        items: data.items ?? [],
        total: data.total ?? 0,
        page,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// APPROVE MODERATION ITEM
export const approveModerationItem = createAsyncThunk(
  'moderation/approveModerationItem',
  async ({ groupId, itemId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/moderation/queue/${itemId}/approve`, {
        method: 'POST',
        token,
      });
      return { groupId, itemId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// REJECT MODERATION ITEM
export const rejectModerationItem = createAsyncThunk(
  'moderation/rejectModerationItem',
  async ({ groupId, itemId, reason } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/moderation/queue/${itemId}/reject`, {
        method: 'POST',
        token,
        body: { reason },
      });
      return { groupId, itemId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GET MODERATION ITEM DETAILS
export const getModerationItemDetails = createAsyncThunk(
  'moderation/getModerationItemDetails',
  async ({ groupId, itemId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/moderation/queue/${itemId}`, {
        token,
      });
      return { groupId, item: data.item ?? data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const moderationSlice = createSlice({
  name: 'moderation',
  initialState: {
    byGroup: {}, // { groupId: [] }
    totalByGroup: {},
    itemDetails: {}, // { itemId: { ... } }
    loading: false,
    approvingIds: [],
    rejectingIds: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModerationQueue.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchModerationQueue.fulfilled, (s, a) => {
        const { groupId, items, total, page } = a.payload;
        s.loading = false;
        s.byGroup[groupId] = page === 1 ? items : [...(s.byGroup[groupId] ?? []), ...items];
        s.totalByGroup[groupId] = total;
      })
      .addCase(fetchModerationQueue.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(approveModerationItem.pending, (s, a) => {
        const itemId = a.meta.arg.itemId;
        if (!s.approvingIds.includes(itemId)) {
          s.approvingIds.push(itemId);
        }
      })
      .addCase(approveModerationItem.fulfilled, (s, a) => {
        const { groupId, itemId } = a.payload;
        s.approvingIds = s.approvingIds.filter((id) => id !== itemId);
        if (s.byGroup[groupId]) {
          s.byGroup[groupId] = s.byGroup[groupId].filter((item) => (item._id ?? item.id) !== itemId);
          s.totalByGroup[groupId] = Math.max(0, (s.totalByGroup[groupId] ?? 0) - 1);
        }
      })
      .addCase(approveModerationItem.rejected, (s, a) => {
        const itemId = a.meta.arg.itemId;
        s.approvingIds = s.approvingIds.filter((id) => id !== itemId);
        s.error = a.payload;
      })

      .addCase(rejectModerationItem.pending, (s, a) => {
        const itemId = a.meta.arg.itemId;
        if (!s.rejectingIds.includes(itemId)) {
          s.rejectingIds.push(itemId);
        }
      })
      .addCase(rejectModerationItem.fulfilled, (s, a) => {
        const { groupId, itemId } = a.payload;
        s.rejectingIds = s.rejectingIds.filter((id) => id !== itemId);
        if (s.byGroup[groupId]) {
          s.byGroup[groupId] = s.byGroup[groupId].filter((item) => (item._id ?? item.id) !== itemId);
          s.totalByGroup[groupId] = Math.max(0, (s.totalByGroup[groupId] ?? 0) - 1);
        }
      })
      .addCase(rejectModerationItem.rejected, (s, a) => {
        const itemId = a.meta.arg.itemId;
        s.rejectingIds = s.rejectingIds.filter((id) => id !== itemId);
        s.error = a.payload;
      })

      .addCase(getModerationItemDetails.fulfilled, (s, a) => {
        const { item } = a.payload;
        const itemId = item._id ?? item.id;
        s.itemDetails[itemId] = item;
      });
  },
});

export default moderationSlice.reducer;
