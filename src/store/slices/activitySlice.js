import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// FETCH GROUP ACTIVITY LOG
export const fetchActivityLog = createAsyncThunk(
  'activity/fetchActivityLog',
  async ({ groupId, page = 1, limit = 50, type } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      let url = `/api/groups/${groupId}/activity?page=${page}&limit=${limit}`;
      if (type) url += `&type=${type}`;
      const data = await apiRequest(url, { token });
      return {
        groupId,
        activities: data.activities ?? [],
        total: data.total ?? 0,
        page,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    byGroup: {}, // { groupId: [] }
    totalByGroup: {},
    loading: false,
    error: null,
  },
  reducers: {
    // Optimistically add activity (when socket event received)
    addActivity(s, a) {
      const { groupId, activity } = a.payload;
      if (!s.byGroup[groupId]) {
        s.byGroup[groupId] = [];
      }
      s.byGroup[groupId].unshift(activity);
      if (s.totalByGroup[groupId] !== undefined) {
        s.totalByGroup[groupId] += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLog.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchActivityLog.fulfilled, (s, a) => {
        const { groupId, activities, total, page } = a.payload;
        s.loading = false;
        s.byGroup[groupId] = page === 1 ? activities : [...(s.byGroup[groupId] ?? []), ...activities];
        s.totalByGroup[groupId] = total;
      })
      .addCase(fetchActivityLog.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { addActivity } = activitySlice.actions;
export default activitySlice.reducer;
