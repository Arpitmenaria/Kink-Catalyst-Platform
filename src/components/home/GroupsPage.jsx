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
function UsersIcon()        { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function EditIcon()         { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }

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

function BookmarkIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }
function AlertTriangleIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function InfoCircleIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>; }

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
function CommunityModerationPage({ group, onBack, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick, onLibraryClick, onCoursesClick, onMinisitesClick }) {
  const [postApproval,  setPostApproval]  = useState(true);
  const [commentPerms,  setCommentPerms]  = useState(true);
  const [rules,         setRules]         = useState(COMMUNITY_RULES);
  const [dismissed,       setDismissed]       = useState({});
  const [createPostOpen,  setCreatePostOpen]  = useState(false);

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onFeedClick?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages')  onMessagesClick?.();
    if (id === 'minisites') onMinisitesClick?.();
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
  { id: 1, name: 'Sarah Jenkins',  email: 'sarah.jenkins@design.co',   role: 'group_admin', joined: 'Oct 12, 2023', img: 'https://i.pravatar.cc/40?img=1',  isFriend: true  },
  { id: 2, name: 'Marcus Thorne',  email: 'marcus.thorne@devhub.io',    role: 'moderator',   joined: 'Nov 5, 2023',  img: 'https://i.pravatar.cc/40?img=3',  isFriend: false },
  { id: 3, name: 'Alex Rivera',    email: 'alex.r@techlabs.dev',        role: 'member',      joined: 'Jan 8, 2024',  img: 'https://i.pravatar.cc/40?img=5',  isFriend: true  },
  { id: 4, name: 'Elena Vance',    email: 'elena.v@creativeflow.net',   role: 'member',      joined: 'Feb 20, 2024', img: 'https://i.pravatar.cc/40?img=9',  isFriend: false },
  { id: 5, name: 'James Okafor',   email: 'james.o@buildspace.io',      role: 'member',      joined: 'Mar 14, 2024', img: 'https://i.pravatar.cc/40?img=12', isFriend: false },
  { id: 6, name: 'Priya Sharma',   email: 'priya.s@codecraft.dev',      role: 'member',      joined: 'Apr 2, 2024',  img: 'https://i.pravatar.cc/40?img=16', isFriend: true  },
];

const INIT_PENDING = [
  { id: 101, name: 'Lucas Bennett',  email: 'lucas.b@webdev.io',      requestedOn: 'Jun 20, 2026', bio: 'Full-stack dev, 5 yrs exp. Passionate about open source.',            img: 'https://i.pravatar.cc/40?img=11' },
  { id: 102, name: 'Amara Diallo',   email: 'amara.d@designhub.co',   requestedOn: 'Jun 21, 2026', bio: 'UI/UX designer focused on accessibility and design systems.',           img: 'https://i.pravatar.cc/40?img=20' },
  { id: 103, name: 'Kenji Watanabe', email: 'kenji.w@techforge.dev',  requestedOn: 'Jun 22, 2026', bio: 'Backend engineer, Go & Rust enthusiast. Looking for like-minded devs.', img: 'https://i.pravatar.cc/40?img=33' },
  { id: 104, name: 'Sofia Herrera',  email: 'sofia.h@pixelcraft.io',  requestedOn: 'Jun 22, 2026', bio: 'Frontend dev specialising in React. Active open source contributor.',    img: 'https://i.pravatar.cc/40?img=44' },
];

const ADMIN_POSTS = [
  {
    id: 1,
    author: 'Alex Vanguard',
    badge: 'ADMIN',
    badgeCls: 'adm-post-badge--admin',
    avatar: 'https://i.pravatar.cc/40?img=3',
    time: '2 hours ago',
    protocol: 'Encryption Protocol A-13',
    text: 'Critical update pushed to all nodes: security patch v2.4.9 is now live. Please synchronize your local buffers. This patch addresses the recursive vulnerability found in the primary decryption gateway of Sector 4.',
    img: 'https://picsum.photos/seed/server-rack-dark/600/280',
    likes: '1.2k',
    comments: 86,
  },
  {
    id: 2,
    author: 'Data Stream 04',
    badge: null,
    avatar: 'https://i.pravatar.cc/40?img=7',
    time: '5 hours ago',
    protocol: 'Automated Alert',
    alert: true,
    alertText: '[ALERT] Unusual traffic spikes detected in sector 7-G. Analyzing packet headers... Origins appear to be spoofed through multiple planetary relays. Level 4 response team standing by.',
    likes: 256,
    comments: 12,
  },
];

const ROLE_BADGE_MAP = {
  group_admin: { label: 'GROUP ADMIN', cls: 'adm-badge--admin'  },
  moderator:   { label: 'MODERATOR',   cls: 'adm-badge--mod'    },
  member:      { label: 'MEMBER',      cls: 'adm-badge--member' },
};

