import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../../services/api';
import { fetchMe } from '../../store/slices/authSlice';
import './ProfileCompletionModal.css';

const PROFESSIONS = [
  'Software Engineer',
  'Product Manager',
  'Designer',
  'Data Scientist',
  'Marketing Manager',
  'Sales Executive',
  'Business Analyst',
  'DevOps Engineer',
  'QA Engineer',
  'Project Manager',
  'Consultant',
  'Entrepreneur',
  'Student',
  'Other'
];

export default function ProfileCompletionModal({ token }) {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profession, setProfession] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar || !profession) {
      setError('Please upload avatar and select profession');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64Avatar = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(avatar);
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      );

      const response = await Promise.race([
        apiRequest('/api/user/profile', {
          method: 'PUT',
          body: { avatar: base64Avatar, profession },
          token,
        }),
        timeoutPromise,
      ]);

      if (response?.success) {
        dispatch(fetchMe());
        setTimeout(() => {
          window.location.href = '/';
        }, 800);
      } else {
        throw new Error(response?.message || 'Backend error');
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="profile-completion-overlay">
      <div className="profile-completion-modal">
        <h2>Complete Your Profile</h2>
        <p className="subtitle">Please upload your profile picture and select your profession to continue</p>

        <form onSubmit={handleSubmit}>
          {/* Avatar Upload */}
          <div className="form-group">
            <label>Profile Picture *</label>
            <div className="avatar-upload-wrapper">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                  </svg>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={loading}
                className="avatar-input"
              />
              <span className="upload-text">{avatar ? 'Change' : 'Upload'}</span>
            </div>
          </div>

          {/* Profession Select */}
          <div className="form-group">
            <label htmlFor="profession">Profession *</label>
            <select
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              disabled={loading}
              className="profession-select"
            >
              <option value="">Select your profession</option>
              {PROFESSIONS.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading || !avatar || !profession} className="submit-btn">
            {loading ? 'Completing...' : 'Complete Profile'}
          </button>
        </form>

        <p className="info-text">This information is required to use the platform</p>
      </div>
    </div>
  );
}
