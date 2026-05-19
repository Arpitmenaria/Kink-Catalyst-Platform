import { useSelector } from 'react-redux';

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

function FriendsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M13 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM0 18v-2a4 4 0 0 1 4-4h1a5 5 0 0 0 10 0h1a4 4 0 0 1 4 4v2H0z"/>
    </svg>
  );
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);

  const displayName = profile?.fullName ?? authUser?.fullName ?? 'Alex Rivera';
  const avatarUrl = profile?.avatar || '';
  const followersCount = profile?.followers?.length ?? 0;
  const followingCount = profile?.following?.length ?? 0;

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
        <div className="navbar-stat">
          <FriendsIcon />
          <span><strong>{followingCount}</strong> Following</span>
        </div>
        <div className="navbar-divider" />
        <div className="navbar-stat">
          <FriendsIcon />
          <span><strong>{followersCount}</strong> Followers</span>
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" aria-label="Notifications">
          <BellIcon />
          <span className="notif-dot notif-dot--red" />
        </button>
        <button className="navbar-icon-btn" aria-label="Messages">
          <BellIcon />
          <span className="notif-dot notif-dot--green" />
        </button>
        <div className="navbar-user">
          <div className="navbar-avatar" style={{ overflow: avatarUrl ? 'hidden' : undefined }} aria-hidden="true">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials(displayName)
            }
          </div>
          <span className="navbar-username">{displayName}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="#6b7399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </nav>
  );
}
