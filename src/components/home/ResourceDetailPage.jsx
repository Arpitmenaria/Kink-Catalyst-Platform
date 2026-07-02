import { useEffect } from 'react';
import { getResourceById, RESOURCE_TYPE_COLOR, categoryLabel } from './educationData';
import useEducationProgress from './useEducationProgress';
import './ResourceDetailPage.css';

/* ── Icons ── */
function BackArrowIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function BookmarkIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }
function BookmarkFillIcon(){ return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }

export default function ResourceDetailPage({ resourceId, onBack }) {
  const progress = useEducationProgress();
  const resource = getResourceById(resourceId);

  useEffect(() => {
    if (!resource) return;
    progress.logResourceView(resourceId, resource);
  }, [resourceId]);

  if (!resource) {
    return (
      <div className="rdp-page">
        <header className="rdp-topbar">
          <button className="rdp-back-btn" onClick={onBack}><BackArrowIcon /><span>Back</span></button>
        </header>
        <div style={{ padding: 40, color: '#94a3b8' }}>Resource not found.</div>
      </div>
    );
  }

  const color = RESOURCE_TYPE_COLOR[resource.type] ?? '#6b7399';
  const saved = progress.isSaved(resource.id);

  return (
    <div className="rdp-page">
      <header className="rdp-topbar">
        <button className="rdp-back-btn" onClick={onBack}>
          <BackArrowIcon />
          <span className="rdp-back-label">{resource.title}</span>
        </button>
        <button
          className={`rdp-save-btn${saved ? ' rdp-save-btn--active' : ''}`}
          onClick={() => progress.toggleSaveResource(resource.id)}
        >
          {saved ? <BookmarkFillIcon /> : <BookmarkIcon />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </header>

      <div className="rdp-body">
        <div className="rdp-hero">
          {resource.type === 'Video' && resource.videoUrl ? (
            <video
              className="rdp-hero-video"
              src={resource.videoUrl}
              poster={resource.img}
              controls
            />
          ) : (
            <img src={resource.img} alt={resource.title} className="rdp-hero-img" />
          )}
          <span className="rdp-type-badge" style={{ background: color + '28', color, borderColor: color + '50' }}>
            {resource.type}
          </span>
        </div>

        <div className="rdp-content">
          <div className="rdp-meta-row">
            <span className="rdp-category">{categoryLabel(resource.category)}</span>
            {resource.author && (
              <span className="rdp-author">
                <span className="rdp-author-avatar" style={{ background: resource.authorColor ?? '#3b82f6' }}>
                  {resource.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                {resource.author}
              </span>
            )}
          </div>

          <h1 className="rdp-title">{resource.title}</h1>
          <p className="rdp-desc">{resource.desc}</p>

          <div className="rdp-tags">
            {resource.tags.map(t => (
              <span key={t} className="rdp-tag">{t}</span>
            ))}
          </div>

          <div className="rdp-article">
            {(resource.content ?? []).map((para, i) => (
              <p key={i} className="rdp-para">{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
