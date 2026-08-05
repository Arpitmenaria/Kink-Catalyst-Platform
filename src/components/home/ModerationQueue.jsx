import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModerationQueue, approveModerationItem, rejectModerationItem } from '../../store/slices/moderationSlice';
import { showToast } from '../../store/slices/toastSlice';
import './ModerationQueue.css';

function ShieldIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}

function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
}

function XIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function ModerationQueue({ groupId }) {
  const dispatch = useDispatch();
  const { byGroup, totalByGroup, loading, approvingIds, rejectingIds } = useSelector((s) => s.moderation);
  const items = byGroup[groupId] ?? [];
  const total = totalByGroup[groupId] ?? 0;

  const [page, setPage] = useState(1);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingItem, setRejectingItem] = useState(null);

  useEffect(() => {
    dispatch(fetchModerationQueue({ groupId, page }));
  }, [dispatch, groupId, page]);

  function handleApprove(itemId) {
    dispatch(approveModerationItem({ groupId, itemId })).then((action) => {
      if (approveModerationItem.fulfilled.match(action)) {
        dispatch(showToast({ message: 'Content approved', type: 'success' }));
      } else {
        dispatch(showToast({ message: 'Failed to approve', type: 'error' }));
      }
    });
  }

  function handleReject(itemId) {
    if (!rejectReason.trim()) {
      dispatch(showToast({ message: 'Please provide a rejection reason', type: 'error' }));
      return;
    }
    dispatch(rejectModerationItem({ groupId, itemId, reason: rejectReason })).then((action) => {
      if (rejectModerationItem.fulfilled.match(action)) {
        dispatch(showToast({ message: 'Content rejected', type: 'success' }));
        setRejectingItem(null);
        setRejectReason('');
      } else {
        dispatch(showToast({ message: 'Failed to reject', type: 'error' }));
      }
    });
  }

  return (
    <div className="moderation-queue">
      <div className="moderation-header">
        <h3><ShieldIcon /> Moderation Queue</h3>
        <span className="moderation-badge">{total}</span>
      </div>

      {loading && items.length === 0 ? (
        <p className="moderation-loading">Loading queue...</p>
      ) : items.length === 0 ? (
        <p className="moderation-empty">No pending items. Queue is clean! 🎉</p>
      ) : (
        <div className="moderation-items">
          {items.map((item) => {
            const itemId = item._id ?? item.id;
            const isApproving = approvingIds.includes(itemId);
            const isRejecting = rejectingIds.includes(itemId);
            const isShowingRejectForm = rejectingItem === itemId;

            return (
              <div key={itemId} className="moderation-item">
                <div className="moderation-item-header">
                  <div className="moderation-item-type">
                    {item.type === 'post' ? '📝 Post' : '💬 Comment'}
                  </div>
                  <div className="moderation-item-meta">
                    <span className="moderation-item-author">{item.author?.name ?? 'Unknown'}</span>
                    <span className="moderation-item-time">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="moderation-item-content">
                  <p>{(item.content ?? '').slice(0, 200)}{(item.content ?? '').length > 200 ? '...' : ''}</p>
                </div>

                {item.reason && (
                  <div className="moderation-item-reason">
                    <span className="moderation-reason-label">Flagged:</span>
                    <span className="moderation-reason-text">{item.reason}</span>
                  </div>
                )}

                {isShowingRejectForm ? (
                  <div className="moderation-item-reject-form">
                    <textarea
                      className="moderation-reject-textarea"
                      placeholder="Reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      maxLength={500}
                    />
                    <div className="moderation-reject-actions">
                      <button
                        className="moderation-reject-confirm"
                        onClick={() => handleReject(itemId)}
                        disabled={isRejecting}
                      >
                        {isRejecting ? '...' : 'Reject'}
                      </button>
                      <button
                        className="moderation-reject-cancel"
                        onClick={() => {
                          setRejectingItem(null);
                          setRejectReason('');
                        }}
                        disabled={isRejecting}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="moderation-item-actions">
                    <button
                      className="moderation-approve-btn"
                      onClick={() => handleApprove(itemId)}
                      disabled={isApproving}
                      title="Approve and publish this content"
                    >
                      <CheckIcon /> {isApproving ? '...' : 'Approve'}
                    </button>
                    <button
                      className="moderation-reject-btn"
                      onClick={() => setRejectingItem(itemId)}
                      disabled={isRejecting}
                      title="Reject and notify author"
                    >
                      <XIcon /> {isRejecting ? '...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {Math.ceil(total / 20) > 1 && (
        <div className="moderation-pagination">
          <button
            className="moderation-prev"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="moderation-page">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            className="moderation-next"
            onClick={() => setPage(Math.min(Math.ceil(total / 20), page + 1))}
            disabled={page === Math.ceil(total / 20)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ModerationQueue;
