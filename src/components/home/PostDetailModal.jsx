import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, clearPostDetail } from '../../store/slices/postsSlice';
import PostCard from './PostCard';
import './PostDetailModal.css';

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Full post + comment thread, opened from a notification. Works for any post
// regardless of feed pagination (the feed only holds the first page).
export default function PostDetailModal({ postId, onClose, onUserClick }) {
  const dispatch = useDispatch();
  const { postDetail, postDetailLoading, postDetailError } = useSelector(s => s.posts);

  useEffect(() => {
    if (postId) dispatch(fetchPostById(postId));
    return () => dispatch(clearPostDetail());
  }, [postId, dispatch]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const errText = postDetailError?.status === 404
    ? "This post no longer exists."
    : postDetailError?.status === 403
      ? "You don't have access to this post."
      : postDetailError?.message;

  return (
    <div className="pdm-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="pdm-modal" role="dialog" aria-modal="true">
        <div className="pdm-header">
          <h2 className="pdm-title">Post</h2>
          <button className="pdm-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="pdm-body">
          {postDetailLoading && <p className="pdm-state">Loading post…</p>}
          {!postDetailLoading && postDetailError && <p className="pdm-state">{errText}</p>}
          {!postDetailLoading && !postDetailError && postDetail && (
            <PostCard post={postDetail} onUserClick={onUserClick} />
          )}
        </div>
      </div>
    </div>
  );
}
