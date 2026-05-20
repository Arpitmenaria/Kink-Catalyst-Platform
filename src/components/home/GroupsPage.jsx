import { useState } from 'react';
import './GroupsPage.css';

/* ── Nav icons ── */
function FeedNavIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function EventNavIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function GroupsNavIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CalendarNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MessagesNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }

/* ── UI icons ── */
function PlusIcon()        { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function SearchIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function MembersIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function GlobeIcon()       { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function LockIcon()        { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function CameraIcon()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function CheckSmIcon()     { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function ArrowRightIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }

const GRP_NAV = [
  { id: 'feed',     label: 'Feed',     icon: <FeedNavIcon /> },
  { id: 'event',    label: 'Event',    icon: <EventNavIcon /> },
  { id: 'groups',   label: 'Groups',   icon: <GroupsNavIcon />, active: true },
  { id: 'calendar', label: 'Calendar', icon: <CalendarNavIcon /> },
  { id: 'messages', label: 'Messages', icon: <MessagesNavIcon /> },
];

const TABS = ['All Groups', 'My Groups', 'Suggested'];

const GROUPS_DATA = [
  { id: '1', name: 'UI/UX Designers Hub',       desc: 'A community for designers to share work, get feedback, and grow together.', members: '2.4k', color: '#7c3aed', privacy: 'public',  joined: true  },
  { id: '2', name: 'React Developers',           desc: 'Everything React — hooks, patterns, performance, and the ecosystem.', members: '1.8k', color: '#0891b2', privacy: 'public',  joined: true  },
  { id: '3', name: 'Product Managers Network',   desc: 'Strategy, roadmaps, and product thinking for PMs at every level.', members: '956',  color: '#059669', privacy: 'private', joined: false },
  { id: '4', name: 'Creative Collective',        desc: 'Photographers, illustrators, and visual artists inspiring each other.', members: '3.1k', color: '#dc2626', privacy: 'public',  joined: false },
  { id: '5', name: 'Startup Founders Network',   desc: 'Connect with founders, swap stories, and build together.', members: '542',  color: '#d97706', privacy: 'private', joined: true  },
  { id: '6', name: 'Tech Innovators',            desc: 'AI, blockchain, and emerging tech — stay ahead of the curve.', members: '4.2k', color: '#2563eb', privacy: 'public',  joined: false },
];

const MODAL_CONTACTS = [
  { id: '1', name: 'Sarah Jenkins',   role: 'Product Designer',    color: '#b45309' },
  { id: '2', name: 'Marcus Chen',     role: 'Senior Engineer',     color: '#1d4ed8' },
  { id: '3', name: 'Elena Rodriguez', role: 'Marketing Lead',      color: '#be185d' },
  { id: '4', name: 'David Park',      role: 'Community Manager',   color: '#6d28d9' },
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

function formatCount(n) {
  const num = parseFloat(n);
  if (n.endsWith('k')) return n;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

/* ── Create Group Modal ── */
function CreateGroupModal({ onClose }) {
  const [groupName, setGroupName]     = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy]         = useState('public');
  const [selected, setSelected]       = useState([]);
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

        {/* Header */}
        <div className="grp-modal-header">
          <div>
            <h2 className="grp-modal-title">New Message</h2>
            <p className="grp-modal-subtitle">Start a conversation or create a group chat.</p>
          </div>
          <button className="grp-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="grp-modal-body">
          {/* Create New Group link */}
          <button className="grp-create-link">
            <GroupsNavIcon /> Create New Group
          </button>

          {/* Image upload + form */}
          <div className="grp-form-row">
            <div className="grp-img-upload">
              <CameraIcon />
              <span className="grp-img-badge"><CheckSmIcon /></span>
            </div>
            <div className="grp-form-fields">
              <div className="grp-field">
                <label className="grp-label">Group Name</label>
                <input
                  className="grp-input"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                />
              </div>
              <div className="grp-field">
                <label className="grp-label">Description (Optional)</label>
                <textarea
                  className="grp-textarea"
                  placeholder="What's this group about?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Privacy toggle */}
          <div className="grp-privacy-row">
            <span className="grp-privacy-label">Privacy</span>
            <div className="grp-privacy-toggle">
              <button
                type="button"
                className={`grp-privacy-btn${privacy === 'public' ? ' grp-privacy-btn--active' : ''}`}
                onClick={() => setPrivacy('public')}
              >
                <GlobeIcon /> Public
              </button>
              <button
                type="button"
                className={`grp-privacy-btn${privacy === 'private' ? ' grp-privacy-btn--active' : ''}`}
                onClick={() => setPrivacy('private')}
              >
                <LockIcon /> Private
              </button>
            </div>
          </div>

          {/* Suggested Contacts */}
          <div className="grp-contacts-section">
            <div className="grp-contacts-header">
              <span className="grp-contacts-title">Suggested Contacts</span>
              <div className="grp-contacts-right">
                <div className="grp-search-wrap">
                  <SearchIcon />
                  <input
                    className="grp-contact-search"
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChange={e => setContactSearch(e.target.value)}
                  />
                </div>
                <button className="grp-select-all" onClick={() => setSelected(MODAL_CONTACTS.map(c => c.id))}>
                  Select All
                </button>
              </div>
            </div>

            <div className="grp-contact-list">
              {filtered.map(c => {
                const checked = selected.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`grp-contact-item${checked ? ' grp-contact-item--selected' : ''}`}
                    onClick={() => toggleContact(c.id)}
                  >
                    <div className="grp-contact-avatar" style={{ background: c.color }}>
                      {initials(c.name)}
                    </div>
                    <div className="grp-contact-info">
                      <p className="grp-contact-name">{c.name}</p>
                      <p className="grp-contact-role">{c.role}</p>
                    </div>
                    <div className={`grp-checkbox${checked ? ' grp-checkbox--checked' : ''}`}>
                      {checked && <CheckSmIcon />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="grp-modal-footer">
          <button className="grp-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="grp-submit-btn">
            Create Group <ArrowRightIcon />
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Groups Page ── */
export default function GroupsPage({ onBack, onMessagesClick }) {
  const [tab, setTab]         = useState('All Groups');
  const [search, setSearch]   = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [joined, setJoined]   = useState(
    Object.fromEntries(GROUPS_DATA.map(g => [g.id, g.joined]))
  );

  const filtered = GROUPS_DATA.filter(g => {
    if (tab === 'My Groups' && !joined[g.id]) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="grp-page">
      {/* Left sidebar */}
      <aside className="grp-sidebar">
        <nav className="grp-nav">
          {GRP_NAV.map(item => (
            <button
              key={item.id}
              className={`grp-nav-item${item.active ? ' grp-nav-item--active' : ''}`}
              onClick={
                item.id === 'feed'     ? onBack :
                item.id === 'messages' ? onMessagesClick :
                undefined
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="grp-main">
        {/* Page header */}
        <div className="grp-page-header">
          <div>
            <h1 className="grp-page-title">Groups</h1>
            <p className="grp-page-subtitle">Discover and manage your communities</p>
          </div>
          <button className="grp-create-btn" onClick={() => setModalOpen(true)}>
            <PlusIcon /> Create New Group
          </button>
        </div>

        {/* Tabs + Search */}
        <div className="grp-toolbar">
          <div className="grp-tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`grp-tab${tab === t ? ' grp-tab--active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grp-search-bar">
            <SearchIcon />
            <input
              className="grp-search-input"
              placeholder="Search groups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Groups grid */}
        <div className="grp-grid">
          {filtered.length === 0 ? (
            <p className="grp-empty">No groups found.</p>
          ) : filtered.map(g => (
            <div key={g.id} className="grp-card">
              {/* Cover strip */}
              <div className="grp-card-cover" style={{ background: `linear-gradient(135deg, ${g.color}33, ${g.color}11)`, borderColor: `${g.color}22` }}>
                <div className="grp-card-avatar" style={{ background: g.color }}>
                  {initials(g.name)}
                </div>
              </div>

              <div className="grp-card-body">
                <div className="grp-card-top">
                  <h3 className="grp-card-name">{g.name}</h3>
                  <span className={`grp-privacy-badge${g.privacy === 'private' ? ' grp-privacy-badge--private' : ''}`}>
                    {g.privacy === 'private' ? <LockIcon /> : <GlobeIcon />}
                    {g.privacy === 'private' ? 'Private' : 'Public'}
                  </span>
                </div>
                <p className="grp-card-desc">{g.desc}</p>
                <div className="grp-card-meta">
                  <span className="grp-card-members"><MembersIcon /> {formatCount(g.members)} members</span>
                </div>
                <button
                  className={`grp-card-btn${joined[g.id] ? ' grp-card-btn--joined' : ''}`}
                  onClick={() => setJoined(prev => ({ ...prev, [g.id]: !prev[g.id] }))}
                >
                  {joined[g.id] ? '✓ Joined' : '+ Join Group'}
                </button>
              </div>
            </div>
          ))}

          {/* Create group card */}
          <div className="grp-card grp-card--create" onClick={() => setModalOpen(true)}>
            <div className="grp-create-card-inner">
              <div className="grp-create-icon"><PlusIcon /></div>
              <p className="grp-create-card-text">Create New Group</p>
              <p className="grp-create-card-sub">Start your own community</p>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && <CreateGroupModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
