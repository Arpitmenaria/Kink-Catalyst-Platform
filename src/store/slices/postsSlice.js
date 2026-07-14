import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// The same post can exist as separate copies in the main feed, the logged-in
// user's own post list, and a viewed profile's post list simultaneously —
// mutate every copy that matches, not just the first one found, or lists
// that didn't get the update go stale (e.g. comments posted from a profile
// page never showing there once the feed already holds its own copy).
function forEachMatchingPost(state, postId, fn) {
  for (const list of [state.posts, state.myPosts, state.viewedPosts]) {
    const post = list.find(p => p._id === postId);
    if (post) fn(post);
  }
}

function findComment(comments, commentId) {
  for (const c of comments) {
    if ((c._id ?? c.id) === commentId) return c;
    if (Array.isArray(c.replies)) {
      const reply = c.replies.find(r => (r._id ?? r.id) === commentId);
      if (reply) return reply;
    }
  }
  return null;
}

export function normalizePost(p) {
  // The feed/list endpoint only sends a comment COUNT, not the actual
  // comments — full comment objects are fetched on-demand (fetchPostComments)
  // when a user opens a post's comment section. `commentsLoaded` tracks
  // whether `comments` below is real data yet or just a count-shaped array.
  const commentsIsCount = typeof p.comments === 'number';
  return {
    ...p,
    likes: Array.isArray(p.likes) ? p.likes : [],
    likesCount: typeof p.likesCount === 'number' ? p.likesCount : (Array.isArray(p.likes) ? p.likes.length : 0),
    recentReactors: Array.isArray(p.recentReactors) ? p.recentReactors : [],
    comments: commentsIsCount
      ? new Array(p.comments).fill(null)
      : (Array.isArray(p.comments) ? p.comments : []),
    commentsCount: commentsIsCount ? p.comments : (Array.isArray(p.comments) ? p.comments.length : 0),
    commentsLoaded: !commentsIsCount,
    shares: typeof p.shares === 'number'
      ? new Array(p.shares).fill(null)
      : (Array.isArray(p.shares) ? p.shares : []),
  };
}

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|#|$)/i;

function detectMediaType(url = '', hint = null) {
  if (hint === 'video') return 'video';
  if (VIDEO_EXT.test(url)) return 'video';
  return 'image';
}

// /api/users/me/posts field mapping → PostCard shape
function normalizeMyPost(p) {
  // Build media array, normalizing video type regardless of what the API sends
  let rawMedia = [];
  if (Array.isArray(p.media) && p.media.length > 0) {
    // API already sent media[] — re-check type for each item
    rawMedia = p.media;
  } else {
    // Build from flat fields
    if (p.video) rawMedia.push({ url: p.video, type: 'video' });
    if (Array.isArray(p.videos)) p.videos.filter(Boolean).forEach(url => rawMedia.push({ url, type: 'video' }));
    if (Array.isArray(p.images)) p.images.filter(Boolean).forEach(url => rawMedia.push({ url }));
  }
  const media = rawMedia
    .filter(item => item?.url)
    .map(item => ({ ...item, type: detectMediaType(item.url, item.type) }));

  return {
    ...p,
    // author.name → author.fullName (PostCard reads fullName)
    author: p.author
      ? { ...p.author, fullName: p.author.fullName ?? p.author.name ?? '' }
      : p.author,
    // content → caption (PostCard reads caption)
    caption: p.caption ?? p.content ?? '',
    media,
    // likes is a number from this API — keep as-is for PostCard's isStatic path
    likes: typeof p.likes === 'number' ? p.likes : (Array.isArray(p.likes) ? p.likes : 0),
    comments: typeof p.comments === 'number'
      ? new Array(p.comments).fill(null)
      : (Array.isArray(p.comments) ? p.comments : []),
    commentsCount: typeof p.comments === 'number' ? p.comments : (Array.isArray(p.comments) ? p.comments.length : 0),
    commentsLoaded: typeof p.comments !== 'number',
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

// Lightweight count-only fetch for the navbar's "Total Posts" stat — must NOT
// touch state.myPosts, since ProfilePage's fetchMyPosts (paged list) can be
// in flight at the same time and a shared reducer would clobber it.
export const fetchMyPostsCount = createAsyncThunk(
  'posts/fetchMyPostsCount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/users/me/posts?page=1&limit=1`, { token });
      return { total: data.total ?? 0 };
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
      return { postId, liked: data.liked, likesCount: data.likesCount, recentReactors: data.recentReactors, userId };
    } catch (err) {
      return rejectWithValue({ postId, userId, message: err.message });
    }
  }
);

export const fetchPostComments = createAsyncThunk(
  'posts/fetchComments',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/comments`, { token });
      return { postId, comments: data.comments ?? [] };
    } catch (err) {
      return rejectWithValue({ postId, message: err.message });
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

export const likeComment = createAsyncThunk(
  'posts/likeComment',
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/comments/${commentId}/like`, { method: 'POST', token });
      return { postId, commentId, liked: data.liked, likesCount: data.likesCount };
    } catch (err) {
      return rejectWithValue({ postId, commentId, message: err.message });
    }
  }
);

