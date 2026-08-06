import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

// COMMENTS

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ groupId, postId, page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/posts/${postId}/comments?page=${page}&limit=${limit}`,
        { token }
      );
      return { groupId, postId, comments: data.comments ?? [], total: data.total ?? 0, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ groupId, postId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/posts/${postId}/comments`, {
        method: 'POST',
        token,
        body: { text },
      });
      return { groupId, postId, comment: data.comment ?? data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ groupId, postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        token,
      });
      return { groupId, postId, commentId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ groupId, postId, commentId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        token,
        body: { text },
      });
      return { groupId, postId, comment: data.comment ?? data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async ({ groupId, postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/posts/${postId}/comments/${commentId}/like`,
        { method: 'POST', token }
      );
      return { groupId, postId, commentId, liked: true, likes: data.likes ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unlikeComment = createAsyncThunk(
  'comments/unlikeComment',
  async ({ groupId, postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(
        `/api/groups/${groupId}/posts/${postId}/comments/${commentId}/like`,
        { method: 'DELETE', token }
      );
      return { groupId, postId, commentId, liked: false, likes: data.likes ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST LIKES

export const likePost = createAsyncThunk(
  'comments/likePost',
  async ({ groupId, postId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/posts/${postId}/like`, {
        method: 'POST',
        token,
      });
      return { groupId, postId, liked: true, likes: data.likesCount ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unlikePost = createAsyncThunk(
  'comments/unlikePost',
  async ({ groupId, postId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest(`/api/groups/${groupId}/posts/${postId}/like`, {
        method: 'DELETE',
        token,
      });
      return { groupId, postId, liked: false, likes: data.likesCount ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST ACTIONS

export const deletePost = createAsyncThunk(
  'comments/deletePost',
  async ({ groupId, postId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/posts/${postId}`, {
        method: 'DELETE',
        token,
      });
      return { groupId, postId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editPost = createAsyncThunk(
  'comments/editPost',
  async ({ groupId, postId, caption, media = [] }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const form = new FormData();
      if (caption) form.append('caption', caption);
      Array.from(media).forEach((file) => form.append('media', file));
      const data = await apiRequest(`/api/groups/${groupId}/posts/${postId}`, {
        method: 'PUT',
        token,
        body: form,
        isFormData: true,
      });
      return { groupId, post: data.post ?? data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const pinPost = createAsyncThunk(
  'comments/pinPost',
  async ({ groupId, postId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/posts/${postId}/pin`, {
        method: 'POST',
        token,
      });
      return { groupId, postId, pinned: true };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unpinPost = createAsyncThunk(
  'comments/unpinPost',
  async ({ groupId, postId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/groups/${groupId}/posts/${postId}/pin`, {
        method: 'DELETE',
        token,
      });
      return { groupId, postId, pinned: false };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    commentsByPost: {}, // { "postId": [] }
    commentsTotalByPost: {},
    commentsLoading: false,
    postLikes: {}, // { "postId": { liked: bool, count: int } }
    commentLikes: {}, // { "commentId": { liked: bool, count: int } }
    likingPostIds: [],
    unlikingPostIds: [],
    creatingCommentPostIds: [],
    deletingCommentIds: [],
    deletingPostIds: [],
    editingPostIds: [],
    pinningPostIds: [],
    pinnedPosts: {}, // { "postId": bool }
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (s) => {
        s.commentsLoading = true;
      })
      .addCase(fetchComments.fulfilled, (s, a) => {
        const { postId, comments, total, page } = a.payload;
        s.commentsLoading = false;
        s.commentsByPost[postId] = page === 1 ? comments : [...(s.commentsByPost[postId] ?? []), ...comments];
        s.commentsTotalByPost[postId] = total;
      })
      .addCase(fetchComments.rejected, (s, a) => {
        s.commentsLoading = false;
        s.error = a.payload;
      })

      .addCase(createComment.pending, (s, a) => {
        if (!s.creatingCommentPostIds.includes(a.meta.arg.postId)) {
          s.creatingCommentPostIds.push(a.meta.arg.postId);
        }
      })
      .addCase(createComment.fulfilled, (s, a) => {
        const { postId, comment } = a.payload;
        s.creatingCommentPostIds = s.creatingCommentPostIds.filter((id) => id !== postId);
        if (s.commentsByPost[postId]) {
          s.commentsByPost[postId].unshift(comment);
          if (s.commentsTotalByPost[postId]) s.commentsTotalByPost[postId] += 1;
        }
      })
      .addCase(createComment.rejected, (s, a) => {
        const postId = a.meta.arg.postId;
        s.creatingCommentPostIds = s.creatingCommentPostIds.filter((id) => id !== postId);
        s.error = a.payload;
      })

      .addCase(deleteComment.pending, (s, a) => {
        if (!s.deletingCommentIds.includes(a.meta.arg.commentId)) {
          s.deletingCommentIds.push(a.meta.arg.commentId);
        }
      })
      .addCase(deleteComment.fulfilled, (s, a) => {
        const { postId, commentId } = a.payload;
        s.deletingCommentIds = s.deletingCommentIds.filter((id) => id !== commentId);
        if (s.commentsByPost[postId]) {
          s.commentsByPost[postId] = s.commentsByPost[postId].filter(
            (c) => (c._id ?? c.id) !== commentId
          );
          if (s.commentsTotalByPost[postId]) s.commentsTotalByPost[postId] -= 1;
        }
      })
      .addCase(deleteComment.rejected, (s, a) => {
        const commentId = a.meta.arg.commentId;
        s.deletingCommentIds = s.deletingCommentIds.filter((id) => id !== commentId);
        s.error = a.payload;
      })

      .addCase(updateComment.fulfilled, (s, a) => {
        const { postId, comment } = a.payload;
        if (s.commentsByPost[postId]) {
          const idx = s.commentsByPost[postId].findIndex(
            (c) => (c._id ?? c.id) === (comment._id ?? comment.id)
          );
          if (idx !== -1) {
            s.commentsByPost[postId][idx] = comment;
          }
        }
      })

      .addCase(likeComment.fulfilled, (s, a) => {
        const { commentId, likes } = a.payload;
        s.commentLikes[commentId] = { liked: true, count: likes };
      })

      .addCase(unlikeComment.fulfilled, (s, a) => {
        const { commentId, likes } = a.payload;
        s.commentLikes[commentId] = { liked: false, count: likes };
      })

      .addCase(likePost.pending, (s, a) => {
        const postId = a.meta.arg.postId;
        if (!s.likingPostIds.includes(postId)) {
          s.likingPostIds.push(postId);
        }
      })
      .addCase(likePost.fulfilled, (s, a) => {
        const { postId, likes } = a.payload;
        s.likingPostIds = s.likingPostIds.filter((id) => id !== postId);
        s.postLikes[postId] = { liked: true, count: likes };
      })
      .addCase(likePost.rejected, (s, a) => {
        const postId = a.meta.arg.postId;
        s.likingPostIds = s.likingPostIds.filter((id) => id !== postId);
      })

      .addCase(unlikePost.pending, (s, a) => {
        const postId = a.meta.arg.postId;
        if (!s.unlikingPostIds.includes(postId)) {
          s.unlikingPostIds.push(postId);
        }
      })
      .addCase(unlikePost.fulfilled, (s, a) => {
        const { postId, likes } = a.payload;
        s.unlikingPostIds = s.unlikingPostIds.filter((id) => id !== postId);
        s.postLikes[postId] = { liked: false, count: likes };
      })
      .addCase(unlikePost.rejected, (s, a) => {
        const postId = a.meta.arg.postId;
        s.unlikingPostIds = s.unlikingPostIds.filter((id) => id !== postId);
      })

      .addCase(deletePost.pending, (s, a) => {
        const postId = a.meta.arg.postId;
        if (!s.deletingPostIds.includes(postId)) {
          s.deletingPostIds.push(postId);
        }
      })
      .addCase(deletePost.fulfilled, (s, a) => {
        const { postId } = a.payload;
        s.deletingPostIds = s.deletingPostIds.filter((id) => id !== postId);
      })
      .addCase(deletePost.rejected, (s, a) => {
        const postId = a.meta.arg.postId;
        s.deletingPostIds = s.deletingPostIds.filter((id) => id !== postId);
        s.error = a.payload;
      })

      .addCase(editPost.pending, (s, a) => {
        const postId = a.meta.arg.postId;
        if (!s.editingPostIds.includes(postId)) {
          s.editingPostIds.push(postId);
        }
      })
      .addCase(editPost.fulfilled, (s, a) => {
        const { post } = a.payload;
        const postId = post._id ?? post.id;
        s.editingPostIds = s.editingPostIds.filter((id) => id !== postId);
      })
      .addCase(editPost.rejected, (s, a) => {
        const postId = a.meta.arg.postId;
        s.editingPostIds = s.editingPostIds.filter((id) => id !== postId);
        s.error = a.payload;
      })

      .addCase(pinPost.pending, (s, a) => {
        const postId = a.meta.arg.postId;
        if (!s.pinningPostIds.includes(postId)) {
          s.pinningPostIds.push(postId);
        }
      })
      .addCase(pinPost.fulfilled, (s, a) => {
        const { postId } = a.payload;
        s.pinningPostIds = s.pinningPostIds.filter((id) => id !== postId);
        s.pinnedPosts[postId] = true;
      })
      .addCase(pinPost.rejected, (s, a) => {
        const postId = a.meta.arg.postId;
        s.pinningPostIds = s.pinningPostIds.filter((id) => id !== postId);
      })

      .addCase(unpinPost.pending, (s, a) => {
        const postId = a.meta.arg.postId;
        if (!s.pinningPostIds.includes(postId)) {
          s.pinningPostIds.push(postId);
        }
      })
      .addCase(unpinPost.fulfilled, (s, a) => {
        const { postId } = a.payload;
        s.pinningPostIds = s.pinningPostIds.filter((id) => id !== postId);
        s.pinnedPosts[postId] = false;
      })
      .addCase(unpinPost.rejected, (s, a) => {
        const postId = a.meta.arg.postId;
        s.pinningPostIds = s.pinningPostIds.filter((id) => id !== postId);
      });
  },
});

export default commentsSlice.reducer;
