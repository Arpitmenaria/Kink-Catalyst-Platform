import AnimatedNav from './AnimatedNav';
import { ALEX_AVATAR } from './mockData';
import './EducationPages.css';

const CERTIFICATES = [
  { id: 1, course: 'React Performance Patterns', date: 'Aug 5, 2026', instructor: 'Leo Zhang' },
  { id: 2, course: 'Advanced UI Design Systems', date: 'Jul 28, 2026', instructor: 'Alex Rivera' },
  { id: 3, course: 'UX Research Methods & Usability Testing', date: 'Jul 15, 2026', instructor: 'Sophie Moreau' },
];

export default function CertificatesPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const handleNav = (id) => {
    if (id === 'home') onBack?.();
    if (id === 'library') onLibraryClick?.();
  };

  return (
    <div className="ep-page">
      <AnimatedNav avatarUrl={ALEX_AVATAR} activeNav="courses" onNav={handleNav} />
      <div className="ep-container">
        <div className="ep-header">
          <button className="ep-back-btn" onClick={onBack}>← Back</button>
          <h1 className="ep-title">My Certificates</h1>
        </div>

        <div className="cp-certificates">
          {CERTIFICATES.map(cert => (
            <div key={cert.id} className="cp-cert-card">
              <div className="cp-cert-icon">🏆</div>
              <h3 className="cp-cert-title">{cert.course}</h3>
              <p className="cp-cert-instructor">by {cert.instructor}</p>
              <div className="cp-cert-date">Earned: {cert.date}</div>
              <button className="cp-cert-action">Download Certificate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
