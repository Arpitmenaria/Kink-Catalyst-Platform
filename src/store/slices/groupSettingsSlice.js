import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// UPDATE GROUP SETTINGS
export const updateGroupSettings = createAsyncThunk(
  'groupSettings/updateGroupSettings',
  async ({ groupId, settings }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();

      // Add all settings to FormData
      Object.entries(settings).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch(`/api/groups/${groupId}/settings`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      return { groupId, settings: data.group ?? data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE GROUP PRIVACY
export const updateGroupPrivacy = createAsyncThunk(
  'groupSettings/updateGroupPrivacy',
  async ({ groupId, privacy, requiresApproval }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/privacy`, {
        method: 'PATCH',
        token,
        body: { privacy, requiresApproval },
      });
      return { groupId, privacy: data.privacy, requiresApproval: data.requiresApproval };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ENABLE/DISABLE FEATURES
export const toggleFeature = createAsyncThunk(
  'groupSettings/toggleFeature',
  async ({ groupId, feature, enabled }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/features/${feature}`,
        {
          method: enabled ? 'POST' : 'DELETE',
          token,
        }
      );
      return { groupId, feature, enabled: data.enabled ?? enabled };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE GROUP
export const deleteGroup = createAsyncThunk(
  'groupSettings/deleteGroup',
  async (groupId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}`, {
        method: 'DELETE',
        token,
      });
      return { groupId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const groupSettingsSlice = createSlice({
  name: 'groupSettings',
  initialState: {
    byGroup: {}, // { groupId: { name, description, privacy, ... } }
    updating: false,
    deletingGroupId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateGroupSettings.pending, (s) => {
        s.updating = true;
      })
      .addCase(updateGroupSettings.fulfilled, (s, a) => {
        const { groupId, settings } = a.payload;
        s.updating = false;
        s.byGroup[groupId] = { ...s.byGroup[groupId], ...settings };
      })
      .addCase(updateGroupSettings.rejected, (s, a) => {
        s.updating = false;
        s.error = a.payload;
      })

      .addCase(updateGroupPrivacy.pending, (s) => {
        s.updating = true;
      })
      .addCase(updateGroupPrivacy.fulfilled, (s, a) => {
        const { groupId, privacy, requiresApproval } = a.payload;
        s.updating = false;
        if (!s.byGroup[groupId]) s.byGroup[groupId] = {};
        s.byGroup[groupId].privacy = privacy;
        s.byGroup[groupId].requiresApproval = requiresApproval;
      })
      .addCase(updateGroupPrivacy.rejected, (s, a) => {
        s.updating = false;
        s.error = a.payload;
      })

      .addCase(toggleFeature.pending, (s) => {
        s.updating = true;
      })
      .addCase(toggleFeature.fulfilled, (s, a) => {
        const { groupId, feature, enabled } = a.payload;
        s.updating = false;
        if (!s.byGroup[groupId]) s.byGroup[groupId] = {};
        if (!s.byGroup[groupId].features) s.byGroup[groupId].features = {};
        s.byGroup[groupId].features[feature] = enabled;
      })
      .addCase(toggleFeature.rejected, (s, a) => {
        s.updating = false;
        s.error = a.payload;
      })

      .addCase(deleteGroup.pending, (s, a) => {
        s.deletingGroupId = a.meta.arg;
      })
      .addCase(deleteGroup.fulfilled, (s, a) => {
        const groupId = a.payload.groupId;
        delete s.byGroup[groupId];
        s.deletingGroupId = null;
      })
      .addCase(deleteGroup.rejected, (s, a) => {
        s.deletingGroupId = null;
        s.error = a.payload;
      });
  },
});

export default groupSettingsSlice.reducer;
