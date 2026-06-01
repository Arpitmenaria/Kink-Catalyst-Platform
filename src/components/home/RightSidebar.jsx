import { GALLERY_IMAGES, LIKED_PAGES } from './mockData';

function CalendarIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function PinIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function UsersIcon()    { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }

const EVENT_IMAGE = 'https://picsum.photos/seed/alumni-meet-event/320/130';

export default function RightSidebar() {
  return (
    <aside className="home-right-sidebar">

      {/* Upcoming Event */}
      <div className="right-card">
        <div className="event-card-image" style={{ overflow: 'hidden' }}>
          <img src={EVENT_IMAGE} alt="Annual Alumni Meet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="event-card-body">
          <p className="event-card-title">Annual Alumni Meet</p>
          <p className="event-card-detail"><CalendarIcon /> Oct 24, 2023 · 06:00 PM</p>
          <p className="event-card-detail"><PinIcon /> Grand Hall, Innovation Hub</p>
          <button className="event-attend-btn">Going / Not Going</button>
        </div>
      </div>

      {/* Gallery */}
      <div className="right-card">
        <div className="right-section-header" style={{ padding: '12px 14px 10px' }}>
          <p className="right-section-title">Gallery</p>
          <button className="section-link" style={{ marginLeft: 'auto' }}>View all</button>
        </div>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className="gallery-thumb" style={{ overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === 5 && <div className="gallery-more">+42</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Liked Pages */}
      <div className="right-card">
        <div className="right-liked-header">
          <div>
            <p className="right-section-title">Liked Pages</p>
            <p className="right-section-pages">18 Pages</p>
          </div>
          <button className="section-link">View all</button>
        </div>
        <div className="liked-pages-list">
          {LIKED_PAGES.map(page => (
            <div key={page.id} className="liked-page-item">
              <div className="liked-page-icon" style={{ background: page.color }}>
                {page.initial}
              </div>
              <div className="liked-page-info">
                <p className="liked-page-name">{page.name}</p>
                <p className="liked-page-sub"><UsersIcon /> {page.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
