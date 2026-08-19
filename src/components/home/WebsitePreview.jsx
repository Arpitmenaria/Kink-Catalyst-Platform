import { useState } from 'react';

const DEVICE_WIDTH = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

// In the builder canvas (interactive=true) a nav-link click must not
// navigate — it's editing, not browsing. On the real published/preview
// render (interactive=false), an in-page "#id" link smooth-scrolls to the
// matching section; anything else (an external URL) is left to navigate
// normally.
function handleNavLinkClick(e, url, interactive) {
  if (interactive) { e.preventDefault(); return; }
  if (!url || !url.startsWith('#') || url.length < 2) return;
  const target = document.getElementById(url.slice(1));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const BODY_TRUNCATE_AT = 240;

function TextBody({ text }) {
  const [expanded, setExpanded] = useState(false);
  const body = text || '';
  const isLong = body.length > BODY_TRUNCATE_AT;
  const shown = expanded || !isLong ? body : `${body.slice(0, BODY_TRUNCATE_AT).trimEnd()}…`;

  return (
    <>
      <p>{shown}</p>
      {isLong && (
        <button type="button" className="wp-text-toggle" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </>
  );
}

function SectionContent({ section, interactive }) {
  const c = section.content || {};

  switch (section.type) {
    case 'navbar':
      return (
        <div className="wp-navbar">
          <div className="wp-navbar-logo">{c.logoText}</div>
          <nav className="wp-navbar-links">
            {(c.links || []).map((l, i) => (
              <a key={i} href={l.url} onClick={(e) => handleNavLinkClick(e, l.url, interactive)}>{l.label}</a>
            ))}
          </nav>
          {c.ctaText && (
            <a href={c.ctaLink || '#'} className="wp-btn wp-btn-primary wp-navbar-cta" onClick={(e) => handleNavLinkClick(e, c.ctaLink, interactive)}>
              {c.ctaText}
            </a>
          )}
        </div>
      );

    case 'hero':
      return (
        <div className="wp-hero">
          <div className="wp-hero-content">
            <span className="wp-section-badge">{section.icon}</span>
            <h1>{c.headline}</h1>
            <p>{c.subheadline}</p>
            <div className="wp-hero-buttons">
              {c.primaryButtonText && (
                <a href={c.primaryButtonLink || '#'} className="wp-btn wp-btn-primary" onClick={(e) => handleNavLinkClick(e, c.primaryButtonLink, interactive)}>
                  {c.primaryButtonText}
                </a>
              )}
              {c.secondaryButtonText && (
                <a href={c.secondaryButtonLink || '#'} className="wp-btn wp-btn-secondary" onClick={(e) => handleNavLinkClick(e, c.secondaryButtonLink, interactive)}>
                  {c.secondaryButtonText}
                </a>
              )}
            </div>
          </div>
          <div className="wp-hero-image">
            {c.image ? (
              <img src={c.image} alt={c.headline} className="wp-hero-img" />
            ) : (
              <div className="wp-placeholder-img">{section.icon}</div>
            )}
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="wp-text-section">
          <div className="wp-text-icon">{c.icon}</div>
          <h2>{c.headline}</h2>
          <TextBody text={c.body} />
        </div>
      );

    case 'grid':
      return (
        <div className="wp-grid-section">
          <h2>{c.headline}</h2>
          <div className="wp-grid">
            {(c.items || []).map((item, i) => (
              <div key={i} className="wp-grid-item">
                <div className="wp-grid-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className="wp-gallery-section">
          <h2>{c.headline}</h2>
          <div className="wp-gallery-grid">
            {(c.items || []).map((item, i) => (
              <div key={i} className="wp-gallery-item">
                {item.image ? (
                  <img src={item.image} alt={item.caption} className="wp-gallery-img" />
                ) : (
                  <div className="wp-gallery-placeholder">{section.icon}</div>
                )}
                {item.caption && <p className="wp-gallery-caption">{item.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      );

    case 'form':
      return (
        <div className="wp-form-section">
          <h2>{c.headline}</h2>
          {c.subheadline && <p className="wp-form-sub">{c.subheadline}</p>}
          <form className="wp-form" onSubmit={(e) => e.preventDefault()}>
            {(c.fields || []).map((f, i) =>
              f.type === 'textarea' ? (
                <textarea key={i} placeholder={f.label} readOnly />
              ) : (
                <input key={i} type={f.type || 'text'} placeholder={f.label} readOnly />
              )
            )}
            <button type="submit" className="wp-btn wp-btn-primary">{c.submitButtonText || 'Submit'}</button>
          </form>
        </div>
      );

    case 'cta':
      return (
        <div className="wp-cta-section">
          <h2>{c.headline}</h2>
          <p>{c.subheadline}</p>
          {c.buttonText && (
            <a href={c.buttonLink || '#'} className="wp-btn wp-btn-primary" onClick={(e) => handleNavLinkClick(e, c.buttonLink, interactive)}>
              {c.buttonText}
            </a>
          )}
        </div>
      );

    case 'testimonial':
      return (
        <div className="wp-testimonial-section">
          <h2>{c.headline}</h2>
          <div className="wp-testimonial-grid">
            {(c.items || []).map((t, i) => (
              <div key={i} className="wp-testimonial-card">
                <p className="wp-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <p className="wp-testimonial-author">{t.author}</p>
                {t.role && <p className="wp-testimonial-role">{t.role}</p>}
              </div>
            ))}
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="wp-footer-section">
          <div className="wp-footer-links">
            {(c.links || []).map((l, i) => (
              <a key={i} href={l.url} onClick={(e) => handleNavLinkClick(e, l.url, interactive)}>{l.label}</a>
            ))}
          </div>
          <p className="wp-footer-text">{c.text}</p>
        </div>
      );

    default:
      return (
        <div className="wp-default-section">
          <div className="wp-section-icon">{section.icon}</div>
          <h2>{section.name}</h2>
          <p className="wp-section-type">Type: {section.type}</p>
        </div>
      );
  }
}

export default function WebsitePreview({
  sections,
  selectedSectionId,
  onSelectSection,
  device = 'desktop',
  interactive = true,
}) {
  const visibleSections = sections.filter((section) =>
    device === 'mobile' ? section.visibleOnMobile !== false : section.visibleOnDesktop !== false
  );

  return (
    <div className="wp-preview-container">
      <div className="wp-canvas" style={{ width: DEVICE_WIDTH[device] || '100%' }}>
        {/* Website Sections Preview */}
        <div className="wp-content">
          {visibleSections.length === 0 && (
            <div className="wp-empty-state">
              <span style={{ fontSize: 40 }}>🧱</span>
              <p>No sections yet — add one from the sidebar.</p>
            </div>
          )}

          {visibleSections.map((section) => {
            const style = section.style || {};
            const wrapperStyle = {
              background: style.background,
              color: style.textColor,
              paddingTop: style.paddingTop != null ? `${style.paddingTop}px` : undefined,
              paddingBottom: style.paddingBottom != null ? `${style.paddingBottom}px` : undefined,
              textAlign: style.align,
              borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
              overflow: style.borderRadius ? 'hidden' : undefined,
              '--wp-accent': style.accentColor || '#3b82f6',
              '--wp-btn-radius': `${style.buttonRadius ?? 8}px`,
              ...(section.type === 'form'
                ? {
                    '--wp-form-bg': style.formFieldBackground || '#ffffff',
                    '--wp-form-text': style.formFieldTextColor || '#1f2937',
                    '--wp-form-placeholder': style.formPlaceholderColor || '#9ca3af',
                  }
                : null),
              ...(style.contentWidth === 'boxed' ? { maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto' } : null),
              ...(style.backgroundImage
                ? {
                    backgroundImage: `linear-gradient(rgba(0,0,0,${style.overlayOpacity ?? 0}), rgba(0,0,0,${style.overlayOpacity ?? 0})), url(${style.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : null),
            };

            return (
              <div
                key={section.id}
                id={section.id}
                className={[
                  'wp-section',
                  `wp-section-${section.type}`,
                  interactive ? 'wp-section--interactive' : '',
                  interactive && selectedSectionId === section.id ? 'wp-section--selected' : '',
                ].join(' ').trim()}
                style={wrapperStyle}
                onClick={interactive ? () => onSelectSection(section.id) : undefined}
              >
                <SectionContent section={section} interactive={interactive} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
