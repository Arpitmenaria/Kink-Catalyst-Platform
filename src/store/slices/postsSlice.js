import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import { blockUser } from './usersSlice';

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
  // The single-post modal holds its own copy — keep it in sync too, so
  // reacting/commenting from the modal updates what's on screen.
  if (state.postDetail?._id === postId) fn(state.postDetail);
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
    myReaction: p.myReaction ?? (p.isLiked ? 'like' : null),
    recentReactors: Array.isArray(p.recentReactors) ? p.recentReactors : [],
    comments: commentsIsCount
      ? new Array(p.comments).fill(null)
      : (Array.isArray(p.comments) ? p.comments : []),
    commentsCount: commentsIsCount ? p.comments : (Array.isArray(p.comments) ? p.comments.length : 0),
    commentsLoaded: !commentsIsCount,
    shares: typeof p.shares === 'number'
      ? new Array(p.shares).fill(null)
      : (Array.isArray(p.shares) ? p.shares : []),
    isReported: p.isReported ?? false,
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
    myReaction: p.myReaction ?? (p.isLiked ? 'like' : null),
    comments: typeof p.comments === 'number'
      ? new Array(p.comments).fill(null)
      : (Array.isArray(p.comments) ? p.comments : []),
    commentsCount: typeof p.comments === 'number' ? p.comments : (Array.isArray(p.comments) ? p.comments.length : 0),
    commentsLoaded: typeof p.comments !== 'number',
    shares: typeof p.shares === 'number'
      ? new Array(p.shares).fill(null)
      : (Array.isArray(p.shares) ? p.shares : []),
    isReported: p.isReported ?? false,
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

// Single post + its full comment thread — powers the post-detail modal opened
// from a notification, so it works for any post regardless of feed pagination.
export const fetchPostById = createAsyncThunk(
  'posts/fetchById',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}`, { token });
      return normalizePost(data.post ?? data);
    } catch (err) {
      return rejectWithValue({ status: err.status, message: err.message });
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
  // reaction: 'like' | 'celebrate' | 'support' | 'love' | 'insightful' | 'funny'.
  // remove: true when toggling the current reaction off. Backend sets/replaces/
  // removes the caller's reaction and returns the new count + their reaction.
  async ({ postId, userId, reaction = 'like', remove = false }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/like`, {
        method: 'POST',
        token,
        body: { reaction, remove },
      });
      return {
        postId,
        liked: data.liked,
        likesCount: data.likesCount,
        recentReactors: data.recentReactors,
        myReaction: data.myReaction ?? (data.liked ? reaction : null),
        userId,
      };
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