/* ══════════════════════════
   Group Admin Dashboard
══════════════════════════ */
function GroupAdminDashboard({ group, onBack, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick, onModerationClick, onLibraryClick, onCoursesClick, onMinisitesClick }) {
  const [activeTab,      setActiveTab]      = useState('posts');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [memberRoles,    setMemberRoles]    = useState({ 1: 'Admin', 2: 'Moderator', 3: 'Member', 4: 'Member', 5: 'Member', 6: 'Member' });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [pendingList,    setPendingList]    = useState(INIT_PENDING);
  const [coverImg,       setCoverImg]       = useState(null);
  const [groupImg,       setGroupImg]       = useState(null);
  const coverInputRef = useRef(null);
  const photoInputRef = useRef(null);

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (file) setCoverImg(URL.createObjectURL(file));
    e.target.value = '';
  }
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) setGroupImg(URL.createObjectURL(file));
    e.target.value = '';
  }

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onFeedClick?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  function switchTab(tab) { setActiveTab(tab); setSearchQuery(''); }
  function acceptRequest(id) { setPendingList(p => p.filter(r => r.id !== id)); }
  function rejectRequest(id) { setPendingList(p => p.filter(r => r.id !== id)); }

  const filteredMembers = ADMIN_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPending = pendingList.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="adm-page">
      <AnimatedNav activeId="friends" onNavigate={navClick} />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      <div className="adm-content">

        {/* Cover + profile row */}
        <div className="adm-cover-section">

          {/* Banner */}
          <div className="adm-cover">
            <img
              src={coverImg || `https://picsum.photos/seed/adm-cover-${group?.id || 'default'}/1200/300`}
              alt="Group cover"
              className="adm-cover-img"
            />
            <button className="adm-cover-back-btn" onClick={onBack} title="Back to Groups">
              <BackArrowIcon />
            </button>
            <button className="adm-edit-cover-btn" onClick={() => coverInputRef.current?.click()}>
              <EditIcon /> Edit Cover
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
          </div>

          {/* Photo + name + actions */}
          <div className="adm-profile-row">
            <div className="adm-group-photo-area">
              <img
                src={groupImg || `https://picsum.photos/seed/adm-gp-${group?.id || 'default'}/120/120`}
                alt={group?.name}
                className="adm-group-photo-img"
              />
              <button className="adm-edit-photo-btn" onClick={() => photoInputRef.current?.click()}>
                <EditIcon />
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>

            <div className="adm-group-info">
              <span className="adm-breadcrumb">ADMIN DASHBOARD</span>
              <h1 className="adm-title">{group?.name ?? 'Creative Directors United'}</h1>
              <p className="adm-subtitle">
                Manage {ADMIN_MEMBERS.length} members
                {pendingList.length > 0 && ` · ${pendingList.length} pending requests`}
              </p>
            </div>

            <div className="adm-header-btns">
              <button className="adm-export-btn"><ExportIcon /> Export List</button>
              <button className="adm-invite-btn"><InviteIcon /> Invite Members</button>
            </div>
          </div>

        </div>

        {/* Stats row */}
        <div className="adm-stats-row">
          <div className="adm-stat-card" style={{ cursor: 'pointer' }} onClick={() => switchTab('members')}>
            <p className="adm-stat-label">Total Members</p>
            <p className="adm-stat-value">{ADMIN_MEMBERS.length}</p>
            <span className="adm-stat-pill adm-stat-pill--green">+12% this month</span>
          </div>
          <div className="adm-stat-card">
            <p className="adm-stat-label">Active This Week</p>
            <p className="adm-stat-value">{ADMIN_MEMBERS.length - 1}</p>
            <span className="adm-stat-pill adm-stat-pill--green">High Engagement</span>
          </div>
          {group?.privacy === 'private' && (
            <div className="adm-stat-card" style={{ cursor: 'pointer' }} onClick={() => switchTab('pending')}>
              <p className="adm-stat-label">Pending Requests</p>
              <p className="adm-stat-value">{pendingList.length}</p>
              <span className={`adm-stat-pill ${pendingList.length > 0 ? 'adm-stat-pill--amber' : 'adm-stat-pill--green'}`}>
                {pendingList.length > 0 ? 'Needs Review' : 'All Clear'}
              </span>
            </div>
          )}
          <div className="adm-stat-card adm-stat-card--clickable" onClick={onModerationClick}>
            <p className="adm-stat-label">Moderation Flags</p>
            <p className="adm-stat-value">3</p>
            <span className="adm-stat-pill adm-stat-pill--red">Action Required</span>
          </div>
        </div>

        {/* Members table card */}
        <div className="adm-table-card">
          <div className="adm-table-top">
            <div className="adm-tabs">
              <button className={`adm-tab${activeTab === 'posts'   ? ' adm-tab--active' : ''}`} onClick={() => switchTab('posts')}>
                Posts <span className="adm-tab-count">{ADMIN_POSTS.length}</span>
              </button>
              <button className={`adm-tab${activeTab === 'members' ? ' adm-tab--active' : ''}`} onClick={() => switchTab('members')}>
                Members <span className="adm-tab-count">{ADMIN_MEMBERS.length}</span>
              </button>
              <button className={`adm-tab${activeTab === 'about'   ? ' adm-tab--active' : ''}`} onClick={() => switchTab('about')}>
                About
              </button>
              {group?.privacy === 'private' && (
                <button className={`adm-tab${activeTab === 'pending' ? ' adm-tab--active' : ''}`} onClick={() => switchTab('pending')}>
                  Pending Requests {pendingList.length > 0 && <span className="adm-tab-count">{pendingList.length}</span>}
                </button>
              )}
            </div>
            {activeTab !== 'posts' && activeTab !== 'about' && (
              <div className="adm-table-tools">
                <div className="adm-search-wrap">
                  <SearchIcon />
                  <input
                    className="adm-search-input"
                    placeholder={activeTab === 'members' ? 'Search by name or email…' : 'Search applicants…'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                {activeTab === 'members' && <button className="adm-filter-btn"><FilterIcon /> Filter</button>}
              </div>
            )}
          </div>

          {/* Posts tab */}
          {activeTab === 'posts' && (
            <div className="adm-posts-layout">

              {/* Feed */}
              <div className="adm-posts-feed">
                {ADMIN_POSTS.map(post => (
                  <div key={post.id} className="adm-post-card">
                    <div className="adm-post-header">
                      <img src={post.avatar} alt={post.author} className="adm-post-avatar" />
                      <div className="adm-post-meta">
                        <div className="adm-post-name-row">
                          <span className="adm-post-name">{post.author}</span>
                          {post.badge && <span className={`adm-post-badge ${post.badgeCls || ''}`}>{post.badge}</span>}
                        </div>
                        <span className="adm-post-time">{post.time} · {post.protocol}</span>
                      </div>
                      <button className="adm-post-more"><MoreIcon /></button>
                    </div>

                    {post.text && <p className="adm-post-text">{post.text}</p>}
                    {post.img  && <img src={post.img} alt="" className="adm-post-img" />}
                    {post.alert && (
                      <div className="adm-post-alert-box">
                        <AlertTriangleIcon />
                        <p>{post.alertText}</p>
                      </div>
                    )}

                    <div className="adm-post-footer">
                      <button className="adm-post-reaction"><HeartIcon /> {post.likes}</button>
                      <button className="adm-post-reaction"><ChatIcon /> {post.comments} Comments</button>
                      <button className="adm-post-bookmark"><BookmarkIcon /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="adm-posts-sidebar">
                <div className="adm-mission-card">
                  <div className="adm-mission-head">
                    <span className="adm-mission-icon"><InfoCircleIcon /></span>
                    <span className="adm-mission-title">Group Mission</span>
                  </div>
                  <p className="adm-mission-text">
                    {group?.name} is an elite collective of cybersecurity experts dedicated to
                    maintaining the integrity of the core network. Established in cycle 2046,
                    this group operates under Level 5 clearance protocols for global node monitoring.
                  </p>
                </div>

                <div className="adm-roster-card">
                  <p className="adm-roster-title">Current Members</p>
                  <div className="adm-roster-avatars">
                    {ADMIN_MEMBERS.slice(0, 4).map(m => (
                      <img key={m.id} src={m.img} alt={m.name} className="adm-roster-av" />
                    ))}
                    <span className="adm-roster-extra">+12k</span>
                  </div>
                  <button className="adm-view-roster-btn">VIEW FULL ROSTER</button>
                </div>
              </div>

            </div>
          )}

          {/* Members table */}
          {activeTab === 'members' && (
            <>
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
                  {filteredMembers.map(m => {
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
                        <td>
                          <div className="adm-action-cell">
                            <button className="adm-act-btn adm-act-btn--chat" title="Send message"><ChatIcon /></button>
                            {!m.isFriend && (
                              <button className="adm-act-btn adm-act-btn--add" title="Add friend"><InviteIcon /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="adm-table-footer">
                <span className="adm-showing">Showing {filteredMembers.length} of {ADMIN_MEMBERS.length} members</span>
                <div className="adm-pagination">
                  <button className="adm-pg-btn"><ChevronLeftIcon /></button>
                  <button className="adm-pg-btn adm-pg-btn--active">1</button>
                  <button className="adm-pg-btn"><ChevronRightIcon /></button>
                </div>
              </div>
            </>
          )}

          {/* About tab */}
          {activeTab === 'about' && (
            <div className="adm-about-layout">

              {/* Description */}
              <div className="adm-about-card">
                <div className="adm-about-card-head">
                  <span className="adm-about-icon adm-about-icon--blue"><InfoCircleIcon /></span>
                  <span className="adm-about-card-title">About this Group</span>
                </div>
                <p className="adm-about-body">
                  {group?.description || 'No description provided for this group yet.'}
                </p>
              </div>

              {/* Mission */}
              <div className="adm-about-card">
                <div className="adm-about-card-head">
                  <span className="adm-about-icon adm-about-icon--purple"><TrendingUpIcon /></span>
                  <span className="adm-about-card-title">Group Mission</span>
                </div>
                <p className="adm-about-body">
                  {group?.mission || 'No mission statement defined.'}
                </p>
              </div>

              {/* Meta grid */}
              <div className="adm-about-meta-grid">

                <div className="adm-about-meta-card">
                  <span className="adm-about-meta-label">Admin</span>
                  <div className="adm-about-meta-val-row">
                    <img src="https://i.pravatar.cc/28?img=3" alt="admin" className="adm-about-admin-av" />
                    <span className="adm-about-meta-value">{group?.admin || 'Alex Vanguard'}</span>
                  </div>
                </div>

                <div className="adm-about-meta-card">
                  <span className="adm-about-meta-label">Privacy</span>
                  <div className="adm-about-meta-val-row">
                    {group?.privacy === 'private'
                      ? <><LockIcon /><span className="adm-about-meta-value">Private</span></>
                      : <><GlobeIcon /><span className="adm-about-meta-value">Public</span></>
                    }
                  </div>
                </div>

                <div className="adm-about-meta-card">
                  <span className="adm-about-meta-label">Category</span>
                  <span className="adm-about-meta-value">{group?.category || '—'}</span>
                </div>

                <div className="adm-about-meta-card">
                  <span className="adm-about-meta-label">Created</span>
                  <span className="adm-about-meta-value">{group?.createdAt || '—'}</span>
                </div>

              </div>

            </div>
          )}

          {/* Pending Requests table */}
          {activeTab === 'pending' && (
            pendingList.length === 0 ? (
              <p className="adm-empty">No pending requests — you&apos;re all caught up.</p>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>APPLICANT</th>
                    <th>REQUESTED ON</th>
                    <th>BIO</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPending.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="adm-member-cell">
                          <img src={r.img} alt={r.name} className="adm-member-avatar" />
                          <div>
                            <p className="adm-member-name">{r.name}</p>
                            <p className="adm-member-email">{r.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="adm-date-cell">{r.requestedOn}</td>
                      <td className="adm-bio-cell">{r.bio}</td>
                      <td>
                        <div className="adm-req-actions">
                          <button className="adm-accept-btn" onClick={() => acceptRequest(r.id)}>Accept</button>
                          <button className="adm-reject-btn" onClick={() => rejectRequest(r.id)}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>

        {/* Bottom row */}
        <div className="adm-bottom-row">
          <div className="adm-pending-card">
            <div className="adm-pending-deco" />
            <p className="adm-pending-label">{group?.privacy === 'private' ? 'PENDING REQUESTS' : 'OPEN MEMBERSHIP'}</p>
            <h3 className="adm-pending-title">
              {group?.privacy === 'private'
                ? (pendingList.length > 0 ? `Review ${pendingList.length} Pending Requests` : 'All Requests Reviewed')
                : 'Anyone Can Join Freely'}
            </h3>
            <p className="adm-pending-desc">
              {group?.privacy === 'private'
                ? (pendingList.length > 0
                    ? 'New applications to join your group are waiting. Review them to maintain community growth.'
                    : 'Great work — no pending join requests at this time.')
                : 'This is a public group. Members can join without approval — no review required.'}
            </p>
            {group?.privacy === 'private' && pendingList.length > 0 && (
              <div className="adm-pending-btns">
                <button className="adm-goto-btn" onClick={() => switchTab('pending')}>Go to Requests</button>
              </div>
            )}
          </div>

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
function CreateGroupPage({ onBack, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick, onCreateGroup, onLibraryClick, onCoursesClick, onMinisitesClick }) {
  const [groupName,     setGroupName]     = useState('');
  const [mission,       setMission]       = useState('');
  const [description,   setDescription]   = useState('');
  const [category,      setCategory]      = useState('Technology & Software');
  const [privacy,       setPrivacy]       = useState('public');
  const [adminApproval,  setAdminApproval]  = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [coverImg,      setCoverImg]      = useState('');
  const [groupImg,      setGroupImg]      = useState('');
  const coverInputRef = useRef(null);
  const photoInputRef = useRef(null);

  function handleCoverChange(e) {
    const f = e.target.files?.[0];
    if (f) setCoverImg(URL.createObjectURL(f));
  }
  function handlePhotoChange(e) {
    const f = e.target.files?.[0];
    if (f) setGroupImg(URL.createObjectURL(f));
  }

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onFeedClick?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages')  onMessagesClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  return (
    <div className="cg-page">
      <AnimatedNav activeId="friends" onNavigate={navClick} />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      {/* Main content */}
      <div className="cg-content">

        {/* Cover + Group Photo */}
        <div className="adm-cover-section">
          <div className="adm-cover">
            <img
              src={coverImg || 'https://picsum.photos/seed/cg-new-cover/1200/300'}
              alt="Group cover"
              className="adm-cover-img"
            />
            <button className="adm-edit-cover-btn" onClick={() => coverInputRef.current?.click()}>
              <EditIcon /> Edit Cover
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
          </div>
          <div className="adm-profile-row">
            <div className="adm-group-photo-area">
              <img
                src={groupImg || 'https://picsum.photos/seed/cg-new-gp/120/120'}
                alt="Group photo"
                className="adm-group-photo-img"
              />
              <button className="adm-edit-photo-btn" onClick={() => photoInputRef.current?.click()}>
                <EditIcon />
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>
            <div className="adm-group-info">
              <span className="adm-breadcrumb">NEW GROUP</span>
              <h1 className="adm-title">{groupName || 'Untitled Group'}</h1>
              <p className="adm-subtitle">Upload a cover and group photo above</p>
            </div>
          </div>
        </div>

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
                <label className="cg-label">Group Mission</label>
                <input className="cg-input" placeholder="e.g. Empowering designers to build scalable systems" value={mission} onChange={e => setMission(e.target.value)} maxLength={100} />
                <p className="cg-hint">A one-line purpose statement for your group. Max 100 characters.</p>
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
const HUB_CATEGORIES = ['All Hubs', 'Technology', 'Design', 'Business', 'Education', 'Health', 'Science', 'Finance', 'Arts'];

const HUB_GROUPS = [
  { id: 1,  name: 'Neural Interface Labs',   category: 'Technology', members: '14.2k members', memberCount: 14200, coverImg: 'https://picsum.photos/seed/hub-neural/400/200',  iconText: 'NI', color: '#2563eb', tab: 'suggested', privacy: 'public',  createdAt: 'February 8, 2022',   admin: 'Lena Hartmann',  mission: 'Push the boundary between human cognition and machine intelligence.',     description: 'Neural Interface Labs is a research-driven community for engineers, neuroscientists, and AI practitioners exploring brain-computer interfaces, neural decoding, and next-gen human-machine interaction. We share papers, tools, and collaborate on open research.' },
  { id: 2,  name: 'Quantum Finance Guild',   category: 'Finance',    members: '8.7k members',  memberCount: 8700,  coverImg: 'https://picsum.photos/seed/hub-quantum/400/200', iconText: 'QF', color: '#7c3aed', tab: 'suggested', privacy: 'private', createdAt: 'September 3, 2021',  admin: 'Ravi Menon',     mission: 'Apply quantum computing to financial modelling and risk.',                description: 'The Quantum Finance Guild connects quants, mathematicians, and fintech engineers exploring quantum algorithms for portfolio optimisation, derivatives pricing, and high-frequency trading. Private group — verified finance professionals only.' },
  { id: 3,  name: 'BioSynth Research',       category: 'Science',    members: '5.1k members',  memberCount: 5100,  coverImg: 'https://picsum.photos/seed/hub-bio/400/200',     iconText: 'BR', color: '#059669', tab: 'suggested', privacy: 'public',  createdAt: 'April 17, 2023',     admin: 'Dr. Yuki Tanaka', mission: 'Accelerate synthetic biology through open collaboration.',              description: 'BioSynth Research brings together biologists, chemists, and computational scientists working on engineered biological systems. Members share protocols, discuss CRISPR tooling, and collaborate on open-source biology projects.' },
  { id: 4,  name: 'Digital Arts Collective', category: 'Design',     members: '11.3k members', memberCount: 11300, coverImg: 'https://picsum.photos/seed/hub-arts/400/200',    iconText: 'DA', color: '#db2777', tab: 'suggested', privacy: 'public',  createdAt: 'June 1, 2021',       admin: 'Mira Osei',      mission: 'Celebrate digital creativity in every medium.',                          description: 'The Digital Arts Collective is a vibrant space for illustrators, motion designers, 3D artists, and generative art creators. Share your work, get critique, explore new tools, and collaborate on community art projects and exhibitions.' },
  { id: 5,  name: 'Infratech Alliance',      category: 'Technology', members: '9.8k members',  memberCount: 9800,  coverImg: 'https://picsum.photos/seed/hub-infra/400/200',   iconText: 'IA', color: '#0891b2', tab: 'suggested', privacy: 'public',  createdAt: 'November 12, 2022',  admin: 'Chen Wei',       mission: 'Redefine infrastructure with open, scalable, cloud-native patterns.',    description: 'Infratech Alliance is the go-to community for DevOps engineers, SREs, and platform teams. Discussions cover Kubernetes, Terraform, observability, CI/CD, and modern infrastructure patterns. A collaborative space for sharing runbooks, incident postmortems, and tooling reviews.' },
  { id: 6,  name: 'CryptoVault Network',     category: 'Finance',    members: '18.5k members', memberCount: 18500, coverImg: 'https://picsum.photos/seed/hub-crypto/400/200',  iconText: 'CV', color: '#d97706', tab: 'suggested', privacy: 'public',  createdAt: 'January 20, 2021',   admin: 'Andre Volta',    mission: 'Decode the future of decentralised finance for everyone.',               description: 'CryptoVault Network is one of the largest DeFi communities on the platform. Members analyse on-chain data, debate protocol governance, share alpha, and break down complex financial instruments in plain language. All experience levels welcome.' },
  { id: 7,  name: 'Health Matrix',           category: 'Health',     members: '6.4k members',  memberCount: 6400,  coverImg: 'https://picsum.photos/seed/hub-health/400/200',  iconText: 'HM', color: '#16a34a', tab: 'suggested', privacy: 'public',  createdAt: 'March 9, 2023',      admin: 'Dr. Priya Sood', mission: 'Empower individuals with data-driven health and wellness knowledge.',     description: 'Health Matrix is a science-first wellness community for doctors, researchers, fitness professionals, and health-curious individuals. We discuss evidence-based nutrition, longevity research, mental health, and the quantified self movement.' },
  { id: 8,  name: 'Edu Nexus Academy',       category: 'Education',  members: '21.0k members', memberCount: 21000, coverImg: 'https://picsum.photos/seed/hub-edu/400/200',     iconText: 'EN', color: '#4f46e5', tab: 'suggested', privacy: 'public',  createdAt: 'August 5, 2020',     admin: 'James Okafor',   mission: 'Make quality education accessible and collaborative for all.',            description: 'Edu Nexus Academy connects educators, learners, and ed-tech builders. Share learning resources, discuss pedagogy, build study groups, and explore the latest trends in online education, MOOCs, and adaptive learning technologies.' },
  { id: 9,  name: 'Open Source Forge',       category: 'Technology', members: '1.2k members',  memberCount: 1200,  coverImg: 'https://picsum.photos/seed/hub-oss/400/200',     iconText: 'OS', color: '#2563eb', tab: 'yours',     privacy: 'public',  pendingReqs: 0,  createdAt: 'March 14, 2023',  admin: 'Alex Vanguard',  mission: 'Accelerate open-source adoption by connecting contributors worldwide.',   description: 'Open Source Forge is a collaborative hub for developers passionate about open-source software. We share projects, review code, host sprints, and mentor new contributors across all technology stacks.' },
  { id: 10, name: 'Digital Artists Hub',     category: 'Design',     members: '1.1k members',  memberCount: 1100,  coverImg: 'https://picsum.photos/seed/hub-dart/400/200',    iconText: 'DH', color: '#db2777', tab: 'yours',     privacy: 'private', pendingReqs: 7,  createdAt: 'July 2, 2023',    admin: 'Alex Vanguard',  mission: 'Celebrate and elevate digital art in all its forms.',                    description: 'A private creative space for digital artists to share work-in-progress, get constructive critique, discover tools, and collaborate on commissions and exhibitions.' },
  { id: 14, name: 'Full-Stack Builders',     category: 'Technology', members: '874 members',   memberCount: 874,   coverImg: 'https://picsum.photos/seed/hub-fsb/400/200',     iconText: 'FB', color: '#0891b2', tab: 'yours',     privacy: 'public',  pendingReqs: 0,  createdAt: 'January 9, 2024', admin: 'Alex Vanguard',  mission: 'Bridge the gap between frontend craft and backend engineering.',          description: 'Full-Stack Builders brings together engineers who love the entire stack. From API design to pixel-perfect UIs, we dive deep into architecture patterns, performance tuning, and real-world project challenges.' },
  { id: 11, name: 'UX Design Masters',       category: 'Design',     members: '3.5k members',  memberCount: 3500,  coverImg: 'https://picsum.photos/seed/hub-ux/400/200',      iconText: 'UX', color: '#7c3aed', tab: 'joined',    joined: true, privacy: 'public',  createdAt: 'May 22, 2022',      admin: 'Fatima Al-Rashid', mission: 'Master every facet of user experience design.',                          description: 'UX Design Masters is a practitioner community for UX researchers, interaction designers, and product designers. Monthly design challenges, critique sessions, job boards, and deep dives into research methodologies keep the community sharp.' },
  { id: 12, name: 'Modern Stack Devs',       category: 'Technology', members: '12.4k members', memberCount: 12400, coverImg: 'https://picsum.photos/seed/hub-stack/400/200',   iconText: 'MS', color: '#0891b2', tab: 'joined',    joined: true, privacy: 'public',  createdAt: 'October 14, 2021',  admin: 'Soren Bjerg',    mission: 'Ship faster by sharing what actually works in production.',              description: 'Modern Stack Devs is a no-fluff engineering community where developers share real-world experiences with React, Next.js, TypeScript, Bun, and everything in between. Candid discussions about tooling, architecture trade-offs, and career growth.' },
  { id: 13, name: 'Beat Makers Collective',  category: 'Arts',       members: '22.9k members', memberCount: 22900, coverImg: 'https://picsum.photos/seed/hub-beats/400/200',   iconText: 'BM', color: '#d97706', tab: 'joined',    joined: true, privacy: 'public',  createdAt: 'July 30, 2020',     admin: 'DJ NovaCast',    mission: 'Connect music producers and grow the global beat-making community.',     description: 'Beat Makers Collective is the largest music production community on the platform. Share your beats, get feedback, collaborate with artists worldwide, discuss DAWs, sample packs, and the business side of music production.' },
];

const MODAL_CONTACTS = [
  { id: '1', name: 'Sarah Jenkins',   role: 'Product Designer',  color: '#b45309' },
  { id: '2', name: 'Marcus Chen',     role: 'Senior Engineer',   color: '#1d4ed8' },
  { id: '3', name: 'Elena Rodriguez', role: 'Marketing Lead',    color: '#be185d' },
  { id: '4', name: 'David Park',      role: 'Community Manager', color: '#6d28d9' },
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

/* ══════════════════════════
   Group Detail Page
══════════════════════════ */
const GD_MEMBERS = [
  { id: 1, name: 'Sarah Jenkins',  role: 'Admin',     joined: 'Oct 2023', img: 'https://i.pravatar.cc/56?img=1',  isFriend: true  },
  { id: 2, name: 'Marcus Thorne',  role: 'Moderator', joined: 'Nov 2023', img: 'https://i.pravatar.cc/56?img=3',  isFriend: false },
  { id: 3, name: 'Alex Rivera',    role: 'Member',    joined: 'Jan 2024', img: 'https://i.pravatar.cc/56?img=5',  isFriend: true  },
  { id: 4, name: 'Elena Vance',    role: 'Member',    joined: 'Feb 2024', img: 'https://i.pravatar.cc/56?img=9',  isFriend: false },
  { id: 5, name: 'James Okafor',   role: 'Member',    joined: 'Mar 2024', img: 'https://i.pravatar.cc/56?img=12', isFriend: false },
  { id: 6, name: 'Priya Sharma',   role: 'Member',    joined: 'Apr 2024', img: 'https://i.pravatar.cc/56?img=16', isFriend: true  },
  { id: 7, name: 'Tom Barker',     role: 'Member',    joined: 'May 2024', img: 'https://i.pravatar.cc/56?img=21', isFriend: false },
  { id: 8, name: 'Nina Petrova',   role: 'Member',    joined: 'Jun 2024', img: 'https://i.pravatar.cc/56?img=25', isFriend: true  },
];

function GroupDetailPage({ group, onBack, onManage, onFeedClick, onEventsClick, onCalendarClick, onMessagesClick, onLibraryClick, onCoursesClick, onMinisitesClick }) {
  const [detailTab,    setDetailTab]    = useState('about');
  const [joinedLocal,  setJoinedLocal]  = useState(group.joined || false);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onFeedClick?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onBack?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  const isOwned = group.tab === 'yours';
  const isPrivate = group.privacy === 'private';

  return (
    <div className="gd-page">
      <AnimatedNav activeId="friends" onNavigate={navClick} />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      {/* Cover */}
      <div className="gd-cover-section">
        <div className="gd-cover">
          <img src={group.coverImg} alt={group.name} className="gd-cover-img" />
          <button className="gd-cover-back-btn" onClick={onBack} title="Back to Groups">
            <BackArrowIcon />
          </button>
        </div>

        {/* Profile row */}
        <div className="gd-profile-row">
          <div className="gd-group-icon" style={{ background: group.color }}>{group.iconText}</div>
          <div className="gd-group-info">
            <h1 className="gd-title">{group.name}</h1>
            <p className="gd-meta">
              {isPrivate ? <><LockIcon /> Private</> : <><GlobeIcon /> Public</>}
              <span className="gd-meta-dot">·</span>
              {group.category}
              <span className="gd-meta-dot">·</span>
              {group.members}
            </p>
          </div>
          <div className="gd-header-actions">
            {isOwned ? (
              <button className="gd-manage-btn" onClick={onManage}>Manage Group</button>
            ) : (
              <button
                className={`gd-join-btn${joinedLocal ? ' gd-join-btn--joined' : ''}`}
                onClick={() => setJoinedLocal(v => !v)}
              >
                {joinedLocal ? 'Leave Group' : 'Join Group'}
              </button>
            )}
            <button className="gd-share-btn"><ShareIcon2 /> Share</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="gd-tab-row">
        <button className={`gd-tab${detailTab === 'about'   ? ' gd-tab--active' : ''}`} onClick={() => setDetailTab('about')}>About</button>
        <button className={`gd-tab${detailTab === 'posts'   ? ' gd-tab--active' : ''}`} onClick={() => setDetailTab('posts')}>Posts</button>
        <button className={`gd-tab${detailTab === 'members' ? ' gd-tab--active' : ''}`} onClick={() => setDetailTab('members')}>Members</button>
      </div>

      {/* Body */}
      <div className="gd-body">

        {/* ── About tab ── */}
        {detailTab === 'about' && (
          <>
            <div className="gd-main">
              <div className="gd-card">
                <h3 className="gd-card-title">About this Group</h3>
                <p className="gd-card-text">{group.description || 'No description provided.'}</p>
              </div>
              {group.mission && (
                <div className="gd-card">
                  <h3 className="gd-card-title">Group Mission</h3>
                  <p className="gd-card-text gd-mission-text">{group.mission}</p>
                </div>
              )}
            </div>
            <div className="gd-sidebar">
              <div className="gd-card">
                <h3 className="gd-card-title">Group Info</h3>
                <div className="gd-info-rows">
                  <div className="gd-info-row">
                    {isPrivate ? <LockIcon /> : <GlobeIcon />}
                    <div>
                      <p className="gd-info-label">{isPrivate ? 'Private Group' : 'Public Group'}</p>
                      <p className="gd-info-sub">{isPrivate ? 'Only members can see posts' : 'Anyone can view and join'}</p>
                    </div>
                  </div>
                  <div className="gd-info-row">
                    <UsersIcon />
                    <div>
                      <p className="gd-info-label">{group.members}</p>
                      <p className="gd-info-sub">Total members</p>
                    </div>
                  </div>
                  {group.createdAt && (
                    <div className="gd-info-row">
                      <InfoCircleIcon />
                      <div>
                        <p className="gd-info-label">Created {group.createdAt}</p>
                        <p className="gd-info-sub">Group history</p>
                      </div>
                    </div>
                  )}
                  {group.admin && (
                    <div className="gd-info-row">
                      <OrganizerIcon />
                      <div>
                        <p className="gd-info-label">{group.admin}</p>
                        <p className="gd-info-sub">Group Admin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Posts tab ── */}
        {detailTab === 'posts' && (
          <>
            <div className="gd-main">
              {ADMIN_POSTS.map(post => (
                <div key={post.id} className="adm-post-card">
                  <div className="adm-post-header">
                    <img src={post.avatar} alt={post.author} className="adm-post-avatar" />
                    <div className="adm-post-meta">
                      <div className="adm-post-author-row">
                        <span className="adm-post-author">{post.author}</span>
                        {post.badge && <span className={`adm-post-badge ${post.badgeCls}`}>{post.badge}</span>}
                      </div>
                      <span className="adm-post-time">{post.time}</span>
                    </div>
                  </div>
                  {post.alert ? (
                    <div className="adm-post-alert-box">{post.alertText}</div>
                  ) : (
                    <>
                      <p className="adm-post-text">{post.text}</p>
                      {post.img && <img src={post.img} alt="post" className="adm-post-img" />}
                    </>
                  )}
                  <div className="adm-post-footer">
                    <span className="adm-post-stat"><HeartIcon /> {post.likes}</span>
                    <span className="adm-post-stat"><ChatIcon /> {post.comments}</span>
                    <span className="adm-post-stat"><ShareIcon2 /> Share</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="gd-sidebar">
              <div className="gd-card">
                <h3 className="gd-card-title">Group Info</h3>
                <div className="gd-info-rows">
                  <div className="gd-info-row">
                    {isPrivate ? <LockIcon /> : <GlobeIcon />}
                    <div>
                      <p className="gd-info-label">{isPrivate ? 'Private Group' : 'Public Group'}</p>
                      <p className="gd-info-sub">{isPrivate ? 'Only members can see posts' : 'Anyone can view and join'}</p>
                    </div>
                  </div>
                  <div className="gd-info-row">
                    <UsersIcon />
                    <div>
                      <p className="gd-info-label">{group.members}</p>
                      <p className="gd-info-sub">Total members</p>
                    </div>
                  </div>
                  {group.admin && (
                    <div className="gd-info-row">
                      <OrganizerIcon />
                      <div>
                        <p className="gd-info-label">{group.admin}</p>
                        <p className="gd-info-sub">Group Admin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Members tab ── */}
        {detailTab === 'members' && (
          <div className="gd-members-section">
            <div className="gd-members-grid">
              {GD_MEMBERS.map(m => (
                <div key={m.id} className="gd-member-card">
                  <img src={m.img} alt={m.name} className="gd-member-av" />
                  <div className="gd-member-info">
                    <p className="gd-member-name">{m.name}</p>
                    <p className="gd-member-role">{m.role}</p>
                    <p className="gd-member-joined">Joined {m.joined}</p>
                  </div>
                  <div className="gd-member-actions">
                    <button className="gd-act-btn gd-act-btn--chat" title="Message"><ChatIcon /></button>
                    {!m.isFriend && <button className="gd-act-btn gd-act-btn--add" title="Add friend"><InviteIcon /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function OrganizerIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }

/* ── Group Hub Card ── */
function GroupHubCard({ group, onManage, onView }) {
  const [joined, setJoined] = useState(group.joined || false);
  const isOwned = group.tab === 'yours';

  return (
    <div className="hub-card hub-card--clickable" onClick={onView}>
      <div className="hub-card-cover">
        <img src={group.coverImg} alt={group.name} className="hub-card-cover-img" />
        <span className="hub-card-badge">{group.category}</span>
        {isOwned && group.privacy === 'private' && group.pendingReqs > 0 && (
          <span className="hub-card-pending" onClick={e => { e.stopPropagation(); onManage?.(); }}>{group.pendingReqs} pending</span>
        )}
      </div>
      <div className="hub-card-icon-wrap">
        <div className="hub-card-icon" style={{ background: group.color }}>{group.iconText}</div>
        {isOwned && <span className="hub-card-owner-badge">Admin</span>}
      </div>
      <div className="hub-card-body">
        <p className="hub-card-name">{group.name}</p>

        {isOwned ? (
          <>
            <div className="hub-card-stats">
              <div className="hub-card-stat">
                <span className="hub-card-stat-value">{group.memberCount.toLocaleString()}</span>
                <span className="hub-card-stat-label">Active Members</span>
              </div>
              {group.privacy === 'private' && (
                <>
                  <div className="hub-card-stat-div" />
                  <div className="hub-card-stat">
                    <span className={`hub-card-stat-value${group.pendingReqs > 0 ? ' hub-card-stat-value--alert' : ''}`}>
                      {group.pendingReqs}
                    </span>
                    <span className="hub-card-stat-label">Pending Requests</span>
                  </div>
                </>
              )}
            </div>
            <button className="hub-card-manage" onClick={e => { e.stopPropagation(); onManage?.(); }}>
              Manage Group
            </button>
          </>
        ) : (
          <>
            <p className="hub-card-members"><UsersIcon /> {group.members}</p>
            <button
              className={`hub-card-join${joined ? ' hub-card-join--joined' : ''}`}
              onClick={e => { e.stopPropagation(); setJoined(v => !v); }}
            >
              {joined ? 'Joined' : 'Join Group'}
            </button>
          </>
        )}
      </div>
    </div>
  );
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
export default function GroupsPage({ onBack, onEventsClick, onCalendarClick, onMessagesClick, onLibraryClick, onCoursesClick, onMinisitesClick }) {
  const [modalOpen,      setModalOpen]      = useState(false);
  const [showCreate,     setShowCreate]     = useState(false);
  const [showAdmin,      setShowAdmin]      = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [showDetail,     setShowDetail]     = useState(false);
  const [adminGroup,     setAdminGroup]     = useState(null);
  const [detailGroup,    setDetailGroup]    = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [hubTab,         setHubTab]         = useState('suggested');
  const [hubCat,         setHubCat]         = useState('All Hubs');

  if (showCreate) {
    return (
      <CreateGroupPage
        onBack={() => setShowCreate(false)}
        onFeedClick={onBack}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onMessagesClick={onMessagesClick}
        onLibraryClick={onLibraryClick}
        onCoursesClick={onCoursesClick}
        onMinisitesClick={onMinisitesClick}
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
        onLibraryClick={onLibraryClick}
        onCoursesClick={onCoursesClick}
        onMinisitesClick={onMinisitesClick}
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
        onLibraryClick={onLibraryClick}
        onCoursesClick={onCoursesClick}
        onMinisitesClick={onMinisitesClick}
        onModerationClick={() => setShowModeration(true)}
      />
    );
  }

  if (showDetail) {
    return (
      <GroupDetailPage
        group={detailGroup}
        onBack={() => setShowDetail(false)}
        onManage={() => { setAdminGroup(detailGroup); setShowDetail(false); setShowAdmin(true); }}
        onFeedClick={onBack}
        onEventsClick={onEventsClick}
        onCalendarClick={onCalendarClick}
        onMessagesClick={onMessagesClick}
        onLibraryClick={onLibraryClick}
        onCoursesClick={onCoursesClick}
        onMinisitesClick={onMinisitesClick}
      />
    );
  }

  function navClick(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onBack?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'calendar')  onCalendarClick?.();
    if (id === 'messages')  onMessagesClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  const displayGroups = HUB_GROUPS
    .filter(g => g.tab === hubTab)
    .filter(g => hubCat === 'All Hubs' || g.category === hubCat);

  return (
    <div className="grp-page">

      <AnimatedNav activeId="friends" onNavigate={navClick} />

      <main className="grp-hub-main">

        {/* Header: tabs + create button */}
        <div className="grp-hub-top">
          <div className="grp-hub-tabs">
            <button className={`grp-hub-tab${hubTab === 'suggested' ? ' grp-hub-tab--active' : ''}`} onClick={() => setHubTab('suggested')}>Suggested Groups</button>
            <button className={`grp-hub-tab${hubTab === 'yours'     ? ' grp-hub-tab--active' : ''}`} onClick={() => setHubTab('yours')}>Your Groups</button>
            <button className={`grp-hub-tab${hubTab === 'joined'    ? ' grp-hub-tab--active' : ''}`} onClick={() => setHubTab('joined')}>Joined Groups</button>
          </div>
          <button className="grp-hub-create-btn" onClick={() => setShowCreate(true)}>
            <PlusIcon /> Create Group
          </button>
        </div>

        {/* Category chips */}
        <div className="grp-hub-cats">
          {HUB_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`grp-hub-cat${hubCat === cat ? ' grp-hub-cat--active' : ''}`}
              onClick={() => setHubCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Group cards grid */}
        <div className="grp-hub-grid">
          {displayGroups.map(g => (
            <GroupHubCard
              key={g.id}
              group={g}
              onView={() => { setDetailGroup(g); setShowDetail(true); }}
              onManage={g.tab === 'yours' ? () => { setAdminGroup(g); setShowAdmin(true); } : undefined}
            />
          ))}
          {displayGroups.length === 0 && (
            <p className="grp-hub-empty">No groups found in this category.</p>
          )}
        </div>

        {/* Status bar */}
        <div className="grp-hub-footer">
          <span className="grp-hub-status">
            <span className="grp-hub-status-dot" />
            SYSTEM STATUS &bull; ALL NODES OPERATIONAL
          </span>
          <span className="grp-hub-footer-sep">|</span>
          <span className="grp-hub-total">TOTAL USERS 148,298</span>
        </div>

      </main>

      {modalOpen && <CreateGroupModal onClose={() => setModalOpen(false)} />}
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

    </div>
  );
}
