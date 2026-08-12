import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import CourseDetailPage from './CourseDetailPage';
import { ALEX_AVATAR } from './mockData';
import { COURSES, RESOURCES } from './educationData';
import useEducationProgress from './useEducationProgress';
import './LearningActivityPage.css';

function PlusIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function PlayIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
}

export default function LearningActivityPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick, onNavigateEducation }) {
  const { profile } = useSelector(s => s.profile);
  const avatarUrl = profile?.avatar ?? ALEX_AVATAR;
  const progress = useEducationProgress();
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');

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

  const ongoingCourses = COURSES.filter(c => progress.isEnrolled(c.id) && progress.getCourseProgressPct(c.id, c) < 100).slice(0, 3);
  const categories = ['All Topics', 'Design', 'Development', 'Business', 'Technology', 'Marketing', 'Finance', 'Soft Skills'];

  let exploreCourses = COURSES;
  if (filterType === 'recommended') {
    exploreCourses = COURSES.filter(c => c.rating >= 4.5);
  } else if (filterType === 'popular') {
    exploreCourses = COURSES.filter(c => c.students >= 100);
  }
  const myCreatedCourses = [
    { id: 'custom-1', title: 'Advanced React Patterns', instructor: 'You', duration: '12h 30m', rating: 4.9, price: '$89.99', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80', category: 'Development', students: 245 },
    { id: 'custom-2', title: 'Web Design Masterclass', instructor: 'You', duration: '15h 45m', rating: 4.8, price: 'Free', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80', category: 'Design', students: 189 },
  ];

  return (
    <div className="lap-page">
      <AnimatedNav activeId="courses" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="lap-main">
        {/* Tab Navigation */}
        <div className="lap-tabs">
          <button
            className={`lap-tab ${activeTab === 'all' ? 'lap-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`lap-tab ${activeTab === 'ongoing' ? 'lap-tab--active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Ongoing Courses
          </button>
          <button
            className={`lap-tab ${activeTab === 'created' ? 'lap-tab--active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            My Created
          </button>
        </div>

        {/* Header with Stats */}
        <div className="lap-header-section">
          <div className="lap-stats-container">
            <div className="lap-stat">
              <div className="lap-stat-icon">📚</div>
              <div className="lap-stat-info">
                <p className="lap-stat-label">COURSES ENROLLED</p>
                <p className="lap-stat-value">3</p>
              </div>
            </div>
            <div className="lap-stat">
              <div className="lap-stat-icon">✅</div>
              <div className="lap-stat-info">
                <p className="lap-stat-label">COMPLETED</p>
                <p className="lap-stat-value">0</p>
              </div>
            </div>
            <div className="lap-stat">
              <div className="lap-stat-icon">⏱️</div>
              <div className="lap-stat-info">
                <p className="lap-stat-label">HOURS SPENT</p>
                <p className="lap-stat-value">48h</p>
              </div>
            </div>
          </div>
          <button className="lap-create-course-btn" onClick={() => onNavigateEducation?.('create')}>
            <PlusIcon /> Create Course
          </button>
        </div>

        {/* Ongoing Courses - Show only in Ongoing tab */}
        {activeTab === 'ongoing' && ongoingCourses.length > 0 && (
          <div className="lap-section">
            <div className="lap-section-header">
              <h2>Ongoing Courses</h2>
              <a href="#" className="lap-see-all">See All</a>
            </div>
            <div className="lap-courses-grid">
              {ongoingCourses.map((course, idx) => {
                const pct = progress.getCourseProgressPct(course.id, course);
                return (
                  <div key={course.id} className="lap-course-card">
                    <div className="lap-course-img-wrapper">
                      <img src={course.img} alt={course.title} className="lap-course-img" />
                      <span className="lap-ongoing-badge">ONGOING</span>
                    </div>
                    <div className="lap-course-content">
                      <h3 className="lap-course-title">{course.title}</h3>
                      <p className="lap-course-price">${course.price || 'Free'}</p>
                      <div className="lap-progress-section">
                        <span className="lap-progress-label">Progress</span>
                        <span className="lap-progress-pct">{pct}%</span>
                      </div>
                      <div className="lap-progress-bar">
                        <div className="lap-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <button className="lap-resume-btn" onClick={() => setActiveCourseId(course.id)}>
                        <PlayIcon /> Resume
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Explore Categories - Show only in All tab */}
        {activeTab === 'all' && (
        <div className="lap-section">
          <div className="lap-section-header">
            <h2>Explore Categories</h2>
          </div>
          <div className="lap-filter-buttons">
            <button
              className={`lap-filter-btn ${filterType === 'all' ? 'lap-filter-btn--active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Courses
            </button>
            <button
              className={`lap-filter-btn ${filterType === 'recommended' ? 'lap-filter-btn--active' : ''}`}
              onClick={() => setFilterType('recommended')}
            >
              Recommended
            </button>
            <button
              className={`lap-filter-btn ${filterType === 'popular' ? 'lap-filter-btn--active' : ''}`}
              onClick={() => setFilterType('popular')}
            >
              Popular
            </button>
          </div>
          {filterType === 'all' && (
            <div className="lap-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`lap-category-btn ${selectedCategory === cat ? 'lap-category-btn--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          <div className="lap-courses-grid">
            {exploreCourses.map(course => (
              <div key={course.id} className="lap-explore-card">
                <div className="lap-card-img-wrapper">
                  <img src={course.img} alt={course.title} className="lap-card-img" />
                </div>
                <div className="lap-card-content">
                  <h3 className="lap-card-title">{course.title}</h3>
                  <div className="lap-card-meta">
                    <span className="lap-instructor">👤 {course.instructor}</span>
                    <span className="lap-rating">⭐ {course.rating}</span>
                  </div>
                  <p className="lap-duration">⏱️ {course.duration}</p>
                  <button className="lap-enroll-btn" onClick={() => setActiveCourseId(course.id)}>
                    Enroll this course {course.price ? `· $${course.price}` : '· Free'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* My Created Courses - Show only in Created tab */}
        {activeTab === 'created' && (
        <div className="lap-section">
          <div className="lap-section-header">
            <h2>My Courses</h2>
            <button className="lap-create-new-btn" onClick={() => onNavigateEducation?.('create')}>
              + Create New
            </button>
          </div>
          {myCreatedCourses.length === 0 ? (
            <div className="lap-empty-state">
              <p className="lap-empty-icon">📚</p>
              <p className="lap-empty-text">You haven't created any courses yet</p>
              <button className="lap-create-course-link" onClick={() => onNavigateEducation?.('create')}>
                Create your first course
              </button>
            </div>
          ) : (
            <div className="lap-courses-grid">
              {myCreatedCourses.map(course => (
                <div key={course.id} className="lap-my-course-card">
                  <div className="lap-card-img-wrapper">
                    <img src={course.img} alt={course.title} className="lap-card-img" />
                  </div>
                  <div className="lap-card-content">
                    <h3 className="lap-card-title">{course.title}</h3>
                    <div className="lap-card-meta">
                      <span className="lap-instructor">👤 {course.instructor}</span>
                      <span className="lap-rating">⭐ {course.rating}</span>
                    </div>
                    <p className="lap-duration">⏱️ {course.duration}</p>
                    <div className="lap-course-stats">
                      <span className="lap-students">{course.students} students</span>
                      <span className="lap-price">{course.price}</span>
                    </div>
                    <div className="lap-course-actions">
                      <button className="lap-edit-btn">Edit</button>
                      <button className="lap-manage-btn">Manage</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

      </div>
    </div>
  );
}
