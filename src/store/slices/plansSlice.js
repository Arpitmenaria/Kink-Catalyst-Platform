import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const STATIC_PLANS = [
  {
    _id: 'plan-free',
    tier: 'free',
    price: 0,
    features: [
      'Basic profile',
      '5 posts per day',
      'Standard feed',
      'Connect with friends',
    ],
  },
  {
    _id: 'plan-gold',
    tier: 'gold',
    price: 9,
    features: [
      'Everything in Free',
      'Unlimited posts',
      'Priority feed ranking',
      'Analytics dashboard',
      'Custom profile badge',
    ],
  },
  {
    _id: 'plan-platinum',
    tier: 'platinum',
    price: 19,
    features: [
      'Everything in Gold',
      '4x visibility boost',
      'Advanced analytics',
      'Early access to features',
      'Dedicated support',
    ],
  },
];

export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async () => {
    return STATIC_PLANS;
  }
);

export const selectPlan = createAsyncThunk(
  'plans/selectPlan',
  async (planId) => {
    const plan = STATIC_PLANS.find(p => p._id === planId);
    return {
      planId,
      data: {
        token: 'mock-token',
        user: { fullName: 'Demo User', id: 'mock-user-1', membership: plan?.tier ?? 'free' },
      },
    };
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
