import { useState, useRef, useEffect } from 'react';
import './MessagesPage.css';
import AnimatedNav from './AnimatedNav';
import CreatePostModal from './CreatePostModal';

/* ── App nav icons ── */
function FeedNavIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function EventNavIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function GroupsNavIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CalendarNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MessagesNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }

/* ── UI icons ── */
function SearchIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function ComposeIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function CheckIcon()       { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function DoubleCheckIcon() { return <svg width="16" height="13" viewBox="0 0 28 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 7 5 11 13 3"/><polyline points="9 7 13 11 21 3"/></svg>; }
function PlusCircleIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function AttachPlusIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function ImageIcon()       { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function EmojiIcon()       { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>; }
function MicIcon()         { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>; }
function SendIcon()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function ChevronRightIcon(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
function BlockIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>; }
function AlertIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
function ReadCheckIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>; }
function BackArrowIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function UploadIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function DownloadIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function InfoIcon()        { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>; }
function LinkItemIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>; }
function DocDownloadIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function PdfIcon()         { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function DocxIcon()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function XlsxIcon()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>; }
function PptxIcon()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }

const SA_TABS = [
  { id: 'media', label: 'Media', count: 142 },
  { id: 'links', label: 'Links', count: 58  },
  { id: 'docs',  label: 'Docs',  count: 24  },
];

const MEDIA_ITEMS = Array.from({ length: 6 }, (_, i) => ({ id: String(i + 1) }));

const LINKS_DATA = [
  { id: '1', title: 'Figma – Modern UI Design System', domain: 'figma.com',       sharedBy: 'Sarah', time: '2 hours ago' },
  { id: '2', title: 'React Documentation',             domain: 'react.dev',        sharedBy: 'Sarah', time: 'Oct 24'      },
  { id: '3', title: 'Tailwind CSS Tips',               domain: 'tailwindcss.com',  sharedBy: 'Sarah', time: 'Oct 23'      },
];

const DOCS_DATA = [
  { id: '1', name: 'Project Timeline – U4.pdf', size: '1.2 MB',  sharedBy: 'Sarah Jenkins', time: '2 hours ago', type: 'pdf'  },
  { id: '2', name: 'Design Feedback.docx',       size: '850 KB',  sharedBy: 'Sarah Jenkins', time: 'Oct 22',      type: 'docx' },
  { id: '3', name: 'Budget Estimates.xlsx',       size: '2.4 MB',  sharedBy: 'Sarah Jenkins', time: 'Oct 20',      type: 'xlsx' },
  { id: '4', name: 'Pitch Deck Final.pptx',       size: '15.8 MB', sharedBy: 'Sarah Jenkins', time: 'Oct 18',      type: 'pptx' },
];

