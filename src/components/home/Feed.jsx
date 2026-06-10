import { useState, useRef } from 'react';
import { MOCK_POSTS, ALEX_AVATAR } from './mockData';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';

function PhotosIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function VideoIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>; }
function EventIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }

export default function Feed({ onEventsClick, onProfileClick, onCreateEvent }) {
  const [createOpen,     setCreateOpen]     = useState(false);
  const [createTab,      setCreateTab]      = useState('photo');
  const [creatorClicked, setCreatorClicked] = useState(false);
  const clickTimer = useRef(null);

  function openCreate(tab = 'photo') { setCreateTab(tab); setCreateOpen(true); }

  function handleCreatorClick(tab = 'photo') {
    setCreatorClicked(true);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setCreatorClicked(false), 500);
    openCreate(tab);
  }

  return (
    <main className="home-feed">
      {/* Post creator */}
      <div className={`post-creator${creatorClicked ? ' post-creator--clicked' : ''}`}>
        <div className="creator-top">
          <div className="creator-avatar" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={onProfileClick}>
            <img src={ALEX_AVATAR} alt="Alex Rivera" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <textarea
            className="creator-input"
            placeholder="What's on your mind, Alex?"
            readOnly
            onClick={() => handleCreatorClick('photo')}
            rows={3}
          />
        </div>
        <div className="creator-actions">
          <button className="creator-media-btn" onClick={() => handleCreatorClick('photo')}><PhotosIcon /> Photos</button>
          <button className="creator-media-btn" onClick={() => handleCreatorClick('video')}><VideoIcon /> Video</button>
          <button className="creator-media-btn" onClick={() => onCreateEvent ? onCreateEvent() : handleCreatorClick('event')}><EventIcon /> Event</button>
          <button className="creator-post-btn"  onClick={() => handleCreatorClick('photo')}>Post</button>
        </div>
      </div>

      {createOpen && <CreatePostModal initialTab={createTab} onClose={() => setCreateOpen(false)} onNavigateToEvents={onEventsClick} onCreateEvent={onCreateEvent} />}

      <div className="feed-posts">
        {MOCK_POSTS.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
}
