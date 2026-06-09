import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import CreatePostModal from './CreatePostModal';
import { ALEX_AVATAR } from './mockData';
import './MiniSitesPage.css';

/* ── Icons ── */
function GlobeIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function PlusIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function EyeIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function EditIcon()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function TrashIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function BarChartIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>; }
function LinkIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>; }
function DotsIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }

/* ── Mock data ── */
const STAT_CARDS = [
  { Icon: GlobeIcon,    label: 'TOTAL SITES',     value: '4',     color: '#3b82f6' },
  { Icon: EyeIcon,      label: 'TOTAL VIEWS',      value: '12.4K', color: '#10b981' },
  { Icon: BarChartIcon, label: 'THIS MONTH',       value: '3.2K',  color: '#8b5cf6' },
  { Icon: LinkIcon,     label: 'ACTIVE LINKS',     value: '28',    color: '#f59e0b' },
];

const MINI_SITES = [
  {
    id: 1,
    name: 'My Portfolio',
    url: 'portfolio.kicksite.io',
    status: 'live',
    views: 5840,
    lastEdited: '2 days ago',
    thumb: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&fit=crop',
  },
  {
    id: 2,
    name: 'Design Blog',
    url: 'design-blog.kicksite.io',
    status: 'live',
    views: 3210,
    lastEdited: '1 week ago',
    thumb: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80&fit=crop',
  },
  {
    id: 3,
    name: 'Product Launch Page',
    url: 'launch.kicksite.io',
    status: 'draft',
    views: 0,
    lastEdited: '3 hours ago',
    thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop',
  },
  {
    id: 4,
    name: 'Event Landing Page',
    url: 'event2024.kicksite.io',
    status: 'live',
    views: 3380,
    lastEdited: '5 days ago',
    thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&fit=crop',
  },
];

const TEMPLATES = [
  { id: 1, name: 'Portfolio',    thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop', tag: 'Popular' },
  { id: 2, name: 'Landing Page', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&fit=crop', tag: 'New' },
  { id: 3, name: 'Blog',         thumb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80&fit=crop', tag: null },
  { id: 4, name: 'Event Page',   thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80&fit=crop', tag: 'Popular' },
];

export default function MiniSitesPage({
  onBack, onMessagesClick, onEventsClick, onGroupsClick,
  onCalendarClick, onCoursesClick, onLibraryClick, onMinisitesClick,
}) {
  const avatarUrl = useSelector(s => s.user?.avatar) || ALEX_AVATAR;
  const [activeTab,      setActiveTab]      = useState('my-sites');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [openMenuId,     setOpenMenuId]     = useState(null);

  function handleNav(id) {
    if (id === 'create')    { setCreatePostOpen(true); return; }
    if (id === 'home')      onBack?.();
    if (id === 'courses')   onCoursesClick?.();
    if (id === 'library')   onLibraryClick?.();
    if (id === 'events')    onEventsClick?.();
    if (id === 'friends')   onGroupsClick?.();
    if (id === 'messages')  onMessagesClick?.();
    if (id === 'calendar')  onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }

  return (
    <>
    <div className="ms-page">
      <AnimatedNav activeId="minisites" avatarUrl={avatarUrl} onNavigate={handleNav} />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      <div className="ms-main">

        {/* Header */}
        <div className="ms-header">
          <div>
            <h1 className="ms-title">Mini Sites</h1>
            <p className="ms-subtitle">Build and manage your personal web pages</p>
          </div>
          <button className="ms-create-btn"><PlusIcon /> Create New Site</button>
        </div>

        {/* Stat cards */}
        <div className="ms-stats">
          {STAT_CARDS.map(({ Icon, label, value, color }) => (
            <div className="ms-stat-card" key={label}>
              <div className="ms-stat-icon" style={{ color, background: color + '18' }}><Icon /></div>
              <div>
                <p className="ms-stat-value">{value}</p>
                <p className="ms-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="ms-tabs">
          {['my-sites', 'templates'].map(t => (
            <button
              key={t}
              className={`ms-tab${activeTab === t ? ' ms-tab--active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'my-sites' ? 'My Sites' : 'Templates'}
            </button>
          ))}
        </div>

        {activeTab === 'my-sites' && (
          <div className="ms-sites-grid">
            {/* New site card */}
            <button className="ms-new-card">
              <div className="ms-new-icon"><PlusIcon /></div>
              <p className="ms-new-label">Create New Site</p>
              <p className="ms-new-sub">Start from scratch or use a template</p>
            </button>

            {MINI_SITES.map(site => (
              <div
                key={site.id}
                className="ms-site-card"
                onClick={() => setOpenMenuId(null)}
              >
                <div className="ms-site-thumb">
                  <img src={site.thumb} alt={site.name} />
                  <div className={`ms-site-badge ms-site-badge--${site.status}`}>
                    {site.status === 'live' ? 'Live' : 'Draft'}
                  </div>
                  <div className="ms-site-actions-overlay">
                    <button className="ms-site-action-btn" title="Preview"><EyeIcon /></button>
                    <button className="ms-site-action-btn" title="Edit"><EditIcon /></button>
                  </div>
                </div>
                <div className="ms-site-info">
                  <div className="ms-site-row">
                    <span className="ms-site-name">{site.name}</span>
                    <div className="ms-site-menu-wrap">
                      <button
                        className="ms-site-dots"
                        onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === site.id ? null : site.id); }}
                      ><DotsIcon /></button>
                      {openMenuId === site.id && (
                        <div className="ms-site-dropdown">
                          <button className="ms-dd-item"><EditIcon /> Edit</button>
                          <button className="ms-dd-item"><EyeIcon /> Preview</button>
                          <button className="ms-dd-item ms-dd-item--danger"><TrashIcon /> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="ms-site-url">{site.url}</p>
                  <div className="ms-site-meta">
                    <span className="ms-site-views"><EyeIcon /> {site.views.toLocaleString()}</span>
                    <span className="ms-site-edited">Edited {site.lastEdited}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="ms-templates-grid">
            {TEMPLATES.map(tpl => (
              <div key={tpl.id} className="ms-tpl-card">
                <div className="ms-tpl-thumb">
                  <img src={tpl.thumb} alt={tpl.name} />
                  {tpl.tag && <span className="ms-tpl-tag">{tpl.tag}</span>}
                  <div className="ms-tpl-overlay">
                    <button className="ms-tpl-use-btn"><PlusIcon /> Use Template</button>
                  </div>
                </div>
                <p className="ms-tpl-name">{tpl.name}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
    </>
  );
}
