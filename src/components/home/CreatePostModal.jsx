import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../store/slices/postsSlice';
import './CreatePost.css';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

function PhotoTabIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function VideoTabIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
}
function EventTabIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function GlobeIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function FriendsIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function LockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function CheckIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function ChevronDownIcon() {
  return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

const VISIBILITY_OPTIONS = [
  { id: 'anyone',  label: 'Anyone',       icon: <GlobeIcon />   },
  { id: 'friends', label: 'Friends only', icon: <FriendsIcon /> },
  { id: 'only_me', label: 'Only me',      icon: <LockIcon />    },
];
function UploadPhotoIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/><path d="M14 3v4h4"/></svg>;
}
function UploadVideoIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
}
function HashIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;
}
function AtIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>;
}
function EmojiIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
}
function SendIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}

const TABS = [
  { id: 'photo', label: 'Photo', icon: <PhotoTabIcon /> },
  { id: 'video', label: 'Video', icon: <VideoTabIcon /> },
  { id: 'event', label: 'Event', icon: <EventTabIcon /> },
];

export default function CreatePostModal({ onClose, initialTab = 'photo', onNavigateToEvents, onCreateEvent }) {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(s => s.auth);
  const { profile } = useSelector(s => s.profile);
  const { creating } = useSelector(s => s.posts);

  const [tab,           setTab]           = useState(initialTab);
  const [caption,       setCaption]       = useState('');
  const [mediaFile,     setMediaFile]     = useState(null);
  const [mediaPreview,  setMediaPreview]  = useState(null);
  const [dragOver,      setDragOver]      = useState(false);
  const [error,         setError]         = useState('');
  const [visibility,    setVisibility]    = useState('anyone');
  const [dropdownOpen,  setDropdownOpen]  = useState(false);

  const fileInputRef  = useRef(null);
  const dropdownRef   = useRef(null);
  const displayName = profile?.fullName ?? authUser?.fullName ?? 'You';
  const avatarUrl = profile?.avatar || '';

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    function onOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, [dropdownOpen]);

  function switchTab(t) {
    if (t === 'event') {
      onClose();
      if (onCreateEvent) onCreateEvent();
      else onNavigateToEvents?.();
      return;
    }
    setTab(t);
    setMediaFile(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
    setError('');
  }

  function handleFileSelect(file) {
    if (!file) return;
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setError('');
  }

  function handleInputChange(e) { handleFileSelect(e.target.files[0]); }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }

  function removeMedia() {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview(null);
  }

  async function handlePost() {
    if (!caption.trim() && !mediaFile) {
      setError('Add a caption or media to post.');
      return;
    }
    setError('');
    const result = await dispatch(createPost({ caption: caption.trim(), mediaFile }));
    if (!result.error) {
      onClose();
    } else {
      setError(result.payload || 'Failed to create post.');
    }
  }

  return (
    <div className="cp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cp-modal" role="dialog" aria-modal="true" aria-labelledby="cp-title">

        {/* Header */}
        <div className="cp-header">
          <div>
            <h2 className="cp-title" id="cp-title">Create Post</h2>
            <p className="cp-subtitle">Share an update, photo, or event with your network.</p>
          </div>
          <button className="cp-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tabs */}
        <div className="cp-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`cp-tab${tab === t.id ? ' cp-tab--active' : ''}`}
              onClick={() => switchTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="cp-body">
          {/* Audience row */}
          <div className="cp-audience-row">
            <div className="cp-user-avatar" style={{ overflow: avatarUrl ? 'hidden' : undefined }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : getInitials(displayName)
              }
            </div>
            <div className="cp-audience-wrap" ref={dropdownRef}>
              <button
                className={`cp-audience-chip${dropdownOpen ? ' cp-audience-chip--open' : ''}`}
                type="button"
                onClick={() => setDropdownOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                {VISIBILITY_OPTIONS.find(o => o.id === visibility)?.icon}
                {VISIBILITY_OPTIONS.find(o => o.id === visibility)?.label}
                <span className={`cp-chevron${dropdownOpen ? ' cp-chevron--up' : ''}`}><ChevronDownIcon /></span>
              </button>

              {dropdownOpen && (
                <ul className="cp-visibility-dropdown" role="listbox">
                  {VISIBILITY_OPTIONS.map(opt => (
                    <li key={opt.id} role="option" aria-selected={visibility === opt.id}>
                      <button
                        className={`cp-vis-option${visibility === opt.id ? ' cp-vis-option--active' : ''}`}
                        onClick={() => { setVisibility(opt.id); setDropdownOpen(false); }}
                      >
                        <span className="cp-vis-icon">{opt.icon}</span>
                        <span className="cp-vis-label">{opt.label}</span>
                        {visibility === opt.id && <span className="cp-vis-check"><CheckIcon /></span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Caption */}
          <textarea
            className="cp-textarea"
            placeholder="What's on your mind?"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            rows={3}
          />

          {/* Media upload / preview */}
          {tab === 'photo' || tab === 'video' ? (
            mediaPreview ? (
              <div className="cp-preview">
                {tab === 'photo'
                  ? <img src={mediaPreview} alt="preview" className="cp-preview-img" />
                  : <video src={mediaPreview} controls className="cp-preview-img" />
                }
                <button className="cp-remove-media" onClick={removeMedia} aria-label="Remove media">✕</button>
              </div>
            ) : (
              <div
                className={`cp-upload-zone${dragOver ? ' cp-upload-zone--dragover' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
              >
                <div className="cp-upload-icon">
                  {tab === 'photo' ? <UploadPhotoIcon /> : <UploadVideoIcon />}
                </div>
                {tab === 'photo' ? (
                  <>
                    <p className="cp-upload-title">Select images to share</p>
                    <p className="cp-upload-sub">JPG, PNG or GIF, up to 5MB</p>
                  </>
                ) : (
                  <p className="cp-upload-title">Drag and drop your videos here</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={tab === 'photo' ? 'image/*' : 'video/*'}
                  style={{ display: 'none' }}
                  onChange={handleInputChange}
                />
              </div>
            )
          ) : (
            <div className="cp-event-placeholder">Event creation coming soon.</div>
          )}
        </div>

        {/* Footer */}
        <div className="cp-footer">
          <div className="cp-footer-icons">
            <button className="cp-footer-icon-btn" type="button" title="Add hashtag"><HashIcon /></button>
            <button className="cp-footer-icon-btn" type="button" title="Mention someone"><AtIcon /></button>
            <button className="cp-footer-icon-btn" type="button" title="Add emoji"><EmojiIcon /></button>
          </div>
          {error && <p className="cp-error">{error}</p>}
          <button className="cp-post-btn" onClick={handlePost} disabled={creating || tab === 'event'}>
            {creating ? 'Posting…' : <><span>Post</span><SendIcon /></>}
          </button>
        </div>

      </div>
    </div>
  );
}
