import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

function normalizePost(p) {
  return {
    ...p,
    likes: Array.isArray(p.likes) ? p.likes : [],
    comments: typeof p.comments === 'number'
      ? new Array(p.comments).fill(null)
      : (Array.isArray(p.comments) ? p.comments : []),
    shares: typeof p.shares === 'number'
      ? new Array(p.shares).fill(null)
      : (Array.isArray(p.shares) ? p.shares : []),
  };
}

// /api/users/me/posts field mapping → PostCard shape
function normalizeMyPost(p) {
  return {
    ...p,
    // author.name → author.fullName (PostCard reads fullName)
    author: p.author
      ? { ...p.author, fullName: p.author.fullName ?? p.author.name ?? '' }
      : p.author,
    // content → caption (PostCard reads caption)
    caption: p.caption ?? p.content ?? '',
    // Build media array from all possible shapes the API may send
    media: p.media ?? (() => {
      const items = [];
      // Explicit video field(s)
      if (p.video) items.push({ url: p.video, type: 'video' });
      if (Array.isArray(p.videos)) p.videos.filter(Boolean).forEach(url => items.push({ url, type: 'video' }));
      // images[] — detect video URLs by extension
      if (Array.isArray(p.images)) {
        p.images.filter(Boolean).forEach(url => {
          const isVid = /\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(url);
          items.push({ url, type: isVid ? 'video' : 'image' });
        });
      }
      return items;
    })(),
    // likes is a number from this API — keep as-is for PostCard's isStatic path
    likes: typeof p.likes === 'number' ? p.likes : (Array.isArray(p.likes) ? p.likes : 0),
    comments: typeof p.comments === 'number'
      ? new Array(p.comments).fill(null)
      : (Array.isArray(p.comments) ? p.comments : []),
    shares: typeof p.shares === 'number'
      ? new Array(p.shares).fill(null)
      : (Array.isArray(p.shares) ? p.shares : []),
  };
}

export const fetchFeedPosts = createAsyncThunk(
  'posts/fetchFeed',
  async ({ page = 1, limit = 10 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts?page=${page}&limit=${limit}`, { token });
      return (data.posts ?? []).map(normalizePost);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  'posts/fetchMyPosts',
  async ({ page = 1, limit = 10 } = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/users/me/posts?page=${page}&limit=${limit}`, { token });
      return {
        posts: (data.posts ?? []).map(normalizeMyPost),
        total: data.total ?? 0,
        page: data.page ?? page,
        hasMore: data.hasMore ?? false,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/like',
  async ({ postId, userId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/like`, { method: 'POST', token });
      return { postId, liked: data.liked, likesCount: data.likesCount, userId };
    } catch (err) {
      return rejectWithValue({ postId, userId, message: err.message });
    }
  }
);

export const commentPost = createAsyncThunk(
  'posts/comment',
  async ({ postId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: { text },
        token,
      });
      return { postId, comment: data.comment };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async ({ caption, mediaFile, visibility = 'anyone' }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      if (caption?.trim()) formData.append('caption', caption.trim());
      formData.append('visibility', visibility);
      if (mediaFile) formData.append('media', mediaFile);

      const data = await apiRequest('/api/posts', {
        method: 'POST',
        body: formData,
        token,
        isFormData: true,
      });
      return normalizePost(data.post);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchReportReasons = createAsyncThunk(
  'posts/fetchReportReasons',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/api/posts/report-reasons');
      return data.reasons ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const reportPost = createAsyncThunk(
  'posts/report',
  async ({ postId, reason }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/posts/${postId}/report`, {
        method: 'POST',
        body: { reason },
        token,
      });
      return { postId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const sharePost = createAsyncThunk(
  'posts/share',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/share`, { method: 'POST', token });
      return { postId, sharesCount: data.sharesCount };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
    myPosts: [],
    myPostsTotal: 0,
    myPostsLoading: false,
    myPostsHasMore: false,
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

      // ── Fetch My Posts (profile feed) ─────────
      .addCase(fetchMyPosts.pending, (state) => { state.myPostsLoading = true; })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        const { posts, total, page, hasMore } = action.payload;
        state.myPostsLoading = false;
        state.myPosts = page === 1 ? posts : [...state.myPosts, ...posts];
        state.myPostsTotal = total;
        state.myPostsHasMore = hasMore;
      })
      .addCase(fetchMyPosts.rejected, (state) => { state.myPostsLoading = false; })

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
        if (action.payload) {
          state.posts.unshift(action.payload);
          state.myPosts.unshift(action.payload);
          state.myPostsTotal += 1;
        }
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
