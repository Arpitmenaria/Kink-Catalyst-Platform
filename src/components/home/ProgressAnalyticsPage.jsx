import AnimatedNav from './AnimatedNav';
import { ALEX_AVATAR } from './mockData';
import './EducationPages.css';

export default function ProgressAnalyticsPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const stats = [
    { label: 'Courses Enrolled', value: '8', color: '#3b82f6' },
    { label: 'Courses Completed', value: '3', color: '#10b981' },
    { label: 'Learning Hours', value: '48.5', color: '#f59e0b' },
    { label: 'Avg Score', value: '88%', color: '#8b5cf6' },
  ];

  const handleNav = (id) => {
    if (id === 'home') onBack?.();
    if (id === 'library') onLibraryClick?.();
  };

  return (
    <div className="ep-page">
      <AnimatedNav avatarUrl={ALEX_AVATAR} activeNav="courses" onNav={handleNav} />
      <div className="ep-container">
        <div className="ep-header">
          <button className="ep-back-btn" onClick={onBack}>← Back</button>
          <h1 className="ep-title">Learning Analytics</h1>
        </div>

        <div className="pa-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="pa-stat-box">
              <div className="pa-stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="pa-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="pa-section">
          <h2 className="pa-section-title">Recent Activity</h2>
          <div className="pa-timeline">
            <div className="pa-event">
              <div className="pa-event-dot"></div>
              <div><strong>Completed Quiz:</strong> React Hooks Basics - 92%</div>
              <div className="pa-event-date">Today</div>
            </div>
            <div className="pa-event">
              <div className="pa-event-dot"></div>
              <div><strong>Watched Lesson:</strong> Component Architecture - 15 min</div>
              <div className="pa-event-date">Yesterday</div>
            </div>
            <div className="pa-event">
              <div className="pa-event-dot"></div>
              <div><strong>Submitted Assignment:</strong> Custom Hook Implementation - 95%</div>
              <div className="pa-event-date">2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
