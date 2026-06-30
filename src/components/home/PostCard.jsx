import { useState, useRef, useEffect } from 'react';
import SkeletonImg from '../SkeletonImg';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, commentPost, sharePost } from '../../store/slices/postsSlice';
import ReportModal from './ReportModal';
import './PostCard.css';

const REACTOR_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&q=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80&fit=crop&crop=face',
];

const BURST_EMOJIS = ['😊', '❤️', '🔥', '✨', '💫', '⭐', '🎉', '👏'];
const BURST_PATHS = [
  { dx: -48, dy: -64, rot: -30 },
  { dx: -22, dy: -78, rot:  15 },
  { dx:   8, dy: -82, rot: -10 },
  { dx:  36, dy: -68, rot:  25 },
  { dx:  52, dy: -42, rot: -20 },
  { dx: -58, dy: -38, rot:  30 },
  { dx: -12, dy: -72, rot: -18 },
  { dx:  28, dy: -56, rot:  22 },
];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
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

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#ef4444'];
function nameColor(name = '') {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function nameInitials(name = '') {
  return name.split(' ').map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2);
}
function normalizeComment(c) {
  if (!c || !c._id) return null;
  const name = c.author?.fullName ?? 'Unknown';
  return {
    id: c._id,
    initials: nameInitials(name),
    color: nameColor(name),
    name,
    time: timeAgo(c.createdAt),
    text: c.text ?? '',
    likes: typeof c.likes === 'number' ? c.likes : (Array.isArray(c.likes) ? c.likes.length : 0),
    replies: (c.replies ?? []).filter(Boolean).map(r => {
      const rName = r.author?.fullName ?? 'Unknown';
      return {
        id: r._id ?? r.id,
        initials: nameInitials(rName),
        color: nameColor(rName),
        name: rName,
        time: timeAgo(r.createdAt),
        text: r.text ?? '',
        likes: typeof r.likes === 'number' ? r.likes : 0,
      };
    }),
  };
}

