import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/auth/user/plans');
      return Array.isArray(data) ? data : (data.data ?? data.plans ?? []);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const selectPlan = createAsyncThunk(
  'plans/selectPlan',
  async (planId, { getState, rejectWithValue }) => {
    try {
      const { setupToken } = getState().auth;
      const data = await apiRequest('/api/auth/user/select-plan', {
        method: 'POST',
        body: { planId },
        token: setupToken,
      });
      const payload = data.data ?? data;
      return { planId, data: { token: payload.token ?? null, user: payload.user ?? null } };
    } catch (err) {
      return rejectWithValue(err.message);
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
