import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    page: 'login', // Changed from 'signup' to 'login'
    // One-shot cross-app navigation request (e.g. clicking a new-message toast
    // from anywhere in the app) — HomePage consumes it and clears it back to
    // null, since there's no router this app can otherwise target from
    // outside HomePage's own component state.
    pendingNavigation: null, // { section, convId } | null
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
    navigateTo(state, action) {
      state.pendingNavigation = action.payload;
    },
    clearPendingNavigation(state) {
      state.pendingNavigation = null;
    },
  },
});

export const { showLogin, showSignup, showForgotPassword, navigateTo, clearPendingNavigation } = uiSlice.actions;
export default uiSlice.reducer;