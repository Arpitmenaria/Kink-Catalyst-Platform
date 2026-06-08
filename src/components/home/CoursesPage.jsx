import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import ExplorePage from './ExplorePage';
import LearningActivityPage from './LearningActivityPage';
import CourseReaderPage from './CourseReaderPage';
import CreatePostModal from './CreatePostModal';
import { ALEX_AVATAR } from './mockData';
import './CoursesPage.css';

/* ── Icons ── */
function StarIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function UserIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function ClockIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function PlayIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function HeartIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function FileIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function VideoIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>; }
function BookIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function CheckCircleIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function TimerIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function DownloadIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function ExternalLinkIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }

/* ── Mock data ── */
const STAT_CARDS = [
  { Icon: BookIcon,       label: 'COURSES ENROLLED', value: '12',  color: '#3b82f6' },
  { Icon: CheckCircleIcon,label: 'COMPLETED',         value: '5',   color: '#10b981' },
  { Icon: TimerIcon,      label: 'HOURS SPENT',       value: '48h', color: '#8b5cf6' },
];

const ONGOING_COURSES = [
  { id: 1, title: 'Mastering UI Design',  progress: 45, img: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=600&q=80&fit=crop' },
  { id: 2, title: 'Product Management',   progress: 68, img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop' },
  { id: 3, title: 'Advanced React',       progress: 22, img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop' },
];

const CATEGORIES = ['All Topics', 'Technology', 'Business', 'Leadership', 'Finance', 'Marketing', 'Design'];

const CATEGORY_COLOR = {
  Design: '#3b82f6', Development: '#10b981', Business: '#f59e0b',
  Technology: '#8b5cf6', Marketing: '#ec4899', Finance: '#06b6d4',
};

const EXPLORE_COURSES = [
  { id: 1, title: 'Advanced UI Design Systems',     category: 'Design',      instructor: 'Alex Rivera',   rating: 4.9, duration: '12h 30m', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80&fit=crop' },
  { id: 2, title: 'Full-Stack Web Architecture',    category: 'Development', instructor: 'Leo Zhang',     rating: 4.8, duration: '18h 45m', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80&fit=crop' },
  { id: 3, title: 'Product Management Elite',       category: 'Business',    instructor: 'Sophia Bloom',  rating: 4.7, duration: '8h 15m',  img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80&fit=crop' },
  { id: 4, title: 'Blockchain for Everyone',        category: 'Technology',  instructor: 'Dr. Kai Vance', rating: 4.9, duration: '10h 6m',  img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80&fit=crop' },
];

const RECOMMENDED = [
  { id: 1, title: 'Data-Driven Marketing Strategy',  category: 'Marketing', instructor: 'Dr. Sarah Jenkins', rating: 4.8, price: '$89.99',  img: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&q=80&fit=crop' },
  { id: 2, title: 'Financial Analysis for Business', category: 'Finance',   instructor: 'Marcus Thorne',     rating: 4.3, price: '$124.50', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80&fit=crop' },
  { id: 3, title: 'Advanced Python Development',     category: 'Technology',instructor: 'Aria Chen',         rating: 4.7, price: '$75.00',  img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80&fit=crop' },
];

const RESOURCES = [
  { id: 1, Icon: FileIcon,  title: 'UI Design Handbook 2024', desc: 'Essential principles and case studies for modern design systems.', action: 'Download PDF', type: 'pdf' },
  { id: 2, Icon: VideoIcon, title: 'Tech Trends Webinar',     desc: 'Recorded session with industry experts on the future of AI technology.', action: 'Watch Video', type: 'video' },
];

/* ── Category badge ── */
function CategoryBadge({ label }) {
  const color = CATEGORY_COLOR[label] ?? '#6b7399';
  return (
    <span className="cs-cat-badge" style={{ color, background: color + '22', borderColor: color + '44' }}>
      {label}
    </span>
  );
}

export default function CoursesPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick }) {
  const { user: authUser } = useSelector(s => s.auth);
  const { profile }        = useSelector(s => s.profile);
  const avatarUrl          = profile?.avatar ?? ALEX_AVATAR;

  const [activeCategory,   setActiveCategory]   = useState('All Topics');
  const [wishlist,         setWishlist]         = useState(new Set());
  const [showExplore,      setShowExplore]      = useState(false);
  const [showActivity,     setShowActivity]     = useState(false);
  const [activeCourse,     setActiveCourse]     = useState(null);
  const [createPostOpen,   setCreatePostOpen]   = useState(false);

  if (activeCourse)  return <CourseReaderPage course={activeCourse} onBack={() => setActiveCourse(null)} />;
  if (showExplore)   return <ExplorePage onBack={() => setShowExplore(false)} />;
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
    if (id === 'calendar') onCalendarClick?.();
  }

  function toggleWishlist(id) {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filteredExplore = activeCategory === 'All Topics'
    ? EXPLORE_COURSES
    : EXPLORE_COURSES.filter(c => c.category === activeCategory);

  return (
    <>
    <div className="courses-page">
      <AnimatedNav activeId="courses" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="courses-main">

        {/* ── Stats row ── */}
        <div className="cs-stats-row">
          {STAT_CARDS.map(({ Icon, label, value, color }) => (
            <div key={label} className="cs-stat-card">
              <div className="cs-stat-icon" style={{ color, background: color + '18' }}>
                <Icon />
              </div>
              <div className="cs-stat-body">
                <p className="cs-stat-label">{label}</p>
                <p className="cs-stat-value">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ongoing Courses ── */}
        <section className="cs-section">
          <div className="cs-section-head">
            <h2 className="cs-section-title">Ongoing Courses</h2>
            <button className="cs-link" onClick={() => setShowActivity(true)}>See all activity</button>
          </div>
          <div className="cs-ongoing-grid">
            {ONGOING_COURSES.map((c, i) => (
              <div key={c.id} className="cs-ongoing-card" style={{ '--ci': i }}>
                <div className="cs-ongoing-thumb">
                  <img src={c.img} alt={c.title} />
                  <span className="cs-ongoing-badge">ONGOING</span>
                </div>
                <div className="cs-ongoing-body">
                  <p className="cs-ongoing-title">{c.title}</p>
                  <div className="cs-progress-row">
                    <span className="cs-progress-label">Progress</span>
                    <span className="cs-progress-pct">{c.progress}%</span>
                  </div>
                  <div className="cs-progress-track">
                    <div className="cs-progress-fill" style={{ width: `${c.progress}%` }} />
                  </div>
                  <button className="cs-resume-btn" onClick={() => setActiveCourse(c)}><PlayIcon /> Resume</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Explore Categories ── */}
        <section className="cs-section">
          <div className="cs-section-head">
            <h2 className="cs-section-title">Explore Categories</h2>
            <button className="cs-link" onClick={() => setShowExplore(true)}>Explore All →</button>
          </div>

          <div className="cs-tabs-row">
            {CATEGORIES.map(cat => (
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
            {filteredExplore.map((c, i) => (
              <div key={c.id} className="cs-explore-card" style={{ '--ci': i }}>
                <div className="cs-explore-thumb">
                  <img src={c.img} alt={c.title} />
                  <CategoryBadge label={c.category} />
                </div>
                <div className="cs-explore-body">
                  <p className="cs-explore-title">{c.title}</p>
                  <div className="cs-explore-meta">
                    <span className="cs-meta-item"><UserIcon /> {c.instructor}</span>
                    <span className="cs-meta-item cs-meta-rating"><StarIcon /> {c.rating}</span>
                  </div>
                  <div className="cs-explore-footer">
                    <span className="cs-duration"><ClockIcon /> {c.duration}</span>
                    <button className="cs-enroll-btn">Enroll Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recommended for You ── */}
        <section className="cs-section">
          <div className="cs-section-head">
            <h2 className="cs-section-title">Recommended for You</h2>
          </div>
          <div className="cs-rec-grid">
            {RECOMMENDED.map((c, i) => (
              <div key={c.id} className="cs-rec-card" style={{ '--ci': i }}>
                <div className="cs-rec-thumb">
                  <img src={c.img} alt={c.title} />
                  <CategoryBadge label={c.category} />
                </div>
                <div className="cs-rec-body">
                  <p className="cs-rec-title">{c.title}</p>
                  <div className="cs-rec-meta">
                    <span className="cs-meta-item"><UserIcon /> {c.instructor}</span>
                    <span className="cs-meta-item cs-meta-rating"><StarIcon /> {c.rating}</span>
                  </div>
                  <div className="cs-rec-footer">
                    <span className="cs-price">{c.price}</span>
                    <button
                      className={`cs-wish-btn${wishlist.has(c.id) ? ' cs-wish-btn--active' : ''}`}
                      onClick={() => toggleWishlist(c.id)}
                      aria-label="Wishlist"
                    >
                      <HeartIcon />
                    </button>
                    <button className="cs-cart-btn">Add to Cart</button>
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
            <button className="cs-link">View All</button>
          </div>
          <div className="cs-resources-grid">
            {RESOURCES.map((r, i) => (
              <div key={r.id} className="cs-resource-card" style={{ '--ci': i }}>
                <div className="cs-resource-icon">
                  <r.Icon />
                </div>
                <div className="cs-resource-body">
                  <p className="cs-resource-title">{r.title}</p>
                  <p className="cs-resource-desc">{r.desc}</p>
                  <button className={`cs-resource-action cs-resource-action--${r.type}`}>
                    {r.type === 'pdf' ? <DownloadIcon /> : <ExternalLinkIcon />}
                    {r.action}
                  </button>
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
