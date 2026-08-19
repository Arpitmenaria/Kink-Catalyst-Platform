import { useDispatch, useSelector } from 'react-redux';
import { markNotificationAsRead } from '../../store/slices/adminActionsSlice';
import './AdminActionNotification.css';

function AlertIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

function XIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function AdminActionNotification({ notification, onDismiss }) {
  const dispatch = useDispatch();
  const { markingAsReadIds } = useSelector((s) => s.adminActions);
  const notifId = notification._id ?? notification.id;
  const isMarking = markingAsReadIds.includes(notifId);

  function handleDismiss() {
    dispatch(markNotificationAsRead(notifId)).then((action) => {
      if (markNotificationAsRead.fulfilled.match(action)) {
        onDismiss?.();
      }
    });
  }

  function formatTime(timestamp) {
    if (!timestamp) return '—';
    const d = new Date(timestamp);
    if (isNaN(d)) return timestamp;
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className={`aan-notification${notification.read ? ' aan-notification--read' : ''}`}>
      <div className="aan-header">
        <div className="aan-icon">
          <AlertIcon />
        </div>
        <div className="aan-title-wrap">
          <h4 className="aan-title">{notification.title ?? 'Admin Action'}</h4>
          <p className="aan-time">{formatTime(notification.createdAt)}</p>
        </div>
        <button
          className="aan-dismiss-btn"
          onClick={handleDismiss}
          disabled={isMarking}
          title="Dismiss notification"
        >
          <XIcon />
        </button>
      </div>

      <div className="aan-content">
        <p className="aan-message">{notification.message}</p>

        {notification.details && (
          <div className="aan-details">
            <p className="aan-detail-label">Details:</p>
            <p className="aan-detail-text">{notification.details}</p>
          </div>
        )}
      </div>

      <div className="aan-footer">
        <p className="aan-footer-text">The Kick Catalyst Moderation Team</p>
      </div>
    </div>
  );
}

export default AdminActionNotification;
