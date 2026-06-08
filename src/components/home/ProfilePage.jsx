import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import { MOCK_POSTS, ALEX_AVATAR } from './mockData';
import './ProfilePage.css';

const COVER_URL = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90&fit=crop';
const TABS = ['Feed', 'About', 'Connections', 'Media', 'Events'];

const MEDIA_PHOTOS = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', likes: '22K', comments: '3K' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&q=80', likes: '32K', comments: '12K' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80', likes: '21K', comments: '4K' },
  { id: 'm4', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', likes: '32K', comments: '16K' },
  { id: 'm5', url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500&q=80', likes: '20K', comments: '8K' },
  { id: 'm6', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80', likes: '56K', comments: '12K' },
  { id: 'm7', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', likes: '18K', comments: '5K' },
  { id: 'm8', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&q=80', likes: '41K', comments: '9K' },
  { id: 'm9', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=80', likes: '29K', comments: '7K' },
];

const INFO_ITEMS = [
  { id: 'born',     Icon: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: 'Born', value: 'October 20, 1990' },
  { id: 'status',   Icon: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label: 'Status', value: 'Single' },
  { id: 'job',      Icon: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>, label: null, value: 'Lead Developer' },
  { id: 'lives',    Icon: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Lives in', value: 'New Hampshire' },
  { id: 'joined',   Icon: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Joined on', value: 'Nov 26, 2019' },
  { id: 'email',    Icon: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', value: 'abc@xyz.com' },
];

const INTERESTS = [
  { id: 'oracle', bg: '#0070c0', logo: 'O', name: 'Oracle', followers: '7,546,224 followers' },
  { id: 'apple',  bg: '#1c1c1e', logo: '🍎', name: 'Apple',  followers: '102B followers' },
  { id: 'elon',   bg: '#334155', logo: '👤', name: 'Elon Musk', followers: 'CEO and Product Architect of Tesla, Inc 41B followers', small: true },
  { id: 'xfactor',bg: '#7c3aed', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&q=80', name: 'The X Factor', followers: '9,654 followers' },
  { id: 'getbs',  bg: '#6f42c1', logo: 'B', name: 'Getbootstrap', followers: '8,457,224 followers' },
];

function BriefcaseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function PinIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function CalIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function EditIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function TrashIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function MoreIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }
function PhotosIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function VideoIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>; }
function EventIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function CheckBadge()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>; }
function PlusCircle()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function LockIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }

const DEFAULT_BIO = "He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy. Handsome met debating sir dwelling age material. As style lived he worse dried. Offered related so visitors we private removed. Moderate do subjects to distance.";

function CameraIcon() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function HeartFillIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function MsgIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }

function MediaTab() {
  return (
    <div className="media-tab">
      <div className="media-header">
        <h2 className="media-title">Photos</h2>
        <button className="media-create-btn"><PlusIcon /> Create album</button>
      </div>
      <div className="media-grid">
        {/* Add photo slot */}
        <button className="media-add-slot">
          <div className="media-add-icon"><CameraIcon /></div>
          <span className="media-add-label">Add photo</span>
        </button>

        {MEDIA_PHOTOS.map(photo => (
          <div key={photo.id} className="media-photo-card">
            <div className="media-photo-wrap">
              <img src={photo.url} alt="" className="media-photo-img" />
              <div className="media-photo-overlay" />
            </div>
            <div className="media-photo-stats">
              <span className="media-stat"><HeartFillIcon /> {photo.likes}</span>
              <span className="media-stat"><MsgIcon /> {photo.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PROFILE_EVENTS = [
  { id: 'e1', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80', title: 'Comedy on the green',         date: 'Mon, Sep 25, 2020 at 9:30 AM',  location: 'San Francisco',  going: 77  },
  { id: 'e2', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80', title: 'Tech Summit 2024',             date: 'Fri, Nov 15, 2024 at 10:00 AM', location: 'New York',       going: 243 },
  { id: 'e3', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80', title: 'Live Music Night at the Park', date: 'Sat, Dec 07, 2024 at 7:00 PM',  location: 'Los Angeles',    going: 512 },
];

function EventsTab({ onEventsClick }) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [openMenuId,    setOpenMenuId]    = useState(null);

  return (
    <div className="ev-tab">
      <div className="ev-header">
        <h2 className="ev-title">Discover Events</h2>
        <button className="ev-create-btn" onClick={onEventsClick}><PlusIcon /> Create events</button>
      </div>

      {bannerVisible && (
        <div className="ev-banner">
          <span className="ev-banner-text">
            <strong>Upcoming event:</strong> The learning conference on Sep 19 2024
          </span>
          <button className="ev-banner-view">View event</button>
          <button className="ev-banner-close" onClick={() => setBannerVisible(false)}>✕</button>
        </div>
      )}

      <div className="ev-list">
        {PROFILE_EVENTS.map(ev => (
          <div key={ev.id} className="ev-card">
            <img src={ev.img} alt={ev.title} className="ev-card-img" />
            <div className="ev-card-body">
              <p className="ev-card-title">{ev.title}</p>
              <div className="ev-card-meta">
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {ev.date}
                </span>
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {ev.location}
                </span>
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {ev.going} going
                </span>
              </div>
            </div>
            <div className="ev-card-more-wrap">
              <button className="ev-card-more-btn" onClick={() => setOpenMenuId(openMenuId === ev.id ? null : ev.id)}>
                <MoreIcon />
              </button>
              {openMenuId === ev.id && (
                <div className="ev-card-dropdown">
                  <button className="ev-dd-item" onClick={() => setOpenMenuId(null)}>View event</button>
                  <button className="ev-dd-item" onClick={() => setOpenMenuId(null)}>Share</button>
                  <button className="ev-dd-item ev-dd-item--danger" onClick={() => setOpenMenuId(null)}>Remove</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab() {
  const [bio,          setBio]          = useState(DEFAULT_BIO);
  const [editingBio,   setEditingBio]   = useState(false);
  const [draftBio,     setDraftBio]     = useState(DEFAULT_BIO);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function close(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  function handleEdit() {
    setDraftBio(bio ?? '');
    setEditingBio(true);
    setMenuOpen(false);
  }
  function handleDelete() {
    setBio(null);
    setEditingBio(false);
    setMenuOpen(false);
  }
  function handleSave() {
    setBio(draftBio.trim() || null);
    setEditingBio(false);
  }

  return (
    <div className="about-tab">
      <h2 className="about-section-title">Profile Info</h2>

      {/* Overview card */}
      <div className="about-card">
        <div className="about-card-header">
          <span className="about-card-label">Overview</span>
          <div className="about-card-menu-wrap" ref={menuRef}>
            <button className="about-dots-btn" onClick={() => setMenuOpen(v => !v)}><MoreIcon /></button>
            <span className="about-lock-icon"><LockIcon /></span>
            {menuOpen && (
              <div className="about-dropdown">
                <button className="about-dropdown-item" onClick={handleEdit}>
                  <span className="about-dd-icon about-dd-icon--blue"><EditIcon /></span>
                  Edit
                </button>
                <button className="about-dropdown-item about-dropdown-item--danger" onClick={handleDelete}>
                  <span className="about-dd-icon about-dd-icon--red"><TrashIcon /></span>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {editingBio ? (
          <div className="about-bio-edit">
            <textarea
              className="about-bio-textarea"
              value={draftBio}
              onChange={e => setDraftBio(e.target.value)}
              rows={5}
              autoFocus
            />
            <div className="about-bio-edit-actions">
              <button className="about-bio-cancel" onClick={() => setEditingBio(false)}>Cancel</button>
              <button className="about-bio-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        ) : bio ? (
          <p className="about-bio-text">{bio}</p>
        ) : (
          <p className="about-bio-empty">No overview added yet.</p>
        )}
      </div>

      {/* Info grid */}
      <div className="about-info-grid">
        {INFO_ITEMS.map(item => (
          <div key={item.id} className="about-info-item">
            <span className="about-info-icon"><item.Icon /></span>
            <span className="about-info-text">
              {item.label && <span className="about-info-label">{item.label}: </span>}
              <strong>{item.value}</strong>
            </span>
            <div className="about-info-actions">
              <button className="about-dots-btn"><MoreIcon /></button>
              <span className="about-lock-icon"><LockIcon /></span>
            </div>
          </div>
        ))}
        <div className="about-info-item about-info-item--add">
          <PlusCircle /> Add a workplace
        </div>
        <div className="about-info-item about-info-item--add">
          <PlusCircle /> Add a education
        </div>
      </div>

      {/* Interests */}
      <div className="about-interests">
        <div className="about-interests-header">
          <h3 className="about-interests-title">Interests</h3>
          <button className="about-see-all">See all</button>
        </div>
        <div className="about-interests-grid">
          {INTERESTS.map(item => (
            <div key={item.id} className="about-interest-item">
              <div className="about-interest-logo" style={{ background: item.bg }}>
                {item.img
                  ? <img src={item.img} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span style={{ fontSize: item.logo.length > 1 ? '18px' : '16px', fontWeight: 700, color: '#fff' }}>{item.logo}</span>
                }
              </div>
              <div className="about-interest-info">
                <span className="about-interest-name">{item.name}</span>
                <span className="about-interest-followers">{item.followers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({
  onBack, onCoursesClick, onLibraryClick, onEventsClick,
  onGroupsClick, onMessagesClick, onCalendarClick,
}) {
  const { user: authUser }  = useSelector(s => s.auth);
  const { profile }         = useSelector(s => s.profile);
  const avatarUrl           = profile?.avatar ?? ALEX_AVATAR;
  const displayName         = profile?.fullName ?? authUser?.fullName ?? 'Alex Rivera';
  const role                = profile?.role ?? 'Lead Developer';

  const [activeTab,      setActiveTab]      = useState('Feed');
  const [createPostOpen, setCreatePostOpen] = useState(false);

  function handleNav(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onBack?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'calendar') onCalendarClick?.();
  }

  return (
    <>
    <div className="prof-page">
      <AnimatedNav activeId="home" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="prof-main">
        <div className="prof-cover">
          <img src={COVER_URL} alt="cover" className="prof-cover-img" />
        </div>

        <div className="prof-identity">
          <div className="prof-avatar-wrap">
            <img src={avatarUrl} alt={displayName} className="prof-avatar-img" />
          </div>
          <div className="prof-info">
            <div className="prof-name-row">
              <h1 className="prof-name">{displayName}</h1>
              <CheckBadge />
              <div className="prof-connections">250 connections</div>
            </div>
            <div className="prof-meta-row">
              <span className="prof-meta-item"><BriefcaseIcon /> {role}</span>
              <span className="prof-meta-sep">·</span>
              <span className="prof-meta-item"><PinIcon /> New Hampshire</span>
              <span className="prof-meta-sep">·</span>
              <span className="prof-meta-item"><CalIcon /> Joined on Nov 26, 2019</span>
            </div>
            <div className="prof-counts-row">
              <button className="prof-count-item">
                <span className="prof-count-num">8,400</span>
                <span className="prof-count-lbl">Total Followers</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item">
                <span className="prof-count-num">1,200</span>
                <span className="prof-count-lbl">Total Following</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item">
                <span className="prof-count-num">326</span>
                <span className="prof-count-lbl">Total Posts</span>
              </button>
            </div>
          </div>
          <div className="prof-actions">
            <button className="prof-edit-btn"><EditIcon /> Edit profile</button>
            <button className="prof-more-btn"><MoreIcon /></button>
          </div>
        </div>

        <div className="prof-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`prof-tab${activeTab === tab ? ' prof-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'Connections' && <span className="prof-tab-badge">300</span>}
            </button>
          ))}
        </div>

        <div className="prof-content">
          {activeTab === 'Feed' && (
            <div className="prof-feed">
              <div className="prof-creator">
                <div className="prof-creator-top">
                  <div className="prof-creator-avatar">
                    <img src={avatarUrl} alt={displayName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <button className="prof-creator-input" onClick={() => setCreatePostOpen(true)}>
                    Share your thoughts...
                  </button>
                </div>
                <div className="prof-creator-actions">
                  <button className="prof-creator-btn" onClick={() => setCreatePostOpen(true)}>
                    <span className="prof-creator-btn-icon" style={{ background:'#22c55e20', color:'#22c55e' }}><PhotosIcon /></span> Photo
                  </button>
                  <button className="prof-creator-btn" onClick={() => setCreatePostOpen(true)}>
                    <span className="prof-creator-btn-icon" style={{ background:'#3b82f620', color:'#3b82f6' }}><VideoIcon /></span> Video
                  </button>
                  <button className="prof-creator-btn" onClick={() => setCreatePostOpen(true)}>
                    <span className="prof-creator-btn-icon" style={{ background:'#ef444420', color:'#ef4444' }}><EventIcon /></span> Event
                  </button>
                  <button className="prof-creator-btn prof-creator-dots"><MoreIcon /></button>
                </div>
              </div>
              {MOCK_POSTS.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'About' && <AboutTab />}
          {activeTab === 'Media'  && <MediaTab />}
          {activeTab === 'Events' && <EventsTab onEventsClick={onEventsClick} />}

          {activeTab !== 'Feed' && activeTab !== 'About' && activeTab !== 'Media' && activeTab !== 'Events' && activeTab !== 'Connections' && (
            <div className="prof-empty-tab">
              <p className="prof-empty-title">{activeTab}</p>
              <p className="prof-empty-sub">Nothing here yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} onNavigateToEvents={onEventsClick} />}
    </>
  );
}
