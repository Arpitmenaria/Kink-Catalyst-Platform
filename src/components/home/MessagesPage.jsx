import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MessagesPage.css';
import AnimatedNav from './AnimatedNav';
import CreatePostModal from './CreatePostModal';
import {
  fetchConversations, fetchMessages, sendMessage, markRead,
  startDM, createGroup, fetchAssets, uploadAssets,
  toggleBlock, reportConversation, fetchOnlineUsers, clearUnread, clearPendingOpenConv,
} from '../../store/slices/messagesSlice';
import { fetchSuggestions } from '../../store/slices/usersSlice';
import {
  joinConversation, leaveConversation,
  emitTypingStart, emitTypingStop, onUserTyping, onUserStoppedTyping,
} from '../../services/socket';

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
  { id: 'media', label: 'Media' },
  { id: 'links', label: 'Links' },
  { id: 'docs',  label: 'Docs'  },
];

const DOC_TYPE_META = {
  pdf:  { icon: <PdfIcon />,  color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  docx: { icon: <DocxIcon />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  xlsx: { icon: <XlsxIcon />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  pptx: { icon: <PptxIcon />, color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
};

function initials(name) {
  return (name ?? '').split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function formatDocSize(bytes) {
  const n = Number(bytes);
  if (!n || !Number.isFinite(n)) return '';
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / 1024).toFixed(0)} KB`;
}

/* ── Upload Assets Modal ── */
function UploadAssetsModal({ convId, onClose }) {
  const dispatch   = useDispatch();
  const [dragging,  setDragging]  = useState(false);
  const [files,     setFiles]     = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  function handleFiles(incoming) {
    setFiles(prev => [...prev, ...Array.from(incoming)]);
  }

  async function handleDone() {
    if (files.length > 0 && convId) {
      setUploading(true);
      await dispatch(uploadAssets({ convId, files }));
      setUploading(false);
    }
    onClose();
  }

  const totalBytes = files.reduce((s, f) => s + f.size, 0);
  const totalLabel = totalBytes >= 1024 * 1024
    ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(totalBytes / 1024).toFixed(0)} KB`;

  return (
    <div className="ua-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>

        <div className="ua-header">
          <h2 className="ua-title">Upload New Assets</h2>
          <button className="ua-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div
          className={`ua-dropzone${dragging ? ' ua-dropzone--active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        >
          <div className="ua-cloud-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
          </div>
          <p className="ua-drop-title">Drag and drop your assets here</p>
          <p className="ua-drop-sub">Support for JPG, PNG, and MP4 up to 50MB</p>
          <button className="ua-browse-btn" type="button" onClick={() => fileInputRef.current?.click()}>Browse Files</button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="ua-uploaded-section">
            <div className="ua-uploaded-header">
              <span className="ua-uploaded-label">SELECTED ({files.length})</span>
              <span className="ua-uploaded-size">{totalLabel} total</span>
            </div>
            <div className="ua-thumbs">
              {files.slice(0, 5).map((f, i) => (
                <div key={i} className="ua-thumb" style={{ background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8' }}>
                  {f.name.split('.').pop()?.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ua-footer">
          <button className="ua-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ua-done-btn" onClick={handleDone} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SharedAssetsView({ conv, onBack }) {
  const dispatch = useDispatch();
  const { assets, assetsLoading } = useSelector(s => s.messages);

  const [tab,        setTab]    = useState('media');
  const [uploadOpen, setUpload] = useState(false);

  const convAssets = assets[conv.id] ?? {};
  const items      = convAssets[tab] ?? [];
  const storage    = convAssets.storage;
  const usedGB     = storage?.usedGB  ?? 0;
  const totalGB    = storage?.totalGB ?? 10;
  const pct        = Math.round((usedGB / totalGB) * 100);

  // Fetch counts/items for all three tabs up front so the tab labels show
  // correct per-tab counts immediately, without waiting for the user to switch tabs.
  useEffect(() => {
    SA_TABS.forEach(t => dispatch(fetchAssets({ convId: conv.id, tab: t.id })));
  }, [conv.id, dispatch]);

  return (
    <div className="sa-wrap">
      <div className="sa-main">
        <button className="sa-back-btn" onClick={onBack}>
          <BackArrowIcon /> Back to Chat
        </button>

        <h1 className="sa-title">Shared Assets</h1>
        <p className="sa-subtitle">
          Assets shared in conversation with{' '}
          <span className="sa-conv-name">{conv.name}</span>
        </p>

        <div className="sa-tabs">
          {SA_TABS.map(t => (
            <button
              key={t.id}
              className={`sa-tab${tab === t.id ? ' sa-tab--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label} {convAssets.totals?.[t.id] != null && <span className="sa-tab-count">({convAssets.totals[t.id]})</span>}
            </button>
          ))}
        </div>
        <div className="sa-tab-underline" />

        {assetsLoading && <p style={{ color: '#5c6a8c', fontSize: 13, padding: '16px 0' }}>Loading…</p>}

        {/* ── Media tab ── */}
        {!assetsLoading && tab === 'media' && (
          <div className="sa-media-grid">
            {items.length === 0 && <p style={{ color: '#5c6a8c', fontSize: 13 }}>No media yet.</p>}
            {items.map((item, i) => (
              <div key={item.id ?? i} className="sa-media-thumb">
                {item.type === 'video'
                  ? <video src={item.url} className="sa-media-img" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  : <img src={item.url} alt="" className="sa-media-img" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                }
              </div>
            ))}
          </div>
        )}

        {/* ── Links tab ── */}
        {!assetsLoading && tab === 'links' && (
          <div className="sa-list">
            {items.length === 0 && <p style={{ color: '#5c6a8c', fontSize: 13 }}>No links yet.</p>}
            {items.map((link, i) => (
              <a
                key={link.id ?? i}
                className="sa-link-item"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="sa-link-icon"><LinkItemIcon /></div>
                <div className="sa-link-body">
                  <p className="sa-link-title">{link.title ?? link.url}</p>
                  <p className="sa-link-domain">{link.domain ?? ''}</p>
                </div>
                <div className="sa-link-meta">
                  <span className="sa-link-shared">Shared by <strong>{link.sharedBy ?? ''}</strong></span>
                  <div className="sa-link-time-row">
                    <span className="sa-link-time">{link.time ?? ''}</span>
                    <div className="sa-link-avatar" style={{ background: conv.color }}>{initials(conv.name)}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── Docs tab ── */}
        {!assetsLoading && tab === 'docs' && (
          <div className="sa-list">
            {items.length === 0 && <p style={{ color: '#5c6a8c', fontSize: 13 }}>No documents yet.</p>}
            {items.map((doc, i) => {
              const ext  = doc.name?.split('.').pop()?.toLowerCase() ?? 'pdf';
              const meta = DOC_TYPE_META[ext] ?? DOC_TYPE_META.pdf;
              return (
                <div key={doc.id ?? i} className="sa-doc-item">
                  <div className="sa-doc-icon" style={{ background: meta.bg, color: meta.color }}>{meta.icon}</div>
                  <div className="sa-doc-body">
                    <p className="sa-doc-name">{doc.name}</p>
                    <p className="sa-doc-meta">{formatDocSize(doc.size)} • Shared by {doc.sharedBy ?? ''} • {doc.time ?? ''}</p>
                  </div>
                  <a className="sa-doc-download" href={doc.url} download title="Download"><DocDownloadIcon /></a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="sa-right">
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
            <span>{conv.name.split(' ')[0]} has contributed <strong>{storage?.otherUserContribGB ?? 0} GB</strong> to this share.</span>
          </div>
        </div>

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

      {uploadOpen && <UploadAssetsModal convId={conv.id} onClose={() => setUpload(false)} />}
    </div>
  );
}

function CameraIcon()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function CheckSmIcon()     { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function GroupNewIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function ArrowRightSmIcon(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }

function NewMessageModal({ onClose, onStartDM, onCreateGroup }) {
  const dispatch = useDispatch();
  const { suggestions } = useSelector(s => s.users);

  const [view,        setView]        = useState('dm');
  const [search,      setSearch]      = useState('');
  const [groupName,   setGroupName]   = useState('');
  const [description, setDescription] = useState('');
  const [selected,    setSelected]    = useState([]);
  const [groupImg,    setGroupImg]    = useState(null);
  const imgInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSuggestions(20));
  }, [dispatch]);

  const contacts = suggestions.map(s => ({
    id: s.id ?? s._id ?? '',
    name: s.name ?? s.fullName ?? '',
    role: s.role ?? s.bio ?? '',
    color: s.color ?? '#3b82f6',
  })).filter(c => c.id);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleContact(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleSelectDM(contact) {
    onStartDM?.(contact.id);
    onClose();
  }

  async function handleCreateGroupSubmit() {
    if (!groupName.trim() || selected.length === 0) return;
    await onCreateGroup?.({ name: groupName.trim(), description: description.trim(), memberIds: selected, image: groupImg });
    onClose();
  }

  function switchToGroup() { setSearch(''); setSelected([]); setView('group'); }
  function switchToDM()    { setSearch(''); setGroupName(''); setDescription(''); setSelected([]); setView('dm'); }

  return (
    <div className="nm-overlay" onClick={onClose}>
      <div className="nm-modal" onClick={e => e.stopPropagation()}>
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
                    <div key={c.id} className="nm-contact-item" onClick={() => handleSelectDM(c)}>
                      <div className="nm-contact-avatar" style={{ background: c.color }}>{initials(c.name)}</div>
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

          {view === 'group' && (
            <>
              <div className="nm-form-row">
                <div className="nm-img-upload" onClick={() => imgInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                  {groupImg
                    ? <img src={URL.createObjectURL(groupImg)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    : <CameraIcon />
                  }
                  <span className="nm-img-badge"><CheckSmIcon /></span>
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files[0] && setGroupImg(e.target.files[0])}
                  />
                </div>
                <div className="nm-form-fields">
                  <div className="nm-field">
                    <label className="nm-label">Group Name</label>
                    <input className="nm-input" placeholder="Enter group name..." value={groupName} onChange={e => setGroupName(e.target.value)} autoFocus />
                  </div>
                  <div className="nm-field">
                    <label className="nm-label">Description (Optional)</label>
                    <textarea className="nm-textarea" placeholder="What's this group about?" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                  </div>
                </div>
              </div>

              <div className="nm-contacts-section">
                <div className="nm-contacts-header">
                  <span className="nm-contacts-title">Add Members</span>
                  <div className="nm-contacts-right">
                    <div className="nm-contact-search-wrap">
                      <SearchIcon />
                      <input className="nm-contact-search" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button className="nm-select-all" onClick={() => setSelected(contacts.map(c => c.id))}>Select All</button>
                  </div>
                </div>
                <div className="nm-contact-list">
                  {filtered.map(c => {
                    const checked = selected.includes(c.id);
                    return (
                      <div key={c.id} className={`nm-contact-item${checked ? ' nm-contact-item--selected' : ''}`} onClick={() => toggleContact(c.id)}>
                        <div className="nm-contact-avatar" style={{ background: c.color }}>{initials(c.name)}</div>
                        <div className="nm-contact-info">
                          <p className="nm-contact-name">{c.name}</p>
                          <p className="nm-contact-role">{c.role}</p>
                        </div>
                        <div className={`nm-checkbox${checked ? ' nm-checkbox--checked' : ''}`}>{checked && <CheckSmIcon />}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="nm-footer">
          {view === 'dm' ? (
            <button className="nm-cancel-btn" onClick={onClose}>Cancel</button>
          ) : (
            <>
              <button className="nm-cancel-btn" onClick={switchToDM}>Back</button>
              <button className="nm-create-btn" disabled={!groupName.trim() || selected.length === 0} onClick={handleCreateGroupSubmit}>
                Create Group <ArrowRightSmIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const TABS = ['All', 'Unread', 'Groups', 'Online'];

const TAB_PARAM = { All: 'all', Unread: 'unread', Groups: 'groups', Online: 'online' };

export default function MessagesPage({ onBack, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onCoursesClick, onMinisitesClick, initialUserId, onInitUserConsumed }) {
  const dispatch = useDispatch();
  const {
    conversations, conversationsLoading,
    messages: allMessages,
    messagesLoading,
    onlineUsers,
    blockedConvIds,
    sending,
    assets: allAssets,
    pendingOpenConvId,
  } = useSelector(s => s.messages);

  const [tab,              setTab]             = useState('All');
  const [createPostOpen,   setCreatePostOpen]  = useState(false);
  const [search,           setSearch]          = useState('');
  const [debouncedSearch,  setDebouncedSearch] = useState('');
  const [activeConv,       setActiveConv]      = useState(null);
  const [chatKey,          setChatKey]         = useState(0);
  const [inputMsg,         setInputMsg]        = useState('');
  const [newMsgOpen,       setNewMsgOpen]      = useState(false);
  const [showAssets,       setShowAssets]      = useState(false);
  const [typingUser,       setTypingUser]      = useState(null);
  const [lightboxUrl,      setLightboxUrl]     = useState(null);

  const messagesEndRef  = useRef(null);
  const typingTimerRef  = useRef(null);
  const isTypingRef     = useRef(false);
  const imgInputRef     = useRef(null);
  const fileInputRef    = useRef(null);

  /* Fetch online users on mount */
  useEffect(() => {
    dispatch(fetchOnlineUsers());
  }, [dispatch]);

  /* Auto-open conversation started via Chat button from Groups / Profile */
  useEffect(() => {
    if (!pendingOpenConvId || conversations.length === 0) return;
    const conv = conversations.find(c => c.id === pendingOpenConvId);
    if (conv) {
      setActiveConv(conv);
      dispatch(clearPendingOpenConv());
    }
  }, [pendingOpenConvId, conversations, dispatch]);

  /* Navigated here with a specific user (Chat button on a profile) — get-or-create the DM and open it.
     Guarded by a ref because React.StrictMode double-invokes effects in dev, and the backend isn't
     guaranteed to dedupe two concurrent "create DM" calls into a single conversation. */
  const startedDMForRef = useRef(null);
  useEffect(() => {
    if (!initialUserId || startedDMForRef.current === initialUserId) return;
    startedDMForRef.current = initialUserId;
    // Already have this DM loaded locally — open it directly instead of hitting the create endpoint again.
    const existing = conversations.find(c => c.type === 'dm' && c.participantId === initialUserId);
    if (existing) {
      openConversation(existing);
      onInitUserConsumed?.();
      return;
    }
    (async () => {
      const result = await dispatch(startDM(initialUserId));
      if (startDM.fulfilled.match(result)) openConversation(result.payload);
      onInitUserConsumed?.();
    })();
  }, [initialUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* Fetch conversations on mount + whenever tab / search changes */
  useEffect(() => {
    dispatch(fetchConversations({ tab: TAB_PARAM[tab], search: debouncedSearch }));
  }, [tab, debouncedSearch, dispatch]);

  /* Join/leave socket room + typing listeners when conversation changes */
  useEffect(() => {
    if (!activeConv) return;
    joinConversation(activeConv.id);

    const offTyping = onUserTyping(() => {
      setTypingUser(true);
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setTypingUser(null), 3000);
    });
    const offStopped = onUserStoppedTyping(() => setTypingUser(null));

    return () => {
      leaveConversation(activeConv.id);
      offTyping?.();
      offStopped?.();
    };
  }, [activeConv?.id]); // eslint-disable-line

  /* Auto-scroll on new messages */
  const msgCount = allMessages[activeConv?.id]?.length ?? 0;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgCount]);

  function openConversation(conv) {
    setActiveConv(conv);
    setChatKey(k => k + 1);
    setShowAssets(false);
    dispatch(clearUnread({ convId: conv.id })); // instant badge clear
    dispatch(fetchMessages({ convId: conv.id }));
    dispatch(markRead(conv.id));
    dispatch(fetchAssets({ convId: conv.id, tab: 'media', limit: 3 })); // right panel preview
  }

  async function handleSend() {
    if (!inputMsg.trim() || !activeConv || sending) return;
    const text = inputMsg.trim();
    setInputMsg('');
    if (isTypingRef.current) {
      isTypingRef.current = false;
      emitTypingStop(activeConv.id);
      clearTimeout(typingTimerRef.current);
    }
    dispatch(sendMessage({ convId: activeConv.id, type: 'text', text }));
  }

  function handleSendFile(file, msgType) {
    if (!file || !activeConv || sending) return;
    dispatch(sendMessage({ convId: activeConv.id, type: msgType, file }));
  }

  function handleInputChange(e) {
    setInputMsg(e.target.value);
    if (!activeConv) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTypingStart(activeConv.id);
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitTypingStop(activeConv.id);
    }, 1500);
  }

  async function handleStartDM(userId) {
    const result = await dispatch(startDM(userId));
    if (startDM.fulfilled.match(result)) openConversation(result.payload);
    setNewMsgOpen(false);
  }

  async function handleCreateGroup(groupData) {
    const result = await dispatch(createGroup(groupData));
    if (createGroup.fulfilled.match(result)) openConversation(result.payload);
  }

  function handleBlock() {
    if (activeConv) dispatch(toggleBlock(activeConv.id));
  }

  function handleReport() {
    if (activeConv) dispatch(reportConversation({ convId: activeConv.id, reason: 'Inappropriate content' }));
  }

  const messages  = activeConv ? (allMessages[activeConv.id] ?? []) : [];
  const isBlocked = activeConv ? (blockedConvIds[activeConv.id] ?? false) : false;
  // activeConv is a snapshot taken when the chat was opened, so it goes stale as soon as the
  // store updates (e.g. a socket "online"/"offline" event) — always render the live copy from
  // the conversations list instead of the frozen selection.
  const liveActiveConv = activeConv ? (conversations.find(c => c.id === activeConv.id) ?? activeConv) : null;

  /* ── Chat view ── */
  if (activeConv) {
    return (
      <div className="msg-page" style={{ overflow: showAssets ? 'auto' : undefined }}>
        <AnimatedNav
          activeId="messages"
          onNavigate={id => {
            if (id === 'create')    { setCreatePostOpen(true); return; }
            if (id === 'home')      onBack?.();
            if (id === 'courses')   onCoursesClick?.();
            if (id === 'library')   onLibraryClick?.();
            if (id === 'events')    onEventsClick?.();
            if (id === 'friends')   onGroupsClick?.();
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
            {conversations.map(conv => (
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
                    <span className="msg-compact-time">{conv.lastMessage?.time ?? ''}</span>
                  </div>
                  <div className="msg-compact-bottom">
                    <span className="msg-compact-preview">{conv.lastMessage?.text ?? ''}</span>
                    {conv.unreadCount > 0 && <span className="msg-badge">{conv.unreadCount}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAssets
          ? <SharedAssetsView conv={liveActiveConv} onBack={() => setShowAssets(false)} />
          : <>
          {/* Chat area */}
          <div className="msg-chat-area" key={chatKey}>
            <div className="msg-chat-header">
              <div className="msg-chat-header-user">
                <div className="msg-avatar-wrap">
                  <div className="msg-avatar msg-avatar--md" style={{ background: liveActiveConv.color }}>{initials(liveActiveConv.name)}</div>
                  {liveActiveConv.online && <span className="msg-online-dot" />}
                </div>
                <div>
                  <p className="msg-chat-name">{liveActiveConv.name}</p>
                  {liveActiveConv.online
                    ? <p className="msg-chat-status msg-chat-status--online">● Online</p>
                    : <p className="msg-chat-status">Offline</p>
                  }
                </div>
              </div>
              <button className="msg-chat-search-btn"><SearchIcon /></button>
            </div>

            <div className="msg-chat-messages">
              {messagesLoading && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#5c6a8c', fontSize: 13 }}>Loading messages…</div>
              )}

              {!messagesLoading && <div className="msg-date-sep"><span>TODAY</span></div>}

              {!messagesLoading && messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#5c6a8c', fontSize: 13 }}>No messages yet. Say hello!</div>
              )}

              {messages.map(msg => (
                <div key={msg.id} className={`msg-bubble-row${msg.from === 'me' ? ' msg-bubble-row--me' : ''}`} style={msg.pending ? { opacity: 0.6 } : undefined}>
                  {msg.from !== 'me' && (
                    <div className="msg-avatar msg-avatar--xs" style={{ background: activeConv.color, flexShrink: 0 }}>
                      {initials(activeConv.name)}
                    </div>
                  )}
                  <div className="msg-bubble-col">
                    {(msg.type === 'image' || msg.type === 'video') ? (
                      <div className="msg-bubble-img-wrap">
                        {msg.type === 'video'
                          ? <video src={msg.mediaUrl} controls className="msg-img-placeholder" style={{ width: '100%', background: '#0d1424' }} />
                          : msg.mediaUrl
                            ? <img src={msg.mediaUrl} alt="" className="msg-img-placeholder" style={{ objectFit: 'cover', cursor: 'pointer' }} onClick={() => setLightboxUrl(msg.mediaUrl)} />
                            : <div className="msg-img-placeholder" />
                        }
                        <div className="msg-bubble-meta msg-bubble-meta--right">
                          <span className="msg-bubble-time">{msg.pending ? '···' : msg.time}</span>
                          {msg.from === 'me' && msg.read && !msg.pending && <span className="msg-read-check"><ReadCheckIcon /></span>}
                        </div>
                      </div>
                    ) : msg.type === 'file' ? (
                      <div className={`msg-bubble${msg.from === 'me' ? ' msg-bubble--sent' : ' msg-bubble--received'}`}>
                        {msg.mediaUrl ? (
                          <a className="msg-file-chip" href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" download>
                            <span className="msg-file-icon">{(DOC_TYPE_META[msg.fileName?.split('.').pop()?.toLowerCase()] ?? DOC_TYPE_META.pdf).icon}</span>
                            <span className="msg-file-name">{msg.fileName || 'Attachment'}</span>
                          </a>
                        ) : (
                          <p className="msg-bubble-text">{msg.pending ? msg.text : (msg.fileName || 'Attachment')}</p>
                        )}
                      </div>
                    ) : (
                      <div className={`msg-bubble${msg.from === 'me' ? ' msg-bubble--sent' : ' msg-bubble--received'}`}>
                        <p className="msg-bubble-text">{msg.text}</p>
                      </div>
                    )}
                    {msg.type !== 'image' && msg.type !== 'video' && (
                      <div className={`msg-bubble-meta${msg.from === 'me' ? ' msg-bubble-meta--right' : ''}`}>
                        <span className="msg-bubble-time">{msg.pending ? '···' : msg.time}</span>
                        {msg.from === 'me' && msg.read && !msg.pending && <span className="msg-read-check"><ReadCheckIcon /></span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typingUser && (
                <div className="msg-bubble-row">
                  <div className="msg-avatar msg-avatar--xs" style={{ background: activeConv.color, flexShrink: 0 }}>{initials(activeConv.name)}</div>
                  <div className="msg-bubble msg-bubble--received" style={{ fontStyle: 'italic', color: '#94a3b8' }}>typing…</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Hidden file inputs */}
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleSendFile(f, f.type.startsWith('video') ? 'video' : 'image'); e.target.value = ''; }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleSendFile(f, 'file'); e.target.value = ''; }}
            />

            <div className="msg-input-bar">
              <button className="msg-input-icon-btn" title="Attach file" onClick={() => !isBlocked && fileInputRef.current?.click()}><AttachPlusIcon /></button>
              <button className="msg-input-icon-btn" title="Send image" onClick={() => !isBlocked && imgInputRef.current?.click()}><ImageIcon /></button>
              <input
                className="msg-input"
                type="text"
                placeholder={isBlocked ? 'You have blocked this conversation' : 'Type a message...'}
                value={inputMsg}
                onChange={handleInputChange}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isBlocked || sending}
              />
              <button className="msg-input-icon-btn"><EmojiIcon /></button>
              <button className="msg-input-icon-btn"><MicIcon /></button>
              <button
                className={`msg-send-btn${inputMsg.trim() ? ' msg-send-btn--active' : ''}`}
                onClick={handleSend}
                disabled={!inputMsg.trim() || sending || isBlocked}
              >
                <SendIcon />
              </button>
            </div>
          </div>

          {newMsgOpen && (
            <NewMessageModal
              onClose={() => setNewMsgOpen(false)}
              onStartDM={handleStartDM}
              onCreateGroup={handleCreateGroup}
            />
          )}

          {/* Contact info panel */}
          <div className="msg-contact-panel" key={`panel-${chatKey}`}>
            <div className="msg-contact-avatar-wrap">
              <div className="msg-contact-avatar" style={{ background: liveActiveConv.color }}>{initials(liveActiveConv.name)}</div>
              {liveActiveConv.online && <span className="msg-contact-online-dot" />}
            </div>
            <p className="msg-contact-name">{liveActiveConv.name}</p>
            <p className="msg-contact-role">{liveActiveConv.role}</p>

            <div className="msg-media-section">
              <div className="msg-media-header">
                <span className="msg-media-title">Media, Links, and Docs</span>
                <button className="msg-see-all" onClick={() => setShowAssets(true)}>See All</button>
              </div>
              {(() => {
                const convAssets = allAssets[activeConv.id] ?? {};
                const mediaItems = convAssets.media ?? [];
                const total = convAssets.total ?? 0;
                const preview = mediaItems.slice(0, 2);
                const remaining = total > 2 ? total - 2 : 0;
                if (total === 0 && mediaItems.length === 0) return null;
                return (
                  <div className="msg-media-grid">
                    {preview.map((item, i) => (
                      item.url
                        ? <img key={item.id ?? i} src={item.url} alt="" className={`msg-media-thumb msg-media-thumb--${i + 1}`} style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: 6 }} />
                        : <div key={i} className={`msg-media-thumb msg-media-thumb--${i + 1}`} />
                    ))}
                    {preview.length === 0 && <div className="msg-media-thumb msg-media-thumb--1" />}
                    {remaining > 0 && <div className="msg-media-count">+{remaining}</div>}
                  </div>
                );
              })()}
            </div>

            <div className="msg-contact-actions">
              <button className="msg-action-item" onClick={handleBlock}>
                <span className="msg-action-icon msg-action-icon--red"><BlockIcon /></span>
                <span className="msg-action-label">
                  {isBlocked ? `Unblock ${liveActiveConv.name.split(' ')[0]}` : `Block ${liveActiveConv.name.split(' ')[0]}`}
                </span>
                <ChevronRightIcon />
              </button>
              <button className="msg-action-item" onClick={handleReport}>
                <span className="msg-action-icon msg-action-icon--orange"><AlertIcon /></span>
                <span className="msg-action-label">Report Conversation</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </>}

        {/* ── Lightbox ── */}
        {lightboxUrl && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              style={{ position: 'absolute', top: 18, right: 22, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 38, height: 38, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
              aria-label="Close"
            >✕</button>
            <img
              src={lightboxUrl}
              alt=""
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '88vh', borderRadius: 10, objectFit: 'contain', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
            />
          </div>
        )}
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

      {newMsgOpen && (
        <NewMessageModal
          onClose={() => setNewMsgOpen(false)}
          onStartDM={handleStartDM}
          onCreateGroup={handleCreateGroup}
        />
      )}

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
            <button key={t} className={`msg-tab${tab === t ? ' msg-tab--active' : ''}`} onClick={() => setTab(t)}>
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
          {conversationsLoading && conversations.length === 0 && (
            <p style={{ color: '#5c6a8c', fontSize: 13, padding: '16px 0' }}>Loading…</p>
          )}
          {!conversationsLoading && conversations.length === 0 && (
            <p style={{ color: '#5c6a8c', fontSize: 13, padding: '16px 0' }}>No conversations yet.</p>
          )}
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`msg-conv${conv.unreadCount > 0 ? ' msg-conv--unread' : ''}`}
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
                    <span className="msg-conv-time">{conv.lastMessage?.time ?? ''}</span>
                    {conv.unreadCount > 0 && <span className="msg-unread-dot" />}
                  </div>
                </div>
                <div className="msg-conv-bottom">
                  <span className="msg-conv-preview">{conv.lastMessage?.text ?? ''}</span>
                  <span className="msg-checks">
                    {conv.unreadCount > 0 ? <DoubleCheckIcon /> : <CheckIcon />}
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
            {onlineUsers.slice(0, 5).map(u => (
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
