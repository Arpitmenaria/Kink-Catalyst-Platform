import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, commentPost, sharePost } from '../../store/slices/postsSlice';
import ReportModal from './ReportModal';
import './PostCard.css';

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

function nameColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { likingIds, commentingId } = useSelector(s => s.posts);

  const [comment, setComment] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const menuRef = useRef(null);

  const userId = user?.id;
  const authorName = post.author?.fullName || 'Unknown';
  const mediaUrl = post.media?.[0]?.url;
  const isLiked = post.likes?.includes(userId) ?? false;
  const isLiking = likingIds.includes(post._id);
  const isCommenting = commentingId === post._id;

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  function handleLike() {
    if (isLiking || !userId) return;
    dispatch(likePost({ postId: post._id, userId }));
  }

  function handleShare() {
    dispatch(sharePost(post._id));
  }

  function handleCommentKey(e) {
    if (e.key === 'Enter' && comment.trim() && !isCommenting) {
      dispatch(commentPost({ postId: post._id, text: comment.trim() }));
      setComment('');
    }
  }

  function openReport() {
    setMenuOpen(false);
    setReportOpen(true);
  }

  return (
    <>
      <article className="post-card">
        {/* Header */}
        <div className="post-header">
          <div className="post-avatar" style={{ background: nameColor(authorName), overflow: 'hidden' }}>
            {post.author?.avatar
              ? <img src={post.author.avatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : getInitials(authorName)
            }
          </div>
          <div className="post-meta">
            <p className="post-author">{authorName}</p>
            <p className="post-time">{timeAgo(post.createdAt)}</p>
          </div>

          {/* 3-dot menu */}
          <div className="post-menu-wrap" ref={menuRef}>
            <button
              className="post-more-btn"
              aria-label="More options"
              onClick={() => setMenuOpen(v => !v)}
            >
              <MoreIcon />
            </button>
            {menuOpen && (
              <div className="post-menu-dropdown">
                <button className="post-menu-item" onClick={openReport}>
                  <span className="post-menu-icon post-menu-icon--red"><ReportIcon /></span>
                  <span className="post-menu-text">
                    <span className="post-menu-item-title">Report Post</span>
                    <span className="post-menu-item-sub">Submit a report for review</span>
                  </span>
                </button>
                <div className="post-menu-divider" />
                <button className="post-menu-item" onClick={openReport}>
                  <span className="post-menu-icon post-menu-icon--blue"><FlagIcon /></span>
                  <span className="post-menu-text">
                    <span className="post-menu-item-title">Flag as inappropriate</span>
                    <span className="post-menu-item-sub">Mark as offensive content</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        {post.caption && <p className="post-text">{post.caption}</p>}

        {/* Media */}
        {mediaUrl && <img src={mediaUrl} alt="" className="post-image" />}

        {/* Stats */}
        <div className="post-stats">
          <span>{post.likes?.length ?? 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}</span>
          <span>{post.comments?.length ?? 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
          <span>{post.shares?.length ?? 0} Shares</span>
          <span className="post-bookmark"><BookmarkIcon /></span>
        </div>

        {/* Action buttons */}
        <div className="post-actions">
          <button
            className={`post-action-btn${isLiked ? ' post-action-btn--active' : ''}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <HeartIcon filled={isLiked} /> {isLiked ? 'Liked' : 'Like'}
          </button>
          <div className="post-action-sep" />
          <button className="post-action-btn">
            <CommentIcon /> Comment
          </button>
          <div className="post-action-sep" />
          <button className="post-action-btn" onClick={handleShare}>
            <ShareIcon /> Share
          </button>
        </div>

        {/* Comment input */}
        <div className="post-comment-bar">
          <div className="comment-avatar">{getInitials(user?.fullName)}</div>
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment… (Enter to post)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={handleCommentKey}
            disabled={isCommenting}
          />
        </div>
      </article>

      {reportOpen && (
        <ReportModal postId={post._id} onClose={() => setReportOpen(false)} />
      )}
    </>
  );
}
