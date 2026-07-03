import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import ExplorePage from './ExplorePage';
import LearningActivityPage from './LearningActivityPage';
import CourseDetailPage from './CourseDetailPage';
import HistoryPage from './HistoryPage';
import CreatePostModal from './CreatePostModal';
import { ALEX_AVATAR } from './mockData';
import { COURSES, RESOURCES, CATEGORIES, categoryLabel, categoryColor, priceLabel, RESOURCE_TYPE_COLOR } from './educationData';
import useEducationProgress from './useEducationProgress';
import './CoursesPage.css';

/* ── Icons ── */
function StarIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function UserIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function ClockIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function PlayIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function HeartIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function BookIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function CheckCircleIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function TimerIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function ExternalLinkIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
function BackArrowIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }

const CATEGORY_TABS = ['All Topics', ...CATEGORIES.map(c => c.label)];

/* ── Category badge ── */
function CategoryBadge({ categoryId, inline }) {
  const color = categoryColor(categoryId);
  return (
    <span
      className="cs-cat-badge"
      style={{ color, background: color + '22', borderColor: color + '44', ...(inline ? { position: 'static' } : null) }}
    >
      {categoryLabel(categoryId)}
    </span>
  );
}

/* ── Price badge ── */
function PriceBadge({ course }) {
  const free = course.isFree;
  const color = free ? '#10b981' : '#f59e0b';
  return (
    <span className="cs-cat-badge" style={{ color, background: color + '22', borderColor: color + '44' }}>
      {priceLabel(course)}
    </span>
  );
}

/* ── Resource type badge ── */
function ResourceTypeBadge({ type }) {
  const color = RESOURCE_TYPE_COLOR[type] ?? '#818cf8';
  return (
    <span className="cs-cat-badge" style={{ color, background: color + '22', borderColor: color + '44' }}>
      {type}
    </span>
  );
}

