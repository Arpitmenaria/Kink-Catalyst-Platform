import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const STATIC_REPORT_REASONS = [
  'Spam or misleading',
  'Nudity or sexual content',
  'Hate speech or symbols',
  'Violence or dangerous organizations',
  'Bullying or harassment',
  'Intellectual property violation',
];

export const fetchFeedPosts = createAsyncThunk(
  'posts/fetchFeed',
  async () => []
);

export const likePost = createAsyncThunk(
  'posts/like',
  async ({ postId, userId }) => {
    return { postId, likes: null, userId };
  }
);

export const commentPost = createAsyncThunk(
  'posts/comment',
  async ({ postId, text }) => {
    const comment = { _id: `c-${Date.now()}`, text, author: { fullName: 'You' }, createdAt: new Date().toISOString() };
    return { postId, comment };
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async ({ caption, mediaFile }) => {
    const mediaUrl = mediaFile ? URL.createObjectURL(mediaFile) : null;
    return {
      _id: `post-${Date.now()}`,
      author: { fullName: 'You', avatar: '' },
      caption,
      media: mediaUrl ? [{ url: mediaUrl }] : [],
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      shares: [],
    };
  }
);

export const fetchReportReasons = createAsyncThunk(
  'posts/fetchReportReasons',
  async () => STATIC_REPORT_REASONS
);

export const reportPost = createAsyncThunk(
  'posts/report',
  async ({ postId }) => {
    return { postId };
  }
);

export const reportUser = createAsyncThunk(
  'posts/reportUser',
  async ({ userId }) => {
    return { userId };
  }
);

export const sharePost = createAsyncThunk(
  'posts/share',
  async (postId) => {
    return { postId, shares: null };
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
        const { postId } = action.payload;
        state.likingIds = state.likingIds.filter(id => id !== postId);
      })
      .addCase(likePost.rejected, (state, action) => {
        const { postId, userId } = action.meta.arg;
        state.likingIds = state.likingIds.filter(id => id !== postId);
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
        state.sharingId = null;
        const { postId } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post && Array.isArray(post.shares)) post.shares.push('shared');
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
      })

      // ── Report User ────────────────────────
      .addCase(reportUser.pending, (state) => {
        state.reportSubmitting = true;
      })
      .addCase(reportUser.fulfilled, (state) => {
        state.reportSubmitting = false;
      })
      .addCase(reportUser.rejected, (state) => {
        state.reportSubmitting = false;
      });
  },
});

export default postsSlice.reducer;
