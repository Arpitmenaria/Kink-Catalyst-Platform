import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://social-platform-backend-a4zd.onrender.com/api';

export const fetchFeedPosts = createAsyncThunk(
  'posts/fetchFeed',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await fetch(`${BASE_URL}/auth/user/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) return rejectWithValue(data?.message || 'Failed to load posts.');
      return data.posts;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/like',
  async ({ postId, userId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await fetch(`${BASE_URL}/auth/user/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) return rejectWithValue({ postId, userId });
      return { postId, likes: data.likes, userId };
    } catch {
      return rejectWithValue({ postId, userId });
    }
  }
);

export const commentPost = createAsyncThunk(
  'posts/comment',
  async ({ postId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await fetch(`${BASE_URL}/auth/user/posts/${postId}/comment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return rejectWithValue(data?.message || 'Failed to post comment.');
      return { postId, comment: data.comment };
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async ({ caption, mediaFile }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      formData.append('caption', caption);
      if (mediaFile) formData.append('media', mediaFile);
      const res = await fetch(`${BASE_URL}/auth/user/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) return rejectWithValue(data?.message || 'Failed to create post.');
      return data.post;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchReportReasons = createAsyncThunk(
  'posts/fetchReportReasons',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await fetch(`${BASE_URL}/auth/user/report-reasons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) return rejectWithValue('Failed to load reasons.');
      return data.reasons;
    } catch {
      return rejectWithValue('Network error.');
    }
  }
);

export const reportPost = createAsyncThunk(
  'posts/report',
  async ({ postId, reason }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await fetch(`${BASE_URL}/auth/user/posts/${postId}/report`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return rejectWithValue(data?.message || 'Failed to submit report.');
      return { postId };
    } catch {
      return rejectWithValue('Network error.');
    }
  }
);

export const sharePost = createAsyncThunk(
  'posts/share',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await fetch(`${BASE_URL}/auth/user/posts/${postId}/share`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) return rejectWithValue(data?.message || 'Failed to share.');
      return { postId, shares: data.shares };
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
    likingIds: [],
    commentingId: null,
    sharingId: null,
    creating: false,
    reportReasons: [],
    reasonsLoading: false,
    reportSubmitting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Fetch Feed ─────────────────────────
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload ?? [];
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Like (optimistic toggle) ────────────
      .addCase(likePost.pending, (state, action) => {
        const { postId, userId } = action.meta.arg;
        state.likingIds.push(postId);
        const post = state.posts.find(p => p._id === postId);
        if (!post) return;
        const idx = post.likes.indexOf(userId);
        if (idx === -1) post.likes.push(userId);
        else post.likes.splice(idx, 1);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        state.likingIds = state.likingIds.filter(id => id !== postId);
        const post = state.posts.find(p => p._id === postId);
        if (post && likes) post.likes = likes;
      })
      .addCase(likePost.rejected, (state, action) => {
        const { postId, userId } = action.meta.arg;
        state.likingIds = state.likingIds.filter(id => id !== postId);
        // revert optimistic toggle
        const post = state.posts.find(p => p._id === postId);
        if (!post) return;
        const idx = post.likes.indexOf(userId);
        if (idx === -1) post.likes.push(userId);
        else post.likes.splice(idx, 1);
      })

      // ── Comment ────────────────────────────
      .addCase(commentPost.pending, (state, action) => {
        state.commentingId = action.meta.arg.postId;
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        state.commentingId = null;
        const post = state.posts.find(p => p._id === postId);
        if (post && comment) post.comments.push(comment);
      })
      .addCase(commentPost.rejected, (state) => {
        state.commentingId = null;
      })

      // ── Share ──────────────────────────────
      .addCase(sharePost.pending, (state, action) => {
        state.sharingId = action.meta.arg;
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId, shares } = action.payload;
        state.sharingId = null;
        const post = state.posts.find(p => p._id === postId);
        if (post && shares) post.shares = shares;
      })
      .addCase(sharePost.rejected, (state) => {
        state.sharingId = null;
      })

      // ── Create Post ───────────────────────
      .addCase(createPost.pending, (state) => {
        state.creating = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload) state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state) => {
        state.creating = false;
      })

      // ── Report Reasons ─────────────────────
      .addCase(fetchReportReasons.pending, (state) => {
        state.reasonsLoading = true;
      })
      .addCase(fetchReportReasons.fulfilled, (state, action) => {
        state.reasonsLoading = false;
        state.reportReasons = action.payload;
      })
      .addCase(fetchReportReasons.rejected, (state) => {
        state.reasonsLoading = false;
      })

      // ── Report Post ────────────────────────
      .addCase(reportPost.pending, (state) => {
        state.reportSubmitting = true;
      })
      .addCase(reportPost.fulfilled, (state) => {
        state.reportSubmitting = false;
      })
      .addCase(reportPost.rejected, (state) => {
        state.reportSubmitting = false;
      });
  },
});

export default postsSlice.reducer;
