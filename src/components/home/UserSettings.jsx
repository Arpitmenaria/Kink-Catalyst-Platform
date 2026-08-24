import { useState } from 'react';
import AdminActionsList from './AdminActionsList';
import NotificationPreferences from './NotificationPreferences';
import './UserSettings.css';

function UserSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="us-container">
      <div className="us-header">
        <h1>Account Settings</h1>
        <p>Manage your profile, privacy, and security</p>
      </div>

      <div className="us-tabs">
        <button
          className={`us-tab${activeTab === 'profile' ? ' us-tab--active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`us-tab${activeTab === 'privacy' ? ' us-tab--active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          🔒 Privacy
        </button>
        <button
          className={`us-tab${activeTab === 'notifications' ? ' us-tab--active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications
        </button>
        <button
          className={`us-tab${activeTab === 'security' ? ' us-tab--active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🛡️ Security
        </button>
      </div>

      <div className="us-content">
        {activeTab === 'profile' && (
          <div className="us-section">
            <h2>Profile Settings</h2>
            <p className="us-placeholder">Profile management coming soon...</p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="us-section">
            <h2>Privacy Settings</h2>
            <p className="us-placeholder">Privacy controls coming soon...</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="us-section">
            <h2>Notification Preferences</h2>
            <NotificationPreferences />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="us-section">
            <h2>Account Security</h2>
            <AdminActionsList />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;
