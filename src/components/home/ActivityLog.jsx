import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityLog } from '../../store/slices/activitySlice';
import './ActivityLog.css';

const ACTIVITY_ICONS = {
  member_joined: '👥',
  member_left: '👤',
  member_invited: '📧',
  member_removed: '⛔',
  member_role_changed: '⚙️',
  post_created: '📝',
  post_deleted: '🗑️',
  post_pinned: '📌',
};

const ACTIVITY_LABELS = {
  member_joined: 'Member Joined',
  member_left: 'Member Left',
  member_invited: 'Member Invited',
  member_removed: 'Member Removed',
  member_role_changed: 'Role Changed',
  post_created: 'Post Created',
  post_deleted: 'Post Deleted',
  post_pinned: 'Post Pinned',
};

function ActivityLog({ groupId }) {
  const dispatch = useDispatch();
  const { byGroup, totalByGroup, loading } = useSelector((s) => s.activity);
  const activities = byGroup[groupId] ?? [];
  const total = totalByGroup[groupId] ?? 0;

  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (!groupId) return;
    dispatch(fetchActivityLog({ groupId, page, type: filterType }));
  }, [dispatch, groupId, page, filterType]);

  function formatTime(timestamp) {
    if (!timestamp) return '—';
    const d = new Date(timestamp);
    if (isNaN(d)) return timestamp;
    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getActivityDescription(activity) {
    const { type, actor, subject, details } = activity;
    switch (type) {
      case 'member_joined':
        return `${actor?.name ?? 'User'} joined the group`;
      case 'member_left':
        return `${actor?.name ?? 'User'} left the group`;
      case 'member_invited':
        return `${actor?.name ?? 'User'} invited ${subject?.name ?? 'someone'}`;
      case 'member_removed':
        return `${actor?.name ?? 'User'} removed ${subject?.name ?? 'someone'}`;
      case 'member_role_changed':
        return `${actor?.name ?? 'User'} changed ${subject?.name ?? 'someone'}'s role to ${details?.newRole ?? 'Unknown'}`;
      case 'post_created':
        return `${actor?.name ?? 'User'} created a post`;
      case 'post_deleted':
        return `${actor?.name ?? 'User'} deleted a post`;
      case 'post_pinned':
        return `${actor?.name ?? 'User'} pinned a post`;
      default:
        return `Activity: ${type}`;
    }
  }

  return (
    <div className="activity-log">
      <div className="activity-log-header">
        <h3>Activity Log</h3>
        <select
          className="activity-log-filter"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Activities</option>
          {Object.entries(ACTIVITY_LABELS).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="activity-log-stats">
        <p className="activity-log-total">
          Showing {activities.length} of {total} activities
        </p>
      </div>

      <div className="activity-log-list">
        {loading && activities.length === 0 ? (
          <p className="activity-log-loading">Loading activities...</p>
        ) : activities.length === 0 ? (
          <p className="activity-log-empty">No activities yet</p>
        ) : (
          activities.map((activity) => {
            const actId = activity._id ?? activity.id;
            const icon = ACTIVITY_ICONS[activity.type] ?? '📍';
            return (
              <div key={actId} className="activity-log-item">
                <div className="activity-log-icon">{icon}</div>
                <div className="activity-log-content">
                  <p className="activity-log-description">
                    {getActivityDescription(activity)}
                  </p>
                  <span className="activity-log-time">
                    {formatTime(activity.createdAt ?? activity.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {Math.ceil(total / 50) > 1 && (
        <div className="activity-log-pagination">
          <button
            className="activity-log-prev"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="activity-log-page">
            Page {page} of {Math.ceil(total / 50)}
          </span>
          <button
            className="activity-log-next"
            onClick={() => setPage(Math.min(Math.ceil(total / 50), page + 1))}
            disabled={page === Math.ceil(total / 50)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ActivityLog;
