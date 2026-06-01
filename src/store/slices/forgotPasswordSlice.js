import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://kick-analyst-backend-production.up.railway.app/api';

export const sendResetOtp = createAsyncThunk(
  'forgotPassword/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) return rejectWithValue(data?.message || 'Failed to send OTP.');
      return email;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const verifyResetOtp = createAsyncThunk(
  'forgotPassword/verifyOtp',
  async (otp, { getState, rejectWithValue }) => {
    try {
      const { email } = getState().forgotPassword;
      const response = await fetch(`${BASE_URL}/auth/user/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) return rejectWithValue(data?.message || 'Invalid OTP.');
      return { ...data, otp }; // carry otp forward so reset-password can use it
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'forgotPassword/resetPassword',
  async (newPassword, { getState, rejectWithValue }) => {
    try {
      const { email, otp } = getState().forgotPassword;
      const response = await fetch(`${BASE_URL}/auth/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) return rejectWithValue(data?.message || 'Failed to reset password.');
      return data;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: {
    step: 'email',   // 'email' | 'otp' | 'reset' | 'done'
    email: '',
    otp: '',
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    goToStep(state, action) {
      state.step = action.payload;
      state.error = null;
      state.successMessage = null;
    },
    clearForgotState(state) {
      state.error = null;
      state.successMessage = null;
    },
    resetForgotPassword() {
      return { step: 'email', email: '', otp: '', loading: false, error: null, successMessage: null };
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Send OTP ──────────────────────────────
      .addCase(sendResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload;
        state.step = 'otp';
      })
      .addCase(sendResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Verify OTP ────────────────────────────
      .addCase(verifyResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otp = action.payload.otp;
        state.step = 'reset';
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Reset Password ────────────────────────
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.step = 'done';
        state.successMessage = 'Password reset successfully!';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { goToStep, clearForgotState, resetForgotPassword } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