const DOC_TYPE_META = {
  pdf:  { icon: <PdfIcon />,  color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  docx: { icon: <DocxIcon />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  xlsx: { icon: <XlsxIcon />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  pptx: { icon: <PptxIcon />, color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
};

/* ── Upload Assets Modal ── */
const UPLOADED_THUMBS = [
  'linear-gradient(135deg,#1e3a5f,#2563eb)',
  'linear-gradient(135deg,#1a1040,#7c3aed)',
  'linear-gradient(135deg,#0f2a1e,#065f46)',
  'linear-gradient(135deg,#0c2a2a,#0f766e)',
  'linear-gradient(135deg,#1a1a2e,#374151)',
];

function UploadAssetsModal({ onClose }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="ua-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="ua-header">
          <h2 className="ua-title">Upload New Assets</h2>
          <button className="ua-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Drop zone */}
        <div
          className={`ua-dropzone${dragging ? ' ua-dropzone--active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); }}
        >
          <div className="ua-cloud-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
          </div>
          <p className="ua-drop-title">Drag and drop your assets here</p>
          <p className="ua-drop-sub">Support for JPG, PNG, and MP4 up to 50MB</p>
          <button className="ua-browse-btn">Browse Files</button>
        </div>

        {/* Uploaded files */}
        <div className="ua-uploaded-section">
          <div className="ua-uploaded-header">
            <span className="ua-uploaded-label">SUCCESSFULLY UPLOADED (5)</span>
            <span className="ua-uploaded-size">2.4 MB total</span>
          </div>
          <div className="ua-thumbs">
            {UPLOADED_THUMBS.map((bg, i) => (
              <div key={i} className="ua-thumb" style={{ background: bg }} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="ua-footer">
          <button className="ua-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ua-done-btn" onClick={onClose}>Done</button>
        </div>

      </div>
    </div>
  );
}

function SharedAssetsView({ conv, onBack }) {
  const [tab, setTab]         = useState('media');
  const [uploadOpen, setUpload] = useState(false);
  const usedGB  = 6.2;
  const totalGB = 10;
  const pct     = Math.round((usedGB / totalGB) * 100);

  return (
    <div className="sa-wrap">
      {/* Main area */}
      <div className="sa-main">
        {/* Back link */}
        <button className="sa-back-btn" onClick={onBack}>
          <BackArrowIcon /> Back to Chat
        </button>

        {/* Header */}
        <h1 className="sa-title">Shared Assets</h1>
        <p className="sa-subtitle">
          Assets shared in conversation with{' '}
          <span className="sa-conv-name">{conv.name}</span>
        </p>

        {/* Tabs */}
        <div className="sa-tabs">
          {SA_TABS.map(t => (
            <button
              key={t.id}
              className={`sa-tab${tab === t.id ? ' sa-tab--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label} <span className="sa-tab-count">({t.count})</span>
            </button>
          ))}
        </div>
        <div className="sa-tab-underline" />

        {/* ── Media tab ── */}
        {tab === 'media' && (
          <div className="sa-media-grid">
            {MEDIA_ITEMS.map(item => (
              <div key={item.id} className="sa-media-thumb">
                <div className="sa-media-img" />
              </div>
            ))}
          </div>
        )}

        {/* ── Links tab ── */}
        {tab === 'links' && (
          <div className="sa-list">
            {LINKS_DATA.map(link => (
              <div key={link.id} className="sa-link-item">
                <div className="sa-link-icon">
                  <LinkItemIcon />
                </div>
                <div className="sa-link-body">
                  <p className="sa-link-title">{link.title}</p>
                  <p className="sa-link-domain">{link.domain}</p>
                </div>
                <div className="sa-link-meta">
                  <span className="sa-link-shared">Shared by <strong>{link.sharedBy}</strong></span>
                  <div className="sa-link-time-row">
                    <span className="sa-link-time">{link.time}</span>
                    <div className="sa-link-avatar" style={{ background: conv.color }}>
                      {initials(conv.name)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Docs tab ── */}
        {tab === 'docs' && (
          <div className="sa-list">
            {DOCS_DATA.map(doc => {
              const meta = DOC_TYPE_META[doc.type];
              return (
                <div key={doc.id} className="sa-doc-item">
                  <div className="sa-doc-icon" style={{ background: meta.bg, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div className="sa-doc-body">
                    <p className="sa-doc-name">{doc.name}</p>
                    <p className="sa-doc-meta">{doc.size} • Shared by {doc.sharedBy} • {doc.time}</p>
                  </div>
                  <button className="sa-doc-download" title="Download">
                    <DocDownloadIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* old placeholder kept below — will never render */}
        {false && (
          <div className="sa-empty-tab">
            <p>24 shared documents</p>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="sa-right">
        {/* Storage */}
        <div className="sa-panel">
          <div className="sa-panel-header">
            <span className="sa-panel-title">Storage Used</span>
            <button className="sa-upgrade-btn">Upgrade</button>
          </div>
          <p className="sa-storage-nums">
            <span className="sa-storage-used">{usedGB} GB</span>
            <span className="sa-storage-total"> of {totalGB} GB</span>
          </p>
          <div className="sa-progress-track">
            <div className="sa-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="sa-storage-note">
            <InfoIcon />
            <span>{conv.name.split(' ')[0]} has contributed <strong>2.4 GB</strong> to this share.</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="sa-panel">
          <p className="sa-quick-title">QUICK ACTIONS</p>
          <button className="sa-action-btn sa-action-btn--primary" onClick={() => setUpload(true)}>
            <UploadIcon /> Upload New
          </button>
          <button className="sa-action-btn sa-action-btn--secondary">
            <DownloadIcon /> Download All
          </button>
        </div>
      </div>

      {uploadOpen && <UploadAssetsModal onClose={() => setUpload(false)} />}
    </div>
  );
}
function CameraIcon()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function CheckSmIcon()     { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function GroupNewIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function ArrowRightSmIcon(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }

const MODAL_CONTACTS = [
  { id: '1', name: 'Sarah Jenkins',   role: 'Product Designer',    color: '#b45309' },
  { id: '2', name: 'Marcus Chen',     role: 'Senior Engineer',     color: '#1d4ed8' },
  { id: '3', name: 'Elena Rodriguez', role: 'Marketing Lead',      color: '#be185d' },
  { id: '4', name: 'David Park',      role: 'Community Manager',   color: '#6d28d9' },
];

function NewMessageModal({ onClose, onStartConversation }) {
  const [view,        setView]        = useState('dm'); // 'dm' | 'group'
  const [search,      setSearch]      = useState('');
  const [groupName,   setGroupName]   = useState('');
  const [description, setDescription] = useState('');
  const [selected,    setSelected]    = useState([]);

  function toggleContact(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const filtered = MODAL_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelectDM(contact) {
    onStartConversation?.(contact);
    onClose();
  }

  function switchToGroup() {
    setSearch('');
    setSelected([]);
    setView('group');
  }

  function switchToDM() {
    setSearch('');
    setGroupName('');
    setDescription('');
    setSelected([]);
    setView('dm');
  }

  return (
    <div className="nm-overlay" onClick={onClose}>
      <div className="nm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="nm-header">
          <div>
            <h2 className="nm-title">{view === 'dm' ? 'New Message' : 'Create Group'}</h2>
            <p className="nm-subtitle">
              {view === 'dm' ? 'Search for someone to start a conversation.' : 'Set up a group chat with your contacts.'}
            </p>
          </div>
          <button className="nm-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="nm-body">
          {/* ── DM view ── */}
          {view === 'dm' && (
            <>
              <button className="nm-group-link" onClick={switchToGroup}>
                <GroupNewIcon /> Create New Group
              </button>

              <div className="nm-contact-search-wrap" style={{ marginBottom: 12 }}>
                <SearchIcon />
                <input
                  className="nm-contact-search"
                  placeholder="Search people..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="nm-contacts-section">
                <span className="nm-contacts-title">Suggested</span>
                <div className="nm-contact-list">
                  {filtered.map(c => (
                    <div
                      key={c.id}
                      className="nm-contact-item"
                      onClick={() => handleSelectDM(c)}
                    >
                      <div className="nm-contact-avatar" style={{ background: c.color }}>
                        {initials(c.name)}
                      </div>
                      <div className="nm-contact-info">
                        <p className="nm-contact-name">{c.name}</p>
                        <p className="nm-contact-role">{c.role}</p>
                      </div>
                      <ArrowRightSmIcon />
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p style={{ color: '#5c6a8c', fontSize: 13, padding: '8px 0' }}>No contacts found.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Group view ── */}
          {view === 'group' && (
            <>
              <div className="nm-form-row">
                <div className="nm-img-upload">
                  <CameraIcon />
                  <span className="nm-img-badge"><CheckSmIcon /></span>
                </div>
                <div className="nm-form-fields">
                  <div className="nm-field">
                    <label className="nm-label">Group Name</label>
                    <input
                      className="nm-input"
                      placeholder="Enter group name..."
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="nm-field">
                    <label className="nm-label">Description (Optional)</label>
                    <textarea
                      className="nm-textarea"
                      placeholder="What's this group about?"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="nm-contacts-section">
                <div className="nm-contacts-header">
                  <span className="nm-contacts-title">Add Members</span>
                  <div className="nm-contacts-right">
                    <div className="nm-contact-search-wrap">
                      <SearchIcon />
                      <input
                        className="nm-contact-search"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>
                    <button className="nm-select-all" onClick={() => setSelected(MODAL_CONTACTS.map(c => c.id))}>
                      Select All
                    </button>
                  </div>
                </div>
                <div className="nm-contact-list">
                  {filtered.map(c => {
                    const checked = selected.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        className={`nm-contact-item${checked ? ' nm-contact-item--selected' : ''}`}
                        onClick={() => toggleContact(c.id)}
                      >
                        <div className="nm-contact-avatar" style={{ background: c.color }}>
                          {initials(c.name)}
                        </div>
                        <div className="nm-contact-info">
                          <p className="nm-contact-name">{c.name}</p>
                          <p className="nm-contact-role">{c.role}</p>
                        </div>
                        <div className={`nm-checkbox${checked ? ' nm-checkbox--checked' : ''}`}>
                          {checked && <CheckSmIcon />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="nm-footer">
          {view === 'dm' ? (
            <button className="nm-cancel-btn" onClick={onClose}>Cancel</button>
          ) : (
            <>
              <button className="nm-cancel-btn" onClick={switchToDM}>Back</button>
              <button className="nm-create-btn" disabled={!groupName.trim() || selected.length === 0}>
                Create Group <ArrowRightSmIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const MSG_NAV = [
  { id: 'feed',     label: 'Feed',     icon: <FeedNavIcon /> },
  { id: 'event',    label: 'Event',    icon: <EventNavIcon /> },
  { id: 'groups',   label: 'Groups',   icon: <GroupsNavIcon /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarNavIcon /> },
  { id: 'messages', label: 'Messages', icon: <MessagesNavIcon />, active: true },
];

const TABS = ['All', 'Unread', 'Groups', 'Online'];

const CONVERSATIONS = [
  { id: '1', name: 'Sarah Jenkins',   color: '#b45309', time: '10:42 AM', preview: "That sounds perfect! Let's...", online: true,  unread: false, badge: 0, role: 'Senior Product Designer' },
  { id: '2', name: 'Marcus Chen',     color: '#1d4ed8', time: 'Yesterday', preview: 'Did you see the new design?',    online: true,  unread: true,  badge: 1, role: 'UI Designer' },
  { id: '3', name: 'Elena Rodriguez', color: '#be185d', time: 'Mon',       preview: 'The group meeting is at 2PM.',  online: false, unread: true,  badge: 1, role: 'Project Manager' },
  { id: '4', name: "Liam O'Connell",  color: '#6d28d9', time: 'Mar 12',    preview: 'Did you see the new community...', online: false, unread: false, badge: 0, role: 'Developer' },
  { id: '5', name: 'Sofia Rodriguez', color: '#0e7490', time: 'Mar 10',    preview: 'That video was incredible!',    online: true,  unread: false, badge: 0, role: 'Content Creator' },
];

const MESSAGES_DATA = {
  '1': [
    { id: '1', from: 'them', text: 'Hey! Are you free to discuss the new project timeline later this afternoon?', time: '10:30 AM' },
    { id: '2', from: 'me',   text: 'Absolutely! I just finished reviewing the drafts you sent over. They look incredible.', time: '10:32 AM', read: true },
    { id: '3', from: 'me',   type: 'image', time: '10:33 AM', read: true },
    { id: '4', from: 'them', text: "That sounds perfect! Let's jump on a call and finalize the details.", time: '10:35 AM' },
  ],
  '2': [
    { id: '1', from: 'them', text: 'Did you see the new design? I just pushed the updates.', time: 'Yesterday' },
  ],
  '3': [
    { id: '1', from: 'them', text: 'The group meeting is at 2PM. Don\'t forget!', time: 'Mon' },
  ],
};

const QUICK_ONLINE = [
  { id: '1', name: 'Sarah Jenkins',  color: '#b45309' },
  { id: '2', name: 'Avery Sterling', color: '#0e7490' },
  { id: '3', name: 'Sofia Rodriguez',color: '#be185d' },
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

export default function MessagesPage({ onBack, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onCoursesClick, onMinisitesClick }) {
  const [tab, setTab]           = useState('All');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [search, setSearch]     = useState('');
  const [activeConv, setActiveConv] = useState(null);
  const [chatKey, setChatKey]   = useState(0);
  const [inputMsg, setInputMsg] = useState('');
  const [newMsgOpen, setNewMsgOpen] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const messagesEndRef = useRef(null);

  function openConversation(conv) {
    setActiveConv(conv);
    setChatKey(k => k + 1);
    setShowAssets(false);
  }

  useEffect(() => {
    if (activeConv) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv]);

  const filtered = CONVERSATIONS.filter(c => {
    if (tab === 'Unread' && !c.unread) return false;
    if (tab === 'Online' && !c.online) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const messages = activeConv ? (MESSAGES_DATA[activeConv.id] || []) : [];

  /* ── Chat view ── */
  if (activeConv) {
    return (
      <div className="msg-page" style={{ overflow: showAssets ? 'auto' : undefined }}>
        <AnimatedNav
          activeId="messages"
          onNavigate={id => {
            if (id === 'create')   { setCreatePostOpen(true); return; }
            if (id === 'home')     onBack?.();
            if (id === 'courses')  onCoursesClick?.();
            if (id === 'library')  onLibraryClick?.();
            if (id === 'events')   onEventsClick?.();
            if (id === 'friends')  onGroupsClick?.();
            if (id === 'calendar')  onCalendarClick?.();
          if (id === 'minisites') onMinisitesClick?.();
          }}
        />
        {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

        {/* Compact conversation list */}
        <div className="msg-conv-panel">
          <div className="msg-conv-panel-header">
            <span className="msg-conv-panel-title">Messages</span>
            <button className="msg-compose-btn" title="New message" onClick={() => setNewMsgOpen(true)}><ComposeIcon /></button>
          </div>
          <div className="msg-conv-panel-list">
            {CONVERSATIONS.map(conv => (
              <div
                key={conv.id}
                className={`msg-compact-item${activeConv.id === conv.id ? ' msg-compact-item--active' : ''}`}
                onClick={() => openConversation(conv)}
              >
                <div className="msg-avatar-wrap">
                  <div className="msg-avatar msg-avatar--sm" style={{ background: conv.color }}>{initials(conv.name)}</div>
                  {conv.online && <span className="msg-online-dot" />}
                </div>
                <div className="msg-compact-body">
                  <div className="msg-compact-top">
                    <span className="msg-compact-name">{conv.name}</span>
                    <span className="msg-compact-time">{conv.time}</span>
                  </div>
                  <div className="msg-compact-bottom">
                    <span className="msg-compact-preview">{conv.preview}</span>
                    {conv.badge > 0 && <span className="msg-badge">{conv.badge}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAssets
          ? <SharedAssetsView conv={activeConv} onBack={() => setShowAssets(false)} />
          : <>
        {/* Chat area */}
        <div className="msg-chat-area" key={chatKey}>
          {/* Chat header */}
          <div className="msg-chat-header">
            <div className="msg-chat-header-user">
              <div className="msg-avatar-wrap">
                <div className="msg-avatar msg-avatar--md" style={{ background: activeConv.color }}>{initials(activeConv.name)}</div>
                {activeConv.online && <span className="msg-online-dot" />}
              </div>
              <div>
                <p className="msg-chat-name">{activeConv.name}</p>
                {activeConv.online
                  ? <p className="msg-chat-status msg-chat-status--online">● Online</p>
                  : <p className="msg-chat-status">Offline</p>
                }
              </div>
            </div>
            <button className="msg-chat-search-btn"><SearchIcon /></button>
          </div>

          {/* Messages */}
          <div className="msg-chat-messages">
            <div className="msg-date-sep"><span>TODAY</span></div>

            {messages.map(msg => (
              <div key={msg.id} className={`msg-bubble-row${msg.from === 'me' ? ' msg-bubble-row--me' : ''}`}>
                {msg.from === 'them' && (
                  <div className="msg-avatar msg-avatar--xs" style={{ background: activeConv.color, flexShrink: 0 }}>
                    {initials(activeConv.name)}
                  </div>
                )}
                <div className="msg-bubble-col">
                  {msg.type === 'image' ? (
                    <div className="msg-bubble-img-wrap">
                      <div className="msg-img-placeholder" />
                      <div className="msg-bubble-meta msg-bubble-meta--right">
                        <span className="msg-bubble-time">{msg.time}</span>
                        {msg.from === 'me' && msg.read && (
                          <span className="msg-read-check"><ReadCheckIcon /></span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={`msg-bubble${msg.from === 'me' ? ' msg-bubble--sent' : ' msg-bubble--received'}`}>
                      <p className="msg-bubble-text">{msg.text}</p>
                    </div>
                  )}
                  {msg.type !== 'image' && (
                    <div className={`msg-bubble-meta${msg.from === 'me' ? ' msg-bubble-meta--right' : ''}`}>
                      <span className="msg-bubble-time">{msg.time}</span>
                      {msg.from === 'me' && msg.read && (
                        <span className="msg-read-check"><ReadCheckIcon /></span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="msg-input-bar">
            <button className="msg-input-icon-btn"><AttachPlusIcon /></button>
            <button className="msg-input-icon-btn"><ImageIcon /></button>
            <input
              className="msg-input"
              type="text"
              placeholder="Type a message..."
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setInputMsg('')}
            />
            <button className="msg-input-icon-btn"><EmojiIcon /></button>
            <button className="msg-input-icon-btn"><MicIcon /></button>
            <button className={`msg-send-btn${inputMsg ? ' msg-send-btn--active' : ''}`}>
              <SendIcon />
            </button>
          </div>
        </div>

        {newMsgOpen && <NewMessageModal onClose={() => setNewMsgOpen(false)} onStartConversation={conv => { setNewMsgOpen(false); openConversation(conv); }} />}

        {/* Contact info panel */}
        <div className="msg-contact-panel" key={`panel-${chatKey}`}>
          <div className="msg-contact-avatar-wrap">
            <div className="msg-contact-avatar" style={{ background: activeConv.color }}>
              {initials(activeConv.name)}
            </div>
            {activeConv.online && <span className="msg-contact-online-dot" />}
          </div>
          <p className="msg-contact-name">{activeConv.name}</p>
          <p className="msg-contact-role">{activeConv.role}</p>

          {/* Media section */}
          <div className="msg-media-section">
            <div className="msg-media-header">
              <span className="msg-media-title">Media, Links, and Docs</span>
              <button className="msg-see-all" onClick={() => setShowAssets(true)}>See All</button>
            </div>
            <div className="msg-media-grid">
              <div className="msg-media-thumb msg-media-thumb--1" />
              <div className="msg-media-thumb msg-media-thumb--2" />
              <div className="msg-media-count">+12</div>
            </div>
          </div>

          {/* Actions */}
          <div className="msg-contact-actions">
            <button className="msg-action-item">
              <span className="msg-action-icon msg-action-icon--red"><BlockIcon /></span>
              <span className="msg-action-label">Block {activeConv.name.split(' ')[0]}</span>
              <ChevronRightIcon />
            </button>
            <button className="msg-action-item">
              <span className="msg-action-icon msg-action-icon--orange"><AlertIcon /></span>
              <span className="msg-action-label">Report Conversation</span>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        </>}
      </div>
    );
  }

  /* ── List view (no conversation selected) ── */
  return (
    <>
    <div className="msg-page">
      <AnimatedNav
        activeId="messages"
        onNavigate={id => {
          if (id === 'create')   { setCreatePostOpen(true); return; }
          if (id === 'home')     onBack?.();
          if (id === 'courses')  onCoursesClick?.();
          if (id === 'library')  onLibraryClick?.();
          if (id === 'events')   onEventsClick?.();
          if (id === 'friends')  onGroupsClick?.();
          if (id === 'calendar') onCalendarClick?.();
        }}
      />

      {newMsgOpen && <NewMessageModal onClose={() => setNewMsgOpen(false)} onStartConversation={conv => { setNewMsgOpen(false); openConversation(conv); }} />}

      <div className="msg-main">
        <div className="msg-header">
          <div className="msg-header-row">
            <div>
              <h1 className="msg-title">Messages</h1>
              <p className="msg-subtitle">Manage your private conversations</p>
            </div>
            <button className="msg-compose-btn msg-compose-btn--lg" title="New message" onClick={() => setNewMsgOpen(true)}><ComposeIcon /></button>
          </div>
        </div>

        <div className="msg-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`msg-tab${tab === t ? ' msg-tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="msg-search-wrap">
          <SearchIcon />
          <input
            className="msg-search"
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="msg-list">
          {filtered.map(conv => (
            <div
              key={conv.id}
              className={`msg-conv${conv.unread ? ' msg-conv--unread' : ''}`}
              onClick={() => openConversation(conv)}
            >
              <div className="msg-avatar-wrap">
                <div className="msg-avatar" style={{ background: conv.color }}>{initials(conv.name)}</div>
                {conv.online && <span className="msg-online-dot" />}
              </div>
              <div className="msg-conv-body">
                <div className="msg-conv-top">
                  <span className="msg-conv-name">{conv.name}</span>
                  <div className="msg-conv-meta">
                    <span className="msg-conv-time">{conv.time}</span>
                    {conv.unread && <span className="msg-unread-dot" />}
                  </div>
                </div>
                <div className="msg-conv-bottom">
                  <span className="msg-conv-preview">{conv.preview}</span>
                  <span className="msg-checks">
                    {conv.badge > 0 ? <DoubleCheckIcon /> : <CheckIcon />}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="msg-right">
        <div className="msg-panel">
          <div className="msg-panel-header">
            <span className="msg-panel-title">Quick Online</span>
            <button className="msg-view-all">View All</button>
          </div>
          <div className="msg-online-list">
            {QUICK_ONLINE.map(u => (
              <div key={u.id} className="msg-online-item">
                <div className="msg-online-avatar" style={{ background: u.color }}>{initials(u.name)}</div>
                <span className="msg-online-dot msg-online-dot--sm" />
              </div>
            ))}
            <button className="msg-online-add"><PlusCircleIcon /></button>
          </div>
        </div>

        <div className="msg-support-card">
          <p className="msg-support-title">Chat Support</p>
          <p className="msg-support-desc">Need help with your Flow? Our team is available 24/7 to assist you with any questions.</p>
          <button className="msg-support-btn">Open Help Center</button>
        </div>
      </div>
    </div>
    {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}
    </>
  );
}
