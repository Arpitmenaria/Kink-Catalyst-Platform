import { useState } from 'react';
import { COURSES } from './educationData';
import useEducationProgress from './useEducationProgress';
import CourseDetailPage from './CourseDetailPage';
import './HistoryPage.css';
import './CoursesPage.css';
import './EnrolledCoursesPage.css';

/* ── Icons ── */
function BackArrowIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function PlayIcon()      { return <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function UserIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function ClockIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }

export default function EnrolledCoursesPage({ onBack }) {
  const progress = useEducationProgress();
  const [activeCourseId, setActiveCourseId] = useState(null);

  if (activeCourseId) return <CourseDetailPage courseId={activeCourseId} onBack={() => setActiveCourseId(null)} />;

  const enrolled = COURSES.filter(c => progress.isEnrolled(c.id));

  return (
    <div className="hp-page">
      <header className="hp-topbar">
        <button className="hp-back-btn" onClick={onBack} title="Back to Courses">
          <BackArrowIcon />
        </button>
      </header>

      <div className="hp-body ecp-body">
        <div className="hp-head">
          <h1 className="hp-title">Enrolled Courses</h1>
          <p className="hp-sub">{enrolled.length} course{enrolled.length === 1 ? '' : 's'} you're enrolled in, most recently added first.</p>
        </div>

        {enrolled.length === 0 ? (
          <div className="hp-empty">You haven't enrolled in any courses yet — head back to Courses to get started.</div>
        ) : (
          <div className="cs-ongoing-grid ecp-grid">
            {enrolled.map((c, i) => {
              const pct = progress.getCourseProgressPct(c.id, c);
              const complete = pct === 100;
              return (
                <div
                  key={c.id}
                  className="cs-ongoing-card"
                  style={{ '--ci': i, cursor: 'pointer' }}
                  onClick={() => setActiveCourseId(c.id)}
                >
                  <div className="cs-ongoing-thumb">
                    <img src={c.img} alt={c.title} />
                    <span className="cs-ongoing-badge" style={complete ? { background: '#10b981' } : undefined}>
                      {complete ? 'COMPLETED' : 'ONGOING'}
                    </span>
                  </div>
                  <div className="cs-ongoing-body">
                    <p className="cs-ongoing-title">{c.title}</p>
                    <p className="ecp-card-meta">
                      <UserIcon /> {c.instructor}
                      <span className="ecp-meta-sep">·</span>
                      <ClockIcon /> {c.duration}
                    </p>
                    <div className="cs-progress-row">
                      <span className="cs-progress-label">Progress</span>
                      <span className="cs-progress-pct">{pct}%</span>
                    </div>
                    <div className="cs-progress-track">
                      <div className="cs-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <button className="cs-resume-btn"><PlayIcon /> {complete ? 'Review' : 'Resume'}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
