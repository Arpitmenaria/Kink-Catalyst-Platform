import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery, uploadPhoto } from '../../store/slices/profileSlice';
import SkeletonImg from '../SkeletonImg';

function CameraIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function GradCapIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>; }

export default function RightSidebar({ onAddEducationClick, onGalleryClick }) {
  const dispatch = useDispatch();
  const { profile, gallery, galleryTotal } = useSelector(s => s.profile);
  const photoInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const displayedGallery = gallery.slice(0, 6);
  const extraCount = galleryTotal > 6 ? galleryTotal - 6 : 0;

  const education = profile?.education ?? [];

  function handlePhotoChosen(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    dispatch(uploadPhoto({ files: file }))
      .then(() => dispatch(fetchGallery()))
      .finally(() => setUploading(false));
  }

  return (
    <aside className="home-right-sidebar">

      {/* Education */}
      <div className="right-card">
        <div className="right-section-header" style={{ padding: '12px 14px 10px' }}>
          <p className="right-section-title">Education</p>
          {education.length > 0 && (
            <button className="section-link" style={{ marginLeft: 'auto' }} onClick={onAddEducationClick}>Edit</button>
          )}
        </div>
        {education.length === 0 ? (
          <div style={{ padding: '0 14px 14px' }}>
            <button className="gallery-add-first-btn" onClick={onAddEducationClick}>
              <GradCapIcon /> Add your education
            </button>
          </div>
        ) : (
          <div className="event-list" style={{ padding: '0 14px 14px' }}>
            {education.slice(0, 3).map((edu, i) => (
              <div key={edu._id ?? edu.id ?? i} className="sidebar-event-item" style={{ cursor: 'pointer' }} onClick={onAddEducationClick}>
                <div className="friend-info">
                  <p className="friend-name">{edu.school}</p>
                  <p className="friend-sub">{[edu.degree, edu.years].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="right-card">
        <div className="right-section-header" style={{ padding: '12px 14px 10px' }}>
          <p className="right-section-title">Gallery</p>
          {displayedGallery.length > 0 && (
            <button className="section-link" style={{ marginLeft: 'auto' }} onClick={onGalleryClick}>View all</button>
          )}
        </div>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoChosen}
        />

        {displayedGallery.length === 0 ? (
          <div style={{ padding: '0 14px 14px' }}>
            <button
              className="gallery-add-first-btn"
              onClick={() => photoInputRef.current?.click()}
              disabled={uploading}
            >
              <CameraIcon />
              {uploading ? 'Uploading…' : 'Add your first photo'}
            </button>
          </div>
        ) : (
          <div className="gallery-grid">
            {displayedGallery.map((src, i) => (
              <div key={i} className="gallery-thumb" style={{ overflow: 'hidden', position: 'relative' }}>
                <SkeletonImg src={src} alt="" />
                {i === 5 && extraCount > 0 && <div className="gallery-more">+{extraCount}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
