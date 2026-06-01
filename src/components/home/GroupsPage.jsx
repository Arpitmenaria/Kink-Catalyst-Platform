import { useState } from 'react';
import './GroupsPage.css';

/* ── Nav icons ── */
function FeedNavIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function EventNavIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function GroupsNavIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CalendarNavIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MessagesNavIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }

/* ── UI icons ── */
function PlusIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function HeartIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function ChatIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function ShareIcon2()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>; }
function MoreIcon()       { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }
function TrendingUpIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
function SearchIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function GlobeIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function LockIcon()       { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function CameraIcon()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function CheckSmIcon()    { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function ArrowRightIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }

/* ── Create Group Page icons ── */
function BackArrowIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function IdentityIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M8 12h.01M12 12h4M8 16h8"/><circle cx="8" cy="12" r="1" fill="currentColor"/></svg>; }
function ShieldIcon2()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function GlobeIconLg()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function LockIconLg()       { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function ChevronDownIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function PlantIcon()        { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12C12 7 17 4 20 5c-1 4-4 7-8 7z"/><path d="M12 12C12 7 7 4 4 5c1 4 4 7 8 7z"/></svg>; }
function CheckCircleIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10" fill="none" stroke="white" strokeWidth="2"/></svg>; }

const CATEGORIES = [
  'Technology & Software', 'Design & Creative', 'Business & Finance',
  'Education & Learning', 'Health & Wellness', 'Entertainment',
  'Sports & Fitness', 'Travel & Lifestyle',
];

/* ══════════════════════════
   Create Group Page
══════════════════════════ */
function CreateGroupPage({ onBack, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick }) {
  const [groupName,     setGroupName]     = useState('');
  const [description,   setDescription]   = useState('');
  const [category,      setCategory]      = useState('Technology & Software');
  const [privacy,       setPrivacy]       = useState('public');
  const [adminApproval, setAdminApproval] = useState(true);

  function navClick(id) {
    if (id === 'feed')     onFeedClick?.();
    if (id === 'event')    onEventsClick?.();
    if (id === 'groups')   onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
  }

  return (
    <div className="cg-page">
      {/* Sidebar */}
      <aside className="grp-sidebar">
        <nav className="grp-nav">
          {GRP_NAV.map(item => (
            <button key={item.id} className={`grp-nav-item${item.active ? ' grp-nav-item--active' : ''}`} onClick={() => navClick(item.id)}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="cg-content">

        {/* Header */}
        <div className="cg-header">
          <button className="cg-back-btn" onClick={onBack}><BackArrowIcon /></button>
          <div>
            <h1 className="cg-title">Create New Group</h1>
            <p className="cg-subtitle">Build a community for shared interests and collaboration.</p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="cg-layout">

          {/* Left column */}
          <div className="cg-left">

            {/* Group Identity */}
            <div className="cg-section">
              <div className="cg-section-head"><IdentityIcon /> Group Identity</div>

              <div className="cg-field">
                <label className="cg-label">Group Name</label>
                <input className="cg-input" placeholder="e.g. Design Systems Weekly" value={groupName} onChange={e => setGroupName(e.target.value)} maxLength={50} />
                <p className="cg-hint">Keep it short and descriptive. Max 50 characters.</p>
              </div>

              <div className="cg-field">
                <label className="cg-label">Description</label>
                <textarea className="cg-textarea" placeholder="What is this group about?" value={description} onChange={e => setDescription(e.target.value)} rows={5} />
              </div>

              <div className="cg-field">
                <label className="cg-label">Category</label>
                <div className="cg-select-wrap">
                  <select className="cg-select" value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="cg-chevron"><ChevronDownIcon /></span>
                </div>
              </div>
            </div>

            {/* Privacy & Access */}
            <div className="cg-section">
              <div className="cg-section-head"><ShieldIcon2 /> Privacy & Access</div>

              <div className="cg-privacy-grid">
                {/* Public */}
                <div className={`cg-privacy-card${privacy === 'public' ? ' cg-privacy-card--active' : ''}`} onClick={() => setPrivacy('public')}>
                  <div className="cg-privacy-card-top">
                    <span className={`cg-privacy-icon${privacy === 'public' ? ' active' : ''}`}><GlobeIconLg /></span>
                    <span className={`cg-radio${privacy === 'public' ? ' cg-radio--on' : ''}`}>
                      {privacy === 'public' && <span className="cg-radio-dot" />}
                    </span>
                  </div>
                  <p className="cg-privacy-title">Public Group</p>
                  <p className="cg-privacy-desc">Anyone can see who's in the group and what they post.</p>
                </div>
                {/* Private */}
                <div className={`cg-privacy-card${privacy === 'private' ? ' cg-privacy-card--active' : ''}`} onClick={() => setPrivacy('private')}>
                  <div className="cg-privacy-card-top">
                    <span className={`cg-privacy-icon${privacy === 'private' ? ' active' : ''}`}><LockIconLg /></span>
                    <span className={`cg-radio${privacy === 'private' ? ' cg-radio--on' : ''}`}>
                      {privacy === 'private' && <span className="cg-radio-dot" />}
                    </span>
                  </div>
                  <p className="cg-privacy-title">Private Group</p>
                  <p className="cg-privacy-desc">Only members can see who's in the group and what they post.</p>
                </div>
              </div>

              {/* Admin Approval toggle */}
              <div className="cg-toggle-row">
                <div className="cg-toggle-icon"><ShieldIcon2 /></div>
                <div className="cg-toggle-info">
                  <p className="cg-toggle-title">Admin Approval</p>
                  <p className="cg-toggle-desc">Require admins to approve new member requests.</p>
                </div>
                <div className={`cg-toggle${adminApproval ? ' cg-toggle--on' : ''}`} onClick={() => setAdminApproval(v => !v)}>
                  <div className="cg-toggle-thumb" />
                </div>
              </div>
            </div>

          </div>

          {/* Right column */}
          <div className="cg-right">

            {/* Group Cover */}
            <div className="cg-cover-card">
              <p className="cg-cover-label">GROUP COVER</p>
              <div className="cg-cover-img-wrap">
                <img src="https://picsum.photos/seed/grp-cover-meeting/340/160" alt="cover" className="cg-cover-img" />
              </div>
              <p className="cg-cover-hint">Recommended size: 1200x600px.<br />JPG, PNG or GIF up to 5MB.</p>
            </div>

            {/* Grow your group */}
            <div className="cg-tips-card">
              <div className="cg-tips-head"><PlantIcon /> Grow your group</div>
              <ul className="cg-tips-list">
                <li><CheckCircleIcon /> Pick a clear, searchable name that defines the group's intent.</li>
                <li><CheckCircleIcon /> Add relevant tags to help people find your community easily.</li>
                <li><CheckCircleIcon /> Invite 5–10 friends to start the conversation and build momentum.</li>
              </ul>
            </div>

            {/* Action buttons */}
            <button className="cg-create-btn">Create Group</button>
            <button className="cg-draft-btn">Save as Draft</button>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Nav ── */
const GRP_NAV = [
  { id: 'feed',     label: 'Feed',     icon: <FeedNavIcon />     },
  { id: 'event',    label: 'Event',    icon: <EventNavIcon />    },
  { id: 'groups',   label: 'Groups',   icon: <GroupsNavIcon />,  active: true },
  { id: 'calendar', label: 'Calendar', icon: <CalendarNavIcon /> },
  { id: 'messages', label: 'Messages', icon: <MessagesNavIcon /> },
];

/* ── Mock data ── */
const SUGGESTED_GROUPS = [
  { id: 1, name: 'Modern Stack Devs',      members: '12.4k members', img: 'https://picsum.photos/seed/sg-devs/42/42'   },
  { id: 2, name: 'Minimalist Living',       members: '8.1k members',  img: 'https://picsum.photos/seed/sg-living/42/42' },
  { id: 3, name: 'Beat Makers Collective',  members: '22.9k members', img: 'https://picsum.photos/seed/sg-beats/42/42'  },
];

const YOUR_GROUPS = [
  { id: 1, name: 'Digital Artists Hub',  members: '1.1k members', img: 'https://picsum.photos/seed/yg-artists/42/42' },
  { id: 2, name: 'Open Source Contribs', members: '1.2k members', img: 'https://picsum.photos/seed/yg-oss/42/42'     },
];

const TRENDING_TAGS = ['#Web3Design', '#SocialFlow', '#StartupLife', '#RemoteWork', '#AIArt'];

const MODAL_CONTACTS = [
  { id: '1', name: 'Sarah Jenkins',   role: 'Product Designer',  color: '#b45309' },
  { id: '2', name: 'Marcus Chen',     role: 'Senior Engineer',   color: '#1d4ed8' },
  { id: '3', name: 'Elena Rodriguez', role: 'Marketing Lead',    color: '#be185d' },
  { id: '4', name: 'David Park',      role: 'Community Manager', color: '#6d28d9' },
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

/* ── Create Group Modal ── */
function CreateGroupModal({ onClose }) {
  const [groupName,     setGroupName]     = useState('');
  const [description,   setDescription]   = useState('');
  const [privacy,       setPrivacy]       = useState('public');
  const [selected,      setSelected]      = useState([]);
  const [contactSearch, setContactSearch] = useState('');

  function toggleContact(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  const filtered = MODAL_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="grp-overlay" onClick={onClose}>
      <div className="grp-modal" onClick={e => e.stopPropagation()}>
        <div className="grp-modal-header">
          <div>
            <h2 className="grp-modal-title">Create New Group</h2>
            <p className="grp-modal-subtitle">Build a community around your interest.</p>
          </div>
          <button className="grp-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="grp-modal-body">
          <div className="grp-form-row">
            <div className="grp-img-upload"><CameraIcon /><span className="grp-img-badge"><CheckSmIcon /></span></div>
            <div className="grp-form-fields">
              <div className="grp-field">
                <label className="grp-label">Group Name</label>
                <input className="grp-input" placeholder="Enter group name..." value={groupName} onChange={e => setGroupName(e.target.value)} />
              </div>
              <div className="grp-field">
                <label className="grp-label">Description (Optional)</label>
                <textarea className="grp-textarea" placeholder="What's this group about?" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>
            </div>
          </div>
          <div className="grp-privacy-row">
            <span className="grp-privacy-label">Privacy</span>
            <div className="grp-privacy-toggle">
              <button type="button" className={`grp-privacy-btn${privacy === 'public'  ? ' grp-privacy-btn--active' : ''}`} onClick={() => setPrivacy('public')}><GlobeIcon /> Public</button>
              <button type="button" className={`grp-privacy-btn${privacy === 'private' ? ' grp-privacy-btn--active' : ''}`} onClick={() => setPrivacy('private')}><LockIcon /> Private</button>
            </div>
          </div>
          <div className="grp-contacts-section">
            <div className="grp-contacts-header">
              <span className="grp-contacts-title">Suggested Contacts</span>
              <div className="grp-contacts-right">
                <div className="grp-search-wrap"><SearchIcon /><input className="grp-contact-search" placeholder="Search..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} /></div>
                <button className="grp-select-all" onClick={() => setSelected(MODAL_CONTACTS.map(c => c.id))}>Select All</button>
              </div>
            </div>
            <div className="grp-contact-list">
              {filtered.map(c => {
                const checked = selected.includes(c.id);
                return (
                  <div key={c.id} className={`grp-contact-item${checked ? ' grp-contact-item--selected' : ''}`} onClick={() => toggleContact(c.id)}>
                    <div className="grp-contact-avatar" style={{ background: c.color }}>{initials(c.name)}</div>
                    <div className="grp-contact-info">
                      <p className="grp-contact-name">{c.name}</p>
                      <p className="grp-contact-role">{c.role}</p>
                    </div>
                    <div className={`grp-checkbox${checked ? ' grp-checkbox--checked' : ''}`}>{checked && <CheckSmIcon />}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="grp-modal-footer">
          <button className="grp-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="grp-submit-btn">Create Group <ArrowRightIcon /></button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════
   Main Component
══════════════════════════ */
export default function GroupsPage({ onBack, onEventsClick, onCalendarClick, onMessagesClick }) {
  const [modalOpen,   setModalOpen]   = useState(false);
  const [showCreate,  setShowCreate]  = useState(false);
  const [joinedSugg,  setJoinedSugg]  = useState({});

  if (showCreate) {
    return (
      <CreateGroupPage
        onBack={() => setShowCreate(false)}
        onFeedClick={onBack}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onMessagesClick={onMessagesClick}
      />
    );
  }

  function navClick(id) {
    if (id === 'feed')     onBack?.();
    if (id === 'event')    onEventsClick?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
  }

  return (
    <div className="grp-page">

      {/* ── Left sidebar ── */}
      <aside className="grp-sidebar">
        <nav className="grp-nav">
          {GRP_NAV.map(item => (
            <button
              key={item.id}
              className={`grp-nav-item${item.active ? ' grp-nav-item--active' : ''}`}
              onClick={() => navClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <main className="grp-main">

        {/* Hero banner */}
        <div className="grp-hero">
          <div className="grp-hero-content">
            <h1 className="grp-hero-title">Build Your Community</h1>
            <p className="grp-hero-sub">
              Connect with like-minded individuals, share resources,<br />
              and spark meaningful conversations in your own space.
            </p>
            <button className="grp-hero-btn" onClick={() => setShowCreate(true)}>
              <PlusIcon /> Create Group
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="grp-feed">

          {/* Post card: text post */}
          <div className="grp-post-card">
            <div className="grp-post-header">
              <div className="grp-post-avatar" style={{ background: '#2563eb' }}>U</div>
              <div className="grp-post-meta">
                <p className="grp-post-group-name">UX Design Masters</p>
                <p className="grp-post-sub-meta">Posted by Sarah Chen • 2h ago</p>
              </div>
              <button className="grp-post-more"><MoreIcon /></button>
            </div>
            <p className="grp-post-text">
              Just finished the new design system for Social Pulse! We're prioritizing accessibility and high-contrast tokens. What do you think about the new 'Midnight Professional' palette? 🎨
            </p>
            <div className="grp-post-tags">
              {['#UXDesign', '#DesignSystem', '#Accessibility'].map(t => (
                <span key={t} className="grp-tag">{t}</span>
              ))}
            </div>
            <div className="grp-post-stats">
              <span className="grp-stat"><HeartIcon /> 124</span>
              <span className="grp-stat"><ChatIcon /> 42</span>
              <span className="grp-stat"><ShareIcon2 /> 8</span>
              <span className="grp-read-more">Read more</span>
            </div>
          </div>

          {/* Announcement card */}
          <div className="grp-announce-card">
            <div className="grp-announce-img-wrap">
              <img src="https://picsum.photos/seed/arch-summit-city/330/200" alt="Summit" className="grp-announce-img" />
            </div>
            <div className="grp-announce-body">
              <div className="grp-announce-top">
                <span className="grp-announce-badge">ANNOUNCEMENT</span>
                <span className="grp-announce-group">Arch-Tech Global</span>
              </div>
              <h3 className="grp-announce-title">Sustainable Infrastructure Summit 2024</h3>
              <p className="grp-announce-desc">
                We are thrilled to announce that our annual summit will be hosted in the Metaverse this year. Registration is now...
              </p>
              <div className="grp-announce-footer">
                <div className="grp-interested">
                  {[10, 11].map(n => (
                    <img key={n} src={`https://i.pravatar.cc/30?img=${n}`} className="grp-int-avatar" alt="" />
                  ))}
                  <span className="grp-int-text">+15 Interested</span>
                </div>
                <button className="grp-join-event-btn">Join Event</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Right sidebar ── */}
      <aside className="grp-right">

        {/* Suggested Groups */}
        <div className="grp-right-panel">
          <div className="grp-right-panel-head">
            <span className="grp-right-panel-title">Suggested Groups</span>
            <button className="grp-view-all-btn">View all</button>
          </div>
          {SUGGESTED_GROUPS.map(g => (
            <div key={g.id} className="grp-sugg-item">
              <div className="grp-sugg-avatar">
                <img src={g.img} alt={g.name} />
              </div>
              <div className="grp-sugg-info">
                <p className="grp-sugg-name">{g.name}</p>
                <p className="grp-sugg-members">{g.members}</p>
              </div>
              <button
                className={`grp-join-btn${joinedSugg[g.id] ? ' grp-join-btn--joined' : ''}`}
                onClick={() => setJoinedSugg(p => ({ ...p, [g.id]: !p[g.id] }))}
              >
                {joinedSugg[g.id] ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>

        {/* Your Groups */}
        <div className="grp-right-panel">
          <div className="grp-right-panel-head">
            <span className="grp-right-panel-title">Your Groups</span>
            <span className="grp-count-badge">12</span>
          </div>
          {YOUR_GROUPS.map(g => (
            <div key={g.id} className="grp-sugg-item">
              <div className="grp-sugg-avatar">
                <img src={g.img} alt={g.name} />
              </div>
              <div className="grp-sugg-info">
                <p className="grp-sugg-name">{g.name}</p>
                <p className="grp-sugg-members">{g.members}</p>
              </div>
            </div>
          ))}
          <button className="grp-manage-btn">Manage Subscriptions</button>
        </div>

        {/* Trending Now */}
        <div className="grp-trending-card">
          <div className="grp-trending-head">
            <TrendingUpIcon /> <span>Trending Now</span>
          </div>
          <div className="grp-trending-tags">
            {TRENDING_TAGS.map(tag => (
              <span key={tag} className="grp-trending-tag">{tag}</span>
            ))}
          </div>
        </div>

      </aside>

      {modalOpen && <CreateGroupModal onClose={() => setModalOpen(false)} />}

    </div>
  );
}
