import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ALEX_AVATAR } from './mockData';
import './BookmarkedResourcesPage.css';

/* ── Icons ── */
function SearchIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function BellIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function BackIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function PlayIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function BookmarkFill() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }

/* ── Data ── */
const TYPE_META = {
  VIDEO:    { color: '#8b5cf6', bg: '#8b5cf620' },
  DOCUMENT: { color: '#64748b', bg: '#64748b20' },
  ARTICLE:  { color: '#06b6d4', bg: '#06b6d420' },
  GUIDE:    { color: '#10b981', bg: '#10b98120' },
};

const ALL_BOOKMARKS = [
  {
    id: 1, type: 'VIDEO',    tags: ['DEVELOPMENT', 'JS'],
    title: 'Advanced React Patterns',
    desc:  'Master complex component structures, custom hooks, and state management strategies for scalable applications.',
    author: 'Mark Kovich',   authorColor: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop',
  },
  {
    id: 2, type: 'DOCUMENT', tags: ['AI', 'REPORT'],
    title: 'Future of AI in Education 2024',
    desc:  'An in-depth whitepaper exploring the latest trends and future impact of artificial intelligence on learning.',
    author: 'Robert Fisher', authorColor: '#10b981',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&fit=crop',
  },
  {
    id: 3, type: 'VIDEO',    tags: ['DEVELOPMENT', 'JS'],
    title: 'Advanced React Patterns',
    desc:  'Master complex component structures, custom hooks, and state management strategies for scalable applications.',
    author: 'Mark Kovich',   authorColor: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&fit=crop',
  },
  {
    id: 4, type: 'ARTICLE',  tags: ['DESIGN', 'ACCESSIBILITY'],
    title: 'Principles of Web Accessibility',
    desc:  'Learn the fundamental guidelines for creating digital experiences that are inclusive for all users, from WCAG basics to advanced patterns.',
    author: 'Sarah Jenkins', authorColor: '#f59e0b',
    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&q=80&fit=crop',
  },
  {
    id: 5, type: 'GUIDE',    tags: ['UX RESEARCH', 'STRATEGY'],
    title: 'Effective User Interviewing',
    desc:  'A comprehensive guide on how to ask the right questions and extract valuable insights from your target audience.',
    author: 'Elena Lu',      authorColor: '#8b5cf6',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&fit=crop',
  },
  {
    id: 6, type: 'DOCUMENT', tags: ['AI', 'REPORT'],
    title: 'Future of AI in Education 2024',
    desc:  'An in-depth whitepaper exploring the latest trends and future impact of artificial intelligence on learning.',
    author: 'Robert Fisher', authorColor: '#10b981',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80&fit=crop',
  },
];

const TAB_FILTERS = ['All', 'Articles', 'Guides', 'Videos', 'Documents'];
const TYPE_MAP    = { Articles: 'ARTICLE', Guides: 'GUIDE', Videos: 'VIDEO', Documents: 'DOCUMENT' };

function InstructorAvatar({ name, color }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return <span className="br-author-avatar" style={{ background: color }}>{initials}</span>;
}

function ResourceCard({ item, idx }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.ARTICLE;
  return (
    <div className="br-card" style={{ '--ci': idx }}>
      {/* Thumbnail */}
      <div className="br-thumb">
        <img src={item.img} alt={item.title} loading="lazy" />
        <span className="br-type-badge" style={{ background: meta.bg, color: meta.color }}>
          {item.type}
        </span>
        {item.type === 'VIDEO' && (
          <div className="br-play-overlay">
            <div className="br-play-btn"><PlayIcon /></div>
          </div>
        )}
        <button className="br-bookmark-btn" aria-label="Bookmarked">
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
          <div className="br-author">
            <InstructorAvatar name={item.author} color={item.authorColor} />
            <span className="br-author-name">{item.author}</span>
          </div>
          <button className="br-view-btn">View Resource</button>
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

  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? ALL_BOOKMARKS
    : ALL_BOOKMARKS.filter(r => r.type === TYPE_MAP[activeTab]);

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
              <ResourceCard key={item.id} item={item} idx={i} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
