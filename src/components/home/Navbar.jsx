import { useSelector } from 'react-redux';
import { ALEX_AVATAR } from './mockData';

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="#4a5270" strokeWidth="1.8" />
      <path d="M14.5 14.5l3.5 3.5" stroke="#4a5270" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 0 0-5-5.917V4a1 1 0 1 0-2 0v1.083A6 6 0 0 0 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile }        = useSelector((state) => state.profile);

  const displayName = profile?.fullName ?? authUser?.fullName ?? 'Alex Rivera';
  const avatarUrl   = profile?.avatar   ?? ALEX_AVATAR;

  return (
    <nav className="home-navbar">
      <div className="navbar-left">
        <span className="navbar-logo">SocialPlatform</span>
        <div className="navbar-search">
          <SearchIcon />
          <input type="text" placeholder="Find Friends" className="navbar-search-input" />
        </div>
      </div>

      <div className="navbar-center">
        <div className="navbar-stat-pill">
          <span className="navbar-stat-num">326</span>
          <span className="navbar-stat-lbl">Total Posts</span>
        </div>
        <div className="navbar-divider" />
        <div className="navbar-stat-pill">
          <span className="navbar-stat-num">2456</span>
          <span className="navbar-stat-lbl">Total Friends</span>
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" aria-label="Messages">
          <ChatBubbleIcon />
          <span className="notif-badge notif-badge--green">2</span>
        </button>
        <button className="navbar-icon-btn" aria-label="Notifications">
          <BellIcon />
          <span className="notif-badge notif-badge--red">2</span>
        </button>
        <div className="navbar-user">
          <div className="navbar-avatar-wrap">
            <div className="navbar-avatar" style={{ overflow: 'hidden' }} aria-hidden="true">
              <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="navbar-online-dot" />
          </div>
          <div className="navbar-user-info">
            <span className="navbar-username">{displayName}</span>
            <span className="navbar-active-now">Active Now</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
