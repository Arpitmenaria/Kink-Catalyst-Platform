import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ALEX_AVATAR } from './mockData';
import './ExplorePage.css';

/* ── Icons ── */
function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function BellIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function ClockIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function StarIcon()   { return <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function ChevronIcon(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function GridIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function ListIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function ChevLeft()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevRight()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
function UserIcon()   { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function BackIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }

/* ── Mock data ── */
const DIFFICULTY_COLOR = {
  ADVANCED:     { bg: '#0e7490', text: '#67e8f9' },
  INTERMEDIATE: { bg: '#92400e', text: '#fcd34d' },
  BEGINNER:     { bg: '#065f46', text: '#6ee7b7' },
};

const ALL_COURSES = [
  { id: 1,  title: 'Advanced Design Systems & Scalable UI Frameworks', difficulty: 'ADVANCED',     instructor: 'Arjun Ivatury',   instructorImg: null,  duration: '12h 30m', rating: 4.9, reviews: '1.2k', category: 'Design',      img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80&fit=crop' },
  { id: 2,  title: 'Full-Stack Web Architecture with Modern Frameworks', difficulty: 'INTERMEDIATE', instructor: 'Sarah Linden',    instructorImg: null,  duration: '24h 45m', rating: 4.8, reviews: '850',  category: 'Development', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80&fit=crop' },
  { id: 3,  title: 'Data Science for Business & Analytics Professionals', difficulty: 'BEGINNER',    instructor: 'Marcus Kane',     instructorImg: null,  duration: '8h 15m',  rating: 4.7, reviews: '2.4k', category: 'Technology',  img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop' },
  { id: 4,  title: 'Modern Branding Strategies for Digital Products',    difficulty: 'INTERMEDIATE', instructor: 'Elena Wong',      instructorImg: null,  duration: '15h 20m', rating: 4.9, reviews: '540',  category: 'Marketing',   img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80&fit=crop' },
  { id: 5,  title: 'Growth Marketing Mastery & Funnel Optimization',    difficulty: 'ADVANCED',     instructor: 'James Doe',       instructorImg: null,  duration: '18h 00m', rating: 5.0, reviews: '105',  category: 'Marketing',   img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop' },
  { id: 6,  title: 'Python for Machine Learning & AI Development',      difficulty: 'INTERMEDIATE', instructor: 'Aria Chen',       instructorImg: null,  duration: '20h 10m', rating: 4.8, reviews: '970',  category: 'Technology',  img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80&fit=crop' },
  { id: 7,  title: 'Financial Modeling for Business Leaders',           difficulty: 'BEGINNER',     instructor: 'Marcus Thorne',   instructorImg: null,  duration: '6h 45m',  rating: 4.6, reviews: '320',  category: 'Finance',     img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80&fit=crop' },
  { id: 8,  title: 'UX Research Methods & Usability Testing',          difficulty: 'BEGINNER',     instructor: 'Sophie Moreau',   instructorImg: null,  duration: '10h 30m', rating: 4.7, reviews: '610',  category: 'Design',      img: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=600&q=80&fit=crop' },
  { id: 9,  title: 'Blockchain & Decentralized Finance Fundamentals',   difficulty: 'ADVANCED',     instructor: 'Dr. Kai Vance',   instructorImg: null,  duration: '14h 00m', rating: 4.9, reviews: '430',  category: 'Technology',  img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80&fit=crop' },
  { id: 10, title: 'Leadership & Team Management for Tech Leads',       difficulty: 'INTERMEDIATE', instructor: 'Dr. Sarah Jenkins',instructorImg: null, duration: '9h 20m',  rating: 4.8, reviews: '760',  category: 'Business',    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop' },
  { id: 11, title: 'React Performance Patterns & Optimization',         difficulty: 'ADVANCED',     instructor: 'Leo Zhang',       instructorImg: null,  duration: '11h 15m', rating: 4.9, reviews: '1.1k', category: 'Development', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop' },
  { id: 12, title: 'Product Management: From Ideation to Launch',       difficulty: 'INTERMEDIATE', instructor: 'Sophia Bloom',    instructorImg: null,  duration: '16h 50m', rating: 4.7, reviews: '890',  category: 'Business',    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fit=crop' },
];

const DIFFICULTY_OPTS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const DURATION_OPTS   = ['Any length', 'Under 5h', '5h – 10h', '10h – 20h', '20h+'];
const CATEGORY_OPTS   = ['All Categories', 'Design', 'Development', 'Technology', 'Business', 'Finance', 'Marketing'];

const PAGE_SIZE = 8;

function DiffBadge({ level }) {
  const c = DIFFICULTY_COLOR[level] ?? { bg: '#1e293b', text: '#94a3b8' };
  return (
    <span className="ep-diff-badge" style={{ background: c.bg, color: c.text }}>
      {level}
    </span>
  );
}

function InstructorAvatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors   = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
  const color    = colors[name.charCodeAt(0) % colors.length];
  return (
    <span className="ep-instructor-avatar" style={{ background: color }}>
      {initials}
    </span>
  );
}

function CourseCard({ course, idx }) {
  const [enrolled, setEnrolled] = useState(false);
  return (
    <div className="ep-card" style={{ '--ci': idx }}>
      <div className="ep-card-thumb">
        <img src={course.img} alt={course.title} loading="lazy" />
        <DiffBadge level={course.difficulty} />
      </div>
      <div className="ep-card-body">
        <h3 className="ep-card-title">{course.title}</h3>
        <div className="ep-card-instructor">
          <InstructorAvatar name={course.instructor} />
          <span className="ep-instructor-name">{course.instructor}</span>
        </div>
        <div className="ep-card-meta">
          <span className="ep-meta-item"><ClockIcon /> {course.duration}</span>
          <span className="ep-meta-item ep-rating"><StarIcon /> {course.rating} <span className="ep-review-count">({course.reviews})</span></span>
        </div>
        <button
          className={`ep-enroll-btn${enrolled ? ' ep-enroll-btn--done' : ''}`}
          onClick={() => setEnrolled(e => !e)}
        >
          {enrolled ? 'Enrolled ✓' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
}

function Dropdown({ label, value, opts, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ep-dropdown" onBlur={() => setOpen(false)} tabIndex={0}>
      <button className="ep-dropdown-btn" onClick={() => setOpen(o => !o)}>
        <span className="ep-dropdown-label">{label}</span>
        <span className="ep-dropdown-value">{value}</span>
        <span className={`ep-dropdown-arrow${open ? ' ep-dropdown-arrow--open' : ''}`}><ChevronIcon /></span>
      </button>
      {open && (
        <div className="ep-dropdown-menu">
          {opts.map(opt => (
            <button
              key={opt}
              className={`ep-dropdown-item${value === opt ? ' ep-dropdown-item--active' : ''}`}
              onMouseDown={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage({ onBack }) {
  const { profile } = useSelector(s => s.profile);
  const avatarUrl   = profile?.avatar ?? ALEX_AVATAR;
  const displayName = profile?.fullName ?? 'Alex Rivera';

  const [difficulty, setDifficulty] = useState('All Levels');
  const [duration,   setDuration]   = useState('Any length');
  const [category,   setCategory]   = useState('All Categories');
  const [viewMode,   setViewMode]   = useState('grid');
  const [page,       setPage]       = useState(1);

  const TOTAL_PAGES = 12;

  const filtered = ALL_COURSES.filter(c => {
    const diffOk = difficulty === 'All Levels'    || c.difficulty === difficulty.toUpperCase();
    const catOk  = category   === 'All Categories'|| c.category  === category;
    const durMap = { 'Under 5h': [0,5], '5h – 10h': [5,10], '10h – 20h': [10,20], '20h+': [20,999] };
    let durOk = true;
    if (duration !== 'Any length') {
      const [lo, hi] = durMap[duration] ?? [0, 999];
      const hrs = parseFloat(c.duration);
      durOk = hrs >= lo && hrs < hi;
    }
    return diffOk && catOk && durOk;
  });

  const hasFilter = difficulty !== 'All Levels' || duration !== 'Any length' || category !== 'All Categories';
  function clearFilters() { setDifficulty('All Levels'); setDuration('Any length'); setCategory('All Categories'); setPage(1); }

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function paginationPages() {
    const pages = [];
    if (TOTAL_PAGES <= 5) {
      for (let i = 1; i <= TOTAL_PAGES; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (page > 4) pages.push('...');
      if (page > 3 && page < TOTAL_PAGES - 1) pages.push(page);
      pages.push('...');
      pages.push(TOTAL_PAGES);
    }
    return [...new Set(pages)];
  }

  return (
    <div className="ep-page">

      {/* ── Top Bar ── */}
      <header className="ep-topbar">
        <div className="ep-topbar-left">
          <button className="ep-back-btn" onClick={onBack} aria-label="Back">
            <BackIcon />
          </button>
          <div className="ep-search-wrap">
            <SearchIcon />
            <input className="ep-search" placeholder="Find Friends" />
          </div>
        </div>

        <div className="ep-topbar-center">
          <div className="ep-stat-pill">
            <span className="ep-stat-num">326</span>
            <span className="ep-stat-lbl">Total Posts</span>
          </div>
          <div className="ep-stat-pill">
            <span className="ep-stat-num">2456</span>
            <span className="ep-stat-lbl">Total Friends</span>
          </div>
        </div>

        <div className="ep-topbar-right">
          <button className="ep-icon-btn">
            <BellIcon />
            <span className="ep-badge ep-badge--green">7</span>
          </button>
          <button className="ep-icon-btn">
            <BellIcon />
            <span className="ep-badge ep-badge--red">3</span>
          </button>
          <div className="ep-user-chip">
            <img src={avatarUrl} alt={displayName} className="ep-user-avatar" />
            <div className="ep-user-info">
              <span className="ep-user-name">{displayName}</span>
              <span className="ep-user-status"><span className="ep-status-dot" />Active Now</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="ep-main">

        {/* Page header */}
        <div className="ep-page-head">
          <div>
            <h1 className="ep-page-title">Explore Courses</h1>
            <p className="ep-page-sub">Showing 124 specialized tracks for your career growth.</p>
          </div>
          <div className="ep-view-toggle">
            <button
              className={`ep-view-btn${viewMode === 'grid' ? ' ep-view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <GridIcon />
            </button>
            <button
              className={`ep-view-btn${viewMode === 'list' ? ' ep-view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="ep-filters">
          <Dropdown label="Difficulty" value={difficulty} opts={DIFFICULTY_OPTS} onChange={v => { setDifficulty(v); setPage(1); }} />
          <Dropdown label="Duration"   value={duration}   opts={DURATION_OPTS}   onChange={v => { setDuration(v);   setPage(1); }} />
          <Dropdown label="Category"   value={category}   opts={CATEGORY_OPTS}   onChange={v => { setCategory(v);   setPage(1); }} />
          {hasFilter && (
            <button className="ep-clear-btn" onClick={clearFilters}>
              <span>✕</span> Clear Filters
            </button>
          )}
        </div>

        {/* Grid */}
        {pageItems.length === 0 ? (
          <div className="ep-empty">No courses match your filters.</div>
        ) : (
          <div className={`ep-grid${viewMode === 'list' ? ' ep-grid--list' : ''}`}>
            {pageItems.map((c, i) => (
              <CourseCard key={c.id} course={c} idx={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="ep-pagination">
          <button
            className="ep-page-btn ep-page-btn--nav"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevLeft />
          </button>
          {paginationPages().map((p, i) =>
            p === '...'
              ? <span key={`dots-${i}`} className="ep-page-dots">…</span>
              : (
                <button
                  key={p}
                  className={`ep-page-btn${page === p ? ' ep-page-btn--active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
          )}
          <button
            className="ep-page-btn ep-page-btn--nav"
            onClick={() => setPage(p => Math.min(TOTAL_PAGES, p + 1))}
            disabled={page === TOTAL_PAGES}
          >
            <ChevRight />
          </button>
        </div>

      </main>
    </div>
  );
}
