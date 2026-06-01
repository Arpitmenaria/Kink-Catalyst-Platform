import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    page: 'login', // Changed from 'signup' to 'login'
    // Add any other initial UI states here if they exist
  },
  reducers: {
    showLogin(state) {
      state.page = 'login';
    },
    showSignup(state) {
      state.page = 'signup';
    },
    showForgotPassword(state) {
      state.page = 'forgot-password';
    },
  },
});

export const { showLogin, showSignup, showForgotPassword } = uiSlice.actions;
export default uiSlice.reducer;