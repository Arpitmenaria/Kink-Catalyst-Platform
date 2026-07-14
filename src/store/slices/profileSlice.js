import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

function fmtCount(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function normalizeConnection(c) {
  return {
    id:           c.id ?? c._id,
    name:         c.name ?? '',
    role:         c.role ?? '',
    location:     c.location ?? '',
    industry:     c.industry ?? '',
    avatar:       c.avatar?.startsWith?.('http') ? c.avatar : '',
    online:       c.online ?? false,
    lastActive:   c.lastActive ?? null,
    mutual:       c.mutualCount ?? 0,
    sharedAvatars:(c.mutualAvatars ?? []).filter(u => u?.startsWith?.('http')),
    extra:        c.extraMutual || null,
  };
}

function normalizePerson(p) {
  return {
    id:        p.id ?? p._id,
    name:      p.name ?? '',
    role:      p.role ?? '',
    avatar:    p.avatar?.startsWith?.('http') ? p.avatar : '',
    mutual:    p.mutualCount ?? 0,
    following: p.isFollowing ?? false,
  };
}

function normalizePhoto(p) {
  return {
    id:       p.id ?? p._id,
    images:   (p.images ?? []).filter(u => u?.startsWith?.('http')),
    likes:    fmtCount(p.likesCount ?? 0),
    comments: fmtCount(p.commentsCount ?? 0),
    createdAt: p.createdAt,
  };
}

// ── 1. GET /api/users/me ───────────────────────────────────────────────────────
export const fetchUserProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, user } = getState().auth;
      if (!token) return user ?? null;
      const data = await apiRequest('/api/users/me', { token });
      return data.user ?? data.data ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 2. PUT /api/users/me/avatar ────────────────────────────────────────────────
