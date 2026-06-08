import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import CourseReaderPage from './CourseReaderPage';
import BookmarkedResourcesPage from './BookmarkedResourcesPage';
import { ALEX_AVATAR } from './mockData';
import './LearningActivityPage.css';

/* ── Icons ── */
function PlayIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function DotsIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }

function CourseListIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function CheckCircleIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function ClockIcon2()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }

function TrophyIcon()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/><rect x="6" y="18" width="12" height="4" rx="1"/><path d="M18 9a6 6 0 0 1-12 0"/></svg>; }
function StarBadgeIcon(){ return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function MedalIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="6"/><path d="M8.21 9.42L7 4l5 2 5-2-1.21 5.42"/></svg>; }

function ArticleIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function VideoFileIcon(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>; }
function PdfIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>; }

/* ── Static data ── */
const STATS = [
  { Icon: CourseListIcon,  value: '12',   label: 'Total Courses',  color: '#06b6d4' },
  { Icon: CheckCircleIcon, value: '5',    label: 'Completed',      color: '#10b981' },
  { Icon: ClockIcon2,      value: '120h', label: 'Learning Hours', color: '#8b5cf6' },
];

const CONTINUE_COURSES = [
  { id: 1, title: 'Advanced UI Design Systems',       module: 'Module 4: Tokens & Components',   chapter: 'Chapter 7 of 10: Component Architecture', progress: 65, img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&q=80&fit=crop' },
  { id: 2, title: 'Product Management Fundamentals',  module: 'Module 2: User Research Ethics',  chapter: 'Chapter 4 of 8: User Interview Ethics',   progress: 32, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80&fit=crop' },
  { id: 3, title: 'React Performance Patterns',       module: 'Module 1: Profiling & Rendering', chapter: 'Chapter 2 of 12: React DevTools',          progress: 18, img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&q=80&fit=crop' },
];

const ACHIEVEMENTS = [
  { Icon: TrophyIcon,    label: 'Fast Learner', active: true  },
  { Icon: StarBadgeIcon, label: 'Consistency',  active: true  },
  { Icon: MedalIcon,     label: 'Top 1%',       active: false },
];

const FAVORITES = [
  { Icon: ArticleIcon,   title: 'Principles of Web Accessibility', meta: '8 min read',   color: '#3b82f6' },
  { Icon: VideoFileIcon, title: 'Micro-interactions in Figma',     meta: '12 min video', color: '#8b5cf6' },
  { Icon: PdfIcon,       title: 'UX Interview Cheatsheet',         meta: 'PDF • 1.2 MB', color: '#f59e0b' },
];

export default function LearningActivityPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick }) {
  const { profile }   = useSelector(s => s.profile);
  const avatarUrl     = profile?.avatar ?? ALEX_AVATAR;
  const firstName     = (profile?.fullName ?? 'Alex Rivera').split(' ')[0];
  const [activeCourse,    setActiveCourse]    = useState(null);
  const [showBookmarks,   setShowBookmarks]   = useState(false);

  if (activeCourse)  return <CourseReaderPage course={activeCourse} onBack={() => setActiveCourse(null)} />;
  if (showBookmarks) return <BookmarkedResourcesPage onBack={() => setShowBookmarks(false)} />;

  function handleNav(id) {
    if (id === 'home')     onBack?.();
    if (id === 'courses')  onBack?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'calendar') onCalendarClick?.();
  }

  return (
    <div className="la-page">
      <AnimatedNav activeId="courses" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="la-main">

        {/* Welcome */}
        <div className="la-welcome">
          <h1 className="la-welcome-title">Welcome Back, {firstName}</h1>
          <p className="la-welcome-sub">Ready to continue your learning journey today?</p>
        </div>

        {/* ── Two-column content grid ── */}
        <div className="la-content-grid">

          {/* LEFT: stat cards + continue learning */}
          <div className="la-left-col">
            <div className="la-stats-row">
              {STATS.map(({ Icon, value, label, color }) => (
                <div key={label} className="la-stat-card">
                  <div className="la-stat-icon" style={{ color, background: color + '18' }}>
                    <Icon />
                  </div>
                  <p className="la-stat-value">{value}</p>
                  <p className="la-stat-label">{label}</p>
                </div>
              ))}
            </div>

            <div className="la-continue-card">
              <div className="la-card-head">
                <h2 className="la-card-title">Continue Learning</h2>
                <button className="la-view-all">View All</button>
              </div>
              <div className="la-course-list">
                {CONTINUE_COURSES.map((c, i) => (
                  <div key={c.id} className="la-course-item" style={{ '--li': i }}>
                    <img src={c.img} alt={c.title} className="la-course-thumb" />
                    <div className="la-course-body">
                      <div className="la-course-top-row">
                        <div>
                          <p className="la-course-title">{c.title}</p>
                          <p className="la-course-module">{c.module}</p>
                        </div>
                        <span className="la-course-pct">{c.progress}%</span>
                      </div>
                      <div className="la-progress-track">
                        <div className="la-progress-fill" style={{ width: `${c.progress}%` }} />
                      </div>
                      <div className="la-course-bottom-row">
                        <p className="la-course-chapter">{c.chapter}</p>
                        <button className="la-play-btn" aria-label="Resume" onClick={() => setActiveCourse(c)}><PlayIcon /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: achievements + favorites stacked */}
          <div className="la-right-col">

            <div className="la-stat-card la-achievements-card">
              <p className="la-achievements-heading">Achievements</p>
              <div className="la-achievements-row">
                {ACHIEVEMENTS.map(({ Icon, label, active }) => (
                  <div key={label} className={`la-achievement${active ? ' la-achievement--active' : ''}`}>
                    <div className="la-achievement-icon"><Icon /></div>
                    <span className="la-achievement-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="la-panel">
              <div className="la-card-head">
                <h2 className="la-card-title">Favorites</h2>
                <button className="la-dots-btn" aria-label="View all bookmarks" onClick={() => setShowBookmarks(true)}><DotsIcon /></button>
              </div>
              <div className="la-fav-list">
                {FAVORITES.map(({ Icon, title, meta, color }, i) => (
                  <div key={i} className="la-fav-item">
                    <div className="la-fav-icon" style={{ color, background: color + '18' }}><Icon /></div>
                    <div className="la-fav-body">
                      <p className="la-fav-title">{title}</p>
                      <p className="la-fav-meta">{meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
