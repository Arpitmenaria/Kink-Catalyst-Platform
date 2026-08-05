import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// INVITE USER TO GROUP
export const inviteUserToGroup = createAsyncThunk(
  'invitations/inviteUserToGroup',
  async ({ groupId, userId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        token,
        body: { userId },
      });
      return { groupId, invitation: data.invitation ?? data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH USER INVITATIONS
export const fetchUserInvitations = createAsyncThunk(
  'invitations/fetchUserInvitations',
  async ({ page = 1, limit = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/users/me/group-invitations?page=${page}&limit=${limit}`,
        { token }
      );
      return { invitations: data.invitations ?? [], total: data.total ?? 0, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ACCEPT INVITATION
export const acceptInvitation = createAsyncThunk(
  'invitations/acceptInvitation',
  async (invitationId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/users/me/group-invitations/${invitationId}/accept`,
        { method: 'POST', token }
      );
      return { invitationId, groupId: data.groupId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// REJECT INVITATION
export const rejectInvitation = createAsyncThunk(
  'invitations/rejectInvitation',
  async (invitationId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/users/me/group-invitations/${invitationId}`, {
        method: 'DELETE',
        token,
      });
      return { invitationId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH GROUP INVITATIONS (ADMIN)
export const fetchGroupInvitations = createAsyncThunk(
  'invitations/fetchGroupInvitations',
  async ({ groupId, page = 1, limit = 50 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/invitations?page=${page}&limit=${limit}`,
        { token }
      );
      return { groupId, invitations: data.invitations ?? [], total: data.total ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState: {
    userInvitations: [],
    userInvitationsTotal: 0,
    userInvitationsLoading: false,
    groupInvitations: {}, // { groupId: [] }
    groupInvitationsTotal: {},
    groupInvitationsLoading: false,
    invitingIds: [],
    acceptingIds: [],
    rejectingIds: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user invitations
      .addCase(fetchUserInvitations.pending, (s) => {
        s.userInvitationsLoading = true;
      })
      .addCase(fetchUserInvitations.fulfilled, (s, a) => {
        const { invitations, total, page } = a.payload;
        s.userInvitationsLoading = false;
        s.userInvitations = page === 1 ? invitations : [...s.userInvitations, ...invitations];
        s.userInvitationsTotal = total;
      })
      .addCase(fetchUserInvitations.rejected, (s, a) => {
        s.userInvitationsLoading = false;
        s.error = a.payload;
      })

      // Accept invitation
      .addCase(acceptInvitation.pending, (s, a) => {
        if (!s.acceptingIds.includes(a.meta.arg)) {
          s.acceptingIds.push(a.meta.arg);
        }
      })
      .addCase(acceptInvitation.fulfilled, (s, a) => {
        const invitationId = a.meta.arg;
        s.acceptingIds = s.acceptingIds.filter((id) => id !== invitationId);
        s.userInvitations = s.userInvitations.filter((inv) => (inv._id ?? inv.id) !== invitationId);
        s.userInvitationsTotal = Math.max(0, s.userInvitationsTotal - 1);
      })
      .addCase(acceptInvitation.rejected, (s, a) => {
        const invitationId = a.meta.arg;
        s.acceptingIds = s.acceptingIds.filter((id) => id !== invitationId);
        s.error = a.payload;
      })

      // Reject invitation
      .addCase(rejectInvitation.pending, (s, a) => {
        if (!s.rejectingIds.includes(a.meta.arg)) {
          s.rejectingIds.push(a.meta.arg);
        }
      })
      .addCase(rejectInvitation.fulfilled, (s, a) => {
        const invitationId = a.meta.arg;
        s.rejectingIds = s.rejectingIds.filter((id) => id !== invitationId);
        s.userInvitations = s.userInvitations.filter((inv) => (inv._id ?? inv.id) !== invitationId);
        s.userInvitationsTotal = Math.max(0, s.userInvitationsTotal - 1);
      })
      .addCase(rejectInvitation.rejected, (s, a) => {
        const invitationId = a.meta.arg;
        s.rejectingIds = s.rejectingIds.filter((id) => id !== invitationId);
        s.error = a.payload;
      })

      // Invite user
      .addCase(inviteUserToGroup.pending, (s, a) => {
        const userId = a.meta.arg.userId;
        if (!s.invitingIds.includes(userId)) {
          s.invitingIds.push(userId);
        }
      })
      .addCase(inviteUserToGroup.fulfilled, (s, a) => {
        const userId = a.meta.arg.userId;
        s.invitingIds = s.invitingIds.filter((id) => id !== userId);
      })
      .addCase(inviteUserToGroup.rejected, (s, a) => {
        const userId = a.meta.arg.userId;
        s.invitingIds = s.invitingIds.filter((id) => id !== userId);
        s.error = a.payload;
      })

      // Fetch group invitations (admin)
      .addCase(fetchGroupInvitations.pending, (s) => {
        s.groupInvitationsLoading = true;
      })
      .addCase(fetchGroupInvitations.fulfilled, (s, a) => {
        const { groupId, invitations, total } = a.payload;
        s.groupInvitationsLoading = false;
        s.groupInvitations[groupId] = invitations;
        s.groupInvitationsTotal[groupId] = total;
      })
      .addCase(fetchGroupInvitations.rejected, (s, a) => {
        s.groupInvitationsLoading = false;
        s.error = a.payload;
      });
  },
});

export default invitationsSlice.reducer;
