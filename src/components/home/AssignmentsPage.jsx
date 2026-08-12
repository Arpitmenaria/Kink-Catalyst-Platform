import { useState } from 'react';
import AnimatedNav from './AnimatedNav';
import { ALEX_AVATAR } from './mockData';
import './EducationPages.css';

const ASSIGNMENTS = [
  { id: 1, title: 'Build a Custom Hook', course: 'React Performance Patterns', dueDate: '2 days', status: 'submitted', grade: 95 },
  { id: 2, title: 'Design System Component', course: 'Advanced UI Design Systems', dueDate: '5 days', status: 'in-progress', grade: null },
  { id: 3, title: 'Product Requirements Doc', course: 'Product Management Fundamentals', dueDate: '1 week', status: 'pending', grade: null },
];

export default function AssignmentsPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
          <h1 className="ep-title">Assignments</h1>
        </div>
        <div className="ep-list">
          {ASSIGNMENTS.map(a => (
            <div key={a.id} className={`ep-card ep-status--${a.status}`} onClick={() => setSelectedAssignment(a)}>
              <div className="ep-card-header">
                <h3 className="ep-card-title">{a.title}</h3>
                <span className={`ep-badge ep-badge--${a.status}`}>{a.status.replace('-', ' ')}</span>
              </div>
              <p className="ep-card-course">{a.course}</p>
              <div className="ep-card-footer">
                <span className="ep-due">Due: {a.dueDate}</span>
                {a.grade && <span className="ep-grade">✓ {a.grade}%</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
