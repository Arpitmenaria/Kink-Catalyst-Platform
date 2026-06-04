import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const sendResetOtp = createAsyncThunk(
  'forgotPassword/sendOtp',
  async (email) => {
    return email;
  }
);

export const verifyResetOtp = createAsyncThunk(
  'forgotPassword/verifyOtp',
  async (otp) => {
    return { otp };
  }
);

export const resetPassword = createAsyncThunk(
  'forgotPassword/resetPassword',
  async () => {
    return { success: true };
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