export const replyToComment = createAsyncThunk(
  'posts/replyToComment',
  async ({ postId, commentId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        body: { text },
        token,
      });
      return { postId, commentId, reply: data.reply };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  // mediaFile: single video file. mediaFiles: one or more images (multi-photo
  // posts) — both append under the same 'media' field so the backend can
  // treat it as an array, same as the group-post upload.
  async ({ caption, mediaFile, mediaFiles, visibility = 'anyone' }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      if (caption?.trim()) formData.append('caption', caption.trim());
      formData.append('visibility', visibility);
      if (mediaFile) formData.append('media', mediaFile);
      (mediaFiles ?? []).forEach(file => formData.append('media', file));

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

export const reportUser = createAsyncThunk(
  'posts/reportUser',
  async ({ userId, reason }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/users/${userId}/report`, {
        method: 'POST',
        body: { reason },
        token,
      });
      return { userId };
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
    viewedPosts: [],
    likingIds: [],
    commentingId: null,
    commentsLoadingIds: [],
    sharingId: null,
    creating: false,
    reportReasons: [],
    reasonsLoading: false,
    reportSubmitting: false,
  },
  reducers: {
    setViewedPosts(state, action) {
      state.viewedPosts = action.payload ?? [];
    },
  },
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

      // ── Fetch My Posts Count (navbar stat only) ────
      .addCase(fetchMyPostsCount.fulfilled, (state, action) => {
        state.myPostsTotal = action.payload.total;
      })

      // ── Like (optimistic toggle) ────────────
      .addCase(likePost.pending, (state, action) => {
        const { postId, userId } = action.meta.arg;
        state.likingIds.push(postId);
        forEachMatchingPost(state, postId, (post) => {
          const idx = post.likes.indexOf(userId);
          if (idx === -1) { post.likes.push(userId); post.likesCount += 1; }
          else { post.likes.splice(idx, 1); post.likesCount = Math.max(0, post.likesCount - 1); }
        });
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likesCount, recentReactors } = action.payload;
        state.likingIds = state.likingIds.filter(id => id !== postId);
        forEachMatchingPost(state, postId, (post) => {
          if (typeof likesCount === 'number') post.likesCount = likesCount;
          if (Array.isArray(recentReactors)) post.recentReactors = recentReactors;
        });
      })
      .addCase(likePost.rejected, (state, action) => {
        const { postId, userId } = action.meta.arg;
        state.likingIds = state.likingIds.filter(id => id !== postId);
        forEachMatchingPost(state, postId, (post) => {
          const idx = post.likes.indexOf(userId);
          if (idx === -1) { post.likes.push(userId); post.likesCount += 1; }
          else { post.likes.splice(idx, 1); post.likesCount = Math.max(0, post.likesCount - 1); }
        });
      })

      // ── Comment ────────────────────────────
      .addCase(commentPost.pending, (state, action) => {
        state.commentingId = action.meta.arg.postId;
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        state.commentingId = null;
        if (comment) {
          forEachMatchingPost(state, postId, (post) => {
            post.comments.push(comment);
            post.commentsCount = (post.commentsCount ?? 0) + 1;
          });
        }
      })
      .addCase(commentPost.rejected, (state) => {
        state.commentingId = null;
      })

      // ── Fetch full comments for a post (on-demand) ──
      .addCase(fetchPostComments.pending, (state, action) => {
        state.commentsLoadingIds.push(action.meta.arg);
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.commentsLoadingIds = state.commentsLoadingIds.filter(id => id !== postId);
        forEachMatchingPost(state, postId, (post) => {
          post.comments = comments;
          post.commentsCount = comments.length;
          post.commentsLoaded = true;
        });
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        const postId = action.payload?.postId ?? action.meta.arg;
        state.commentsLoadingIds = state.commentsLoadingIds.filter(id => id !== postId);
      })

      // ── Like a comment/reply ───────────────
      .addCase(likeComment.fulfilled, (state, action) => {
        const { postId, commentId, likesCount } = action.payload;
        forEachMatchingPost(state, postId, (post) => {
          const comment = findComment(post.comments, commentId);
          if (comment && typeof likesCount === 'number') comment.likes = likesCount;
        });
      })

      // ── Reply to a comment ─────────────────
      .addCase(replyToComment.fulfilled, (state, action) => {
        const { postId, commentId, reply } = action.payload;
        if (!reply) return;
        forEachMatchingPost(state, postId, (post) => {
          const comment = post.comments.find(c => (c._id ?? c.id) === commentId);
          if (!comment) return;
          if (!Array.isArray(comment.replies)) comment.replies = [];
          comment.replies.push(reply);
        });
      })

      // ── Share ──────────────────────────────
      .addCase(sharePost.pending, (state, action) => {
        state.sharingId = action.meta.arg;
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        state.sharingId = null;
        const { postId } = action.payload;
        forEachMatchingPost(state, postId, (post) => {
          if (Array.isArray(post.shares)) post.shares.push('shared');
        });
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

export const { setViewedPosts } = postsSlice.actions;
export default postsSlice.reducer;
