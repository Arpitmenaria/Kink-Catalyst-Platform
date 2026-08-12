import { useState } from 'react';
import AnimatedNav from './AnimatedNav';
import { ALEX_AVATAR } from './mockData';
import './CreateCoursePage.css';

function PlusIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function UploadIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}

function CheckIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
}

export default function CreateCoursePage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const avatarUrl = ALEX_AVATAR;
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'development',
    level: 'beginner',
    price: '0',
    isFree: true,
    coverImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value,
      isFree: name === 'price' ? value === '0' : prev.isFree,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        coverImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleNav = (id) => {
    if (id === 'home') onBack?.();
    if (id === 'library') onLibraryClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events') onEventsClick?.();
    if (id === 'friends') onGroupsClick?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  };

  const isFormValid = courseData.title.trim() && courseData.description.trim() && courseData.coverImage;

  return (
    <div className="ccp-page">
      <div className="ccp-container">
        {/* Header */}
        <div className="ccp-header">
          <button className="ccp-back-btn" onClick={onBack}>← Back</button>
          <h1 className="ccp-title">Create New Course</h1>
        </div>

        {/* Single Page Form */}
        <div className="ccp-form">
          {/* Course Info Section */}
          <div className="ccp-section">
            <h2 className="ccp-section-title">Course Information</h2>

            <div className="ccp-form-group">
              <label className="ccp-label">Course Title *</label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                placeholder="e.g., Advanced React Patterns"
                className="ccp-input"
                maxLength={100}
              />
              <p className="ccp-hint">{courseData.title.length}/100 characters</p>
            </div>

            <div className="ccp-form-group">
              <label className="ccp-label">Description *</label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                placeholder="What will students learn? Include key topics, prerequisites, and outcomes."
                className="ccp-textarea"
                rows={4}
                maxLength={500}
              />
              <p className="ccp-hint">{courseData.description.length}/500 characters</p>
            </div>

            <div className="ccp-row">
              <div className="ccp-form-group">
                <label className="ccp-label">Category *</label>
                <select name="category" value={courseData.category} onChange={handleInputChange} className="ccp-select">
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                  <option value="technology">Technology</option>
                </select>
              </div>

              <div className="ccp-form-group">
                <label className="ccp-label">Level *</label>
                <select name="level" value={courseData.level} onChange={handleInputChange} className="ccp-select">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="ccp-row">
              <div className="ccp-form-group">
                <label className="ccp-label">Price (USD) *</label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  placeholder="0 for free"
                  className="ccp-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="ccp-form-group">
                <label className="ccp-label">Status</label>
                <div className="ccp-status-badge">{courseData.isFree ? '✨ Free' : '💰 Paid'}</div>
              </div>
            </div>
          </div>

          {/* Cover Image Section */}
          <div className="ccp-section">
            <h2 className="ccp-section-title">Course Cover Image</h2>
            <p className="ccp-section-desc">Upload a professional cover image (recommended: 1200x600px)</p>

            <div className="ccp-image-upload">
              {courseData.coverImage ? (
                <div className="ccp-image-preview">
                  <img src={courseData.coverImage} alt="Cover" className="ccp-preview-img" />
                  <button
                    type="button"
                    className="ccp-change-btn"
                    onClick={() => document.getElementById('imageInput').click()}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="ccp-upload-area" onClick={() => document.getElementById('imageInput').click()}>
                  <UploadIcon />
                  <p className="ccp-upload-text">Click to upload or drag and drop</p>
                  <p className="ccp-upload-hint">PNG, JPG, GIF up to 10MB</p>
                </label>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Course Preview */}
            {(courseData.title || courseData.coverImage) && (
              <div className="ccp-preview-card">
                <div className="ccp-preview-wrapper">
                  <img src={courseData.coverImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80'} alt="Preview" className="ccp-preview-cover" />
                  <div className="ccp-preview-overlay">
                    <h3 className="ccp-preview-title">{courseData.title || 'Course Title'}</h3>
                    <p className="ccp-preview-category">{courseData.category} • {courseData.level}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ccp-actions">
          <button className="ccp-btn ccp-btn--secondary" onClick={onBack}>
            Cancel
          </button>
          <button
            className="ccp-btn ccp-btn--success"
            onClick={() => alert('✅ Course Created! Redirecting...')}
            disabled={!isFormValid}
          >
            <PlusIcon /> Create Course
          </button>
        </div>
      </div>
    </div>
  );
}