// Reactions modal — full per-reaction-type list, paginated. Fetched with a
// generous limit and no `reaction` filter so tab counts (All / 👍 / 🎉 / …)
// can be computed client-side by grouping `likes` by `.reaction`, without a
// separate probe request per type.
export const fetchPostLikes = createAsyncThunk(
  'posts/fetchLikes',
  async ({ postId, page = 1, limit = 100 }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/likes?page=${page}&limit=${limit}`, { token });
      return { postId, total: data.total ?? 0, page: data.page ?? page, likes: data.likes ?? [] };
    } catch (err) {
      return rejectWithValue({ postId, message: err.message });
    }
  }
);

export const commentPost = createAsyncThunk(
  'posts/comment',
  async ({ postId, text, mentions }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: { text, mentions: mentions ?? [] },
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
  // replyingTo: id of the specific reply this is answering (vs. the parent
  // comment in general) — lets the UI thread it right after that reply
  // instead of always at the end of the flat chronological list. No-ops
  // until the backend actually stores/returns this field on replies.
  async ({ postId, commentId, text, mentions, replyingTo }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        body: { text, mentions: mentions ?? [], replyingTo: replyingTo ?? null },
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
  // posts). Merge into one deduped list so a caller passing the same file as
  // both (video tab did this) doesn't upload it twice under the 'media' field.
  async ({ caption, mediaFile, mediaFiles, visibility = 'anyone', mentions }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const formData = new FormData();
      if (caption?.trim()) formData.append('caption', caption.trim());
      formData.append('visibility', visibility);
      if (mentions?.length) formData.append('mentions', JSON.stringify(mentions));
      const allMedia = [...(mediaFile ? [mediaFile] : []), ...(mediaFiles ?? [])];
      const uniqueMedia = allMedia.filter((f, i) => allMedia.indexOf(f) === i);
      uniqueMedia.forEach(file => formData.append('media', file));

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

export const editPost = createAsyncThunk(
  'posts/edit',
  async ({ postId, caption, visibility, mentions }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: { caption, visibility, mentions: mentions ?? [] },
        token,
      });
      return {
        postId,
        caption: data.post?.caption ?? caption,
        visibility: data.post?.visibility ?? visibility,
        mentions: data.post?.mentions ?? mentions ?? [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/posts/${postId}`, { method: 'DELETE', token });
      return { postId };
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
    postDetail: null,          // single post shown in the detail modal
    postDetailLoading: false,
    postDetailError: null,     // { status, message } on 404/403
    likingIds: [],
    commentingId: null,
    commentsLoadingIds: [],
    postLikes: {}, // { [postId]: { total, items: [], page, hasMore, loading } } — Reactions modal data
    sharingId: null,
    creating: false,
    editingId: null,
    deletingId: null,
    reportReasons: [],
    reasonsLoading: false,
    reportSubmitting: false,
  },
  reducers: {
    setViewedPosts(state, action) {
      state.viewedPosts = action.payload ?? [];
    },
    clearPostDetail(state) {
      state.postDetail = null;
      state.postDetailLoading = false;
      state.postDetailError = null;
    },
    addPostRealtime(state, action) {
      state.posts.unshift(action.payload);
    },
    removePostRealtime(state, action) {
      const postId = action.payload;
      state.posts = state.posts.filter(p => (p._id ?? p.id) !== postId);
      if (state.postDetail?._id === postId || state.postDetail?.id === postId) {
        state.postDetail = null;
      }
    },
    updatePostLikeCount(state, action) {
      const { postId, likeCount } = action.payload;
      const post = state.posts.find(p => (p._id ?? p.id) === postId);
      if (post) post.likeCount = likeCount;
      if ((state.postDetail?._id ?? state.postDetail?.id) === postId) {
        state.postDetail.likeCount = likeCount;
      }
    },
    addCommentRealtime(state, action) {
      const { postId, comment } = action.payload;
      const post = state.posts.find(p => (p._id ?? p.id) === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
        post.commentCount = (post.commentCount ?? 0) + 1;
      }
      if ((state.postDetail?._id ?? state.postDetail?.id) === postId) {
        if (!state.postDetail.comments) state.postDetail.comments = [];
        state.postDetail.comments.push(comment);
        state.postDetail.commentCount = (state.postDetail.commentCount ?? 0) + 1;
      }
    },
    updateCommentLikeCount(state, action) {
      const { postId, commentId, likeCount } = action.payload;
      const post = state.posts.find(p => (p._id ?? p.id) === postId);
      if (post?.comments) {
        const comment = post.comments.find(c => (c._id ?? c.id) === commentId);
        if (comment) comment.likeCount = likeCount;
      }
      if ((state.postDetail?._id ?? state.postDetail?.id) === postId) {
        const comment = state.postDetail.comments?.find(c => (c._id ?? c.id) === commentId);
        if (comment) comment.likeCount = likeCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch single post (detail modal) ───
      .addCase(fetchPostById.pending, (state) => {
        state.postDetailLoading = true;
        state.postDetailError = null;
        state.postDetail = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.postDetailLoading = false;
        state.postDetail = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.postDetailLoading = false;
        state.postDetailError = action.payload ?? { message: 'Could not load this post.' };
      })

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

      // ── Like / React (optimistic) ────────────
      .addCase(likePost.pending, (state, action) => {
        const { postId, userId, reaction = 'like', remove = false } = action.meta.arg;
        state.likingIds.push(postId);
        forEachMatchingPost(state, postId, (post) => {
          const has = post.likes.includes(userId);
          if (remove) {
            // Toggle off: drop the reaction entirely.
            if (has) { post.likes.splice(post.likes.indexOf(userId), 1); post.likesCount = Math.max(0, post.likesCount - 1); }
            post.myReaction = null;
          } else {
            // Add (new) or switch (already reacted → count unchanged).
            if (!has) { post.likes.push(userId); post.likesCount += 1; }
            post.myReaction = reaction;
          }
        });
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likesCount, recentReactors, myReaction } = action.payload;
        state.likingIds = state.likingIds.filter(id => id !== postId);
        forEachMatchingPost(state, postId, (post) => {
          if (typeof likesCount === 'number') post.likesCount = likesCount;
          if (Array.isArray(recentReactors)) post.recentReactors = recentReactors;
          post.myReaction = myReaction ?? null;
        });
      })
      .addCase(likePost.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        state.likingIds = state.likingIds.filter(id => id !== postId);
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

      // ── Reactions modal — full likes list (paginated) ──
      .addCase(fetchPostLikes.pending, (state, action) => {
        const { postId } = action.meta.arg;
        if (!state.postLikes[postId]) state.postLikes[postId] = { total: 0, items: [], page: 0, hasMore: true, loading: false };
        state.postLikes[postId].loading = true;
      })
      .addCase(fetchPostLikes.fulfilled, (state, action) => {
        const { postId, total, page, likes } = action.payload;
        const entry = state.postLikes[postId] ?? { total: 0, items: [], page: 0, hasMore: true, loading: false };
        entry.total = total;
        entry.page = page;
        entry.items = page === 1 ? likes : [...entry.items, ...likes];
        entry.hasMore = entry.items.length < total;
        entry.loading = false;
        state.postLikes[postId] = entry;
      })
      .addCase(fetchPostLikes.rejected, (state, action) => {
        const postId = action.payload?.postId ?? action.meta.arg?.postId;
        if (state.postLikes[postId]) state.postLikes[postId].loading = false;
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
        const postId = action.meta.arg;
        state.sharingId = postId;
        forEachMatchingPost(state, postId, (post) => {
          if (Array.isArray(post.shares)) post.shares.push('shared');
        });
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        state.sharingId = null;
        const { postId, sharesCount } = action.payload;
        // Trust the server's authoritative count over the optimistic push above.
        if (typeof sharesCount === 'number') {
          forEachMatchingPost(state, postId, (post) => {
            if (Array.isArray(post.shares)) post.shares = new Array(sharesCount).fill(null);
          });
        }
      })
      .addCase(sharePost.rejected, (state, action) => {
        state.sharingId = null;
        const postId = action.meta.arg;
        forEachMatchingPost(state, postId, (post) => {
          if (Array.isArray(post.shares) && post.shares.length > 0) post.shares.pop();
        });
      })

      // ── Edit Post ──────────────────────────
      .addCase(editPost.pending, (state, action) => {
        state.editingId = action.meta.arg.postId;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.editingId = null;
        const { postId, caption, visibility, mentions } = action.payload;
        forEachMatchingPost(state, postId, (post) => {
          post.caption = caption;
          post.visibility = visibility;
          post.mentions = mentions;
        });
      })
      .addCase(editPost.rejected, (state) => {
        state.editingId = null;
      })

      // ── Delete Post ────────────────────────
      .addCase(deletePost.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deletingId = null;
        const { postId } = action.payload;
        state.posts = state.posts.filter(p => p._id !== postId);
        state.myPosts = state.myPosts.filter(p => p._id !== postId);
        state.viewedPosts = state.viewedPosts.filter(p => p._id !== postId);
      })
      .addCase(deletePost.rejected, (state) => {
        state.deletingId = null;
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
      .addCase(reportPost.fulfilled, (state, action) => {
        state.reportSubmitting = false;
        // Session-local until the backend also returns `isReported` on the
        // post itself (GET /api/posts, /api/users/me/posts) — without that,
        // this resets to showing the "..." menu again after a page refresh.
        forEachMatchingPost(state, action.payload.postId, (post) => {
          post.isReported = true;
        });
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
      })

      // Blocking a user (usersSlice.blockUser) — the backend excludes their
      // posts from GET /api/posts going forward, but that only takes effect
      // on the NEXT fetch; drop their posts from what's already loaded now
      // so blocking has an immediate visible effect instead of waiting for a refetch.
      .addCase(blockUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        const authorIdOf = (p) => p.author?._id ?? p.author?.id ?? p.authorId ?? p.userId;
        state.posts = state.posts.filter(p => authorIdOf(p) !== userId);
        state.viewedPosts = state.viewedPosts.filter(p => authorIdOf(p) !== userId);
      });
  },
});

export const {
  setViewedPosts,
  clearPostDetail,
  addPostRealtime,
  removePostRealtime,
  updatePostLikeCount,
  addCommentRealtime,
  updateCommentLikeCount,
} = postsSlice.actions;
export default postsSlice.reducer;
