import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostLikes } from '../../store/slices/postsSlice';
import { REACTIONS, REACTION_MAP } from './PostCard';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

// LinkedIn-style "who reacted" modal: All + one tab per reaction type present,
// each with a count, backed by GET /api/posts/:id/likes (paginated, no per-type
// breakdown from the server — tab counts are computed client-side from whatever
// pages have been loaded so far, which is exact once `hasMore` is false).
export default function ReactionsModal({ postId, onClose, onUserClick }) {
  const dispatch = useDispatch();
  const entry = useSelector(s => s.posts.postLikes[postId]) ?? { total: 0, items: [], page: 0, hasMore: true, loading: false };
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchPostLikes({ postId, page: 1 }));
  }, [postId, dispatch]);

  const byType = {};
  entry.items.forEach(item => {
    byType[item.reaction] = (byType[item.reaction] ?? 0) + 1;
  });

  const filtered = activeTab === 'all' ? entry.items : entry.items.filter(i => i.reaction === activeTab);

  function loadMore() {
    dispatch(fetchPostLikes({ postId, page: (entry.page || 0) + 1 }));
  }

  function handlePersonClick(userId) {
    if (!userId) return;
    onUserClick?.(userId);
    onClose();
  }

  return (
    <div className="reactions-modal-overlay" onClick={onClose}>
      <div className="reactions-modal" onClick={e => e.stopPropagation()}>
        <div className="reactions-modal-header">
          <h2 className="reactions-modal-title">Reactions</h2>
          <button className="reactions-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="reactions-modal-tabs">
          <button
            className={`reactions-modal-tab${activeTab === 'all' ? ' reactions-modal-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All <span className="reactions-modal-tab-count">{entry.total}</span>
          </button>
          {REACTIONS.filter(r => byType[r.id] > 0).map(r => (
            <button
              key={r.id}
              className={`reactions-modal-tab${activeTab === r.id ? ' reactions-modal-tab--active' : ''}`}
              onClick={() => setActiveTab(r.id)}
            >
              <span className="reactions-modal-tab-emoji">{r.emoji}</span> {byType[r.id]}
            </button>
          ))}
        </div>

        <div className="reactions-modal-list">
          {entry.loading && filtered.length === 0 && <p className="reactions-modal-empty">Loading…</p>}
          {!entry.loading && filtered.length === 0 && <p className="reactions-modal-empty">No reactions yet.</p>}
          {filtered.map(person => {
            const meta = REACTION_MAP[person.reaction] ?? REACTIONS[0];
            return (
              <div key={person.userId} className="reactions-modal-person" onClick={() => handlePersonClick(person.userId)}>
                <div className="reactions-modal-avatar-wrap">
                  <div className="reactions-modal-avatar" style={{ background: '#3b82f6' }}>
                    {person.avatar?.startsWith?.('http')
                      ? <img src={person.avatar} alt="" />
                      : getInitials(person.fullName)
                    }
                  </div>
                  <span className="reactions-modal-reaction-badge" style={{ background: meta.color }}>{meta.emoji}</span>
                </div>
                <div className="reactions-modal-person-info">
                  <span className="reactions-modal-person-name">{person.fullName}</span>
                  {person.location && <span className="reactions-modal-person-sub">{person.location}</span>}
                </div>
              </div>
            );
          })}
          {entry.hasMore && !entry.loading && filtered.length > 0 && (
            <button className="reactions-modal-load-more" onClick={loadMore}>Load more</button>
          )}
          {entry.loading && filtered.length > 0 && (
            <p className="reactions-modal-empty">Loading more…</p>
          )}
        </div>
      </div>
    </div>
  );
}