export default function PostCard({ post, onUserClick }) {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { likingIds, commentingId } = useSelector(s => s.posts);

  const isStatic = typeof post.likes === 'number';

  const [comment,         setComment]         = useState('');
  const [localLiked,      setLocalLiked]      = useState(false);
  const [reacting,        setReacting]        = useState(false);
  const [particles,       setParticles]       = useState([]);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [reportOpen,      setReportOpen]      = useState(false);
  const [showComments,    setShowComments]    = useState(true);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [likedComments,   setLikedComments]   = useState(new Set());
  const menuRef = useRef(null);

  function toggleReplies(id) {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleCommentLike(id) {
    setLikedComments(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const userId = user?.id ?? user?._id;
  const authorId      = post.author?._id ?? post.author?.id;
  const authorName    = post.author?.fullName || 'Unknown';
  const rawAuthorAv   = post.author?.avatar ?? '';
  const authorAvatar  = rawAuthorAv?.startsWith?.('http') ? rawAuthorAv : '';
  const mediaUrl    = post.media?.[0]?.url?.startsWith?.('http') ? post.media[0].url : null;
  const mediaType   = post.media?.[0]?.type ?? 'image';

  function handleAuthorClick() {
    console.log('Author clicked:', authorId, authorName);
    onUserClick(1);
  }

  const likeCount    = isStatic ? post.likes    : (post.likes?.length    ?? 0);
  const commentCount = isStatic ? post.comments : (post.comments?.length ?? 0);
  const shareCount   = isStatic ? post.shares   : (post.shares?.length   ?? 0);
  const peopleReact  = post.peopleReact ?? (isStatic ? 0 : (likeCount > 0 ? Math.min(likeCount, 4) : 0));

  const isLiked   = isStatic ? localLiked : (post.likes?.includes(userId) ?? false);
  const isLiking  = isStatic ? false : likingIds.includes(post._id);
  const isCommenting = isStatic ? false : commentingId === post._id;

  const realComments = (post.comments ?? [])
    .map(normalizeComment)
    .filter(Boolean);

  useEffect(() => {
    if (!menuOpen) return;
    function onOut(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [menuOpen]);

  function handleLike() {
    if (isStatic) {
      setLocalLiked(v => !v);
      setReacting(true);
      const burst = BURST_PATHS.map((p, i) => ({ id: Date.now() + i, emoji: BURST_EMOJIS[i], ...p }));
      setParticles(burst);
      setTimeout(() => { setReacting(false); setParticles([]); }, 700);
      return;
    }
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
          <div
            className="post-avatar"
            style={{ overflow: 'hidden', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: authorId ? 'pointer' : 'default' }}
            onClick={handleAuthorClick}
          >
            {authorAvatar
              ? <SkeletonImg
                  src={authorAvatar}
                  alt={authorName}
                  fallback={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{getInitials(authorName)}</span>}
                />
              : getInitials(authorName)
            }
          </div>
          <div className="post-meta">
            <p
              className="post-author"
              style={{ cursor: authorId ? 'pointer' : 'default' }}
              onClick={handleAuthorClick}
            >
              {authorName}
            </p>
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
            {mediaType === 'video'
              ? (
                <video
                  src={mediaUrl}
                  className="post-image"
                  controls
                  style={{ height: '240px', width: '100%', display: 'block', objectFit: 'cover', background: '#0d1424' }}
                />
              ) : (
                <SkeletonImg src={mediaUrl} alt="" className="post-image" imgStyle={{ height: '240px' }} />
              )
            }
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
              {REACTOR_AVATARS.slice(0, Math.min(peopleReact, 4)).map((src, i) => (
                <div key={i} className="post-reader-dot">
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
            <span className="post-react-text">+{peopleReact} people react this post</span>
          </div>
        )}

        {/* Actions */}
        <div className="post-actions">
          <div className="react-burst-wrap">
            <button
              className={`post-action-btn${isLiked ? ' post-action-btn--active' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <span className={`react-label${reacting ? ' react-label--spring' : ''}`}>
                <ReactIcon /> {isLiked ? 'Reacted' : 'React'} ({likeCount + (isStatic && localLiked ? 1 : 0)})
              </span>
            </button>
            {particles.map(p => (
              <span
                key={p.id}
                className="react-particle"
                style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg` }}
              >
                {p.emoji}
              </span>
            ))}
          </div>
          <div className="post-action-sep" />
          <button className="post-action-btn" onClick={() => setShowComments(v => !v)}>
            <CommentIcon /> Comment ({commentCount})
          </button>
          <div className="post-action-sep" />
          <button className="post-action-btn" onClick={handleShare}>
            <ShareIcon /> {shareCount > 1 ? 'Shares' : 'Share'} ({shareCount})
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="post-comments-section">
            {realComments.map(c => (
              <div key={c.id} className="pc-thread">
                {/* Top-level comment */}
                <div className="pc-comment">
                  <div className="pc-avatar" style={{ background: c.color }}>{c.initials}</div>
                  <div className="pc-body">
                    <div className="pc-bubble">
                      <span className="pc-name">{c.name}</span>
                      <span className="pc-time">{c.time}</span>
                      <p className="pc-text">{c.text}</p>
                    </div>
                    <div className="pc-actions">
                      <button className={`pc-act${likedComments.has(c.id) ? ' pc-act--liked' : ''}`} onClick={() => toggleCommentLike(c.id)}>
                        Like ({c.likes + (likedComments.has(c.id) ? 1 : 0)})
                      </button>
                      <span className="pc-dot">·</span>
                      <button className="pc-act">Reply</button>
                      {c.replies.length > 0 && (
                        <>
                          <span className="pc-dot">·</span>
                          <button className="pc-act pc-act--view" onClick={() => toggleReplies(c.id)}>
                            {expandedReplies.has(c.id) ? `Hide replies` : `View ${c.replies.length} replies`}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Replies */}
                    {expandedReplies.has(c.id) && c.replies.length > 0 && (
                      <div className="pc-replies">
                        {c.replies.map(r => (
                          <div key={r.id} className="pc-comment pc-comment--reply">
                            <div className="pc-avatar pc-avatar--sm" style={{ background: r.color }}>{r.initials}</div>
                            <div className="pc-body">
                              <div className="pc-bubble pc-bubble--reply">
                                <span className="pc-name">{r.name}</span>
                                <span className="pc-time">{r.time}</span>
                                <p className="pc-text">{r.text}</p>
                              </div>
                              <div className="pc-actions">
                                <button className={`pc-act${likedComments.has(r.id) ? ' pc-act--liked' : ''}`} onClick={() => toggleCommentLike(r.id)}>
                                  Like ({r.likes + (likedComments.has(r.id) ? 1 : 0)})
                                </button>
                                <span className="pc-dot">·</span>
                                <button className="pc-act">Reply</button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button className="pc-load-more">
                          <span className="pc-load-dots">···</span> Load more replies
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button className="pc-view-all" onClick={() => setShowComments(v => !v)}>
              View all comments
            </button>
          </div>
        )}

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