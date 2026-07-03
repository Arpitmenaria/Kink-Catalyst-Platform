import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import ResourceDetailPage from './ResourceDetailPage';
import CreatePostModal from './CreatePostModal';
import { ALEX_AVATAR } from './mockData';
import { RESOURCES, CATEGORIES } from './educationData';
import useEducationProgress from './useEducationProgress';
import './CoursesPage.css';
import './LibraryPage.css';

/* ── Icons ── */
function BackArrowIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function FilterIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>; }
function BookmarkIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }
function SearchIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }

const TAB_TYPES = ['All', 'Articles', 'Guides', 'Videos', 'Documents'];

const TYPE_COLOR = {
  Article:  '#3b82f6',
  Video:    '#8b5cf6',
  Guide:    '#10b981',
  Document: '#f59e0b',
};

function TypeBadge({ type }) {
  const color = TYPE_COLOR[type] ?? '#6b7399';
  return (
    <span className="lib-type-badge" style={{ background: color + '28', color, borderColor: color + '50' }}>
      {type}
    </span>
  );
}

function ResourceCard({ resource, idx, saved, onSave, onView }) {
  return (
    <div className="lib-res-card" style={{ '--ri': idx }} onClick={() => onView(resource)}>
      <div className="lib-res-thumb">
        <img src={resource.img} alt={resource.title} loading="lazy" />
        <TypeBadge type={resource.type} />
        <button
          className={`lib-bookmark-btn${saved ? ' lib-bookmark-btn--saved' : ''}`}
          onClick={(e) => { e.stopPropagation(); onSave(resource.id); }}
          aria-label="Save"
        >
          <BookmarkIcon />
        </button>
      </div>
      <div className="lib-res-body">
        <h3 className="lib-res-title">{resource.title}</h3>
        <p className="lib-res-desc">{resource.desc}</p>
        <div className="lib-tags">
          {resource.tags.map(t => (
            <span key={t} className="lib-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onCoursesClick, onMinisitesClick }) {
  const { profile }        = useSelector(s => s.profile);
  const avatarUrl          = profile?.avatar ?? ALEX_AVATAR;
  const progress = useEducationProgress();

  const [activeTab,     setActiveTab]     = useState('All');
  const [selCategories, setSelCategories] = useState(new Set());
  const [searchQuery,   setSearchQuery]   = useState('');
  const [activeResourceId, setActiveResourceId] = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  if (activeResourceId) return <ResourceDetailPage resourceId={activeResourceId} onBack={() => setActiveResourceId(null)} />;

  function handleNav(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onBack?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'calendar')  onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  function toggleCategory(id) {
    setSelCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const typeMap = { Articles: 'Article', Guides: 'Guide', Videos: 'Video', Documents: 'Document' };

  const filtered = RESOURCES.filter(r => {
    const tabMatch = activeTab === 'All' || r.type === typeMap[activeTab];
    const catMatch = selCategories.size === 0 || selCategories.has(r.category);
    const q = searchQuery.trim().toLowerCase();
    const searchMatch = !q
      || r.title.toLowerCase().includes(q)
      || r.desc.toLowerCase().includes(q)
      || r.tags.some(t => t.toLowerCase().includes(q));
    return tabMatch && catMatch && searchMatch;
  });

  return (
    <>
    <div className="library-page">
      <AnimatedNav activeId="courses" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="library-main">

        <button className="cs-back-btn" onClick={() => onCoursesClick?.()} title="Back to Courses">
          <BackArrowIcon />
        </button>

        {/* ── Page header ── */}
        <div className="lib-header">
          <h1 className="lib-title">Popular Resources</h1>
          <p className="lib-subtitle">Explore thousands of curated resources for your growth.</p>
        </div>

        {/* ── Search ── */}
        <div className="lib-search-wrap">
          <SearchIcon />
          <input
            className="lib-search"
            placeholder="Search resources by title, description, or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
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
                  saved={progress.isSaved(r.id)}
                  onSave={progress.toggleSaveResource}
                  onView={res => setActiveResourceId(res.id)}
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
