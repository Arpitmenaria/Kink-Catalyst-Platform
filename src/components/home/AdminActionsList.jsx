import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminActionsHistory } from '../../store/slices/adminActionsSlice';
import './AdminActionsList.css';

function AlertIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>;
}

function ShieldIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}

function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
}

function AdminActionsList() {
  const dispatch = useDispatch();
  const { actionsHistory, actionsHistoryTotal, loading } = useSelector((s) => s.adminActions);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminActionsHistory({ page, limit: 20 }));
  }, [dispatch, page]);

  function getActionIcon(action) {
    if (action.type?.includes('suspend') || action.type?.includes('ban')) {
      return <ShieldIcon />;
    }
    if (action.type?.includes('remove') || action.type?.includes('delete')) {
      return <AlertIcon />;
    }
    return <AlertIcon />;
  }

  function getStatusBadge(status) {
    if (status === 'active') {
      return <span className="aal-status-badge aal-status-active">🚫 Active</span>;
    }
    if (status === 'resolved') {
      return <span className="aal-status-badge aal-status-resolved"><CheckIcon /> Resolved</span>;
    }
    return <span className="aal-status-badge">{status}</span>;
  }

  function formatDate(timestamp) {
    if (!timestamp) return '—';
    const d = new Date(timestamp);
    if (isNaN(d)) return timestamp;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="aal-container">
      <div className="aal-header">
        <h3>Admin Actions on Your Account</h3>
        <span className="aal-count">{actionsHistoryTotal} action(s)</span>
      </div>

      {loading && actionsHistory.length === 0 ? (
        <p className="aal-loading">Loading admin actions...</p>
      ) : actionsHistory.length === 0 ? (
        <p className="aal-empty">No admin actions on your account. Good standing! ✓</p>
      ) : (
        <>
          <div className="aal-timeline">
            {actionsHistory.map((action, index) => (
              <div key={action._id ?? index} className="aal-item">
                <div className="aal-marker">
                  <div className="aal-icon">{getActionIcon(action)}</div>
                  {index < actionsHistory.length - 1 && <div className="aal-line" />}
                </div>

                <div className="aal-content">
                  <div className="aal-title-row">
                    <h4 className="aal-title">{action.title}</h4>
                    {getStatusBadge(action.status)}
                  </div>

                  <p className="aal-reason">⚠️ {action.reason}</p>

                  {action.details && <p className="aal-details">{action.details}</p>}

                  <div className="aal-meta">
                    <span className="aal-date">{formatDate(action.createdAt)}</span>
                    {action.resolvedAt && (
                      <span className="aal-resolved">
                        Restored {formatDate(action.resolvedAt)}
                      </span>
                    )}
                  </div>

                  {action.status !== 'resolved' && (
                    <button className="aal-contact-btn">Contact Support</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {Math.ceil(actionsHistoryTotal / 20) > 1 && (
            <div className="aal-pagination">
              <button
                className="aal-prev-btn"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="aal-page-info">
                Page {page} of {Math.ceil(actionsHistoryTotal / 20)}
              </span>
              <button
                className="aal-next-btn"
                onClick={() => setPage(Math.min(Math.ceil(actionsHistoryTotal / 20), page + 1))}
                disabled={page === Math.ceil(actionsHistoryTotal / 20)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminActionsList;
