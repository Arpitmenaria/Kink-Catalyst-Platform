import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectPlan } from './plansSlice';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email }) => {
    await new Promise(r => setTimeout(r, 1400));
    const name = email.split('@')[0].replace(/[._]/g, ' ');
    const fullName = name.charAt(0).toUpperCase() + name.slice(1);
    return { user: { fullName, id: 'mock-user-1', email }, token: 'mock-token' };
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials) => {
    await new Promise(r => setTimeout(r, 1400));
    return { data: { success: true }, credentials };
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async () => {
    await new Promise(r => setTimeout(r, 1400));
    return { setupToken: 'mock-setup-token', user: null, token: null };
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async () => {
    return {};
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    setupToken: null,
    isAuthenticated: false,
    requiresPlanSelection: false,
    otpPending: false,
    registrationData: null,
    loading: false,
    resendLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAuthState(state) {
      state.error = null;
      state.successMessage = null;
    },
    resetToSignup(state) {
      state.otpPending = false;
      state.registrationData = null;
      state.error = null;
      state.successMessage = null;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.setupToken = null;
      state.isAuthenticated = false;
      state.requiresPlanSelection = false;
      state.otpPending = false;
      state.registrationData = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ─────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Register ──────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.otpPending = true;
        state.registrationData = action.payload.credentials;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Verify OTP ────────────────────────────
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpPending = false;
        state.registrationData = null;
        state.requiresPlanSelection = true;
        state.user = action.payload.user ?? null;
        state.setupToken = action.payload.setupToken ?? null;
        state.token = action.payload.token ?? null;
        state.successMessage = 'Email verified successfully!';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Resend OTP ────────────────────────────
      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendLoading = false;
        state.successMessage = 'A new code has been sent to your email.';
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.error = action.payload;
      })

      // ── Select Plan ───────────────────────────
      .addCase(selectPlan.fulfilled, (state, action) => {
        const { token, user } = action.payload.data ?? {};
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
        if (user) state.user = user;
        state.setupToken = null;
        state.requiresPlanSelection = false;
      });
  },
});

export const { clearAuthState, resetToSignup, logout } = authSlice.actions;
export default authSlice.reducer;
