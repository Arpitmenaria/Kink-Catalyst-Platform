import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ALEX_AVATAR } from './mockData';
import { logout } from '../../store/slices/authSlice';

const DEMO_NOTIFICATIONS = [
  { id: 1, emoji: '💬', text: 'Alex liked your post', sub: '2 minutes ago', color: '#3b82f6', unread: true },
  { id: 2, emoji: '📸', text: 'Maria commented on your photo', sub: '15 minutes ago', color: '#8b5cf6', unread: true },
  { id: 3, emoji: '🎉', text: 'New event: Music Festival this Saturday', sub: '1 hour ago', color: '#f59e0b', unread: false },
];

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

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Navbar({ onMessagesClick, onProfileClick }) {
  const dispatch               = useDispatch();
  const { user: authUser }     = useSelector((state) => state.auth);
  const { profile }            = useSelector((state) => state.profile);

  const displayName = profile?.fullName || authUser?.fullName || 'Alex Rivera';
  const avatarUrl   = profile?.avatar   ?? ALEX_AVATAR;

  const [notifOpen,  setNotifOpen]  = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [notifs,     setNotifs]     = useState(DEMO_NOTIFICATIONS);
  const notifRef                    = useRef(null);
  const userRef                     = useRef(null);
  const unreadCount                 = notifs.filter(n => n.unread).length;

  useEffect(() => {
    if (!notifOpen) return;
    function onOut(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [notifOpen]);

  useEffect(() => {
    if (!userOpen) return;
    function onOut(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [userOpen]);

  function handleBell() {
    setNotifOpen(v => !v);
    if (!notifOpen) setNotifs(ns => ns.map(n => ({ ...n, unread: false })));
  }

  return (
    <nav className="home-navbar">
      <div className="navbar-left">
        <span className="navbar-logo">Social Platform</span>
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
        {/* Messages */}
        <button className="navbar-icon-btn" aria-label="Messages" onClick={onMessagesClick}>
          <ChatBubbleIcon />
          <span className="notif-badge notif-badge--green">2</span>
        </button>

        {/* Notifications */}
        <div className="navbar-notif-wrap" ref={notifRef}>
          <button className="navbar-icon-btn" aria-label="Notifications" onClick={handleBell}>
            <BellIcon />
            {unreadCount > 0 && (
              <span className="notif-badge notif-badge--red">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="navbar-notif-dropdown">
              <div className="navbar-notif-header">
                <span className="navbar-notif-title">Notifications</span>
                <span className="navbar-notif-pill">{DEMO_NOTIFICATIONS.length} new</span>
              </div>
              {notifs.map((n, i) => (
                <div key={n.id} className="navbar-notif-item" style={{ '--ni': i }}>
                  <div className="navbar-notif-icon" style={{ background: n.color + '22', color: n.color }}>
                    {n.emoji}
                  </div>
                  <div className="navbar-notif-body">
                    <p className="navbar-notif-text">{n.text}</p>
                    <p className="navbar-notif-sub">{n.sub}</p>
                  </div>
                  {n.unread && <span className="navbar-notif-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-user-wrap" ref={userRef}>
          <button className="navbar-user" onClick={() => setUserOpen(v => !v)}>
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
            <span className="navbar-chevron"><ChevronDownIcon /></span>
          </button>

          {userOpen && (
            <div className="navbar-user-dropdown">
              <div className="navbar-user-dropdown-header" style={{ cursor: 'pointer' }} onClick={() => { setUserOpen(false); onProfileClick?.(); }}>
                <div className="navbar-ud-avatar" style={{ overflow: 'hidden' }}>
                  <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p className="navbar-ud-name">{displayName}</p>
                  <p className="navbar-ud-status">Active Now</p>
                </div>
              </div>
              <div className="navbar-ud-divider" />
              <button className="navbar-ud-item">
                <SettingsIcon /> Settings
              </button>
              <div className="navbar-ud-divider" />
              <button className="navbar-ud-item navbar-ud-item--logout" onClick={() => dispatch(logout())}>
                <LogoutIcon /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
