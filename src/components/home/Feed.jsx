import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedPosts } from '../../store/slices/postsSlice';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';

function PhotosIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function VideoIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>; }
function EventIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

export default function Feed() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const { posts, loading, error } = useSelector((state) => state.posts);
  const displayName = profile?.fullName ?? user?.fullName ?? 'You';
  const avatarUrl = profile?.avatar || '';

  const [createOpen, setCreateOpen] = useState(false);
  const [createTab, setCreateTab] = useState('photo');

  function openCreate(tab = 'photo') {
    setCreateTab(tab);
    setCreateOpen(true);
  }

  useEffect(() => {
    dispatch(fetchFeedPosts());
  }, [dispatch]);

  return (
    <main className="home-feed">
      {/* Post creator */}
      <div className="post-creator">
        <div className="creator-top">
          <div className="creator-avatar" style={{ overflow: avatarUrl ? 'hidden' : undefined }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : getInitials(displayName)
            }
          </div>
          <input
            type="text"
            className="creator-input"
            placeholder={`What's on your mind, ${displayName.split(' ')[0]}?`}
            readOnly
            onClick={() => openCreate('photo')}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="creator-actions">
          <button className="creator-media-btn" onClick={() => openCreate('photo')}><PhotosIcon /> Photos</button>
          <button className="creator-media-btn" onClick={() => openCreate('video')}><VideoIcon /> Video</button>
          <button className="creator-media-btn" onClick={() => openCreate('event')}><EventIcon /> Event</button>
          <button className="creator-post-btn" onClick={() => openCreate('photo')}>Post</button>
        </div>
      </div>

      {createOpen && (
        <CreatePostModal initialTab={createTab} onClose={() => setCreateOpen(false)} />
      )}

      {/* Feed posts */}
      {loading && (
        <p style={{ textAlign: 'center', color: '#5c6a8c', padding: '32px 0' }}>Loading posts…</p>
      )}
      {error && !loading && (
        <p style={{ textAlign: 'center', color: '#ef4444', padding: '32px 0' }}>{error}</p>
      )}
      {!loading && !error && posts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#5c6a8c', padding: '32px 0' }}>No posts yet.</p>
      )}
      <div className="feed-posts">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
}
