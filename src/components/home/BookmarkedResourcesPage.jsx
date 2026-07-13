import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ALEX_AVATAR } from './mockData';
import { RESOURCES } from './educationData';
import useEducationProgress from './useEducationProgress';
import ResourceDetailPage from './ResourceDetailPage';
import './BookmarkedResourcesPage.css';

/* ── Icons ── */
function SearchIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function BellIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function BackIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function PlayIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function BookmarkFill() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }

/* ── Data ── */
const TYPE_META = {
  Video:    { color: '#8b5cf6', bg: '#8b5cf620' },
  Document: { color: '#64748b', bg: '#64748b20' },
  Article:  { color: '#06b6d4', bg: '#06b6d420' },
  Guide:    { color: '#10b981', bg: '#10b98120' },
};

const TAB_FILTERS = ['All', 'Articles', 'Guides', 'Videos', 'Documents'];
const TYPE_MAP    = { Articles: 'Article', Guides: 'Guide', Videos: 'Video', Documents: 'Document' };

function InstructorAvatar({ name, color }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return <span className="br-author-avatar" style={{ background: color }}>{initials}</span>;
}

function ResourceCard({ item, idx, onUnsave, onView }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.Article;
  return (
    <div className="br-card" style={{ '--ci': idx }}>
      {/* Thumbnail */}
      <div className="br-thumb">
        <img src={item.img} alt={item.title} loading="lazy" />
        <span className="br-type-badge" style={{ background: meta.bg, color: meta.color }}>
          {item.type}
        </span>
        {item.type === 'Video' && (
          <div className="br-play-overlay">
            <div className="br-play-btn"><PlayIcon /></div>
          </div>
        )}
        <button className="br-bookmark-btn" aria-label="Remove bookmark" onClick={() => onUnsave(item.id)}>
          <BookmarkFill />
        </button>
      </div>

      {/* Body */}
      <div className="br-body">
        <div className="br-tags">
          {item.tags.map(t => (
            <span key={t} className="br-tag">{t}</span>
          ))}
        </div>
        <h3 className="br-title">{item.title}</h3>
        <p className="br-desc">{item.desc}</p>
        <div className="br-footer">
          {item.author && (
            <div className="br-author">
              <InstructorAvatar name={item.author} color={item.authorColor} />
              <span className="br-author-name">{item.author}</span>
            </div>
          )}
          <button className="br-view-btn" onClick={() => onView(item)}>View Resource</button>
        </div>
      </div>
    </div>
  );
}

export default function BookmarkedResourcesPage({ onBack }) {
  const { profile } = useSelector(s => s.profile);
  const { posts }   = useSelector(s => s.posts);
  const avatarUrl   = profile?.avatar ?? ALEX_AVATAR;
  const totalPosts  = posts.length;
  const totalFriends = profile?.followers?.length ?? profile?.followersCount ?? 0;
  const progress = useEducationProgress();

  const [activeTab, setActiveTab] = useState('All');
  const [activeResourceId, setActiveResourceId] = useState(null);

  if (activeResourceId) return <ResourceDetailPage resourceId={activeResourceId} onBack={() => setActiveResourceId(null)} />;

  const savedResources = RESOURCES.filter(r => progress.isSaved(r.id));
  const filtered = activeTab === 'All'
    ? savedResources
    : savedResources.filter(r => r.type === TYPE_MAP[activeTab]);

  return (
    <div className="br-page">

      {/* ── Top Bar ── */}
      <header className="br-topbar">
        <div className="br-topbar-left">
          <button className="br-back-btn" onClick={onBack}>
            <BackIcon />
          </button>
          <div className="br-search-wrap">
            <SearchIcon />
            <input className="br-search" placeholder="Find Friends" />
          </div>
        </div>

        <div className="br-topbar-center">
          <div className="br-stat-pill"><span className="br-stat-num">{totalPosts}</span><span className="br-stat-lbl">Total Posts</span></div>
          <div className="br-stat-pill"><span className="br-stat-num">{totalFriends}</span><span className="br-stat-lbl">Total Friends</span></div>
        </div>

        <div className="br-topbar-right">
          <button className="br-icon-btn"><BellIcon /><span className="br-badge br-badge--green">7</span></button>
          <button className="br-icon-btn"><BellIcon /><span className="br-badge br-badge--red">3</span></button>
          <div className="br-user-chip">
            <img src={avatarUrl} alt="avatar" className="br-user-avatar" />
            <div className="br-user-info">
              <span className="br-user-name">Alex Rivera</span>
              <span className="br-user-status"><span className="br-status-dot" />Active Now</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="br-main">

        {/* Page header */}
        <div className="br-page-head">
          <h1 className="br-page-title">Bookmarked Resources</h1>
          <p className="br-page-sub">Quick access to your saved educational materials.</p>
        </div>

        {/* Tabs */}
        <div className="br-tabs">
          {TAB_FILTERS.map(tab => (
            <button
              key={tab}
              className={`br-tab${activeTab === tab ? ' br-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="br-empty">No bookmarks in this category.</div>
        ) : (
          <div className="br-grid">
            {filtered.map((item, i) => (
              <ResourceCard key={item.id} item={item} idx={i} onUnsave={progress.toggleSaveResource} onView={res => setActiveResourceId(res.id)} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
