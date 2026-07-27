import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostLikes } from '../../store/slices/postsSlice';
import { sendFriendRequest } from '../../store/slices/usersSlice';
import { startDM } from '../../store/slices/messagesSlice';
import { fetchConnections } from '../../store/slices/profileSlice';
import { navigateTo } from '../../store/slices/uiSlice';
import { REACTIONS } from './PostCard';

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
  const { friendStatusMap } = useSelector(s => s.users);
  const { connections } = useSelector(s => s.profile);
  const { user: authUser } = useSelector(s => s.auth);
  const myId = authUser?.id ?? authUser?._id;
  const [activeTab, setActiveTab] = useState('all');
  const [startingChatId, setStartingChatId] = useState(null);

  useEffect(() => {
    dispatch(fetchPostLikes({ postId, page: 1 }));
  }, [postId, dispatch]);

  // /api/posts/:id/likes doesn't return connection status per person, and
  // merely appearing in the connections list turned out not to be a safe
  // proxy for "currently connected" (showed Chat for people who'd only sent/
  // received a pending request) — so only trust the purpose-built
  // friendStatusMap, defaulting to 'none' (shows "Connect") when unknown.
  // Worst case with this default is an extra click, never an unsolicited
  // "Chat" with someone who isn't actually connected. Still fetch the
  // connections list, though — handleChat below uses it to skip a redundant
  // startDM call when we already know the conversation id.
  useEffect(() => {
    if (!connections.length) dispatch(fetchConnections({ limit: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function friendStatusFor(userId) {
    return friendStatusMap[userId] ?? 'none';
  }

  function handleConnect(e, userId) {
    e.stopPropagation();
    dispatch(sendFriendRequest(userId));
  }

  async function handleChat(e, userId) {
    e.stopPropagation();
    const conn = connections.find(c => c.id === userId);
    if (conn?.conversationId) {
      dispatch(navigateTo({ section: 'messages', convId: conn.conversationId }));
      onClose();
      return;
    }
    setStartingChatId(userId);
    const result = await dispatch(startDM(userId));
    setStartingChatId(null);
    if (startDM.fulfilled.match(result)) {
      dispatch(navigateTo({ section: 'messages', convId: result.payload.id }));
      onClose();
    }
  }

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
          {filtered.map(person => (
            <div key={person.userId} className="reactions-modal-person" onClick={() => handlePersonClick(person.userId)}>
              <div className="reactions-modal-avatar-wrap">
                <div className="reactions-modal-avatar" style={{ background: '#3b82f6' }}>
                  {person.avatar?.startsWith?.('http')
                    ? <img src={person.avatar} alt="" />
                    : getInitials(person.fullName)
                  }
                </div>
              </div>
              <div className="reactions-modal-person-info">
                <span className="reactions-modal-person-name">{person.fullName}</span>
                {person.location && <span className="reactions-modal-person-sub">{person.location}</span>}
              </div>
              {person.userId !== myId && (() => {
                const status = friendStatusFor(person.userId);
                if (status === 'connected') {
                  return (
                    <button
                      className="reactions-modal-action-btn"
                      onClick={e => handleChat(e, person.userId)}
                      disabled={startingChatId === person.userId}
                    >
                      {startingChatId === person.userId ? 'Opening…' : 'Chat'}
                    </button>
                  );
                }
                if (status === 'requested') {
                  return <button className="reactions-modal-action-btn reactions-modal-action-btn--pending" disabled onClick={e => e.stopPropagation()}>Pending</button>;
                }
                if (status === 'incoming') {
                  // No inline accept/reject here — send them to the profile,
                  // which already has that flow.
                  return (
                    <button
                      className="reactions-modal-action-btn reactions-modal-action-btn--pending"
                      onClick={e => { e.stopPropagation(); handlePersonClick(person.userId); }}
                    >
                      Respond
                    </button>
                  );
                }
                return <button className="reactions-modal-action-btn" onClick={e => handleConnect(e, person.userId)}>Connect</button>;
              })()}
            </div>
          ))}
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
