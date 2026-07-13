import { useState, useRef, useEffect } from 'react';
import SkeletonImg from '../SkeletonImg';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, commentPost, sharePost, likeComment, replyToComment, fetchPostComments } from '../../store/slices/postsSlice';
import { showToast } from '../../store/slices/toastSlice';
import ReportModal from './ReportModal';
import './PostCard.css';

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
function FriendsIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline', verticalAlign:'middle' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function LockIcon()    { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline', verticalAlign:'middle' }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }

const VISIBILITY_META = {
  anyone:   { Icon: GlobeIcon,   label: 'Anyone' },
  friends:  { Icon: FriendsIcon, label: 'Friends only' },
  only_me:  { Icon: LockIcon,    label: 'Only me' },
};
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
  if (!c) return null;
  const cid = c._id ?? c.id;
  if (!cid) {
    console.warn('PostCard: comment has no recognizable id, dropping it from the list.', c);
    return null;
  }
  const name = c.author?.fullName ?? 'Unknown';
  return {
    id: cid,
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
  const { likingIds, commentingId, commentsLoadingIds } = useSelector(s => s.posts);

  const isStatic = typeof post.likes === 'number';

  const [comment,         setComment]         = useState('');
  const [localLiked,      setLocalLiked]      = useState(false);
  const [reacting,        setReacting]        = useState(false);
  const [particles,       setParticles]       = useState([]);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [reportOpen,      setReportOpen]      = useState(false);
  const [showComments,    setShowComments]    = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [likedComments,   setLikedComments]   = useState(new Set());
  const [replyingTo,      setReplyingTo]      = useState(null);
  const [replyText,       setReplyText]       = useState('');
  const menuRef = useRef(null);

  function toggleReplies(id) {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleCommentLike(commentId) {
    setLikedComments(prev => {
      const next = new Set(prev);
      next.has(commentId) ? next.delete(commentId) : next.add(commentId);
      return next;
    });
    dispatch(likeComment({ postId: post._id, commentId }));
  }

  function openReplyBox(commentId) {
    setReplyingTo(prev => (prev === commentId ? null : commentId));
    setReplyText('');
  }

  function handleSendReply(commentId) {
    if (!replyText.trim()) return;
    dispatch(replyToComment({ postId: post._id, commentId, text: replyText.trim() }));
    setExpandedReplies(prev => new Set(prev).add(commentId));
    setReplyText('');
    setReplyingTo(null);
  }

  const userId = user?.id ?? user?._id;
  const authorId      = post.author?._id ?? post.author?.id ?? post.author?.userId ?? post.authorId ?? post.userId;
  const authorName    = post.author?.fullName || 'Unknown';
  const rawAuthorAv   = post.author?.avatar ?? '';
  const authorAvatar  = rawAuthorAv?.startsWith?.('http') ? rawAuthorAv : '';
  const mediaUrl    = post.media?.[0]?.url?.startsWith?.('http') ? post.media[0].url : null;
  const mediaType   = post.media?.[0]?.type ?? 'image';
  const visMeta     = VISIBILITY_META[post.visibility] ?? VISIBILITY_META.anyone;

  function handleAuthorClick() {
    if (!onUserClick) return;
    if (!authorId) {
      console.warn('PostCard: no author id anywhere on this post — full post object below.', post);
      dispatch(showToast({ message: "Can't open this profile — the post is missing author info.", type: 'error' }));
      return;
    }
    onUserClick(authorId);
  }

  const likeCount    = isStatic ? post.likes    : (post.likesCount ?? post.likes?.length ?? 0);
  const commentCount = isStatic ? post.comments : (post.commentsCount ?? post.comments?.length ?? 0);
  const shareCount   = isStatic ? post.shares   : (post.shares?.length   ?? 0);
  const recentReactors = isStatic ? [] : (post.recentReactors ?? []);

  const isLiked   = isStatic ? localLiked : (post.likes?.includes(userId) ?? false);
  const isLiking  = isStatic ? false : likingIds.includes(post._id);
  const isCommenting = isStatic ? false : commentingId === post._id;
  const commentsLoading = !isStatic && commentsLoadingIds.includes(post._id);

  const realComments = (post.comments ?? [])
    .map(normalizeComment)
    .filter(Boolean);

  useEffect(() => {
    if (!menuOpen) return;
    function onOut(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [menuOpen]);

  // Feed/list endpoints only return a comment count, not the real comments —
  // fetch the actual thread the first time this post's comments are opened.
  useEffect(() => {
    if (isStatic || !showComments || post.commentsLoaded) return;
    dispatch(fetchPostComments(post._id));
  }, [showComments, post.commentsLoaded, isStatic, post._id, dispatch]);

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
      setShowComments(true);
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
            <p className="post-time">{timeAgo(post.createdAt)} · <span title={visMeta.label}><visMeta.Icon /></span></p>
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
        {likeCount > 0 && (
          <div className="post-people-react">
            <div className="post-reader-avatars">
              {recentReactors.slice(0, 4).map((r, i) => (
                <div key={r._id ?? r.id ?? i} className="post-reader-dot">
                  {r.avatar?.startsWith?.('http')
                    ? <img src={r.avatar} alt={r.fullName ?? ''} />
                    : (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 10, fontWeight: 700, background: '#3b82f6', color: '#fff' }}>
                        {getInitials(r.fullName ?? '')}
                      </span>
                    )
                  }
                </div>
              ))}
            </div>
            <span className="post-react-text">+{likeCount} people react this post</span>
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
            {commentsLoading && (
              <p style={{ textAlign: 'center', padding: '10px', color: '#5c6a8c', fontSize: 13 }}>Loading comments…</p>
            )}
            {!commentsLoading && post.commentsLoaded && realComments.length === 0 && (
              <p style={{ textAlign: 'center', padding: '10px', color: '#5c6a8c', fontSize: 13 }}>No comments yet.</p>
            )}
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
                      <button className={`pc-act${likedComments.has(c.id) ? ' pc-act--liked' : ''}`} onClick={() => handleCommentLike(c.id)}>
                        Like ({c.likes})
                      </button>
                      <span className="pc-dot">·</span>
                      <button className="pc-act" onClick={() => openReplyBox(c.id)}>Reply</button>
                      {c.replies.length > 0 && (
                        <>
                          <span className="pc-dot">·</span>
                          <button className="pc-act pc-act--view" onClick={() => toggleReplies(c.id)}>
                            {expandedReplies.has(c.id) ? `Hide replies` : `View ${c.replies.length} replies`}
                          </button>
                        </>
                      )}
                    </div>

                    {replyingTo === c.id && (
                      <div className="pc-reply-input-wrap">
                        <input
                          type="text"
                          className="pc-reply-input"
                          placeholder={`Reply to ${c.name}...`}
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendReply(c.id)}
                          autoFocus
                        />
                        <button className="pc-reply-send" onClick={() => handleSendReply(c.id)} disabled={!replyText.trim()}>
                          <SendIcon />
                        </button>
                      </div>
                    )}

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
                                <button className={`pc-act${likedComments.has(r.id) ? ' pc-act--liked' : ''}`} onClick={() => handleCommentLike(r.id)}>
                                  Like ({r.likes})
                                </button>
                                <span className="pc-dot">·</span>
                                <button className="pc-act" onClick={() => openReplyBox(c.id)}>Reply</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button className="pc-view-all" onClick={() => setShowComments(v => !v)}>
              Hide comments
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