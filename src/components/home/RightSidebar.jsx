import { GALLERY_COLORS, LIKED_PAGES } from './mockData';

function CalendarIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function PinIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }

export default function RightSidebar() {
  return (
    <aside className="home-right-sidebar">

      {/* Upcoming Event */}
      <div className="right-card">
        <div className="event-card-image" />
        <div className="event-card-body">
          <p className="event-card-title">Annual Alumni Meet</p>
          <p className="event-card-detail"><CalendarIcon /> Oct 24, 2023 · 06:00 PM</p>
          <p className="event-card-detail"><PinIcon /> Innovation Hub</p>
          <button className="event-attend-btn">Going / Not Going</button>
        </div>
      </div>

      {/* Gallery */}
      <div className="right-card">
        <p className="right-section-title">Gallery</p>
        <div className="gallery-grid">
          {GALLERY_COLORS.map((bg, i) => (
            <div key={i} className="gallery-thumb" style={{ background: bg }}>
              {i === 4 && <div className="gallery-more">+4</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Liked Pages */}
      <div className="right-card">
        <div className="right-section-header">
          <p className="right-section-title">Liked Pages</p>
          <span className="right-section-sub">15 Pages</span>
          <button className="section-link" style={{ marginLeft: 'auto' }}>Friend</button>
        </div>
        <div className="liked-pages-list">
          {LIKED_PAGES.map(page => (
            <div key={page.id} className="liked-page-item">
              <div className="liked-page-icon" style={{ background: page.color }}>
                {page.initial}
              </div>
              <div>
                <p className="liked-page-name">{page.name}</p>
                <p className="liked-page-sub">{page.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
