import { createSlice } from '@reduxjs/toolkit';

// Map action base-type → success message
const SUCCESS = {
  'profile/update':                    'Profile updated successfully',
  'profile/updateEducation':           'Education saved',
  'profile/updateAvatar':              'Avatar updated',
  'profile/updateCover':               'Cover photo updated',
  'profile/removeConnection':          'Connection removed',
  'profile/uploadPhoto':               'Photo uploaded',
  'posts/create':                      'Post shared!',
  'posts/commentPost':                 'Comment added',
  'users/follow':                      'Following',
  'users/sendFriendRequest':           'Connection request sent',
  'users/acceptFriendRequest':         'Connection accepted',
  'messages/createGroup':              'Group created',
  'messages/uploadAssets':             'Files uploaded',
  'messages/reportConversation':       'Conversation reported',
};

// Map action base-type → error message (falls back to payload)
const ERROR_BASE = new Set(Object.keys(SUCCESS));

function makeId() { return `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

const toastSlice = createSlice({
  name: 'toast',
  initialState: { toasts: [] },
  reducers: {
    showToast(state, action) {
      const { message, type = 'success', meta = null } = action.payload;
      state.toasts.push({ id: makeId(), message, type, meta });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Success messages ────────────────────────────────────────────────────
      .addMatcher(
        action => action.type.endsWith('/fulfilled') && SUCCESS[action.type.replace('/fulfilled', '')],
        (state, action) => {
          const msg = SUCCESS[action.type.replace('/fulfilled', '')];
          state.toasts.push({ id: makeId(), message: msg, type: 'success' });
        }
      )
      // ── Error messages ──────────────────────────────────────────────────────
      .addMatcher(
        action => action.type.endsWith('/rejected') && ERROR_BASE.has(action.type.replace('/rejected', '')),
        (state, action) => {
          const msg = action.payload || action.error?.message || 'Something went wrong';
          state.toasts.push({ id: makeId(), message: String(msg), type: 'error' });
        }
      );
  },
});

export const { showToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
