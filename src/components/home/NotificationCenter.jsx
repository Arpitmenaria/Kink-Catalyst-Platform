import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserNotifications } from '../../store/slices/adminActionsSlice';
import AdminActionNotification from './AdminActionNotification';
import './NotificationCenter.css';

function BellIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}

function NotificationCenter() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((s) => s.adminActions);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    dispatch(fetchUserNotifications());
  }, [dispatch]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  function handleDismiss() {
    // Notification automatically marked as read via AdminActionNotification
  }

  return (
    <div className="nc-container">
      <div className="nc-header">
        <div className="nc-title-wrap">
          <BellIcon />
          <h2>Notifications</h2>
          {unreadCount > 0 && <span className="nc-badge">{unreadCount}</span>}
        </div>
      </div>

      {loading && notifications.length === 0 ? (
        <p className="nc-loading">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="nc-empty">All caught up! No new notifications. ✓</p>
      ) : (
        <div className="nc-list">
          {notifications.map((notif) => {
            const notifId = notif._id ?? notif.id;

            if (notif.type === 'admin_action') {
              return (
                <AdminActionNotification
                  key={notifId}
                  notification={notif}
                  onDismiss={handleDismiss}
                />
              );
            }

            // Fallback for other notification types
            return (
              <div key={notifId} className="nc-generic-notification">
                <p>{notif.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
