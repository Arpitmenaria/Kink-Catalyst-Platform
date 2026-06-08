import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import BookmarkedResourcesPage from './BookmarkedResourcesPage';
import CreatePostModal from './CreatePostModal';
import { ALEX_AVATAR } from './mockData';
import './LibraryPage.css';

/* ── Icons ── */
function FilterIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>; }
function BookmarkIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }
function BookOpenIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function CheckCircleIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function TimerIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function StarIcon()    { return <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }

/* ── Static data ── */
const STAT_CARDS = [
  { Icon: BookOpenIcon,    label: 'COURSES ENROLLED', value: '12',  color: '#3b82f6' },
  { Icon: CheckCircleIcon, label: 'COMPLETED',         value: '5',   color: '#10b981' },
  { Icon: TimerIcon,       label: 'HOURS SPENT',       value: '48h', color: '#8b5cf6' },
];

const TAB_TYPES = ['All', 'Articles', 'Guides', 'Videos', 'Documents'];

const TYPE_COLOR = {
  Article:  '#3b82f6',
  Video:    '#8b5cf6',
  Guide:    '#10b981',
  Document: '#f59e0b',
};

const CATEGORIES = [
  { id: 'design',   label: 'Design Principles' },
  { id: 'dev',      label: 'Development'       },
  { id: 'business', label: 'Business Strategy' },
  { id: 'soft',     label: 'Soft Skills'       },
];

