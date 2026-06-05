import { useState, useRef, useEffect } from 'react';
import './GroupsPage.css';
import AnimatedNav from './AnimatedNav';
import CreatePostModal from './CreatePostModal';


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

/* ── Moderation Page icons ── */
function SaveIcon()         { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>; }
function RulesIcon()        { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function LockShieldIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function AlertCircleIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
function PlusCircleIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }

/* ── Admin Dashboard icons ── */
function ExportIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function InviteIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>; }
function FilterIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>; }
function InsightsIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function ChevronLeftIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevronRightIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }

/* ── Create Group Page icons ── */
function BackArrowIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function IdentityIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M8 12h.01M12 12h4M8 16h8"/><circle cx="8" cy="12" r="1" fill="currentColor"/></svg>; }
function ShieldIcon2()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function GlobeIconLg()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function LockIconLg()       { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function ChevronDownIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function PlantIcon()        { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12C12 7 17 4 20 5c-1 4-4 7-8 7z"/><path d="M12 12C12 7 7 4 4 5c1 4 4 7 8 7z"/></svg>; }
function CheckCircleIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10" fill="none" stroke="white" strokeWidth="2"/></svg>; }

/* ── Premium Role Dropdown ── */
const ROLE_CONFIG = {
  Admin:     { color: '#60a5fa', bg: 'rgba(59,130,246,0.14)',  border: 'rgba(59,130,246,0.32)'  },
  Moderator: { color: '#fbbf24', bg: 'rgba(245,158,11,0.14)',  border: 'rgba(245,158,11,0.32)'  },
  Member:    { color: '#94a3b8', bg: 'rgba(100,116,139,0.14)', border: 'rgba(100,116,139,0.28)' },
};

function RoleSelect({ value, memberId, openId, onToggle, onChange }) {
  const ref = useRef(null);
  const isOpen = openId === memberId;
  const cfg = ROLE_CONFIG[value] ?? ROLE_CONFIG.Member;

  useEffect(() => {
    if (!isOpen) return;
    function onOut(e) { if (ref.current && !ref.current.contains(e.target)) onToggle(null); }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [isOpen, onToggle]);

  return (
    <div className="adm-rs-wrap" ref={ref}>
      <button
        className="adm-rs-trigger"
        onClick={() => onToggle(isOpen ? null : memberId)}
        style={{ '--rs-color': cfg.color, '--rs-bg': cfg.bg, '--rs-border': cfg.border }}
      >
        <span className="adm-rs-dot" style={{ background: cfg.color }} />
        <span className="adm-rs-label">{value}</span>
        <span className={`adm-rs-chevron${isOpen ? ' adm-rs-chevron--up' : ''}`}><ChevronDownIcon /></span>
      </button>

      {isOpen && (
        <div className="adm-rs-dropdown">
          {Object.entries(ROLE_CONFIG).map(([role, rc]) => (
            <button
              key={role}
              className={`adm-rs-option${value === role ? ' adm-rs-option--active' : ''}`}
              onClick={() => { onChange(role); onToggle(null); }}
            >
              <span className="adm-rs-opt-dot" style={{ background: rc.color, boxShadow: `0 0 6px ${rc.color}` }} />
              <span className="adm-rs-opt-label">{role}</span>
              {value === role && <CheckSmIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CATEGORIES = [
  'Technology & Software', 'Design & Creative', 'Business & Finance',
  'Education & Learning', 'Health & Wellness', 'Entertainment',
  'Sports & Fitness', 'Travel & Lifestyle',
];

/* ── Moderation Page mock data ── */
const COMMUNITY_RULES = [
  { id: 1, title: 'Be Professional & Respectful',  desc: 'Treat all members with courtesy. Zero tolerance for harassment, hate speech, or bullying.' },
  { id: 2, title: 'No Spam or Self-Promotion',     desc: 'Keep discussions relevant. Commercial posts require moderator approval before publishing.' },
  { id: 3, title: 'Protect Privacy',               desc: 'Do not share sensitive information or private conversations outside of this group.' },
];

const REPORTED_CONTENT = [
  { id: 1, quote: '"How to bypass..."',    author: 'Marcus J.', reason: 'Spam / Promotion', reporter: 'Jordan P.', img: 'https://picsum.photos/seed/rep1/44/44' },
  { id: 2, quote: '"You clearly don\'t..."', author: 'Marcus J.', reason: 'Harassment',       reporter: 'Taylor L.', img: 'https://picsum.photos/seed/rep2/44/44' },
];

/* ══════════════════════════
   Community Moderation Page
══════════════════════════ */
function CommunityModerationPage({ group, onBack, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick }) {
  const [postApproval,  setPostApproval]  = useState(true);
  const [commentPerms,  setCommentPerms]  = useState(true);
  const [rules,         setRules]         = useState(COMMUNITY_RULES);
  const [dismissed,       setDismissed]       = useState({});
  const [createPostOpen,  setCreatePostOpen]  = useState(false);

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onFeedClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
  }

  const visible = REPORTED_CONTENT.filter(r => !dismissed[r.id]);

  return (
    <div className="mod-page">
      <AnimatedNav activeId="friends" onNavigate={navClick} />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      {/* Main */}
      <div className="mod-content">

        {/* Breadcrumb + Header */}
        <div className="mod-header-wrap">
          <div className="mod-header-left">
            <p className="mod-breadcrumb">
              <span className="mod-bc-link" onClick={onBack}>Groups</span>
              <span className="mod-bc-sep">›</span>
              Moderation &amp; Rules
            </p>
            <h1 className="mod-title">Community Moderation</h1>
            <p className="mod-subtitle">
              Manage rules, privacy controls, and member reports for <strong>{group?.name ?? 'Design Collective'}</strong>.
            </p>
          </div>
          <button className="mod-save-btn"><SaveIcon /> Save Changes</button>
        </div>

        {/* Two-column: Rules + Privacy */}
        <div className="mod-two-col">

          {/* Community Rules */}
          <div className="mod-card">
            <div className="mod-card-header">
              <div className="mod-card-icon mod-card-icon--gray"><RulesIcon /></div>
              <div className="mod-card-title-group">
                <p className="mod-card-title">Community Rules</p>
                <p className="mod-card-sub">Core guidelines for all members</p>
              </div>
              <button className="mod-add-rule-btn"><PlusCircleIcon /> Add Rule</button>
            </div>

            <div className="mod-rules-list">
              {rules.map(rule => (
                <div key={rule.id} className="mod-rule-item">
                  <span className="mod-rule-num">{rule.id}</span>
                  <div className="mod-rule-body">
                    <p className="mod-rule-title">{rule.title}</p>
                    <p className="mod-rule-desc">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="mod-card mod-card--privacy">
            <div className="mod-card-header mod-card-header--privacy">
              <div className="mod-card-icon mod-card-icon--blue"><LockShieldIcon /></div>
              <div className="mod-card-title-group">
                <p className="mod-card-title">Privacy Controls</p>
                <p className="mod-card-sub">Manage access levels</p>
              </div>
            </div>

            <div className="mod-privacy-list">
              {/* Group Visibility */}
              <div className="mod-privacy-row">
                <div>
                  <p className="mod-privacy-label">Group Visibility</p>
                  <p className="mod-privacy-desc">Who can find the group in search</p>
                </div>
                <span className="mod-visibility-pill">Private (Visible)</span>
              </div>

              {/* Post Approval */}
              <div className="mod-privacy-row">
                <div>
                  <p className="mod-privacy-label">Post Approval</p>
                  <p className="mod-privacy-desc">Admins must approve new posts</p>
                </div>
                <div className={`mod-toggle${postApproval ? ' mod-toggle--on' : ''}`} onClick={() => setPostApproval(v => !v)}>
                  <div className="mod-toggle-thumb" />
                </div>
              </div>

              {/* Comment Permissions */}
              <div className="mod-privacy-row">
                <div>
                  <p className="mod-privacy-label">Comment Permissions</p>
                  <p className="mod-privacy-desc">Allow threaded discussions</p>
                </div>
                <div className={`mod-toggle${commentPerms ? ' mod-toggle--on' : ''}`} onClick={() => setCommentPerms(v => !v)}>
                  <div className="mod-toggle-thumb" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reported Content */}
        <div className="mod-reported-card">
          <div className="mod-reported-header">
            <div className="mod-reported-left">
              <div className="mod-reported-icon"><AlertCircleIcon /></div>
              <div>
                <p className="mod-reported-title">Reported Content</p>
                <p className="mod-reported-sub">Review pending member reports</p>
              </div>
            </div>
            <div className="mod-reported-right">
              <span className="mod-pending-badge">{visible.length} PENDING</span>
              <button className="mod-view-all-btn">View All</button>
            </div>
          </div>

          <table className="mod-table">
            <thead>
              <tr>
                <th>CONTENT</th>
                <th>REASON</th>
                <th>REPORTER</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="mod-content-cell">
                      <img src={r.img} alt="" className="mod-content-thumb" />
                      <div>
                        <p className="mod-content-quote">{r.quote}</p>
                        <p className="mod-content-author">Posted by {r.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="mod-reason">{r.reason}</td>
                  <td className="mod-reporter">{r.reporter}</td>
                  <td>
                    <div className="mod-actions">
                      <button className="mod-dismiss-btn" onClick={() => setDismissed(p => ({ ...p, [r.id]: true }))}>Dismiss</button>
                      <button className="mod-remove-btn">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={4} className="mod-empty">No pending reports.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* ── Admin Dashboard mock data ── */
const ADMIN_MEMBERS = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@design.co', role: 'group_admin', joined: 'Oct 12, 2023', img: 'https://i.pravatar.cc/40?img=1'  },
  { id: 2, name: 'Marcus Thorne', email: 'sarah.j@design.co', role: 'moderator',   joined: 'Oct 12, 2023', img: 'https://i.pravatar.cc/40?img=3'  },
  { id: 3, name: 'Alex Rivera',   email: 'sarah.j@design.co', role: 'member',      joined: 'Oct 12, 2023', img: 'https://i.pravatar.cc/40?img=5'  },
  { id: 4, name: 'Elena Vance',   email: 'sarah.j@design.co', role: 'member',      joined: 'Oct 12, 2023', img: 'https://i.pravatar.cc/40?img=9'  },
];

const ROLE_BADGE_MAP = {
  group_admin: { label: 'GROUP ADMIN', cls: 'adm-badge--admin'  },
  moderator:   { label: 'MODERATOR',   cls: 'adm-badge--mod'    },
  member:      { label: 'MEMBER',      cls: 'adm-badge--member' },
};

/* ══════════════════════════
   Group Admin Dashboard
══════════════════════════ */
function GroupAdminDashboard({ group, onBack, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick, onModerationClick }) {
  const [activeTab,      setActiveTab]      = useState('active');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [memberRoles,    setMemberRoles]    = useState({ 1: 'Admin', 2: 'Moderator', 3: 'Member', 4: 'Member' });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onFeedClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
  }

  const filtered = ADMIN_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="adm-page">
      <AnimatedNav activeId="friends" onNavigate={navClick} />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      {/* Main content */}
      <div className="adm-content">

        {/* Header */}
        <div className="adm-header">
          <div className="adm-header-left">
            <span className="adm-breadcrumb">ADMIN DASHBOARD</span>
            <h1 className="adm-title">{group?.name ?? 'Creative Directors United'}</h1>
            <p className="adm-subtitle">Manage 2,482 members and pending joining requests.</p>
          </div>
          <div className="adm-header-btns">
            <button className="adm-export-btn"><ExportIcon /> Export List</button>
            <button className="adm-invite-btn"><InviteIcon /> Invite Members</button>
          </div>
        </div>

        {/* Stats row */}
        <div className="adm-stats-row">
          <div className="adm-stat-card">
            <p className="adm-stat-label">Total Members</p>
            <p className="adm-stat-value">2,482</p>
            <span className="adm-stat-pill adm-stat-pill--green">+12%</span>
          </div>
          <div className="adm-stat-card">
            <p className="adm-stat-label">Active This Week</p>
            <p className="adm-stat-value">1,890</p>
            <span className="adm-stat-pill adm-stat-pill--green">High Engagement</span>
          </div>
          <div className="adm-stat-card">
            <p className="adm-stat-label">Pending Requests</p>
            <p className="adm-stat-value">42</p>
            <span className="adm-stat-pill adm-stat-pill--amber">Needs Review</span>
          </div>
          <div className="adm-stat-card adm-stat-card--clickable" onClick={onModerationClick}>
            <p className="adm-stat-label">Moderation Flag</p>
            <p className="adm-stat-value">3</p>
            <span className="adm-stat-pill adm-stat-pill--red">Action Required</span>
          </div>
        </div>

        {/* Members table card */}
        <div className="adm-table-card">
          {/* Top: tabs + search */}
          <div className="adm-table-top">
            <div className="adm-tabs">
              <button className={`adm-tab${activeTab === 'active'  ? ' adm-tab--active' : ''}`} onClick={() => setActiveTab('active')}>Active Members</button>
              <button className={`adm-tab${activeTab === 'pending' ? ' adm-tab--active' : ''}`} onClick={() => setActiveTab('pending')}>
                Pending Requests <span className="adm-tab-count">42</span>
              </button>
              <button className={`adm-tab${activeTab === 'banned'  ? ' adm-tab--active' : ''}`} onClick={() => setActiveTab('banned')}>Banned</button>
            </div>
            <div className="adm-table-tools">
              <div className="adm-search-wrap">
                <SearchIcon />
                <input className="adm-search-input" placeholder="Search by name, email or role..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <button className="adm-filter-btn"><FilterIcon /> Filter</button>
            </div>
          </div>

          {/* Table */}
          <table className="adm-table">
            <thead>
              <tr>
                <th>MEMBER</th>
                <th>CURRENT ROLE</th>
                <th>DATE JOINED</th>
                <th>ASSIGN ROLE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const badge = ROLE_BADGE_MAP[m.role] ?? ROLE_BADGE_MAP.member;
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="adm-member-cell">
                        <img src={m.img} alt={m.name} className="adm-member-avatar" />
                        <div>
                          <p className="adm-member-name">{m.name}</p>
                          <p className="adm-member-email">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`adm-badge ${badge.cls}`}>{badge.label}</span></td>
                    <td className="adm-date-cell">{m.joined}</td>
                    <td>
                      <RoleSelect
                        value={memberRoles[m.id]}
                        memberId={m.id}
                        openId={openDropdownId}
                        onToggle={setOpenDropdownId}
                        onChange={role => setMemberRoles(p => ({ ...p, [m.id]: role }))}
                      />
                    </td>
                    <td><button className="adm-action-btn"><MoreIcon /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table footer */}
          <div className="adm-table-footer">
            <span className="adm-showing">Showing 1 to {filtered.length} of 2,482 members</span>
            <div className="adm-pagination">
              <button className="adm-pg-btn"><ChevronLeftIcon /></button>
              {[1, 2, 3].map(n => (
                <button key={n} className={`adm-pg-btn${n === 1 ? ' adm-pg-btn--active' : ''}`}>{n}</button>
              ))}
              <span className="adm-pg-ellipsis">...</span>
              <button className="adm-pg-btn"><ChevronRightIcon /></button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="adm-bottom-row">
          {/* Pending requests CTA */}
          <div className="adm-pending-card">
            <div className="adm-pending-deco" />
            <p className="adm-pending-label">PENDING REQUESTS</p>
            <h3 className="adm-pending-title">Review 42 Pending Requests</h3>
            <p className="adm-pending-desc">There are new applications to join your group. Review them now to maintain your community growth.</p>
            <div className="adm-pending-btns">
              <button className="adm-goto-btn">Go to Requests</button>
              <button className="adm-dismiss-btn">Dismiss Reminder</button>
            </div>
          </div>

          {/* Community Insights */}
          <div className="adm-insights-card">
            <div className="adm-insights-icon-wrap"><InsightsIcon /></div>
            <h3 className="adm-insights-title">Community Insights</h3>
            <p className="adm-insights-desc">Your group saw a 14% increase in participation after the last event.</p>
            <button className="adm-analytics-btn">View full analytics <ArrowRightIcon /></button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════
   Create Group Page
══════════════════════════ */
function CreateGroupPage({ onBack, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick, onCreateGroup }) {
  const [groupName,     setGroupName]     = useState('');
  const [description,   setDescription]   = useState('');
  const [category,      setCategory]      = useState('Technology & Software');
  const [privacy,       setPrivacy]       = useState('public');
  const [adminApproval,  setAdminApproval]  = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onFeedClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
  }

  return (
    <div className="cg-page">
      <AnimatedNav activeId="friends" onNavigate={navClick} />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

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
            <button className="cg-create-btn" onClick={onCreateGroup}>Create Group</button>
            <button className="cg-draft-btn">Save as Draft</button>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Nav ── */

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
  const [modalOpen,      setModalOpen]      = useState(false);
  const [showCreate,     setShowCreate]     = useState(false);
  const [showAdmin,      setShowAdmin]      = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [adminGroup,     setAdminGroup]     = useState(null);
  const [joinedSugg,     setJoinedSugg]    = useState({});
  const [createPostOpen, setCreatePostOpen] = useState(false);

  if (showCreate) {
    return (
      <CreateGroupPage
        onBack={() => setShowCreate(false)}
        onFeedClick={onBack}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onMessagesClick={onMessagesClick}
        onCreateGroup={() => { setShowCreate(false); setAdminGroup(null); setShowAdmin(true); }}
      />
    );
  }

  if (showModeration) {
    return (
      <CommunityModerationPage
        group={adminGroup}
        onBack={() => setShowModeration(false)}
        onFeedClick={onBack}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onMessagesClick={onMessagesClick}
      />
    );
  }

  if (showAdmin) {
    return (
      <GroupAdminDashboard
        group={adminGroup}
        onBack={() => setShowAdmin(false)}
        onFeedClick={onBack}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onMessagesClick={onMessagesClick}
        onModerationClick={() => setShowModeration(true)}
      />
    );
  }

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onBack?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
  }

  return (
    <div className="grp-page">

      {/* ── Left sidebar ── */}
      <AnimatedNav activeId="friends" onNavigate={navClick} />

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
            <div key={g.id} className="grp-sugg-item grp-sugg-item--clickable" onClick={() => { setAdminGroup(g); setShowAdmin(true); }}>
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
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

    </div>
  );
}
