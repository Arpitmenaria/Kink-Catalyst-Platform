import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, commentPost, sharePost } from '../../store/slices/postsSlice';
import ReportModal from './ReportModal';
import './PostCard.css';

const READER_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function MoreIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }
function ReportIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
function FlagIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>; }
function GlobeIcon()   { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline', verticalAlign:'middle' }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function ReactIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>; }
function CommentIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function ShareIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>; }
function BookmarkIcon(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }
function EmojiIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>; }
function SendIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { likingIds, commentingId } = useSelector(s => s.posts);

  const isStatic = typeof post.likes === 'number';

  const [comment,    setComment]    = useState('');
  const [localLiked, setLocalLiked] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const menuRef = useRef(null);

  const userId = user?.id;
  const authorName = post.author?.fullName || 'Unknown';
  const mediaUrl   = post.media?.[0]?.url;

  const likeCount    = isStatic ? post.likes    : (post.likes?.length    ?? 0);
  const commentCount = isStatic ? post.comments : (post.comments?.length ?? 0);
  const shareCount   = isStatic ? post.shares   : (post.shares?.length   ?? 0);
  const peopleReact  = post.peopleReact ?? (isStatic ? 0 : (likeCount > 0 ? Math.min(likeCount, 4) : 0));

  const isLiked   = isStatic ? localLiked : (post.likes?.includes(userId) ?? false);
  const isLiking  = isStatic ? false : likingIds.includes(post._id);
  const isCommenting = isStatic ? false : commentingId === post._id;

  useEffect(() => {
    if (!menuOpen) return;
    function onOut(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [menuOpen]);

  function handleLike() {
    if (isStatic) { setLocalLiked(v => !v); return; }
    if (isLiking || !userId) return;
    dispatch(likePost({ postId: post._id, userId }));
  }

  function handleShare() {
    if (isStatic) return;
    dispatch(sharePost(post._id));
  }

  function handleComment() {
    if (!comment.trim()) return;
    if (isStatic) { setComment(''); return; }
    if (!isCommenting) {
      dispatch(commentPost({ postId: post._id, text: comment.trim() }));
      setComment('');
    }
  }

  function openReport() { setMenuOpen(false); setReportOpen(true); }

  return (
    <>
      <article className="post-card">
        {/* Header */}
        <div className="post-header">
          <div className="post-avatar" style={{ overflow: 'hidden', background: '#3b82f6' }}>
            {post.author?.avatar
              ? <img src={post.author.avatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : getInitials(authorName)
            }
          </div>
          <div className="post-meta">
            <p className="post-author">{authorName}</p>
            <p className="post-time">{timeAgo(post.createdAt)} · <GlobeIcon /></p>
          </div>
          <div className="post-menu-wrap" ref={menuRef}>
            <button className="post-more-btn" onClick={() => setMenuOpen(v => !v)}><MoreIcon /></button>
            {menuOpen && (
              <div className="post-menu-dropdown">
                <button className="post-menu-item" onClick={openReport}>
                  <span className="post-menu-icon post-menu-icon--red"><ReportIcon /></span>
                  <span className="post-menu-text"><span className="post-menu-item-title">Report Post</span><span className="post-menu-item-sub">Submit a report for review</span></span>
                </button>
                <div className="post-menu-divider" />
                <button className="post-menu-item" onClick={openReport}>
                  <span className="post-menu-icon post-menu-icon--blue"><FlagIcon /></span>
                  <span className="post-menu-text"><span className="post-menu-item-title">Flag as inappropriate</span><span className="post-menu-item-sub">Mark as offensive content</span></span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        {post.caption && <p className="post-text">{post.caption}</p>}

        {/* Media */}
        {mediaUrl && (
          <div className="post-image-wrap">
            <img src={mediaUrl} alt="" className="post-image" />
          </div>
        )}

        {/* Title / tags / description (album-style posts) */}
        {post.title && (
          <div className="post-body">
            <p className="post-title">{post.title}</p>
            {post.tags && <p className="post-tags">{post.tags}</p>}
            {post.description && <p className="post-description">{post.description}</p>}
          </div>
        )}

        {/* People react row */}
        {peopleReact > 0 && (
          <div className="post-people-react">
            <div className="post-reader-avatars">
              {READER_COLORS.slice(0, 4).map((c, i) => (
                <div key={i} className="post-reader-dot" style={{ background: c }} />
              ))}
            </div>
            <span className="post-react-text">+{peopleReact} people react this post</span>
          </div>
        )}

        {/* Stats row */}
        <div className="post-stats">
          <div className="post-stats-left">
            <span className="post-emoji-reactions">😊 😮 😢 😠</span>
            <span className="post-reaction-count">+{likeCount}</span>
          </div>
          <div className="post-stats-right">
            <span>{commentCount} Comment</span>
            <span>{shareCount}share</span>
            <span className="post-bookmark"><BookmarkIcon /></span>
          </div>
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button className={`post-action-btn${isLiked ? ' post-action-btn--active' : ''}`} onClick={handleLike} disabled={isLiking}>
            <ReactIcon /> {isLiked ? 'Reacted' : 'React'}
          </button>
          <div className="post-action-sep" />
          <button className="post-action-btn"><CommentIcon /> Comment</button>
          <div className="post-action-sep" />
          <button className="post-action-btn" onClick={handleShare}><ShareIcon /> Share</button>
        </div>

        {/* Comment bar */}
        <div className="post-comment-bar">
          <div className="comment-avatar">{getInitials(user?.fullName ?? 'A')}</div>
          <div className="comment-input-wrap">
            <input
              type="text"
              className="comment-input"
              placeholder="Write A Comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
              disabled={isCommenting}
            />
            <div className="comment-input-icons">
              <button className="comment-icon-btn" tabIndex={-1}><EmojiIcon /></button>
              <button className={`comment-icon-btn comment-send-btn${comment.trim() ? ' active' : ''}`} tabIndex={-1} onClick={handleComment}><SendIcon /></button>
            </div>
          </div>
        </div>
      </article>

      {reportOpen && <ReportModal postId={post._id} onClose={() => setReportOpen(false)} />}
    </>
  );
}
