import { useState } from 'react';
import AnimatedNav from './AnimatedNav';
import { ALEX_AVATAR } from './mockData';
import './EducationPages.css';

const DISCUSSIONS = [
  { id: 1, course: 'React Performance Patterns', title: 'Best way to optimize render performance?', replies: 12, lastReply: '2h ago', author: 'You' },
  { id: 2, course: 'Advanced UI Design Systems', title: 'Token naming conventions', replies: 8, lastReply: '1d ago', author: 'Alex Rivera' },
  { id: 3, course: 'Product Management Fundamentals', title: 'How to run effective retrospectives?', replies: 24, lastReply: '3h ago', author: 'Sarah Jenkins' },
];

export default function DiscussionPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

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
          <h1 className="ep-title">Course Discussions</h1>
        </div>

        <div className="dp-discussions">
          {DISCUSSIONS.map(d => (
            <div key={d.id} className="dp-thread" onClick={() => setSelectedDiscussion(d)}>
              <div className="dp-thread-header">
                <h3 className="dp-thread-title">{d.title}</h3>
                <span className="dp-replies">{d.replies} replies</span>
              </div>
              <p className="dp-course">{d.course}</p>
              <div className="dp-thread-meta">
                <span className="dp-author">by {d.author}</span>
                <span className="dp-last-reply">Last reply {d.lastReply}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedDiscussion && (
          <div className="dp-modal-overlay" onClick={() => setSelectedDiscussion(null)}>
            <div className="dp-modal" onClick={e => e.stopPropagation()}>
              <h2 className="dp-modal-title">{selectedDiscussion.title}</h2>
              <p className="dp-modal-course">{selectedDiscussion.course}</p>
              <div className="dp-message">
                <strong>{selectedDiscussion.author}</strong>
                <p>What's the most effective way to approach this problem? I've been thinking about it and would love to hear your perspective.</p>
              </div>
              <textarea placeholder="Reply..." className="dp-reply-input"></textarea>
              <button className="dp-reply-btn">Post Reply</button>
              <button className="dp-close-btn" onClick={() => setSelectedDiscussion(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
