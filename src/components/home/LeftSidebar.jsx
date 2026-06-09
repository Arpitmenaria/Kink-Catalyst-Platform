import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FRIEND_SUGGESTIONS, GROUPS, SIDEBAR_EVENTS, ALEX_AVATAR } from './mockData';
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

function PersonAddIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  );
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

export default function LeftSidebar({ onEventsClick, onMessagesClick, onGroupsClick, onCalendarClick, onCoursesClick, onLibraryClick, onProfileClick, onMinisitesClick }) {
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const [createOpen,  setCreateOpen]  = useState(false);
  const [activeNavId, setActiveNavId] = useState('home');

  const displayName    = profile?.fullName ?? authUser?.fullName ?? 'Alex Rivera';
  const role           = profile?.role ?? 'Product Designer';
  const followingCount = formatCount(profile?.following?.length ?? 1200);
  const followersCount = formatCount(profile?.followers?.length ?? 8400);
  const avatarUrl      = profile?.avatar ?? ALEX_AVATAR;

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

  return (
    <aside className="home-left-panel">

      {/* ── Animated expand-on-hover nav ── */}
      <AnimatedNav
        activeId={activeNavId}
        avatarUrl={avatarUrl}
        onNavigate={handleNavNavigate}
      />

      {createOpen && <CreatePostModal onClose={() => setCreateOpen(false)} onNavigateToEvents={onEventsClick} />}

      {/* ── Sidebar content ── */}
      <div className="left-sidebar-content">

        {/* Profile card */}
        <div className="profile-card">
          <div className="profile-cover" />
          <div className="profile-body">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar" style={{ overflow: 'hidden' }}>
                <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <button className="section-link">See all</button>
          </div>
          <div className="friend-list">
            {FRIEND_SUGGESTIONS.map(f => (
              <div key={f.id} className="friend-item">
                <div className="friend-avatar" style={{ background: f.color, overflow: 'hidden' }}>
                  {f.avatar
                    ? <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials(f.name)
                  }
                </div>
                <div className="friend-info">
                  <p className="friend-name">{f.name}</p>
                  <p className="friend-sub">{f.sub}</p>
                </div>
                <button className="friend-add-btn" aria-label={`Add ${f.name}`}><PersonAddIcon /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Your Groups */}
        <div className="sidebar-section">
          <div className="section-header">
            <span className="section-title">Your Groups</span>
            <button className="section-link">View all</button>
          </div>
          <div className="group-list">
            {GROUPS.map(g => (
              <div key={g.id} className="group-item">
                <div className="group-icon" style={{ background: g.color }}>
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
            <button className="section-link">View all</button>
          </div>
          <div className="event-list">
            {SIDEBAR_EVENTS.map(e => (
              <div key={e.id} className="sidebar-event-item">
                <div className="event-thumb" style={{ overflow: 'hidden', borderRadius: 8 }}>
                  <img src={e.img} alt={e.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="friend-info">
                  <p className="friend-name">{e.name}</p>
                  <p className="friend-sub">{e.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
