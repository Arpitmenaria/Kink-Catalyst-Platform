import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// FETCH GROUP STATISTICS
export const fetchGroupStats = createAsyncThunk(
  'reporting/fetchGroupStats',
  async ({ groupId, period = '30d' } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/stats?period=${period}`,
        { token }
      );
      return {
        groupId,
        stats: {
          totalMembers: data.totalMembers ?? 0,
          totalPosts: data.totalPosts ?? 0,
          totalComments: data.totalComments ?? 0,
          totalLikes: data.totalLikes ?? 0,
          activeMembers: data.activeMembers ?? 0,
          engagementRate: data.engagementRate ?? 0,
          growthRate: data.growthRate ?? 0,
          postsPerDay: data.postsPerDay ?? 0,
        },
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH MEMBER STATISTICS
export const fetchMemberStats = createAsyncThunk(
  'reporting/fetchMemberStats',
  async ({ groupId, memberId } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/members/${memberId}/stats`,
        { token }
      );
      return {
        groupId,
        memberId,
        stats: {
          postsCount: data.postsCount ?? 0,
          commentsCount: data.commentsCount ?? 0,
          likesGiven: data.likesGiven ?? 0,
          likesReceived: data.likesReceived ?? 0,
          joinDate: data.joinDate,
          lastActivity: data.lastActivity,
          engagement: data.engagement ?? 'low', // low, medium, high
        },
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH ENGAGEMENT TRENDS
export const fetchEngagementTrends = createAsyncThunk(
  'reporting/fetchEngagementTrends',
  async ({ groupId, period = '30d' } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/trends?period=${period}`,
        { token }
      );
      return {
        groupId,
        trends: data.trends ?? [], // Array of daily/weekly data points
        period,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// EXPORT GROUP DATA
export const exportGroupData = createAsyncThunk(
  'reporting/exportGroupData',
  async ({ groupId, format = 'csv' } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(
        `/api/groups/${groupId}/export?format=${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `group-${groupId}-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { groupId, format };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GENERATE REPORT
export const generateReport = createAsyncThunk(
  'reporting/generateReport',
  async ({ groupId, reportType, startDate, endDate } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/reports/${reportType}`,
        {
          method: 'POST',
          token,
          body: { startDate, endDate },
        }
      );
      return {
        groupId,
        reportType,
        report: data.report ?? data,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const reportingSlice = createSlice({
  name: 'reporting',
  initialState: {
    stats: {}, // { groupId: { ... } }
    memberStats: {}, // { `${groupId}:${memberId}`: { ... } }
    trends: {}, // { groupId: { ... } }
    reports: {}, // { `${groupId}:${type}`: { ... } }
    loading: false,
    exporting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupStats.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchGroupStats.fulfilled, (s, a) => {
        const { groupId, stats } = a.payload;
        s.loading = false;
        s.stats[groupId] = stats;
      })
      .addCase(fetchGroupStats.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchMemberStats.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMemberStats.fulfilled, (s, a) => {
        const { groupId, memberId, stats } = a.payload;
        const key = `${groupId}:${memberId}`;
        s.loading = false;
        s.memberStats[key] = stats;
      })
      .addCase(fetchMemberStats.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchEngagementTrends.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchEngagementTrends.fulfilled, (s, a) => {
        const { groupId, trends, period } = a.payload;
        s.loading = false;
        s.trends[groupId] = { data: trends, period };
      })
      .addCase(fetchEngagementTrends.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(generateReport.pending, (s) => {
        s.loading = true;
      })
      .addCase(generateReport.fulfilled, (s, a) => {
        const { groupId, reportType, report } = a.payload;
        const key = `${groupId}:${reportType}`;
        s.loading = false;
        s.reports[key] = report;
      })
      .addCase(generateReport.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(exportGroupData.pending, (s) => {
        s.exporting = true;
      })
      .addCase(exportGroupData.fulfilled, (s) => {
        s.exporting = false;
      })
      .addCase(exportGroupData.rejected, (s, a) => {
        s.exporting = false;
        s.error = a.payload;
      });
  },
});

export default reportingSlice.reducer;
