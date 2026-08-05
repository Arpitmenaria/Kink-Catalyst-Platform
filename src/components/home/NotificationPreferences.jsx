import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotificationPrefs, updateNotificationPrefs, fetchGroupNotificationPrefs, updateGroupNotificationPrefs } from '../../store/slices/notificationPrefsSlice';
import { showToast } from '../../store/slices/toastSlice';
import './NotificationPreferences.css';

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-slider" />
    </label>
  );
}

function NotificationPreferences({ groupId = null }) {
  const dispatch = useDispatch();
  const { global, byGroup, loading } = useSelector((s) => s.notificationPrefs);
  const prefs = groupId ? (byGroup[groupId] ?? {}) : global;

  const [localPrefs, setLocalPrefs] = useState(prefs);
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupNotificationPrefs(groupId));
    } else {
      dispatch(fetchNotificationPrefs());
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    setLocalPrefs(prefs);
    setUnsaved(false);
  }, [prefs]);

  function handleToggle(key, value) {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
    setUnsaved(true);
  }

  function handleSelectChange(key, value) {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
    setUnsaved(true);
  }

  function handleSave() {
    if (groupId) {
      dispatch(updateGroupNotificationPrefs({ groupId, prefs: localPrefs })).then((action) => {
        if (updateGroupNotificationPrefs.fulfilled.match(action)) {
          dispatch(showToast({ message: 'Group notification preferences updated', type: 'success' }));
          setUnsaved(false);
        } else {
          dispatch(showToast({ message: 'Failed to update preferences', type: 'error' }));
        }
      });
    } else {
      dispatch(updateNotificationPrefs(localPrefs)).then((action) => {
        if (updateNotificationPrefs.fulfilled.match(action)) {
          dispatch(showToast({ message: 'Notification preferences updated', type: 'success' }));
          setUnsaved(false);
        } else {
          dispatch(showToast({ message: 'Failed to update preferences', type: 'error' }));
        }
      });
    }
  }

  return (
    <div className="notification-prefs">
      <div className="notification-prefs-header">
        <h3>{groupId ? 'Group Notifications' : 'Email Notifications'}</h3>
        {unsaved && <span className="notification-prefs-unsaved">Unsaved changes</span>}
      </div>

      <div className="notification-prefs-body">
        <div className="notification-pref-item">
          <div className="notification-pref-info">
            <p className="notification-pref-label">New Comments</p>
            <p className="notification-pref-desc">Get notified when someone comments on posts</p>
          </div>
          <ToggleSwitch
            checked={localPrefs.emailOnComment ?? true}
            onChange={(val) => handleToggle('emailOnComment', val)}
            disabled={loading}
          />
        </div>

        <div className="notification-pref-item">
          <div className="notification-pref-info">
            <p className="notification-pref-label">Likes</p>
            <p className="notification-pref-desc">Get notified when someone likes your posts</p>
          </div>
          <ToggleSwitch
            checked={localPrefs.emailOnLike ?? false}
            onChange={(val) => handleToggle('emailOnLike', val)}
            disabled={loading}
          />
        </div>

        <div className="notification-pref-item">
          <div className="notification-pref-info">
            <p className="notification-pref-label">Invitations</p>
            <p className="notification-pref-desc">Get notified when invited to groups</p>
          </div>
          <ToggleSwitch
            checked={localPrefs.emailOnInvite ?? true}
            onChange={(val) => handleToggle('emailOnInvite', val)}
            disabled={loading}
          />
        </div>

        <div className="notification-pref-item">
          <div className="notification-pref-info">
            <p className="notification-pref-label">Mentions</p>
            <p className="notification-pref-desc">Get notified when someone mentions you</p>
          </div>
          <ToggleSwitch
            checked={localPrefs.emailOnMention ?? true}
            onChange={(val) => handleToggle('emailOnMention', val)}
            disabled={loading}
          />
        </div>

        {!groupId && (
          <div className="notification-pref-item">
            <div className="notification-pref-info">
              <p className="notification-pref-label">Digest Frequency</p>
              <p className="notification-pref-desc">How often to receive digest emails</p>
            </div>
            <select
              className="notification-pref-select"
              value={localPrefs.emailDigest ?? 'weekly'}
              onChange={(e) => handleSelectChange('emailDigest', e.target.value)}
              disabled={loading}
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </select>
          </div>
        )}
      </div>

      {unsaved && (
        <div className="notification-prefs-footer">
          <button
            className="notification-prefs-save"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationPreferences;
