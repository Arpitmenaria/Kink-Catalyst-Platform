import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery, uploadPhoto } from '../../store/slices/profileSlice';
import SkeletonImg from '../SkeletonImg';
import { COURSES } from './educationData';
import useEducationProgress from './useEducationProgress';

function CameraIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }

export default function RightSidebar({ onCoursesClick, onGalleryClick }) {
  const dispatch = useDispatch();
  const { gallery, galleryTotal } = useSelector(s => s.profile);
  const { enrolledCourseIds, getCourseProgressPct } = useEducationProgress();
  const photoInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const displayedGallery = gallery.slice(0, 6);
  const extraCount = galleryTotal > 6 ? galleryTotal - 6 : 0;

  const enrolledCourses = COURSES
    .filter(c => enrolledCourseIds.has(c.id))
    .slice(0, 3);

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
          <button className="section-link" style={{ marginLeft: 'auto' }} onClick={onCoursesClick}>View all</button>
        </div>
        <div className="event-list" style={{ padding: '0 14px 14px' }}>
          {enrolledCourses.length === 0 && (
            <p style={{ fontSize: 12, color: '#4a5270', margin: 0 }}>No courses yet.</p>
          )}
          {enrolledCourses.map(course => {
            const pct = getCourseProgressPct(course.id, course);
            return (
              <div key={course.id} className="sidebar-event-item" style={{ cursor: 'pointer' }} onClick={onCoursesClick}>
                <div className="event-thumb" style={{ overflow: 'hidden' }}>
                  <img src={course.img} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="friend-info">
                  <p className="friend-name">{course.title}</p>
                  <p className="friend-sub">{pct}% complete</p>
                </div>
              </div>
            );
          })}
        </div>
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
