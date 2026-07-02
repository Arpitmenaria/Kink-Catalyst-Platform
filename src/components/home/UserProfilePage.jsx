import { useState } from 'react';
import AnimatedNav from './AnimatedNav';
import PostCard from './PostCard';
import { MOCK_POSTS, MOCK_USERS, ALEX_AVATAR } from './mockData';
import './ProfilePage.css';

function BackArrowIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function BriefcaseIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function PinIcon()          { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function CalIcon()          { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MsgIcon()          { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function PersonAddIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>; }
function CheckIcon()        { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }

function initials(name = '') {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90&fit=crop';

export default function UserProfilePage({ userId, onBack, onMessageUser, onEventsClick, onGroupsClick, onLibraryClick, onMinisitesClick }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followHover, setFollowHover] = useState(false);

  const viewedUser  = MOCK_USERS[userId];
  const viewedPosts = MOCK_POSTS.filter(p => p.author?._id === userId);

  const displayName = viewedUser?.fullName ?? 'User';
  const avatarUrl   = viewedUser?.avatar ?? ALEX_AVATAR;
  const coverUrl    = viewedUser?.coverUrl ?? DEFAULT_COVER;

  return (
    <div className="prof-page">
      <AnimatedNav
        activeId="home"
        avatarUrl={ALEX_AVATAR}
        onNavigate={(id) => {
          if (id === 'home')      onBack?.();
          if (id === 'events')    onEventsClick?.();
          if (id === 'friends')   onGroupsClick?.();
          if (id === 'messages')  onMessageUser?.(userId);
          if (id === 'library')   onLibraryClick?.();
          if (id === 'minisites') onMinisitesClick?.();
        }}
      />

      <div className="prof-main">
        <div className="prof-cover">
          <img src={coverUrl} alt="cover" className="prof-cover-img" />
          <button className="prof-cover-back-btn" onClick={onBack} title="Back to Feed">
            <BackArrowIcon />
          </button>
        </div>

        <div className="prof-identity">
          <div className="prof-avatar-wrap" style={{ cursor: 'default' }}>
            {viewedUser?.avatar
              ? <img src={avatarUrl} alt={displayName} className="prof-avatar-img" />
              : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{initials(displayName)}</span>
            }
          </div>

          <div className="prof-info">
            <div className="prof-name-row">
              <h1 className="prof-name">{displayName}</h1>
            </div>
            <div className="prof-meta-row">
              {viewedUser?.role && (
                <>
                  <span className="prof-meta-item"><BriefcaseIcon /> {viewedUser.role}</span>
                  <span className="prof-meta-sep">·</span>
                </>
              )}
              <span className="prof-meta-item"><PinIcon /> {viewedUser?.location ?? 'Unknown'}</span>
              {viewedUser?.joinedAt && (
                <>
                  <span className="prof-meta-sep">·</span>
                  <span className="prof-meta-item">
                    <CalIcon /> Joined on {new Date(viewedUser.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="prof-actions">
            <button
              className="prof-edit-btn"
              style={isFollowing ? { background: followHover ? 'rgba(239,68,68,0.15)' : '#1a2338', border: `1px solid ${followHover ? '#ef4444' : '#1e2a42'}`, color: followHover ? '#ef4444' : '#cbd5e1' } : undefined}
              onMouseEnter={() => setFollowHover(true)}
              onMouseLeave={() => setFollowHover(false)}
              onClick={() => setIsFollowing(v => !v)}
            >
              {isFollowing
                ? (followHover ? <>Unfollow</> : <><CheckIcon /> Following</>)
                : <><PersonAddIcon /> Follow</>
              }
            </button>
            <button
              className="prof-edit-btn"
              style={{ background: '#1a2338', border: '1px solid #1e2a42', color: '#cbd5e1' }}
              onClick={() => onMessageUser?.(userId)}
            >
              <MsgIcon /> Message
            </button>
          </div>
        </div>

        <div className="prof-content" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          {viewedUser?.bio && (
            <div className="about-card" style={{ marginBottom: 16 }}>
              <div className="about-card-header">
                <span className="about-card-label">About</span>
              </div>
              <p className="about-bio-text">{viewedUser.bio}</p>
            </div>
          )}
          <div className="prof-feed">
            {viewedPosts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#5c6a8c', fontSize: 14 }}>
                No posts yet.
              </div>
            )}
            {viewedPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
