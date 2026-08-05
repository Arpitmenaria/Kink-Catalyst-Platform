import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// CHANGE MEMBER ROLE
export const changeMemberRole = createAsyncThunk(
  'memberManagement/changeMemberRole',
  async ({ groupId, memberId, role }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/members/${memberId}/role`,
        {
          method: 'PATCH',
          token,
          body: { role },
        }
      );
      return { groupId, memberId, role: data.role ?? role };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// REMOVE MEMBER
export const removeMember = createAsyncThunk(
  'memberManagement/removeMember',
  async ({ groupId, memberId, reason } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
        token,
        body: { reason },
      });
      return { groupId, memberId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// MUTE MEMBER
export const muteMember = createAsyncThunk(
  'memberManagement/muteMember',
  async ({ groupId, memberId, duration } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/members/${memberId}/mute`, {
        method: 'POST',
        token,
        body: { duration }, // in milliseconds or 'permanent'
      });
      return { groupId, memberId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// UNMUTE MEMBER
export const unmuteMember = createAsyncThunk(
  'memberManagement/unmuteMember',
  async ({ groupId, memberId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/members/${memberId}/mute`, {
        method: 'DELETE',
        token,
      });
      return { groupId, memberId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// BAN MEMBER
export const banMember = createAsyncThunk(
  'memberManagement/banMember',
  async ({ groupId, memberId, reason } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/members/${memberId}/ban`, {
        method: 'POST',
        token,
        body: { reason },
      });
      return { groupId, memberId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const memberManagementSlice = createSlice({
  name: 'memberManagement',
  initialState: {
    changingRoles: {}, // { memberId: role }
    removingIds: [],
    mutingIds: [],
    unMutingIds: [],
    banningIds: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changeMemberRole.pending, (s, a) => {
        const memberId = a.meta.arg.memberId;
        const role = a.meta.arg.role;
        s.changingRoles[memberId] = role;
      })
      .addCase(changeMemberRole.fulfilled, (s, a) => {
        const memberId = a.meta.arg.memberId;
        delete s.changingRoles[memberId];
      })
      .addCase(changeMemberRole.rejected, (s, a) => {
        const memberId = a.meta.arg.memberId;
        delete s.changingRoles[memberId];
        s.error = a.payload;
      })

      .addCase(removeMember.pending, (s, a) => {
        const memberId = a.meta.arg.memberId;
        if (!s.removingIds.includes(memberId)) {
          s.removingIds.push(memberId);
        }
      })
      .addCase(removeMember.fulfilled, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.removingIds = s.removingIds.filter((id) => id !== memberId);
      })
      .addCase(removeMember.rejected, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.removingIds = s.removingIds.filter((id) => id !== memberId);
        s.error = a.payload;
      })

      .addCase(muteMember.pending, (s, a) => {
        const memberId = a.meta.arg.memberId;
        if (!s.mutingIds.includes(memberId)) {
          s.mutingIds.push(memberId);
        }
      })
      .addCase(muteMember.fulfilled, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.mutingIds = s.mutingIds.filter((id) => id !== memberId);
      })
      .addCase(muteMember.rejected, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.mutingIds = s.mutingIds.filter((id) => id !== memberId);
        s.error = a.payload;
      })

      .addCase(unmuteMember.pending, (s, a) => {
        const memberId = a.meta.arg.memberId;
        if (!s.unMutingIds.includes(memberId)) {
          s.unMutingIds.push(memberId);
        }
      })
      .addCase(unmuteMember.fulfilled, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.unMutingIds = s.unMutingIds.filter((id) => id !== memberId);
      })
      .addCase(unmuteMember.rejected, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.unMutingIds = s.unMutingIds.filter((id) => id !== memberId);
        s.error = a.payload;
      })

      .addCase(banMember.pending, (s, a) => {
        const memberId = a.meta.arg.memberId;
        if (!s.banningIds.includes(memberId)) {
          s.banningIds.push(memberId);
        }
      })
      .addCase(banMember.fulfilled, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.banningIds = s.banningIds.filter((id) => id !== memberId);
      })
      .addCase(banMember.rejected, (s, a) => {
        const memberId = a.meta.arg.memberId;
        s.banningIds = s.banningIds.filter((id) => id !== memberId);
        s.error = a.payload;
      });
  },
});

export default memberManagementSlice.reducer;
