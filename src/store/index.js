import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import plansReducer from './slices/plansSlice';
import uiReducer from './slices/uiSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';
import postsReducer from './slices/postsSlice';
import profileReducer from './slices/profileSlice';
import usersReducer from './slices/usersSlice';
import notificationsReducer from './slices/notificationsSlice';
import toastReducer from './slices/toastSlice';
import messagesReducer from './slices/messagesSlice';
import groupsReducer from './slices/groupsSlice';
import eventsReducer from './slices/eventsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: plansReducer,
    ui: uiReducer,
    forgotPassword: forgotPasswordReducer,
    posts: postsReducer,
    profile: profileReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    toast: toastReducer,
    messages: messagesReducer,
    groups: groupsReducer,
    events: eventsReducer,
  },
});

export default store;
