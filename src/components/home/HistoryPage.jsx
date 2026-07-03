import { getCourseById, getResourceById, RESOURCE_TYPE_COLOR } from './educationData';
import useEducationProgress from './useEducationProgress';
import CourseDetailPage from './CourseDetailPage';
import ResourceDetailPage from './ResourceDetailPage';
import { useState } from 'react';
import './HistoryPage.css';

/* ── Icons ── */
function BackArrowIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function CourseIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function ArticleIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function TrashIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>; }
function ClockIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function CalendarIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function TrendIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function isToday(iso) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

function isThisWeek(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  return diff >= 0 && diff < 7 * 86400000;
}

function groupByDay(history) {
  const groups = [];
  let lastLabel = null;
  for (const entry of history) {
    const d = new Date(entry.viewedAt);
    const today = new Date();
    const isTodayEntry = d.toDateString() === today.toDateString();
    const yest = new Date(today); yest.setDate(today.getDate() - 1);
    const isYesterday = d.toDateString() === yest.toDateString();
    const label = isTodayEntry ? 'Today' : isYesterday ? 'Yesterday' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (label !== lastLabel) {
      groups.push({ label, entries: [] });
      lastLabel = label;
    }
    groups[groups.length - 1].entries.push(entry);
  }
  return groups;
}

export default function HistoryPage({ onBack }) {
  const progress = useEducationProgress();
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeResourceId, setActiveResourceId] = useState(null);

  if (activeCourseId) return <CourseDetailPage courseId={activeCourseId} onBack={() => setActiveCourseId(null)} />;
  if (activeResourceId) return <ResourceDetailPage resourceId={activeResourceId} onBack={() => setActiveResourceId(null)} />;

  function openEntry(entry) {
    if (entry.type === 'course') setActiveCourseId(entry.courseId);
    else setActiveResourceId(entry.resourceId);
  }

  const groups = groupByDay(progress.history);

  const STAT_CARDS = [
    { Icon: ClockIcon,    label: 'VIEWED TODAY',     value: String(progress.history.filter(h => isToday(h.viewedAt)).length),     color: '#06b6d4' },
    { Icon: CalendarIcon, label: 'VIEWED THIS WEEK',  value: String(progress.history.filter(h => isThisWeek(h.viewedAt)).length), color: '#8b5cf6' },
    { Icon: TrendIcon,    label: 'TOTAL VIEWED',      value: String(progress.history.length),                                     color: '#10b981' },
  ];

  return (
    <div className="hp-page">
      <header className="hp-topbar">
        <button className="hp-back-btn" onClick={onBack} title="Back to Library">
          <BackArrowIcon />
        </button>
        {progress.history.length > 0 && (
          <button className="hp-clear-btn" onClick={() => progress.clearHistory()}>
            <TrashIcon /> Clear History
          </button>
        )}
      </header>

      <div className="hp-body">
        <div className="hp-head">
          <h1 className="hp-title">Learning History</h1>
          <p className="hp-sub">Everything you've viewed across courses and the library, most recent first.</p>
        </div>

        <div className="hp-stats-row">
          {STAT_CARDS.map(({ Icon, label, value, color }, i) => (
            <div key={label} className="hp-stat-card" style={{ '--ci': i }}>
              <div className="hp-stat-icon" style={{ color, background: color + '18' }}>
                <Icon />
              </div>
              <div className="hp-stat-body">
                <p className="hp-stat-label">{label}</p>
                <p className="hp-stat-value">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 ? (
          <div className="hp-empty">Nothing viewed yet — courses and resources you open will show up here.</div>
        ) : (
          groups.map(group => (
            <div key={group.label} className="hp-group">
              <p className="hp-group-label">{group.label}</p>
              <div className="hp-list">
                {group.entries.map((entry, i) => {
                  const target = entry.type === 'course' ? getCourseById(entry.courseId) : getResourceById(entry.resourceId);
                  const typeLabel = entry.type === 'course' ? 'Course' : target?.type ?? 'Resource';
                  const badgeColor = entry.type === 'course' ? '#3b82f6' : (RESOURCE_TYPE_COLOR[target?.type] ?? '#818cf8');
                  return (
                    <button key={i} className="hp-item" onClick={() => openEntry(entry)}>
                      <img src={entry.img} alt="" className="hp-item-img" />
                      <div className="hp-item-body">
                        <p className="hp-item-title">{entry.title}</p>
                        <p className="hp-item-meta">
                          {entry.type === 'course' ? <CourseIcon /> : <ArticleIcon />}
                          {timeAgo(entry.viewedAt)}
                        </p>
                      </div>
                      <span
                        className="hp-item-badge"
                        style={{ color: badgeColor, background: badgeColor + '22', borderColor: badgeColor + '44' }}
                      >
                        {typeLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