const ALL_RESOURCES = [
  { id: 1,  type: 'Article',  cat: 'design',   title: 'Brand Identity Blueprint',     desc: 'A comprehensive guide to building resilient brand systems and visual languages.', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&fit=crop', saved: false },
  { id: 2,  type: 'Video',    cat: 'business', title: 'Growth Analytics Mastery',     desc: 'Master the core metrics that drive business growth and product success.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop', saved: false },
  { id: 3,  type: 'Guide',    cat: 'business', title: 'Agile Product Management',     desc: 'The complete handbook for agile product teams and sprint planning.', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&fit=crop', saved: false },
  { id: 4,  type: 'Document', cat: 'business', title: 'Founder Agreement Template',   desc: 'Standardized founder vesting and intellectual property agreements.', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80&fit=crop', saved: false },
  { id: 5,  type: 'Article',  cat: 'design',   title: 'Deep Work for Designers',      desc: 'Strategies for maintaining creative focus in distracted environments.', img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&q=80&fit=crop', saved: false },
  { id: 6,  type: 'Guide',    cat: 'dev',      title: 'AI Implementation Guide',      desc: 'Practical steps for integrating large language models into products.', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&fit=crop', saved: false },
  { id: 7,  type: 'Video',    cat: 'dev',      title: 'React Performance Patterns',   desc: 'Advanced techniques for optimizing React applications at scale.', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop', saved: false },
  { id: 8,  type: 'Article',  cat: 'soft',     title: 'Leadership in Remote Teams',   desc: 'Building trust, alignment, and momentum across distributed teams.', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop', saved: false },
  { id: 9,  type: 'Document', cat: 'dev',      title: 'System Design Cheat Sheet',    desc: 'Reference guide covering scalability, reliability, and architecture patterns.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&fit=crop', saved: false },
];

function TypeBadge({ type }) {
  const color = TYPE_COLOR[type] ?? '#6b7399';
  return (
    <span className="lib-type-badge" style={{ background: color + '28', color, borderColor: color + '50' }}>
      {type}
    </span>
  );
}

function ResourceCard({ resource, idx, saved, onSave }) {
  return (
    <div className="lib-res-card" style={{ '--ri': idx }}>
      <div className="lib-res-thumb">
        <img src={resource.img} alt={resource.title} loading="lazy" />
        <TypeBadge type={resource.type} />
        <button
          className={`lib-bookmark-btn${saved ? ' lib-bookmark-btn--saved' : ''}`}
          onClick={() => onSave(resource.id)}
          aria-label="Save"
        >
          <BookmarkIcon />
        </button>
      </div>
      <div className="lib-res-body">
        <h3 className="lib-res-title">{resource.title}</h3>
        <p className="lib-res-desc">{resource.desc}</p>
      </div>
    </div>
  );
}

export default function LibraryPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onCoursesClick }) {
  const { user: authUser } = useSelector(s => s.auth);
  const { profile }        = useSelector(s => s.profile);
  const avatarUrl          = profile?.avatar ?? ALEX_AVATAR;

  const [activeTab,     setActiveTab]     = useState('All');
  const [selCategories, setSelCategories] = useState(new Set());
  const [contentType,   setContentType]   = useState('all');
  const [savedIds,      setSavedIds]      = useState(new Set());
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  if (showBookmarks) return <BookmarkedResourcesPage onBack={() => setShowBookmarks(false)} />;

  function handleNav(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onBack?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'calendar') onCalendarClick?.();
  }

  function toggleCategory(id) {
    setSelCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSave(id) {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const typeMap = { Articles: 'Article', Guides: 'Guide', Videos: 'Video', Documents: 'Document' };

  const filtered = ALL_RESOURCES.filter(r => {
    const tabMatch = activeTab === 'All' || r.type === typeMap[activeTab];
    const catMatch = selCategories.size === 0 || selCategories.has(r.cat);
    return tabMatch && catMatch;
  });

  return (
    <>
    <div className="library-page">
      <AnimatedNav activeId="library" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="library-main">

        {/* ── Page header ── */}
        <div className="lib-header">
          <h1 className="lib-title">Education Library</h1>
          <p className="lib-subtitle">Explore thousands of curated resources for your growth.</p>
        </div>

        {/* ── Stats row ── */}
        <div className="lib-stats-row">
          {STAT_CARDS.map(({ Icon, label, value, color }, i) => (
            <div key={label} className="lib-stat-card" style={{ '--si': i }}>
              <div className="lib-stat-icon" style={{ color, background: color + '18' }}>
                <Icon />
              </div>
              <div className="lib-stat-body">
                <p className="lib-stat-label">{label}</p>
                <p className="lib-stat-value">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Type tabs ── */}
        <div className="lib-tabs-row">
          {TAB_TYPES.map(tab => (
            <button
              key={tab}
              className={`lib-tab${activeTab === tab ? ' lib-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button className="lib-tab lib-tab--saved" onClick={() => setShowBookmarks(true)}>
            🔖 Saved{savedIds.size > 0 ? ` (${savedIds.size})` : ''}
          </button>
        </div>

        {/* ── Two-column: filters + grid ── */}
        <div className="lib-content-area">

          {/* ── Filter sidebar ── */}
          <aside className="lib-filters">
            <div className="lib-filter-head">
              <FilterIcon />
              <span>Filters</span>
            </div>

            <div className="lib-filter-group">
              <p className="lib-filter-label">CATEGORY</p>
              {CATEGORIES.map(cat => (
                <label key={cat.id} className="lib-checkbox-row">
                  <span
                    className={`lib-checkbox${selCategories.has(cat.id) ? ' lib-checkbox--checked' : ''}`}
                    onClick={() => toggleCategory(cat.id)}
                  >
                    {selCategories.has(cat.id) && (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="lib-checkbox-label">{cat.label}</span>
                </label>
              ))}
            </div>

            <div className="lib-filter-group">
              <p className="lib-filter-label">CONTENT TYPE</p>
              {[{ id: 'premium', label: 'Premium Only' }, { id: 'all', label: 'All Access' }].map(opt => (
                <label key={opt.id} className="lib-radio-row" onClick={() => setContentType(opt.id)}>
                  <span className={`lib-radio${contentType === opt.id ? ' lib-radio--active' : ''}`}>
                    {contentType === opt.id && <span className="lib-radio-dot" />}
                  </span>
                  <span className="lib-radio-label">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Upgrade card */}
            <div className="lib-upgrade-card">
              <p className="lib-upgrade-title">Upgrade to Pro</p>
              <p className="lib-upgrade-sub">Get unlimited access to premium guides and expert workshops.</p>
              <button className="lib-upgrade-btn">Learn More</button>
            </div>
          </aside>

          {/* ── Resource grid ── */}
          <div className="lib-grid">
            {filtered.length === 0 ? (
              <div className="lib-empty">No resources match the selected filters.</div>
            ) : (
              filtered.map((r, i) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  idx={i}
                  saved={savedIds.has(r.id)}
                  onSave={toggleSave}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
    {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}
    </>
  );
}
