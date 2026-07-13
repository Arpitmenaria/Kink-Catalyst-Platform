import { useEffect, useState } from 'react';
import { getCourseById, flattenChapters, totalChapterCount, priceLabel } from './educationData';
import useEducationProgress from './useEducationProgress';
import './CourseReaderPage.css';
import './CourseDetailPage.css';

/* ── Icons ── */
function BackArrowIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevLeftIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevRightIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
function CheckIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function BulbIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>; }
function NoteIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function PlayCircleIcon() { return <svg className="cdp-chapter-video-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>; }
function StarIcon()       { return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function ClockIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function SparkIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>; }

const CALLOUT_STYLE = {
  'PRO TIP':     { border: '#06b6d4', bg: '#06b6d408', label: '#06b6d4', Icon: BulbIcon },
  'KEY CONCEPT': { border: '#8b5cf6', bg: '#8b5cf608', label: '#8b5cf6', Icon: NoteIcon },
  'NOTE':        { border: '#f59e0b', bg: '#f59e0b08', label: '#f59e0b', Icon: NoteIcon },
};

export default function CourseDetailPage({ courseId, onBack }) {
  const progress = useEducationProgress();
  const course = getCourseById(courseId);
  const chapters = flattenChapters(course);
  const total = totalChapterCount(course);

  const [selectedChapterId, setSelectedChapterId] = useState(
    () => progress.lastViewedChapter[courseId] ?? chapters[0]?.id
  );
  const [rightIdx, setRightIdx] = useState(0);
  const [rightIdxChapterId, setRightIdxChapterId] = useState(selectedChapterId);

  const chapterIdx = chapters.findIndex(ch => ch.id === selectedChapterId);
  const chapter = chapters[chapterIdx];
  const calloutStyle = chapter?.callout ? (CALLOUT_STYLE[chapter.callout.type] ?? CALLOUT_STYLE['PRO TIP']) : null;
  const pct = progress.getCourseProgressPct(courseId, course);

  if (chapter && chapter.id !== rightIdxChapterId) {
    setRightIdxChapterId(chapter.id);
    setRightIdx(0);
  }

  useEffect(() => {
    if (!course || !chapter) return;
    progress.setLastViewedChapter(courseId, chapter.id);
    progress.logCourseView(courseId, chapter.id, course);
  }, [courseId, chapter?.id]);

  if (!course) {
    return (
      <div className="cr-page">
        <header className="cr-topbar">
          <button className="cr-back-btn" onClick={onBack}><BackArrowIcon /><span className="cr-back-label">Back</span></button>
        </header>
        <div style={{ padding: 40, color: '#94a3b8' }}>Course not found.</div>
      </div>
    );
  }

  function selectChapter(id) {
    setSelectedChapterId(id);
  }

  function prevChapter() {
    const prev = chapters[chapterIdx - 1];
    if (prev) setSelectedChapterId(prev.id);
  }

  function completeAndAdvance() {
    progress.markChapterComplete(courseId, chapter.id);
    const next = chapters[chapterIdx + 1];
    if (next) setSelectedChapterId(next.id);
  }

  const isLastChapter = chapterIdx >= chapters.length - 1;

  return (
    <div className="cr-page">

      {/* ── Top Bar ── */}
      <header className="cr-topbar">
        <div className="cr-topbar-left">
          <button className="cr-back-btn" onClick={onBack}>
            <BackArrowIcon />
            <span className="cr-back-label">{course.title}</span>
          </button>
        </div>

        <div className="cr-topbar-center">
          {!progress.isEnrolled(courseId) && (
            <button className="cdp-enroll-cta" onClick={() => progress.enrollCourse(courseId)}>
              <SparkIcon />
              Enroll this course
              <span className="cdp-enroll-cta-price">{priceLabel(course)}</span>
            </button>
          )}
        </div>

        <div className="cr-topbar-right">
          <span className="cdp-meta-item cdp-meta-item--rating"><StarIcon /> {course.rating}</span>
          <span className="cdp-meta-item"><ClockIcon /> {course.duration}</span>
          <span className="cr-chapter-pill">{course.instructor}</span>
          <span className={`cdp-price-badge cdp-price-badge--highlight${course.isFree ? ' cdp-price-badge--free' : ''}`}>
            <SparkIcon /> Enroll this course <span className="cdp-enroll-cta-price">{priceLabel(course)}</span>
          </span>
        </div>
      </header>

      <div className="cdp-body">

        {/* ── Sidebar: modules / chapters ── */}
        <aside className="cdp-sidebar">
          {course.modules.map(mod => (
            <div key={mod.id} className="cdp-module-group">
              <p className="cdp-module-title">{mod.title}</p>
              {mod.chapters.map(ch => {
                const done = progress.isChapterComplete(courseId, ch.id);
                return (
                  <button
                    key={ch.id}
                    className={`cdp-chapter-row${ch.id === selectedChapterId ? ' cdp-chapter-row--active' : ''}${done ? ' cdp-chapter-row--complete' : ''}`}
                    onClick={() => selectChapter(ch.id)}
                  >
                    <span className={`cdp-chapter-check${done ? ' cdp-chapter-check--done' : ''}`}>
                      {done && <CheckIcon />}
                    </span>
                    <span className="cdp-chapter-row-title">{ch.title}</span>
                    {ch.videoUrl && <PlayCircleIcon />}
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* ── Reader Content ── */}
        <div className="cr-reader cdp-reader">
          <div className="cr-spread">

            <div className="cr-page-left">
              {chapter && (
                <>
                  <p className="cr-chapter-label">{chapter.label}</p>
                  <h1 className="cr-chapter-title">{chapter.title}</h1>
                  {chapter.videoUrl ? (
                    <div className="cdp-video-wrap">
                      <video
                        key={chapter.id}
                        className="cdp-video"
                        src={chapter.videoUrl}
                        poster={chapter.img}
                        controls
                        onEnded={() => progress.markChapterComplete(courseId, chapter.id)}
                      />
                    </div>
                  ) : chapter.img && (
                    <div className="cr-figure">
                      <img src={chapter.img} alt={chapter.title} className="cr-figure-img" />
                      {chapter.figureCaption && <p className="cr-figure-caption">{chapter.figureCaption}</p>}
                    </div>
                  )}
                  <div className="cr-left-body">
                    {chapter.leftBody.map((para, i) => (
                      <p key={i} className="cr-body-text">{para}</p>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="cr-spine" />

            <div className="cr-page-right">
              {chapter && (
                <>
                  {chapter.rightSections.length > 1 && (
                    <div className="cdp-right-nav">
                      <button
                        className="cdp-right-nav-btn"
                        onClick={() => setRightIdx(i => Math.max(0, i - 1))}
                        disabled={rightIdx <= 0}
                        aria-label="Previous section"
                      >
                        <ChevLeftIcon />
                      </button>
                      <span className="cdp-right-nav-count">{rightIdx + 1} / {chapter.rightSections.length}</span>
                      <button
                        className="cdp-right-nav-btn"
                        onClick={() => setRightIdx(i => Math.min(chapter.rightSections.length - 1, i + 1))}
                        disabled={rightIdx >= chapter.rightSections.length - 1}
                        aria-label="Next section"
                      >
                        <ChevRightIcon />
                      </button>
                    </div>
                  )}

                  <div className="cr-right-section">
                    <h2 className="cr-section-heading">{chapter.rightSections[rightIdx].heading}</h2>
                    <p className="cr-body-text">{chapter.rightSections[rightIdx].body}</p>
                  </div>

                  {chapter.callout && (
                    <div className="cr-callout" style={{ borderLeftColor: calloutStyle.border, background: calloutStyle.bg }}>
                      <div className="cr-callout-label" style={{ color: calloutStyle.border }}>
                        <calloutStyle.Icon />
                        {chapter.callout.type}
                      </div>
                      <p className="cr-callout-text">{chapter.callout.text}</p>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <footer className="cr-footer">
        <button
          className="cr-nav-btn cr-nav-btn--prev"
          onClick={prevChapter}
          disabled={chapterIdx <= 0}
        >
          <ChevLeftIcon /> Previous Chapter
        </button>

        <div className="cr-progress-area">
          <div className="cr-progress-track">
            <div className="cr-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="cr-page-label">Chapter {chapterIdx + 1} of {total}</span>
        </div>

        <button
          className="cr-nav-btn cr-nav-btn--next"
          onClick={completeAndAdvance}
        >
          {isLastChapter ? 'Complete Chapter' : 'Next Chapter'} <ChevRightIcon />
        </button>
      </footer>

    </div>
  );
}
