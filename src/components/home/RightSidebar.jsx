import { COURSES } from './educationData';
import useEducationProgress from './useEducationProgress';

export default function RightSidebar({ onCoursesClick }) {
  const { enrolledCourseIds, getCourseProgressPct } = useEducationProgress();

  const enrolledCourses = COURSES
    .filter(c => enrolledCourseIds.has(c.id))
    .slice(0, 3);

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

    </aside>
  );
}
