import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import CourseDetailPage from './CourseDetailPage';
import { ALEX_AVATAR } from './mockData';
import { COURSES } from './educationData';
import './LearningActivityPage.css';

function PlusIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function BookOpenIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}

function TrendIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="2v20"/><polyline points="19 7 12 14 5 7"/></svg>;
}

function PlayIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
}

export default function LearningActivityPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick, onNavigateEducation }) {
  const { profile } = useSelector(s => s.profile);
  const avatarUrl = profile?.avatar ?? ALEX_AVATAR;
  const firstName = (profile?.fullName ?? 'Alex Rivera').split(' ')[0];
  const [activeCourseId, setActiveCourseId] = useState(null);

  if (activeCourseId) return <CourseDetailPage courseId={activeCourseId} onBack={() => setActiveCourseId(null)} />;

  const handleNav = (id) => {
    if (id === 'home') onBack?.();
    if (id === 'library') onLibraryClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events') onEventsClick?.();
    if (id === 'friends') onGroupsClick?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  };

  const enrolledCourses = COURSES.slice(0, 3);

  return (
    <div className="lap-page">
      <AnimatedNav activeId="courses" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="lap-container">
        {/* Header Section */}
        <div className="lap-header">
          <div className="lap-welcome">
            <h1 className="lap-title">Welcome Back, {firstName}</h1>
            <p className="lap-subtitle">Ready to continue your learning journey?</p>
          </div>
          <button className="lap-create-btn" onClick={() => onNavigateEducation?.('create')}>
            <PlusIcon /> Create Course
          </button>
        </div>

        {/* Stats Section */}
        <div className="lap-stats-grid">
          <div className="lap-stat-card">
            <div className="lap-stat-icon">📚</div>
            <div className="lap-stat-content">
              <p className="lap-stat-value">8</p>
              <p className="lap-stat-label">Courses Enrolled</p>
            </div>
          </div>
          <div className="lap-stat-card">
            <div className="lap-stat-icon">✅</div>
            <div className="lap-stat-content">
              <p className="lap-stat-value">3</p>
              <p className="lap-stat-label">Completed</p>
            </div>
          </div>
          <div className="lap-stat-card">
            <div className="lap-stat-icon">⏱️</div>
            <div className="lap-stat-content">
              <p className="lap-stat-value">48.5h</p>
              <p className="lap-stat-label">Learning Hours</p>
            </div>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="lap-section">
          <div className="lap-section-header">
            <h2 className="lap-section-title">Continue Learning</h2>
            <a href="#" className="lap-view-all">View All</a>
          </div>

          <div className="lap-courses-grid">
            {enrolledCourses.map((course, idx) => (
              <div key={course.id} className="lap-course-card" onClick={() => setActiveCourseId(course.id)}>
                <div className="lap-course-image">
                  <img src={course.img} alt={course.title} />
                  <button className="lap-play-overlay" aria-label="Play">
                    <PlayIcon />
                  </button>
                </div>
                <div className="lap-course-info">
                  <h3 className="lap-course-title">{course.title}</h3>
                  <p className="lap-course-meta">Module 1 of {course.modules.length}</p>
                  <div className="lap-progress-bar">
                    <div className="lap-progress-fill" style={{ width: `${(idx + 1) * 30}%` }} />
                  </div>
                  <p className="lap-progress-text">{(idx + 1) * 30}% Complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="lap-quick-nav">
          <button className="lap-quick-btn" onClick={() => onNavigateEducation?.('quizzes')}>
            <span className="lap-quick-icon">📝</span>
            <span className="lap-quick-label">Quizzes</span>
          </button>
          <button className="lap-quick-btn" onClick={() => onNavigateEducation?.('assignments')}>
            <span className="lap-quick-icon">✏️</span>
            <span className="lap-quick-label">Assignments</span>
          </button>
          <button className="lap-quick-btn" onClick={() => onNavigateEducation?.('certificates')}>
            <span className="lap-quick-icon">🏆</span>
            <span className="lap-quick-label">Certificates</span>
          </button>
          <button className="lap-quick-btn" onClick={() => onNavigateEducation?.('progress')}>
            <span className="lap-quick-icon">📊</span>
            <span className="lap-quick-label">Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
}
