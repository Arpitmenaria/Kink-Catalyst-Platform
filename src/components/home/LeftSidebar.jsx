import { useState, useEffect } from 'react';
import SkeletonImg from '../SkeletonImg';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSuggestions, followUser, dismissSuggestion, fetchGroups } from '../../store/slices/usersSlice';
import { fetchUserProfile } from '../../store/slices/profileSlice';
import { fetchEvents } from '../../store/slices/eventsSlice';
import CreatePostModal from './CreatePostModal';
import AnimatedNav from './AnimatedNav';

function membershipLabel(tier = '') {
  const map = { platinum: 'Platinum Member', gold: 'Gold Member', free: 'Free Member' };
  return map[tier.toLowerCase()] ?? (tier ? `${tier[0].toUpperCase()}${tier.slice(1)} Member` : 'Member');
}

function formatCount(n = 0) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

/* ── Nav strip icons ── */
function HomeIcon()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function CreatePostIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function EventsIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function PeopleIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function ChatIcon()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function CalendarIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function PhotoIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function SettingsIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }

const NAV_ITEMS = [
  { icon: <HomeIcon />,        label: 'Home',        active: true      },
  { icon: <CreatePostIcon />,  label: 'Create Post', create: true      },
  { icon: <EventsIcon />,      label: 'Events',      events: true      },
  { icon: <PeopleIcon />,      label: 'Friends',     groups: true      },
  { icon: <ChatIcon />,        label: 'Messages',    messages: true    },
  { icon: <CalendarIcon />,    label: 'Calendar',    calendar: true    },
  { icon: <PhotoIcon />,       label: 'Media'                          },
  { icon: <SettingsIcon />,    label: 'Settings'                       },
];

function MutualIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 3 }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

