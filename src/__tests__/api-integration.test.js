/**
 * Unit tests for all 15 integrated API endpoints.
 * Each test verifies: correct URL, method, auth header, and Redux state update.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

import postsReducer, {
  fetchFeedPosts,
  createPost,
  likePost,
  commentPost,
  sharePost,
  fetchReportReasons,
  reportPost,
} from '../store/slices/postsSlice';

import usersReducer, {
  fetchSuggestions,
  followUser,
  dismissSuggestion,
  fetchGroups,
} from '../store/slices/usersSlice';

import notificationsReducer, {
  fetchNotifications,
  markNotificationsRead,
} from '../store/slices/notificationsSlice';

import profileReducer, {
  fetchGallery,
  fetchLikedPages,
} from '../store/slices/profileSlice';

import authReducer from '../store/slices/authSlice';

// ─── helpers ──────────────────────────────────────────────────────────────────

const TOKEN = 'test-token-123';

function makeStore(extra = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      posts: postsReducer,
      users: usersReducer,
      notifications: notificationsReducer,
      profile: profileReducer,
    },
    preloadedState: {
      auth: { token: TOKEN, user: { id: 'user1', fullName: 'Test User' }, isAuthenticated: true },
      ...extra,
    },
  });
}

function mockFetch(body, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

function lastFetchCall() {
  return global.fetch.mock.calls[0];
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 1 — GET /api/posts
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 1 — GET /api/posts (fetchFeedPosts)', () => {
  const mockPosts = [
    { _id: 'p1', caption: 'Hello', likes: ['user1'], comments: 2, shares: 1, media: [], author: { fullName: 'Jay' }, createdAt: new Date().toISOString() },
    { _id: 'p2', caption: 'World', likes: [], comments: 0, shares: 0, media: [], author: { fullName: 'Bob' }, createdAt: new Date().toISOString() },
  ];

  it('calls GET /api/posts with Bearer token', async () => {
    mockFetch({ success: true, posts: mockPosts });
    const store = makeStore();
    await store.dispatch(fetchFeedPosts());
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/posts');
    expect(opts.method).toBe('GET');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('normalizes comments/shares from number to array', async () => {
    mockFetch({ success: true, posts: mockPosts });
    const store = makeStore();
    await store.dispatch(fetchFeedPosts());
    const { posts } = store.getState().posts;
    expect(Array.isArray(posts[0].comments)).toBe(true);
    expect(posts[0].comments.length).toBe(2);
    expect(Array.isArray(posts[0].shares)).toBe(true);
    expect(posts[0].shares.length).toBe(1);
  });

  it('stores posts in state on success', async () => {
    mockFetch({ success: true, posts: mockPosts });
    const store = makeStore();
    await store.dispatch(fetchFeedPosts());
    expect(store.getState().posts.posts).toHaveLength(2);
    expect(store.getState().posts.posts[0]._id).toBe('p1');
  });

  it('sets error in state on API failure', async () => {
    mockFetch({ success: false, message: 'Unauthorized' }, 401);
    const store = makeStore();
    await store.dispatch(fetchFeedPosts());
    expect(store.getState().posts.error).toBeTruthy();
    expect(store.getState().posts.posts).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 2 — POST /api/posts (createPost)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 2 — POST /api/posts (createPost)', () => {
  const newPost = { _id: 'p99', caption: 'New post', likes: [], comments: 0, shares: 0, media: [], author: { fullName: 'Jay' }, createdAt: new Date().toISOString() };

  it('calls POST /api/posts with Bearer token', async () => {
    mockFetch({ success: true, post: newPost });
    const store = makeStore();
    await store.dispatch(createPost({ caption: 'New post', visibility: 'anyone' }));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/posts');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('sends FormData (no Content-Type json header)', async () => {
    mockFetch({ success: true, post: newPost });
    const store = makeStore();
    await store.dispatch(createPost({ caption: 'Hello' }));
    const [, opts] = lastFetchCall();
    expect(opts.headers['Content-Type']).toBeUndefined();
    expect(opts.body).toBeInstanceOf(FormData);
  });

  it('prepends new post to posts array on success', async () => {
    mockFetch({ success: true, post: newPost });
    const store = makeStore();
    await store.dispatch(createPost({ caption: 'New post' }));
    const posts = store.getState().posts.posts;
    expect(posts[0]._id).toBe('p99');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 3 — POST /api/posts/:id/like (likePost)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 3 — POST /api/posts/:id/like (likePost)', () => {
  it('calls correct endpoint with Bearer token', async () => {
    mockFetch({ success: true, liked: true, likesCount: 5 });
    const store = makeStore({
      posts: { posts: [{ _id: 'p1', likes: [], comments: [], shares: [] }], loading: false, error: null, likingIds: [], commentingId: null, sharingId: null, creating: false, reportReasons: [], reasonsLoading: false, reportSubmitting: false },
    });
    await store.dispatch(likePost({ postId: 'p1', userId: 'user1' }));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/posts/p1/like');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('optimistically toggles like on pending', async () => {
    mockFetch({ success: true, liked: true, likesCount: 1 });
    const store = makeStore({
      posts: { posts: [{ _id: 'p1', likes: [], comments: [], shares: [] }], loading: false, error: null, likingIds: [], commentingId: null, sharingId: null, creating: false, reportReasons: [], reasonsLoading: false, reportSubmitting: false },
    });
    const promise = store.dispatch(likePost({ postId: 'p1', userId: 'user1' }));
    // After pending fires, optimistic like should be applied
    const postAfterPending = store.getState().posts.posts.find(p => p._id === 'p1');
    expect(postAfterPending.likes).toContain('user1');
    await promise;
  });

  it('reverts like on rejected', async () => {
    mockFetch({ success: false, message: 'Post not found' }, 404);
    const store = makeStore({
      posts: { posts: [{ _id: 'p1', likes: [], comments: [], shares: [] }], loading: false, error: null, likingIds: [], commentingId: null, sharingId: null, creating: false, reportReasons: [], reasonsLoading: false, reportSubmitting: false },
    });
    await store.dispatch(likePost({ postId: 'p1', userId: 'user1' }));
    const post = store.getState().posts.posts.find(p => p._id === 'p1');
    expect(post.likes).not.toContain('user1');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 4 — POST /api/posts/:id/comments (commentPost)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 4 — POST /api/posts/:id/comments (commentPost)', () => {
  const mockComment = { _id: 'c1', author: { fullName: 'Jay' }, text: 'Nice!', likes: 0, replies: [], createdAt: new Date().toISOString() };

  it('calls correct endpoint with text body', async () => {
    mockFetch({ success: true, comment: mockComment, commentsCount: 1 });
    const store = makeStore({
      posts: { posts: [{ _id: 'p1', likes: [], comments: [], shares: [] }], loading: false, error: null, likingIds: [], commentingId: null, sharingId: null, creating: false, reportReasons: [], reasonsLoading: false, reportSubmitting: false },
    });
    await store.dispatch(commentPost({ postId: 'p1', text: 'Nice!' }));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/posts/p1/comments');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ text: 'Nice!' });
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('appends comment object to post.comments on success', async () => {
    mockFetch({ success: true, comment: mockComment, commentsCount: 1 });
    const store = makeStore({
      posts: { posts: [{ _id: 'p1', likes: [], comments: [], shares: [] }], loading: false, error: null, likingIds: [], commentingId: null, sharingId: null, creating: false, reportReasons: [], reasonsLoading: false, reportSubmitting: false },
    });
    await store.dispatch(commentPost({ postId: 'p1', text: 'Nice!' }));
    const post = store.getState().posts.posts.find(p => p._id === 'p1');
    expect(post.comments).toHaveLength(1);
    expect(post.comments[0]._id).toBe('c1');
    expect(post.comments[0].text).toBe('Nice!');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 5 — POST /api/posts/:id/share (sharePost)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 5 — POST /api/posts/:id/share (sharePost)', () => {
  it('calls correct endpoint with Bearer token', async () => {
    mockFetch({ success: true, sharesCount: 4 });
    const store = makeStore({
      posts: { posts: [{ _id: 'p1', likes: [], comments: [], shares: [] }], loading: false, error: null, likingIds: [], commentingId: null, sharingId: null, creating: false, reportReasons: [], reasonsLoading: false, reportSubmitting: false },
    });
    await store.dispatch(sharePost('p1'));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/posts/p1/share');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('increments shares array on success', async () => {
    mockFetch({ success: true, sharesCount: 1 });
    const store = makeStore({
      posts: { posts: [{ _id: 'p1', likes: [], comments: [], shares: [] }], loading: false, error: null, likingIds: [], commentingId: null, sharingId: null, creating: false, reportReasons: [], reasonsLoading: false, reportSubmitting: false },
    });
    await store.dispatch(sharePost('p1'));
    const post = store.getState().posts.posts.find(p => p._id === 'p1');
    expect(post.shares.length).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 6 — GET /api/posts/report-reasons (fetchReportReasons)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 6 — GET /api/posts/report-reasons (fetchReportReasons)', () => {
  const reasons = ['Spam or misleading', 'Hateful or abusive content', 'Misinformation'];

  it('calls correct endpoint (no auth required)', async () => {
    mockFetch({ success: true, reasons });
    const store = makeStore();
    await store.dispatch(fetchReportReasons());
    const [url] = lastFetchCall();
    expect(url).toContain('/api/posts/report-reasons');
  });

  it('stores reasons in state on success', async () => {
    mockFetch({ success: true, reasons });
    const store = makeStore();
    await store.dispatch(fetchReportReasons());
    expect(store.getState().posts.reportReasons).toEqual(reasons);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 7 — POST /api/posts/:id/report (reportPost)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 7 — POST /api/posts/:id/report (reportPost)', () => {
  it('calls correct endpoint with reason body', async () => {
    mockFetch({ success: true, message: 'Post reported successfully' });
    const store = makeStore();
    await store.dispatch(reportPost({ postId: 'p1', reason: 'Spam or misleading' }));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/posts/p1/report');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ reason: 'Spam or misleading' });
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('sets reportSubmitting false after completion', async () => {
    mockFetch({ success: true, message: 'Post reported successfully' });
    const store = makeStore();
    await store.dispatch(reportPost({ postId: 'p1', reason: 'Spam or misleading' }));
    expect(store.getState().posts.reportSubmitting).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 8 — GET /api/users/suggestions (fetchSuggestions)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 8 — GET /api/users/suggestions (fetchSuggestions)', () => {
  const suggestions = [
    { id: 'u1', name: 'Sarah Chen', avatar: '', avatarColor: '#3b82f6', mutualFriends: 4 },
    { id: 'u2', name: 'Tom Keller', avatar: '', avatarColor: '#8b5cf6', mutualFriends: 2 },
  ];

  it('calls correct endpoint with limit param and Bearer token', async () => {
    mockFetch({ success: true, suggestions });
    const store = makeStore();
    await store.dispatch(fetchSuggestions(5));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/users/suggestions?limit=5');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('stores suggestions in state on success', async () => {
    mockFetch({ success: true, suggestions });
    const store = makeStore();
    await store.dispatch(fetchSuggestions(5));
    expect(store.getState().users.suggestions).toHaveLength(2);
    expect(store.getState().users.suggestions[0].name).toBe('Sarah Chen');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 9 — POST /api/users/:id/follow (followUser)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 9 — POST /api/users/:id/follow (followUser)', () => {
  it('calls correct endpoint with Bearer token', async () => {
    mockFetch({ success: true, message: 'User followed successfully', following: true });
    const store = makeStore();
    await store.dispatch(followUser('u1'));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/users/u1/follow');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('optimistically adds userId to followingIds on pending', () => {
    mockFetch({ success: true, following: true });
    const store = makeStore();
    store.dispatch(followUser('u1'));
    expect(store.getState().users.followingIds).toContain('u1');
  });

  it('reverts followingIds on API failure', async () => {
    mockFetch({ success: false, message: 'User not found' }, 404);
    const store = makeStore();
    await store.dispatch(followUser('u1'));
    expect(store.getState().users.followingIds).not.toContain('u1');
  });

  it('does not add duplicate if already following', async () => {
    mockFetch({ success: true, following: true });
    const store = makeStore();
    await store.dispatch(followUser('u1'));
    await store.dispatch(followUser('u1'));
    expect(store.getState().users.followingIds.filter(id => id === 'u1')).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 10 — DELETE /api/users/:id/suggestion (dismissSuggestion)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 10 — DELETE /api/users/:id/suggestion (dismissSuggestion)', () => {
  it('calls correct endpoint with DELETE method and Bearer token', async () => {
    mockFetch({ success: true });
    const store = makeStore();
    await store.dispatch(dismissSuggestion('u1'));
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/users/u1/suggestion');
    expect(opts.method).toBe('DELETE');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('optimistically adds userId to dismissedIds on pending', () => {
    mockFetch({ success: true });
    const store = makeStore();
    store.dispatch(dismissSuggestion('u1'));
    expect(store.getState().users.dismissedIds).toContain('u1');
  });

  it('reverts dismissedIds on API failure', async () => {
    mockFetch({ success: false, message: 'Error' }, 500);
    const store = makeStore();
    await store.dispatch(dismissSuggestion('u1'));
    expect(store.getState().users.dismissedIds).not.toContain('u1');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 11 — GET /api/groups/my (fetchGroups)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 11 — GET /api/groups/my (fetchGroups)', () => {
  const groups = [
    { id: 'g1', name: 'Design Collective', members: '1.2k members', color: '#7c3aed' },
    { id: 'g2', name: 'Dev Talk', members: '800 members', color: '#3b82f6' },
  ];

  it('calls correct endpoint with Bearer token', async () => {
    mockFetch({ success: true, groups });
    const store = makeStore();
    await store.dispatch(fetchGroups());
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/groups/my');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('stores groups in state on success', async () => {
    mockFetch({ success: true, groups });
    const store = makeStore();
    await store.dispatch(fetchGroups());
    expect(store.getState().users.groups).toHaveLength(2);
    expect(store.getState().users.groups[0].name).toBe('Design Collective');
  });

  it('returns empty array when user has no groups', async () => {
    mockFetch({ success: true, groups: [] });
    const store = makeStore();
    await store.dispatch(fetchGroups());
    expect(store.getState().users.groups).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 12 — GET /api/notifications (fetchNotifications)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 12 — GET /api/notifications (fetchNotifications)', () => {
  const notifications = [
    { id: 'n1', type: 'like', emoji: '❤️', text: 'Alex liked your post', createdAt: new Date().toISOString(), unread: true },
    { id: 'n2', type: 'follow', emoji: '👤', text: 'Sarah followed you', createdAt: new Date().toISOString(), unread: false },
  ];

  it('calls correct endpoint with Bearer token', async () => {
    mockFetch({ success: true, notifications, unreadCount: 1 });
    const store = makeStore();
    await store.dispatch(fetchNotifications());
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/notifications');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('stores notifications and unreadCount in state', async () => {
    mockFetch({ success: true, notifications, unreadCount: 1 });
    const store = makeStore();
    await store.dispatch(fetchNotifications());
    expect(store.getState().notifications.notifications).toHaveLength(2);
    expect(store.getState().notifications.unreadCount).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 13 — PUT /api/notifications/mark-read (markNotificationsRead)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 13 — PUT /api/notifications/mark-read (markNotificationsRead)', () => {
  it('calls correct endpoint with PUT method and Bearer token', async () => {
    mockFetch({ success: true });
    const store = makeStore();
    await store.dispatch(markNotificationsRead());
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/notifications/mark-read');
    expect(opts.method).toBe('PUT');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('resets unreadCount to 0 and marks all notifications as read', async () => {
    mockFetch({ success: true, notifications: [{ id: 'n1', unread: true }], unreadCount: 1 });
    const store = makeStore();
    await store.dispatch(fetchNotifications());

    mockFetch({ success: true });
    await store.dispatch(markNotificationsRead());

    const state = store.getState().notifications;
    expect(state.unreadCount).toBe(0);
    expect(state.notifications.every(n => n.unread === false)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 14 — GET /api/users/me/gallery (fetchGallery)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 14 — GET /api/users/me/gallery (fetchGallery)', () => {
  const images = ['https://cdn.example.com/photo1.jpg', 'https://cdn.example.com/photo2.jpg'];

  it('calls correct endpoint with Bearer token', async () => {
    mockFetch({ success: true, images, total: 48 });
    const store = makeStore();
    await store.dispatch(fetchGallery());
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/users/me/gallery');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('stores gallery images and total in state', async () => {
    mockFetch({ success: true, images, total: 48 });
    const store = makeStore();
    await store.dispatch(fetchGallery());
    const { gallery, galleryTotal } = store.getState().profile;
    expect(gallery).toEqual(images);
    expect(galleryTotal).toBe(48);
  });

  it('falls back to empty array when images missing', async () => {
    mockFetch({ success: true, total: 0 });
    const store = makeStore();
    await store.dispatch(fetchGallery());
    expect(store.getState().profile.gallery).toEqual([]);
    expect(store.getState().profile.galleryTotal).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API 15 — GET /api/users/me/liked-pages (fetchLikedPages)
// ═══════════════════════════════════════════════════════════════════════════════
describe('API 15 — GET /api/users/me/liked-pages (fetchLikedPages)', () => {
  const pages = [
    { id: 'pg1', name: 'Dribbble', sub: '3.2M followers', color: '#ea4899', initial: 'D' },
    { id: 'pg2', name: 'GitHub',   sub: '10M followers',  color: '#1c1c1e', initial: 'G' },
  ];

  it('calls correct endpoint with Bearer token', async () => {
    mockFetch({ success: true, pages, total: 18 });
    const store = makeStore();
    await store.dispatch(fetchLikedPages());
    const [url, opts] = lastFetchCall();
    expect(url).toContain('/api/users/me/liked-pages');
    expect(opts.headers['Authorization']).toBe(`Bearer ${TOKEN}`);
  });

  it('stores liked pages and total in state', async () => {
    mockFetch({ success: true, pages, total: 18 });
    const store = makeStore();
    await store.dispatch(fetchLikedPages());
    const { likedPages, likedPagesTotal } = store.getState().profile;
    expect(likedPages).toHaveLength(2);
    expect(likedPages[0].name).toBe('Dribbble');
    expect(likedPagesTotal).toBe(18);
  });

  it('falls back to empty array when pages missing', async () => {
    mockFetch({ success: true, total: 0 });
    const store = makeStore();
    await store.dispatch(fetchLikedPages());
    expect(store.getState().profile.likedPages).toEqual([]);
  });
});