export const updateAvatar = createAsyncThunk(
  'profile/updateAvatar',
  async (file, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const form = new FormData();
      form.append('avatar', file);
      const data = await apiRequest('/api/users/me/avatar', { method: 'PUT', token, body: form, isFormData: true });
      return data.avatarUrl;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 3. PUT /api/users/me/cover ─────────────────────────────────────────────────
export const updateCover = createAsyncThunk(
  'profile/updateCover',
  async (file, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const form = new FormData();
      form.append('cover', file);
      const data = await apiRequest('/api/users/me/cover', { method: 'PUT', token, body: form, isFormData: true });
      return data.coverUrl;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 4. PATCH /api/users/me ─────────────────────────────────────────────────────
export const updateProfile = createAsyncThunk(
  'profile/update',
  async (fields, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/users/me', { method: 'PATCH', token, body: fields });
      return data.user ?? data.data ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 5. PUT /api/users/me/education ─────────────────────────────────────────────
export const updateEducation = createAsyncThunk(
  'profile/updateEducation',
  async (educationArray, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const payload = educationArray.map(({ school, degree, years, type }) => ({ school, degree, years, type }));
      const data = await apiRequest('/api/users/me/education', { method: 'PUT', token, body: { education: payload } });
      return data.education ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 6. GET /api/users/me/connections ───────────────────────────────────────────
export const fetchConnections = createAsyncThunk(
  'profile/fetchConnections',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const q = new URLSearchParams();
      if (params.search)   q.set('search',   params.search);
      if (params.location) q.set('location', params.location);
      if (params.industry) q.set('industry', params.industry);
      if (params.page)     q.set('page',     params.page);
      if (params.limit)    q.set('limit',    params.limit);
      const qs = q.toString() ? `?${q}` : '';
      const data = await apiRequest(`/api/users/me/connections${qs}`, { token });
      return {
        connections: (data.connections ?? []).map(normalizeConnection),
        total: data.total ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 7. DELETE /api/users/me/connections/:userId ────────────────────────────────
export const removeConnection = createAsyncThunk(
  'profile/removeConnection',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await apiRequest(`/api/users/me/connections/${userId}`, { method: 'DELETE', token });
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 8. GET /api/users/me/photos ────────────────────────────────────────────────
export const fetchPhotos = createAsyncThunk(
  'profile/fetchPhotos',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const q = new URLSearchParams();
      if (params.page)  q.set('page',  params.page);
      if (params.limit) q.set('limit', params.limit);
      const qs = q.toString() ? `?${q}` : '';
      const data = await apiRequest(`/api/users/me/photos${qs}`, { token });
      return {
        photos: (data.photos ?? []).map(normalizePhoto),
        total:  data.total ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 9. POST /api/users/me/photos ───────────────────────────────────────────────
export const uploadPhoto = createAsyncThunk(
  'profile/uploadPhoto',
  async ({ files, caption = '' }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const form = new FormData();
      const fileList = Array.isArray(files) ? files : [files];
      for (const f of fileList) form.append('photos', f);
      if (caption) form.append('caption', caption);
      const data = await apiRequest('/api/users/me/photos', { method: 'POST', token, body: form, isFormData: true });
      return normalizePhoto(data.photo);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Albums ──────────────────────────────────────────────────────────────────────
function normalizeAlbum(a = {}) {
  const photos = (a.photos ?? a.images ?? [])
    .map(p => (typeof p === 'string' ? p : p?.url))
    .filter(u => u?.startsWith?.('http'));
  return {
    id: a.id ?? a._id,
    name: a.name ?? a.title ?? 'Untitled album',
    cover: (a.cover?.startsWith?.('http') ? a.cover : '') || photos[0] || '',
    photos,
    count: a.count ?? a.photoCount ?? photos.length,
    createdAt: a.createdAt,
  };
}

// GET /api/users/me/albums
export const fetchAlbums = createAsyncThunk(
  'profile/fetchAlbums',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/users/me/albums', { token });
      return (data.albums ?? []).map(normalizeAlbum);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /api/users/me/albums — multipart: name + photos[] files
export const createAlbum = createAsyncThunk(
  'profile/createAlbum',
  async ({ name, files }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const form = new FormData();
      form.append('name', name);
      const fileList = Array.isArray(files) ? files : [files];
      for (const f of fileList) form.append('photos', f);
      const data = await apiRequest('/api/users/me/albums', { method: 'POST', token, body: form, isFormData: true });
      return normalizeAlbum(data.album ?? data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 10. GET /api/users/me/followers ────────────────────────────────────────────
export const fetchFollowers = createAsyncThunk(
  'profile/fetchFollowers',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const q = new URLSearchParams();
      if (params.search) q.set('search', params.search);
      if (params.page)   q.set('page',   params.page);
      if (params.limit)  q.set('limit',  params.limit);
      const qs = q.toString() ? `?${q}` : '';
      const data = await apiRequest(`/api/users/me/followers${qs}`, { token });
      return {
        followers: (data.followers ?? []).map(normalizePerson),
        total: data.total ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── 11. GET /api/users/me/following ────────────────────────────────────────────
export const fetchFollowing = createAsyncThunk(
  'profile/fetchFollowing',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const q = new URLSearchParams();
      if (params.search) q.set('search', params.search);
      if (params.page)   q.set('page',   params.page);
      if (params.limit)  q.set('limit',  params.limit);
      const qs = q.toString() ? `?${q}` : '';
      const data = await apiRequest(`/api/users/me/following${qs}`, { token });
      return {
        following: (data.following ?? []).map(normalizePerson),
        total: data.total ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Gallery (existing) ─────────────────────────────────────────────────────────
export const fetchGallery = createAsyncThunk(
  'profile/fetchGallery',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/users/me/gallery', { token });
      return { images: data.images ?? [], total: data.total ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Liked Pages (existing) ─────────────────────────────────────────────────────
export const fetchLikedPages = createAsyncThunk(
  'profile/fetchLikedPages',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const data = await apiRequest('/api/users/me/liked-pages', { token });
      return { pages: data.pages ?? [], total: data.total ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    loading: false,
    error: null,

    gallery: [],
    galleryTotal: 0,
    galleryLoading: false,

    likedPages: [],
    likedPagesTotal: 0,
    likedPagesLoading: false,

    connections: [],
    connectionsTotal: 0,
    connectionsLoading: false,

    photos: [],
    photosTotal: 0,
    photosLoading: false,

    albums: [],
    albumsLoading: false,
    creatingAlbum: false,

    followers: [],
    followersTotal: 0,
    followersLoading: false,

    following: [],
    followingTotal: 0,
    followingLoading: false,

    uploading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── fetchUserProfile ───────────────────────────────────────────────────
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── updateAvatar ───────────────────────────────────────────────────────
      .addCase(updateAvatar.pending, (state) => { state.uploading = true; })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.profile && action.payload) state.profile.avatar = action.payload;
      })
      .addCase(updateAvatar.rejected, (state) => { state.uploading = false; })

      // ── updateCover ────────────────────────────────────────────────────────
      .addCase(updateCover.pending, (state) => { state.uploading = true; })
      .addCase(updateCover.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.profile && action.payload) state.profile.coverPhoto = action.payload;
      })
      .addCase(updateCover.rejected, (state) => { state.uploading = false; })

      // ── updateProfile ──────────────────────────────────────────────────────
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload && state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })

      // ── updateEducation ────────────────────────────────────────────────────
      .addCase(updateEducation.fulfilled, (state, action) => {
        if (state.profile) state.profile.education = action.payload;
      })

      // ── fetchConnections ───────────────────────────────────────────────────
      .addCase(fetchConnections.pending, (state) => { state.connectionsLoading = true; })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connectionsLoading = false;
        state.connections = action.payload.connections;
        state.connectionsTotal = action.payload.total;
      })
      .addCase(fetchConnections.rejected, (state) => { state.connectionsLoading = false; })

      // ── removeConnection (optimistic) ──────────────────────────────────────
      .addCase(removeConnection.pending, (state, action) => {
        const userId = action.meta.arg;
        state.connections = state.connections.filter(c => c.id !== userId);
        state.connectionsTotal = Math.max(0, state.connectionsTotal - 1);
      })
      .addCase(removeConnection.rejected, (state) => {
        // refetch on failure
        state.connectionsLoading = false;
      })

      // ── fetchPhotos ────────────────────────────────────────────────────────
      .addCase(fetchPhotos.pending, (state) => { state.photosLoading = true; })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.photosLoading = false;
        state.photos = action.payload.photos;
        state.photosTotal = action.payload.total;
      })
      .addCase(fetchPhotos.rejected, (state) => { state.photosLoading = false; })

      // ── uploadPhoto ────────────────────────────────────────────────────────
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        if (action.payload) state.photos.unshift(action.payload);
      })

      // ── Albums ─────────────────────────────────────────────────────────────
      .addCase(fetchAlbums.pending, (state) => { state.albumsLoading = true; })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albumsLoading = false;
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state) => { state.albumsLoading = false; })
      .addCase(createAlbum.pending, (state) => { state.creatingAlbum = true; })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.creatingAlbum = false;
        if (action.payload) state.albums.unshift(action.payload);
      })
      .addCase(createAlbum.rejected, (state) => { state.creatingAlbum = false; })

      // ── fetchFollowers ─────────────────────────────────────────────────────
      .addCase(fetchFollowers.pending, (state) => { state.followersLoading = true; })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followersLoading = false;
        state.followers = action.payload.followers;
        state.followersTotal = action.payload.total;
      })
      .addCase(fetchFollowers.rejected, (state) => { state.followersLoading = false; })

      // ── fetchFollowing ─────────────────────────────────────────────────────
      .addCase(fetchFollowing.pending, (state) => { state.followingLoading = true; })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.followingLoading = false;
        state.following = action.payload.following;
        state.followingTotal = action.payload.total;
      })
      .addCase(fetchFollowing.rejected, (state) => { state.followingLoading = false; })

      // ── fetchGallery ───────────────────────────────────────────────────────
      .addCase(fetchGallery.pending, (state) => { state.galleryLoading = true; })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.galleryLoading = false;
        state.gallery = action.payload.images;
        state.galleryTotal = action.payload.total;
      })
      .addCase(fetchGallery.rejected, (state) => { state.galleryLoading = false; })

      // ── fetchLikedPages ────────────────────────────────────────────────────
      .addCase(fetchLikedPages.pending, (state) => { state.likedPagesLoading = true; })
      .addCase(fetchLikedPages.fulfilled, (state, action) => {
        state.likedPagesLoading = false;
        state.likedPages = action.payload.pages;
        state.likedPagesTotal = action.payload.total;
      })
      .addCase(fetchLikedPages.rejected, (state) => { state.likedPagesLoading = false; });
  },
});

export default profileSlice.reducer;