export default function LeftSidebar({ onEventsClick, onMessagesClick, onGroupsClick, onCalendarClick, onCoursesClick, onLibraryClick, onProfileClick, onMinisitesClick, onGroupClick, onEventClick, onUserClick }) {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const { suggestions, followingIds, dismissedIds, groups } = useSelector((state) => state.users);
  const { conversations } = useSelector((state) => state.messages);
  const { events: upcomingEvents } = useSelector((state) => state.events);
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

  const [createOpen,  setCreateOpen]  = useState(false);
  const [activeNavId, setActiveNavId] = useState('home');
  const [poppingIds,  setPoppingIds]  = useState(new Set());

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchSuggestions(5));
    dispatch(fetchGroups());
    dispatch(fetchEvents({ tab: 'upcoming', limit: 3 }));
  }, [dispatch]);

  function handleAddFriend(id) {
    if (!id) return;
    const selfId = authUser?._id ?? authUser?.id;
    if (selfId && id === selfId) return;
    if (followingIds.includes(id)) return;
    setPoppingIds(prev => new Set([...prev, id]));
    setTimeout(() => setPoppingIds(prev => { const s = new Set(prev); s.delete(id); return s; }), 500);
    dispatch(followUser(id));
  }

  function handleDismiss(id) {
    if (!id) return;
    dispatch(dismissSuggestion(id));
  }

  const displayName    = profile?.fullName ?? authUser?.fullName ?? 'You';
  const role           = profile?.role ?? '';
  const followingCount = formatCount(authUser?.followingCount ?? profile?.following?.length ?? profile?.followingCount ?? 0);
  const followersCount = formatCount(authUser?.followerCount  ?? profile?.followers?.length ?? profile?.followersCount ?? 0);
  const rawAvatar      = profile?.avatar ?? authUser?.avatar ?? '';
  const avatarUrl      = rawAvatar?.startsWith?.('http') ? rawAvatar : '';

  function handleNavNavigate(id) {
    if (id === 'create')   { setCreateOpen(true); return; }
    setActiveNavId(id);
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'calendar')  onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  const visibleSuggestions = suggestions.filter(f => !dismissedIds.includes(f.id ?? f._id));

  return (
    <aside className="home-left-panel">

      {/* ── Animated expand-on-hover nav ── */}
      <AnimatedNav
        activeId={activeNavId}
        avatarUrl={avatarUrl}
        onNavigate={handleNavNavigate}
        unreadMessages={unreadMessages}
      />

      {createOpen && <CreatePostModal onClose={() => setCreateOpen(false)} onNavigateToEvents={onEventsClick} />}

      {/* ── Sidebar content ── */}
      <div className="left-sidebar-content">

        {/* Profile card */}
        <div className="profile-card">
          <div className="profile-cover" style={{ position: 'relative', overflow: 'hidden' }}>
            <SkeletonImg src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80&fit=crop" alt="cover" className="profile-cover-img" />
          </div>
          <div className="profile-body">
            <div className="profile-avatar-wrap" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
              <div className="profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <SkeletonImg
                  src={avatarUrl}
                  alt={displayName}
                  fallback={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{displayName[0]?.toUpperCase()}</span>}
                />
              </div>
            </div>
            <p className="profile-name">{displayName}</p>
            <p className="profile-role">{role}</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-num">{followingCount}</span>
                <span className="stat-lbl">Following</span>
              </div>
              <div className="profile-stat-div" />
              <div className="profile-stat">
                <span className="stat-num">{followersCount}</span>
                <span className="stat-lbl">Followers</span>
              </div>
            </div>
            <button className="view-profile-btn" onClick={onProfileClick}>View Profile</button>
          </div>
        </div>

        {/* Friend Suggestions */}
        <div className="sidebar-section">
          <div className="section-header">
            <span className="section-title">Friend Suggestions</span>
            <button className="section-link">View all</button>
          </div>
          <div className="friend-list">
            {visibleSuggestions.map(f => {
              const id = f.id ?? f._id;
              const isFollowing = followingIds.includes(id);
              return (
                <div
                  key={id}
                  className="friend-item"
                >
                  <div className="friend-item-top">
                    <div
                      className="friend-avatar"
                      style={{ background: f.avatarColor ?? '#3b82f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}
                      onClick={() => onUserClick?.(id)}
                    >
                      {f.avatar
                        ? <SkeletonImg
                            src={f.avatar}
                            alt={f.name}
                            fallback={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{initials(f.name)}</span>}
                          />
                        : initials(f.name)
                      }
                    </div>
                    <div className="friend-info">
                      <p className="friend-name" style={{ cursor: 'pointer' }} onClick={() => onUserClick?.(id)}>{f.name}</p>
                      <p className="friend-sub"><MutualIcon />{f.mutualFriends ? `${f.mutualFriends} mutual friends` : (f.sub ?? '')}</p>
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className={`friend-add-btn${isFollowing ? ' friend-add-btn--added' : ''}${poppingIds.has(id) ? ' friend-add-btn--pop' : ''}`}
                      onClick={() => handleAddFriend(id)}
                    >
                      {isFollowing ? '✓ Added' : 'Add Friend'}
                    </button>
                    <button
                      className={`friend-remove-btn${isFollowing ? ' friend-remove-btn--hidden' : ''}`}
                      onClick={() => handleDismiss(id)}
                      tabIndex={isFollowing ? -1 : 0}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Your Groups */}
        <div className="sidebar-section">
          <div className="section-header">
            <span className="section-title">Your Groups</span>
            <button className="section-link" onClick={onGroupsClick}>View all</button>
          </div>
          <div className="group-list">
            {groups.map(g => (
              <div key={g.id ?? g._id} className="group-item" style={{ cursor: 'pointer' }} onClick={() => onGroupClick?.(g.id ?? g._id)}>
                <div className="group-icon" style={{ background: g.color ?? '#3b82f6' }}>
                  {g.name[0]}
                </div>
                <div className="friend-info">
                  <p className="friend-name">{g.name}</p>
                  <p className="friend-sub">{g.members}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="sidebar-section">
          <div className="section-header">
            <span className="section-title">Upcoming Events</span>
            <button className="section-link" onClick={onEventsClick}>View all</button>
          </div>
          <div className="event-list">
            {upcomingEvents.length === 0 && (
              <p style={{ fontSize: 12, color: '#4a5270', margin: 0 }}>No upcoming events.</p>
            )}
            {upcomingEvents.map(e => (
              <div key={e.id} className="sidebar-event-item" style={{ cursor: 'pointer' }} onClick={() => onEventClick?.(e.id)}>
                <div className="event-thumb" style={{ overflow: 'hidden', borderRadius: 8 }}>
                  <img src={e.img} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="friend-info">
                  <p className="friend-name">{e.title}</p>
                  <p className="friend-sub">{e.month} {e.day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
