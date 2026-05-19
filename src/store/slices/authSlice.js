import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectPlan } from './plansSlice';

const BASE_URL = 'https://social-platform-backend-a4zd.onrender.com/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      // User exists but hasn't picked a plan yet — not a real error
      if (data.requiresPlanSelection) {
        return { requiresPlanSelection: true, setupToken: data.setupToken };
      }

      if (!response.ok || !data.success) {
        return rejectWithValue(data?.message || 'Login failed.');
      }

      return data;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data?.message || 'Registration failed.');
      return { data, credentials };
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otp, { getState, rejectWithValue }) => {
    try {
      const { registrationData } = getState().auth;
      const response = await fetch(`${BASE_URL}/auth/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registrationData, otp }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data?.message || 'Verification failed.');
      return data;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { registrationData } = getState().auth;
      const response = await fetch(`${BASE_URL}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data?.message || 'Resend failed.');
      return data;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
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
        if (action.payload.requiresPlanSelection) {
          state.requiresPlanSelection = true;
          state.setupToken = action.payload.setupToken;
        } else {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
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
        state.isAuthenticated = true;
        state.user = action.payload.user ?? null;
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
      // Absorbs the token + user returned by the select-plan API.
      // Also activates the session when coming from the login→plan-setup flow.
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
