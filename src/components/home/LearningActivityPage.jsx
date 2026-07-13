import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import CourseDetailPage from './CourseDetailPage';
import ResourceDetailPage from './ResourceDetailPage';
import HistoryPage from './HistoryPage';
import BookmarkedResourcesPage from './BookmarkedResourcesPage';
import { ALEX_AVATAR } from './mockData';
import { COURSES, RESOURCES, flattenChapters } from './educationData';
import useEducationProgress from './useEducationProgress';
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
function HistoryIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }

const RESOURCE_ICON = { Article: ArticleIcon, Video: VideoFileIcon, Guide: ArticleIcon, Document: PdfIcon };

const ACHIEVEMENTS = [
  { Icon: TrophyIcon,    label: 'Fast Learner', active: true  },
  { Icon: StarBadgeIcon, label: 'Consistency',  active: true  },
  { Icon: MedalIcon,     label: 'Top 1%',       active: false },
];

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function LearningActivityPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const { profile }   = useSelector(s => s.profile);
  const avatarUrl     = profile?.avatar ?? ALEX_AVATAR;
  const firstName     = (profile?.fullName ?? 'Alex Rivera').split(' ')[0];
  const progress = useEducationProgress();
  const [activeCourseId,  setActiveCourseId]  = useState(null);
  const [activeResourceId, setActiveResourceId] = useState(null);
  const [showBookmarks,   setShowBookmarks]   = useState(false);
  const [showHistory,     setShowHistory]     = useState(false);

  if (activeCourseId) return <CourseDetailPage courseId={activeCourseId} onBack={() => setActiveCourseId(null)} />;
  if (activeResourceId) return <ResourceDetailPage resourceId={activeResourceId} onBack={() => setActiveResourceId(null)} />;
  if (showHistory) return <HistoryPage onBack={() => setShowHistory(false)} />;
  if (showBookmarks) return <BookmarkedResourcesPage onBack={() => setShowBookmarks(false)} />;

  function handleNav(id) {
    if (id === 'home')     onBack?.();
    if (id === 'courses')  onBack?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'calendar')  onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  const continueCourses = COURSES
    .filter(c => progress.isEnrolled(c.id) && progress.getCourseProgressPct(c.id, c) < 100)
    .map(c => {
      const chapters = flattenChapters(c);
      const lastId = progress.lastViewedChapter[c.id] ?? chapters[0]?.id;
      const chIdx = Math.max(0, chapters.findIndex(ch => ch.id === lastId));
      const ch = chapters[chIdx];
      const moduleIdx = c.modules.findIndex(m => m.id === ch?.moduleId);
      return {
        ...c,
        pct: progress.getCourseProgressPct(c.id, c),
        moduleLabel: ch ? `Module ${moduleIdx + 1} of ${c.modules.length}: ${ch.moduleTitle.replace(/^Module \d+:\s*/, '')}` : '',
        chapterLabel: ch ? `Chapter ${chIdx + 1} of ${chapters.length}: ${ch.title}` : '',
      };
    });

  const savedResources = RESOURCES.filter(r => progress.isSaved(r.id)).slice(0, 3);

  const STATS = [
    { Icon: CourseListIcon,  value: String(progress.enrolledCourseIds.size), label: 'Total Courses',  color: '#06b6d4' },
    { Icon: CheckCircleIcon, value: String(COURSES.filter(c => progress.isEnrolled(c.id) && progress.getCourseProgressPct(c.id, c) === 100).length), label: 'Completed', color: '#10b981' },
    { Icon: ClockIcon2,      value: '120h', label: 'Learning Hours', color: '#8b5cf6' },
  ];

  function openHistoryEntry(entry) {
    if (entry.type === 'course') setActiveCourseId(entry.courseId);
    else setActiveResourceId(entry.resourceId);
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
              {STATS.map(({ Icon, value, label, color }) => {
                const isCompleted = label === 'Completed';
                return (
                  <div
                    key={label}
                    className="la-stat-card"
                    style={isCompleted ? { cursor: 'pointer' } : undefined}
                    onClick={isCompleted ? () => setShowHistory(true) : undefined}
                    title={isCompleted ? 'View learning history' : undefined}
                  >
                    <div className="la-stat-icon" style={{ color, background: color + '18' }}>
                      <Icon />
                    </div>
                    <p className="la-stat-value">{value}</p>
                    <p className="la-stat-label">{label}</p>
                  </div>
                );
              })}
            </div>

            <div className="la-continue-card">
              <div className="la-card-head">
                <h2 className="la-card-title">Continue Learning</h2>
                <button className="la-view-all">View All</button>
              </div>
              <div className="la-course-list">
                {continueCourses.length === 0 && (
                  <div style={{ color: '#5c6a8c', fontSize: 14, padding: '8px 0' }}>No courses in progress yet.</div>
                )}
                {continueCourses.map((c, i) => (
                  <div key={c.id} className="la-course-item" style={{ '--li': i }}>
                    <img src={c.img} alt={c.title} className="la-course-thumb" />
                    <div className="la-course-body">
                      <div className="la-course-top-row">
                        <div>
                          <p className="la-course-title">{c.title}</p>
                          <p className="la-course-module">{c.moduleLabel}</p>
                        </div>
                        <span className="la-course-pct">{c.pct}%</span>
                      </div>
                      <div className="la-progress-track">
                        <div className="la-progress-fill" style={{ width: `${c.pct}%` }} />
                      </div>
                      <div className="la-course-bottom-row">
                        <p className="la-course-chapter">{c.chapterLabel}</p>
                        <button className="la-play-btn" aria-label="Resume" onClick={() => setActiveCourseId(c.id)}><PlayIcon /></button>
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
                {savedResources.length === 0 && (
                  <div style={{ color: '#5c6a8c', fontSize: 13 }}>No saved resources yet.</div>
                )}
                {savedResources.map(r => {
                  const Icon = RESOURCE_ICON[r.type] ?? ArticleIcon;
                  return (
                    <div key={r.id} className="la-fav-item">
                      <div className="la-fav-icon" style={{ color: '#3b82f6', background: '#3b82f618' }}><Icon /></div>
                      <div className="la-fav-body">
                        <p className="la-fav-title">{r.title}</p>
                        <p className="la-fav-meta">{r.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="la-panel">
              <div className="la-card-head">
                <h2 className="la-card-title">History</h2>
                <button className="la-view-all" onClick={() => setShowHistory(true)}>View All</button>
              </div>
              <div className="la-fav-list">
                {progress.history.length === 0 && (
                  <div style={{ color: '#5c6a8c', fontSize: 13 }}>Nothing viewed yet.</div>
                )}
                {progress.history.slice(0, 10).map((entry, i) => (
                  <div key={i} className="la-fav-item" style={{ cursor: 'pointer' }} onClick={() => openHistoryEntry(entry)}>
                    <div className="la-fav-icon" style={{ color: '#8b5cf6', background: '#8b5cf618' }}><HistoryIcon /></div>
                    <div className="la-fav-body">
                      <p className="la-fav-title">{entry.title}</p>
                      <p className="la-fav-meta">{entry.type === 'course' ? 'Course' : 'Resource'} · {timeAgo(entry.viewedAt)}</p>
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