export default function CoursesPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const { profile }        = useSelector(s => s.profile);
  const avatarUrl          = profile?.avatar ?? ALEX_AVATAR;
  const progress = useEducationProgress();

  const [activeCategory,   setActiveCategory]   = useState('All Topics');
  const [wishlist,         setWishlist]         = useState(new Set());
  const [showExplore,      setShowExplore]      = useState(false);
  const [showActivity,     setShowActivity]     = useState(false);
  const [activeCourseId,   setActiveCourseId]   = useState(null);
  const [showHistory,      setShowHistory]      = useState(false);
  const [createPostOpen,   setCreatePostOpen]   = useState(false);

  if (activeCourseId) return <CourseDetailPage courseId={activeCourseId} onBack={() => setActiveCourseId(null)} />;
  if (showHistory) return <HistoryPage onBack={() => setShowHistory(false)} />;
  if (showExplore)   return <ExplorePage onBack={() => setShowExplore(false)} onOpenCourse={id => { setShowExplore(false); setActiveCourseId(id); }} />;
  if (showActivity)  return (
    <LearningActivityPage
      onBack={() => setShowActivity(false)}
      onLibraryClick={onLibraryClick}
      onMessagesClick={onMessagesClick}
      onEventsClick={onEventsClick}
      onGroupsClick={onGroupsClick}
      onCalendarClick={onCalendarClick}
    />
  );

  function handleNav(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onBack?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'calendar')  onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  function toggleWishlist(id) {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const ongoingCourses = COURSES.filter(c => progress.isEnrolled(c.id) && progress.getCourseProgressPct(c.id, c) < 100);
  const completedCount = COURSES.filter(c => progress.isEnrolled(c.id) && progress.getCourseProgressPct(c.id, c) === 100).length;

  const STAT_CARDS = [
    { Icon: BookIcon,       label: 'COURSES ENROLLED', value: String(progress.enrolledCourseIds.size), color: '#3b82f6' },
    { Icon: CheckCircleIcon,label: 'COMPLETED',         value: String(completedCount),                  color: '#10b981' },
    { Icon: TimerIcon,      label: 'HOURS SPENT',       value: '48h',                                   color: '#8b5cf6' },
    { Icon: HeartIcon,      label: 'FAVOURITES',        value: String(wishlist.size),                   color: '#ef4444' },
  ];

  const filteredExplore = (activeCategory === 'All Topics'
    ? COURSES
    : COURSES.filter(c => categoryLabel(c.category) === activeCategory)
  ).slice(0, 4);

  const recommended = COURSES
    .filter(c => !filteredExplore.some(fc => fc.id === c.id))
    .slice(0, 3);

  const popularResources = RESOURCES.slice(0, 3);

  return (
    <>
    <div className="courses-page">
      <AnimatedNav activeId="courses" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="courses-main">

        <button className="cs-back-btn" onClick={onBack} title="Back to Feed">
          <BackArrowIcon />
        </button>

        {/* ── Stats row ── */}
        <div className="cs-stats-row">
          {STAT_CARDS.map(({ Icon, label, value, color }) => {
            const isCompleted = label === 'COMPLETED';
            return (
              <div
                key={label}
                className="cs-stat-card"
                style={isCompleted ? { cursor: 'pointer' } : undefined}
                onClick={isCompleted ? () => setShowHistory(true) : undefined}
                title={isCompleted ? 'View learning history' : undefined}
              >
                <div className="cs-stat-icon" style={{ color, background: color + '18' }}>
                  <Icon />
                </div>
                <div className="cs-stat-body">
                  <p className="cs-stat-label">{label}</p>
                  <p className="cs-stat-value">{value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Ongoing Courses ── */}
        <section className="cs-section">
          <div className="cs-section-head">
            <h2 className="cs-section-title">Ongoing Courses</h2>
            <button className="cs-link" onClick={() => setShowActivity(true)}>See All</button>
          </div>
          <div className="cs-ongoing-grid">
            {ongoingCourses.length === 0 && (
              <div style={{ color: '#5c6a8c', fontSize: 14, padding: '12px 0' }}>No ongoing courses yet — enroll in one below to get started.</div>
            )}
            {ongoingCourses.map((c, i) => {
              const pct = progress.getCourseProgressPct(c.id, c);
              return (
                <div key={c.id} className="cs-ongoing-card" style={{ '--ci': i, cursor: 'pointer' }} onClick={() => setActiveCourseId(c.id)}>
                  <div className="cs-ongoing-thumb">
                    <img src={c.img} alt={c.title} />
                    <span className="cs-ongoing-badge">ONGOING</span>
                  </div>
                  <div className="cs-ongoing-body">
                    <p className="cs-ongoing-title">{c.title}</p>
                    <div className="cs-progress-row">
                      <span className="cs-progress-label">Progress</span>
                      <span className="cs-progress-pct">{pct}%</span>
                    </div>
                    <div className="cs-progress-track">
                      <div className="cs-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <button className="cs-resume-btn"><PlayIcon /> Resume</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Explore Categories ── */}
        <section className="cs-section">
          <div className="cs-section-head">
            <h2 className="cs-section-title">Explore Categories</h2>
            <button className="cs-link" onClick={() => setShowExplore(true)}>Explore All</button>
          </div>

          <div className="cs-tabs-row">
            {CATEGORY_TABS.map(cat => (
              <button
                key={cat}
                className={`cs-tab${activeCategory === cat ? ' cs-tab--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="cs-explore-grid">
            {filteredExplore.map((c, i) => {
              const enrolled = progress.isEnrolled(c.id);
              return (
                <div key={c.id} className="cs-explore-card" style={{ '--ci': i }}>
                  <div className="cs-explore-thumb" onClick={() => setActiveCourseId(c.id)} style={{ cursor: 'pointer' }}>
                    <img src={c.img} alt={c.title} />
                    <CategoryBadge categoryId={c.category} />
                  </div>
                  <div className="cs-explore-body">
                    <p className="cs-explore-title" onClick={() => setActiveCourseId(c.id)} style={{ cursor: 'pointer' }}>{c.title}</p>
                    <div className="cs-explore-meta">
                      <span className="cs-meta-item"><UserIcon /> {c.instructor}</span>
                      <span className="cs-meta-item cs-meta-rating"><StarIcon /> {c.rating}</span>
                      <PriceBadge course={c} />
                    </div>
                    <div className="cs-explore-footer">
                      <span className="cs-duration"><ClockIcon /> {c.duration}</span>
                      <button
                        className={`cs-enroll-btn${enrolled ? ' cs-enroll-btn--done' : ''}`}
                        onClick={() => enrolled ? progress.unenrollCourse(c.id) : progress.enrollCourse(c.id)}
                      >
                        {enrolled ? 'Enrolled ✓' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Recommended for You ── */}
        <section className="cs-section">
          <div className="cs-section-head">
            <h2 className="cs-section-title">Recommended for You</h2>
            <button className="cs-link" onClick={() => setShowExplore(true)}>View All</button>
          </div>
          <div className="cs-rec-grid">
            {recommended.map((c, i) => (
              <div key={c.id} className="cs-rec-card" style={{ '--ci': i }}>
                <div className="cs-rec-thumb" onClick={() => setActiveCourseId(c.id)} style={{ cursor: 'pointer' }}>
                  <img src={c.img} alt={c.title} />
                  <CategoryBadge categoryId={c.category} />
                </div>
                <div className="cs-rec-body">
                  <p className="cs-rec-title" onClick={() => setActiveCourseId(c.id)} style={{ cursor: 'pointer' }}>{c.title}</p>
                  <div className="cs-rec-meta">
                    <span className="cs-meta-item"><UserIcon /> {c.instructor}</span>
                    <span className="cs-meta-item cs-meta-rating"><StarIcon /> {c.rating}</span>
                    <PriceBadge course={c} />
                  </div>
                  <div className="cs-rec-footer">
                    <span className="cs-duration"><ClockIcon /> {c.duration}</span>
                    <button
                      className={`cs-wish-btn${wishlist.has(c.id) ? ' cs-wish-btn--active' : ''}`}
                      onClick={() => toggleWishlist(c.id)}
                      aria-label="Wishlist"
                    >
                      <HeartIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Popular Resources ── */}
        <section className="cs-section cs-section--last">
          <div className="cs-section-head">
            <h2 className="cs-section-title">Popular Resources</h2>
            <button className="cs-link" onClick={() => onLibraryClick?.()}>View All</button>
          </div>
          <div className="cs-rec-grid">
            {popularResources.map((r, i) => (
              <div key={r.id} className="cs-rec-card" style={{ '--ci': i }}>
                <div className="cs-rec-thumb" onClick={() => onLibraryClick?.()} style={{ cursor: 'pointer' }}>
                  <img src={r.img} alt={r.title} />
                  <ResourceTypeBadge type={r.type} />
                </div>
                <div className="cs-rec-body">
                  <p className="cs-rec-title" onClick={() => onLibraryClick?.()} style={{ cursor: 'pointer' }}>{r.title}</p>
                  <p className="cs-resource-desc">{r.desc}</p>
                  <div className="cs-rec-footer">
                    <CategoryBadge categoryId={r.category} inline />
                    <button
                      className={`cs-resource-action cs-resource-action--${r.type === 'Video' ? 'video' : 'pdf'}`}
                      style={{ marginLeft: 'auto' }}
                      onClick={() => onLibraryClick?.()}
                    >
                      <ExternalLinkIcon /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
    {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}
    </>
  );
}
