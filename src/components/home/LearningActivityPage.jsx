import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import CourseDetailPage from './CourseDetailPage';
import { ALEX_AVATAR } from './mockData';
import { courseApi } from '../../services/courseApi';
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
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // API Data
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [exploreCourses, setExploreCourses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ coursesEnrolled: 0, completed: 0, hoursSpent: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    if (!profile?.id) return;
    fetchData();
  }, [profile?.id, activeTab, filterType, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const statsRes = await courseApi.getDashboardStats(profile.id);
      if (statsRes.success) {
        setDashboardStats(statsRes);
      }

      // Fetch enrolled courses
      const enrolledRes = await courseApi.getUserEnrolledCourses(profile.id);
      if (enrolledRes.success) {
        setEnrolledCourses(enrolledRes.courses || []);
      }

      // Fetch created courses
      const createdRes = await courseApi.getUserCreatedCourses(profile.id);
      if (createdRes.success) {
        setCreatedCourses(createdRes.courses || []);
      }

      // Fetch explore courses with filters
      const exploreRes = await courseApi.getAllCourses(filterType, selectedCategory);
      if (exploreRes.success) {
        setExploreCourses(exploreRes.courses || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err?.error || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

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

  const ongoingCourses = enrolledCourses.slice(0, 3);
  const categories = ['All Topics', 'Design', 'Development', 'Business', 'Technology', 'Marketing', 'Finance', 'Soft Skills'];

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
                <p className="lap-stat-value">{dashboardStats.coursesEnrolled || 0}</p>
              </div>
            </div>
            <div className="lap-stat">
              <div className="lap-stat-icon">✅</div>
              <div className="lap-stat-info">
                <p className="lap-stat-label">COMPLETED</p>
                <p className="lap-stat-value">{dashboardStats.completed || 0}</p>
              </div>
            </div>
            <div className="lap-stat">
              <div className="lap-stat-icon">⏱️</div>
              <div className="lap-stat-info">
                <p className="lap-stat-label">HOURS SPENT</p>
                <p className="lap-stat-value">{dashboardStats.hoursSpent || '0h'}</p>
              </div>
            </div>
          </div>
          <button className="lap-create-course-btn" onClick={() => onNavigateEducation?.('create')}>
            <PlusIcon /> Create Course
          </button>
        </div>

        {/* Ongoing Courses - Show only in Ongoing tab */}
        {activeTab === 'ongoing' && (
          <div className="lap-section">
            <div className="lap-section-header">
              <h2>Ongoing Courses</h2>
              <a href="#" className="lap-see-all">See All</a>
            </div>
            {ongoingCourses.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#8b95a5' }}>No ongoing courses</p>
            ) : (
              <div className="lap-courses-grid">
                {ongoingCourses.map((course) => (
                  <div key={course.id} className="lap-course-card">
                    <div className="lap-course-img-wrapper">
                      <img src={course.img} alt={course.title} className="lap-course-img" />
                      <span className="lap-ongoing-badge">ONGOING</span>
                    </div>
                    <div className="lap-course-content">
                      <h3 className="lap-course-title">{course.title}</h3>
                      <p className="lap-course-price">{course.price || 'Free'}</p>
                      <div className="lap-progress-section">
                        <span className="lap-progress-label">Progress</span>
                        <span className="lap-progress-pct">{course.progress || 0}%</span>
                      </div>
                      <div className="lap-progress-bar">
                        <div className="lap-progress-fill" style={{ width: `${course.progress || 0}%` }} />
                      </div>
                      <button className="lap-resume-btn" onClick={() => setActiveCourseId(course.id)}>
                        <PlayIcon /> Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {loading ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#8b95a5' }}>Loading courses...</p>
            ) : error ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ef4444' }}>{error}</p>
            ) : exploreCourses.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#8b95a5' }}>No courses found</p>
            ) : (
              exploreCourses.map(course => (
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
              ))
            )}
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
          {createdCourses.length === 0 ? (
            <div className="lap-empty-state">
              <p className="lap-empty-icon">📚</p>
              <p className="lap-empty-text">You haven't created any courses yet</p>
              <button className="lap-create-course-link" onClick={() => onNavigateEducation?.('create')}>
                Create your first course
              </button>
            </div>
          ) : (
            <div className="lap-courses-grid">
              {createdCourses.map(course => (
                <div key={course.id} className="lap-my-course-card">
                  <div className="lap-card-img-wrapper">
                    <img src={course.img} alt={course.title} className="lap-card-img" />
                  </div>
                  <div className="lap-card-content">
                    <h3 className="lap-card-title">{course.title}</h3>
                    <div className="lap-card-meta">
                      <span className="lap-instructor">👤 You</span>
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
