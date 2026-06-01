import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://kick-analyst-backend-production.up.railway.app/api';

export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, setupToken } = getState().auth;
      const authToken = token || setupToken;
      const response = await fetch(`${BASE_URL}/auth/user/plans`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data?.message || 'Failed to load plans.');
      return data.plans;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const selectPlan = createAsyncThunk(
  'plans/selectPlan',
  async (planId, { getState, rejectWithValue }) => {
    try {
      const { token, setupToken } = getState().auth;
      const authToken = token || setupToken; // setupToken used in login→plan-setup flow
      const response = await fetch(`${BASE_URL}/auth/user/select-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data?.message || 'Failed to select plan.');
      return { planId, data }; // data contains token + user consumed by authSlice
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

const plansSlice = createSlice({
  name: 'plans',
  initialState: {
    plans: [],
    selectedPlanId: null,
    planSelectionComplete: false,
    loading: false,
    selecting: null,
    error: null,
  },
  reducers: {
    clearPlansError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch plans ───────────────────────────
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Select plan ───────────────────────────
      .addCase(selectPlan.pending, (state, action) => {
        state.selecting = action.meta.arg;
        state.error = null;
      })
      .addCase(selectPlan.fulfilled, (state, action) => {
        state.selecting = null;
        state.selectedPlanId = action.payload.planId;
        state.planSelectionComplete = true;
      })
      .addCase(selectPlan.rejected, (state, action) => {
        state.selecting = null;
        state.error = action.payload;
      });
  },
});

export const { clearPlansError } = plansSlice.actions;
export default plansSlice.reducer;
