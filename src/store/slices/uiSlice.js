import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    page: 'signup', // 'signup' | 'login'
  },
  reducers: {
    showLogin:          (state) => { state.page = 'login';          },
    showSignup:         (state) => { state.page = 'signup';         },
    showForgotPassword: (state) => { state.page = 'forgot-password'; },
  },
});

export const { showLogin, showSignup, showForgotPassword } = uiSlice.actions;
export default uiSlice.reducer;
