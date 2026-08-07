import { useState } from 'react';
import WebsitePreview from './WebsitePreview';
import './SiteBuilderPage.css';

/* Icons */
function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}

function EyeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

function SaveIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
}

function PublishIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}

function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
}

function DuplicateIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8"/><path d="M21 11V5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2"/></svg>;
}

const INITIAL_SECTIONS = [
  { id: 1, name: 'Hero', type: 'hero', icon: '🎯', color: 'bg-blue' },
  { id: 2, name: 'About', type: 'text', icon: '📝', color: 'bg-purple' },
  { id: 3, name: 'Services', type: 'grid', icon: '⚙️', color: 'bg-green' },
  { id: 4, name: 'Portfolio', type: 'gallery', icon: '🖼️', color: 'bg-orange' },
  { id: 5, name: 'Contact', type: 'form', icon: '📧', color: 'bg-red' },
];

export default function SiteBuilderPage({ siteId, onBack, site }) {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [selectedSection, setSelectedSection] = useState(INITIAL_SECTIONS[0]);
  const [savedStatus, setSavedStatus] = useState('all-saved');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const mockSite = site || {
    id: siteId,
    name: 'My Portfolio',
    description: 'Professional portfolio showcase',
    slug: 'my-portfolio',
    status: 'draft',
    visibility: 'public',
    views: 0,
    lastEdited: 'just now',
    coverImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&fit=crop',
  };

  const handleAddSection = () => {
    const newId = Math.max(...sections.map(s => s.id)) + 1;
    const newSection = {
      id: newId,
      name: `Section ${newId}`,
      type: 'text',
      icon: '📄',
      color: 'bg-gray',
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection);
    console.log('Added new section:', newSection);
  };

  const handleDeleteSection = (sectionId) => {
    const filtered = sections.filter(s => s.id !== sectionId);
    setSections(filtered);
    if (selectedSection.id === sectionId && filtered.length > 0) {
      setSelectedSection(filtered[0]);
    }
    console.log('Deleted section:', sectionId);
  };

  const handleDuplicateSection = (section) => {
    const newId = Math.max(...sections.map(s => s.id)) + 1;
    const newSection = {
      ...section,
      id: newId,
      name: `${section.name} (copy)`,
    };
    const index = sections.findIndex(s => s.id === section.id);
    setSections([...sections.slice(0, index + 1), newSection, ...sections.slice(index + 1)]);
    console.log('Duplicated section:', newSection);
  };

  const handleSave = () => {
    setSavedStatus('saving');
    setTimeout(() => {
      setSavedStatus('all-saved');
      console.log('Site saved:', mockSite.id);
    }, 1000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      console.log('Site published:', mockSite.id);
      alert(`✅ Site "${mockSite.name}" published successfully!\n\nView it at: ${mockSite.slug}.kicksite.io`);
    }, 1500);
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
    console.log('Preview mode toggled');
  };

  return (
    <div className="site-builder-page">
      {/* Header */}
      <div className="sbp-header">
        <div className="sbp-header-left">
          <button className="sbp-back-btn" onClick={onBack} title="Back to dashboard">
            <ArrowLeftIcon />
          </button>
          <div className="sbp-header-info">
            <h1 className="sbp-site-name">{mockSite.name}</h1>
            <p className="sbp-site-url">{mockSite.slug}.kicksite.io</p>
          </div>
        </div>

        <div className="sbp-header-right">
          <div className={`sbp-save-status ${savedStatus}`}>
            {savedStatus === 'all-saved' && (
              <>
                <span className="sbp-status-dot"></span>
                <span className="sbp-status-text">All saved</span>
              </>
            )}
            {savedStatus === 'saving' && (
              <>
                <span className="sbp-status-dot sbp-status-dot--saving"></span>
                <span className="sbp-status-text">Saving...</span>
              </>
            )}
          </div>

          <button
            className={`sbp-btn sbp-btn--preview ${showPreview ? 'sbp-btn--preview--active' : ''}`}
            onClick={handlePreview}
            title="Toggle preview mode"
          >
            <EyeIcon />
            Preview
          </button>

          <button className="sbp-btn sbp-btn--save" onClick={handleSave} disabled={savedStatus === 'saving'}>
            <SaveIcon />
            Save Draft
          </button>

          <button className="sbp-btn sbp-btn--publish" onClick={handlePublish} disabled={isPublishing}>
            <PublishIcon />
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="sbp-content">
        {/* Left Sidebar - Site Structure + Properties */}
        <div className="sbp-sidebar sbp-sidebar--left sbp-sidebar--expanded">
          {/* Structure Section */}
          <div className="sbp-left-section">
            <h3 className="sbp-sidebar-title">Site Structure</h3>

            <div className="sbp-sections-list">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`sbp-section-item ${selectedSection?.id === section.id ? 'sbp-section-item--active' : ''}`}
                >
                  <button
                    className="sbp-section-btn"
                    onClick={() => {
                      setSelectedSection(section);
                      console.log('Selected section:', section.name);
                    }}
                  >
                    <span className="sbp-section-icon">{section.icon}</span>
                    <span className="sbp-section-label">{section.name}</span>
                  </button>
                  <div className="sbp-section-actions">
                    <button
                      className="sbp-section-action"
                      onClick={() => handleDuplicateSection(section)}
                      title="Duplicate section"
                    >
                      <DuplicateIcon />
                    </button>
                    <button
                      className="sbp-section-action sbp-section-action--delete"
                      onClick={() => handleDeleteSection(section.id)}
                      title="Delete section"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="sbp-add-section-btn" onClick={handleAddSection}>
              <PlusIcon />
              Add Section
            </button>
          </div>

          {/* Properties Section */}
          <div className="sbp-left-section sbp-properties-section">
            <h3 className="sbp-sidebar-title">Properties</h3>

            {selectedSection ? (
              <div className="sbp-properties-panel">
                <div className="sbp-property-group">
                  <label className="sbp-property-label">Section Name</label>
                  <input
                    type="text"
                    value={selectedSection.name}
                    onChange={(e) => {
                      setSelectedSection({ ...selectedSection, name: e.target.value });
                      setSections(sections.map(s => s.id === selectedSection.id ? { ...s, name: e.target.value } : s));
                    }}
                    className="sbp-property-input"
                  />
                </div>

                <div className="sbp-property-group">
                  <label className="sbp-property-label">Section Type</label>
                  <select
                    value={selectedSection.type}
                    onChange={(e) => {
                      const updated = { ...selectedSection, type: e.target.value };
                      setSelectedSection(updated);
                      setSections(sections.map(s => s.id === selectedSection.id ? updated : s));
                    }}
                    className="sbp-property-select"
                  >
                    <option value="hero">Hero</option>
                    <option value="text">Text</option>
                    <option value="grid">Grid</option>
                    <option value="gallery">Gallery</option>
                    <option value="form">Form</option>
                    <option value="cta">Call to Action</option>
                    <option value="testimonial">Testimonial</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                <div className="sbp-property-group">
                  <label className="sbp-property-label">Background Color</label>
                  <div className="sbp-color-picker">
                    <div className="sbp-color-option" style={{ backgroundColor: '#fff' }} title="White"></div>
                    <div className="sbp-color-option" style={{ backgroundColor: '#f3f4f6' }} title="Light Gray"></div>
                    <div className="sbp-color-option" style={{ backgroundColor: '#e5e7eb' }} title="Gray"></div>
                    <div className="sbp-color-option" style={{ backgroundColor: '#1f2937' }} title="Dark"></div>
                    <div className="sbp-color-option" style={{ backgroundColor: '#3b82f6' }} title="Blue"></div>
                  </div>
                </div>

                <div className="sbp-property-group">
                  <label className="sbp-property-label">Padding</label>
                  <div className="sbp-property-input-group">
                    <input type="number" placeholder="Top" className="sbp-property-input" defaultValue="20" />
                    <input type="number" placeholder="Bottom" className="sbp-property-input" defaultValue="20" />
                  </div>
                </div>

                <div className="sbp-property-divider"></div>

                <div className="sbp-property-group">
                  <label className="sbp-property-label">Visibility</label>
                  <div className="sbp-toggle-group">
                    <button className="sbp-toggle-btn sbp-toggle-btn--active">Desktop</button>
                    <button className="sbp-toggle-btn">Mobile</button>
                  </div>
                </div>

                <div className="sbp-property-group">
                  <label className="sbp-property-label">
                    <input type="checkbox" defaultChecked /> Show on Mobile
                  </label>
                </div>
              </div>
            ) : (
              <div className="sbp-no-properties">
                <span style={{ fontSize: '48px' }}>⚙️</span>
                <p>Select a section</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Full Website Preview */}
        <div className="sbp-website-preview-container">
          <WebsitePreview
            sections={sections}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
          />
        </div>
      </div>
    </div>
  );
}
