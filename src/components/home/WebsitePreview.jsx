export default function WebsitePreview({ sections, selectedSection, onSelectSection }) {
  return (
    <div className="wp-preview-container">
      {/* Website Header */}
      <div className="wp-header">
        <div className="wp-logo">📱 KickSite</div>
        <nav className="wp-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      {/* Website Sections Preview */}
      <div className="wp-content">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`wp-section wp-section-${section.type} ${selectedSection?.id === section.id ? 'wp-section--selected' : ''}`}
            onClick={() => onSelectSection(section)}
          >
            {/* Hero Section */}
            {section.type === 'hero' && (
              <div className="wp-hero">
                <div className="wp-hero-content">
                  <span className="wp-section-badge">{section.icon}</span>
                  <h1>{section.name}</h1>
                  <p>Premium content for your {section.name.toLowerCase()} section</p>
                  <div className="wp-hero-buttons">
                    <button className="wp-btn wp-btn-primary">Learn More</button>
                    <button className="wp-btn wp-btn-secondary">Get Started</button>
                  </div>
                </div>
                <div className="wp-hero-image">
                  <div className="wp-placeholder-img">{section.icon}</div>
                </div>
              </div>
            )}

            {/* Text/Content Section */}
            {section.type === 'text' && (
              <div className="wp-text-section">
                <div className="wp-text-icon">{section.icon}</div>
                <h2>{section.name}</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            )}

            {/* Gallery Section */}
            {section.type === 'gallery' && (
              <div className="wp-gallery-section">
                <h2>{section.name}</h2>
                <div className="wp-gallery-grid">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="wp-gallery-item">
                      <div className="wp-gallery-placeholder">{section.icon}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid Section */}
            {section.type === 'grid' && (
              <div className="wp-grid-section">
                <h2>{section.name}</h2>
                <div className="wp-grid">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="wp-grid-item">
                      <div className="wp-grid-icon">{section.icon}</div>
                      <h3>Feature {i}</h3>
                      <p>Description for feature</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Section */}
            {section.type === 'form' && (
              <div className="wp-form-section">
                <h2>{section.name}</h2>
                <form className="wp-form">
                  <input type="text" placeholder="Your Name" />
                  <input type="email" placeholder="Your Email" />
                  <textarea placeholder="Your Message"></textarea>
                  <button type="submit" className="wp-btn wp-btn-primary">Submit</button>
                </form>
              </div>
            )}

            {/* Default Section */}
            {!['hero', 'text', 'gallery', 'grid', 'form'].includes(section.type) && (
              <div className="wp-default-section">
                <div className="wp-section-icon">{section.icon}</div>
                <h2>{section.name}</h2>
                <p className="wp-section-type">Type: {section.type}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Website Footer */}
      <div className="wp-footer">
        <p>&copy; 2024 Your Website. All rights reserved.</p>
      </div>
    </div>
  );
}
