import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/slices/toastSlice';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ToastItem({ toast }) {
  const dispatch = useDispatch();
  const isSuccess = toast.type === 'success';

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), 3500);
    return () => clearTimeout(t);
  }, [toast.id, dispatch]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      borderRadius: 10,
      background: isSuccess ? '#0f2718' : '#2a0d0d',
      border: `1px solid ${isSuccess ? '#16a34a' : '#dc2626'}`,
      color: '#f1f5f9',
      fontSize: 14,
      fontWeight: 500,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      minWidth: 260,
      maxWidth: 380,
      animation: 'toast-in 0.25s ease',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* progress bar */}
      <span style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 3,
        width: '100%',
        background: isSuccess ? '#16a34a' : '#dc2626',
        animation: 'toast-progress 3.5s linear forwards',
        transformOrigin: 'left',
      }} />

      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: isSuccess ? '#16a34a22' : '#dc262622',
        color: isSuccess ? '#4ade80' : '#f87171',
        flexShrink: 0,
      }}>
        {isSuccess ? <CheckIcon /> : <XIcon />}
      </span>

      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>

      <button
        onClick={() => dispatch(removeToast(toast.id))}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#64748b',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts } = useSelector(s => s.toast);

  if (!toasts.length) return null;

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem toast={t} />
          </div>
        ))}
      </div>
    </>
  );
}
