import { useState } from 'react';
import AnimatedNav from './AnimatedNav';
import { ALEX_AVATAR } from './mockData';
import './QuizzesPage.css';

function CheckCircleIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

function XCircleIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
}

const QUIZZES = [
  { id: 1, title: 'React Hooks Basics', course: 'React Performance Patterns', status: 'completed', score: 92, total: 100, attempts: 1, date: 'Today' },
  { id: 2, title: 'Component Architecture', course: 'Advanced UI Design Systems', status: 'completed', score: 88, total: 100, attempts: 1, date: 'Yesterday' },
  { id: 3, title: 'Design System Tokens', course: 'Advanced UI Design Systems', status: 'in-progress', score: 65, total: 100, attempts: 1, date: 'In Progress' },
  { id: 4, title: 'Product Strategy', course: 'Product Management Fundamentals', status: 'not-started', score: 0, total: 100, attempts: 0, date: 'Not Started' },
];

export default function QuizzesPage({ onBack, onMessagesClick, onEventsClick, onGroupsClick, onCalendarClick, onLibraryClick, onMinisitesClick }) {
  const avatarUrl = ALEX_AVATAR;
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleNav = (id) => {
    if (id === 'home') onBack?.();
    if (id === 'library') onLibraryClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'events') onEventsClick?.();
    if (id === 'friends') onGroupsClick?.();
    if (id === 'calendar') onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  };

  const stats = {
    completed: QUIZZES.filter(q => q.status === 'completed').length,
    avgScore: 90,
    inProgress: QUIZZES.filter(q => q.status === 'in-progress').length,
  };

  return (
    <div className="qp-page">
      <AnimatedNav avatarUrl={avatarUrl} activeNav="courses" onNav={handleNav} />

      <div className="qp-container">
        <div className="qp-header">
          <button className="qp-back-btn" onClick={onBack}>← Back</button>
          <h1 className="qp-title">Quizzes & Tests</h1>
          <p className="qp-subtitle">Track your quiz performance across courses</p>
        </div>

        {/* Stats Cards */}
        <div className="qp-stats">
          <div className="qp-stat-card">
            <div className="qp-stat-icon">✅</div>
            <div className="qp-stat-content">
              <div className="qp-stat-number">{stats.completed}</div>
              <div className="qp-stat-label">Quizzes Completed</div>
            </div>
          </div>
          <div className="qp-stat-card">
            <div className="qp-stat-icon">⭐</div>
            <div className="qp-stat-content">
              <div className="qp-stat-number">{stats.avgScore}%</div>
              <div className="qp-stat-label">Average Score</div>
            </div>
          </div>
          <div className="qp-stat-card">
            <div className="qp-stat-icon">⏳</div>
            <div className="qp-stat-content">
              <div className="qp-stat-number">{stats.inProgress}</div>
              <div className="qp-stat-label">In Progress</div>
            </div>
          </div>
        </div>

        {/* Quizzes List */}
        <div className="qp-quizzes">
          <h2 className="qp-section-title">Your Quizzes</h2>
          <div className="qp-list">
            {QUIZZES.map(quiz => (
              <div key={quiz.id} className={`qp-quiz-card qp-quiz--${quiz.status}`} onClick={() => setSelectedQuiz(quiz)}>
                <div className="qp-quiz-header">
                  <h3 className="qp-quiz-title">{quiz.title}</h3>
                  <span className={`qp-status-badge qp-status--${quiz.status}`}>
                    {quiz.status === 'completed' && '✓ Completed'}
                    {quiz.status === 'in-progress' && '⏳ In Progress'}
                    {quiz.status === 'not-started' && '→ Start'}
                  </span>
                </div>
                <p className="qp-quiz-course">{quiz.course}</p>
                <div className="qp-quiz-footer">
                  <div className="qp-score-info">
                    {quiz.status === 'completed' && (
                      <>
                        <div className="qp-score-bar">
                          <div className="qp-score-fill" style={{ width: `${quiz.score}%` }}></div>
                        </div>
                        <span className="qp-score-text">{quiz.score}/{quiz.total} points</span>
                      </>
                    )}
                    {quiz.status === 'in-progress' && (
                      <>
                        <div className="qp-score-bar">
                          <div className="qp-score-fill qp-progress-color" style={{ width: `${quiz.score}%` }}></div>
                        </div>
                        <span className="qp-score-text">Progress: {quiz.score}%</span>
                      </>
                    )}
                    {quiz.status === 'not-started' && (
                      <span className="qp-score-text">Not yet attempted</span>
                    )}
                  </div>
                  <button className="qp-quiz-action">
                    {quiz.status === 'completed' && `Attempt ${quiz.attempts + 1}`}
                    {quiz.status === 'in-progress' && 'Continue'}
                    {quiz.status === 'not-started' && 'Start Quiz'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <div className="qp-modal-overlay" onClick={() => setSelectedQuiz(null)}>
          <div className="qp-modal" onClick={e => e.stopPropagation()}>
            <button className="qp-modal-close" onClick={() => setSelectedQuiz(null)}>✕</button>
            <h2 className="qp-modal-title">{selectedQuiz.title}</h2>
            <p className="qp-modal-course">{selectedQuiz.course}</p>

            {selectedQuiz.status === 'completed' && (
              <div className="qp-result-card">
                <div className="qp-result-icon qp-result--pass"><CheckCircleIcon /></div>
                <h3 className="qp-result-title">Quiz Passed! 🎉</h3>
                <div className="qp-result-score">{selectedQuiz.score} out of {selectedQuiz.total}</div>
                <p className="qp-result-text">Great job! You scored {selectedQuiz.score}% on this quiz.</p>
                <button className="qp-modal-btn" onClick={() => setSelectedQuiz(null)}>Retake Quiz</button>
              </div>
            )}

            {selectedQuiz.status === 'in-progress' && (
              <div className="qp-progress-card">
                <div className="qp-progress-bar">
                  <div className="qp-progress-fill" style={{ width: `${selectedQuiz.score}%` }}></div>
                </div>
                <p className="qp-progress-text">You're {selectedQuiz.score}% complete</p>
                <button className="qp-modal-btn" onClick={() => setSelectedQuiz(null)}>Continue Quiz</button>
              </div>
            )}

            {selectedQuiz.status === 'not-started' && (
              <div className="qp-start-card">
                <p className="qp-start-text">This quiz has 10 questions and takes about 15 minutes to complete.</p>
                <button className="qp-modal-btn" onClick={() => setSelectedQuiz(null)}>Start Quiz Now</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
