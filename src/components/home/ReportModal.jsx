import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportReasons, reportPost, reportUser } from '../../store/slices/postsSlice';

export default function ReportModal({ postId, userId, onClose }) {
  const dispatch = useDispatch();
  const { reportReasons, reasonsLoading, reportSubmitting } = useSelector(s => s.posts);
  const [selected, setSelected] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reportReasons.length === 0) dispatch(fetchReportReasons());
  }, [dispatch, reportReasons.length]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit() {
    if (!selected || reportSubmitting) return;
    const action = userId ? reportUser({ userId, reason: selected }) : reportPost({ postId, reason: selected });
    const result = await dispatch(action);
    if (!result.error) setDone(true);
  }

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="report-overlay" onClick={handleOverlay}>
      <div className="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <div className="report-modal-header">
          <h2 className="report-modal-title" id="report-title">{userId ? 'Report User' : 'Report'}</h2>
          <button className="report-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {done ? (
          <div className="report-success">
            <div className="report-success-icon">✓</div>
            <p>Thank you for your report. We'll review it and take action if it violates our community guidelines.</p>
            <button className="report-success-close" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="report-modal-body">
              <h3 className="report-question">What's going on?</h3>
              <p className="report-subtitle">
                We'll check for all community guidelines, so don't worry about making the perfect choice.
              </p>

              {reasonsLoading ? (
                <p style={{ color: '#5c6a8c', fontSize: '13px', padding: '8px 0' }}>Loading…</p>
              ) : (
                <ul className="report-reasons">
                  {reportReasons.map(reason => (
                    <li key={reason} className="report-reason-item">
                      <label className="report-reason-label">
                        <span className={`report-radio${selected === reason ? ' report-radio--checked' : ''}`} />
                        <input
                          type="radio"
                          name="report-reason"
                          value={reason}
                          checked={selected === reason}
                          onChange={() => setSelected(reason)}
                          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                        />
                        <span className="report-reason-text">{reason}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="report-modal-footer">
              <button
                className="report-submit-btn"
                onClick={handleSubmit}
                disabled={!selected || reportSubmitting}
              >
                {reportSubmitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
