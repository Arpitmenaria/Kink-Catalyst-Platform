import { useRef, useEffect, useState } from 'react';
import './PostActionsMenu.css';

function MoreIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
}

function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
}

function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}

function PinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}

function PostActionsMenu({
  isAuthor = false,
  isAdmin = false,
  isPinned = false,
  onDelete,
  onEdit,
  onPin,
  onUnpin,
  isDeleting = false,
  isPinning = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!isAuthor && !isAdmin) return null;

  return (
    <div className="post-actions-menu" ref={ref}>
      <button
        className="post-actions-trigger"
        onClick={() => setOpen(!open)}
        title="More options"
      >
        <MoreIcon />
      </button>

      {open && (
        <div className="post-actions-dropdown">
          {isAuthor && (
            <>
              <button
                className="post-action-item"
                onClick={() => {
                  onEdit?.();
                  setOpen(false);
                }}
              >
                <EditIcon /> Edit
              </button>
              <button
                className="post-action-item delete"
                onClick={() => {
                  if (confirm('Delete this post? This cannot be undone.')) {
                    onDelete?.();
                    setOpen(false);
                  }
                }}
                disabled={isDeleting}
              >
                <TrashIcon /> {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}

          {isAdmin && (
            <button
              className="post-action-item"
              onClick={() => {
                if (isPinned) {
                  onUnpin?.();
                } else {
                  onPin?.();
                }
                setOpen(false);
              }}
              disabled={isPinning}
            >
              <PinIcon /> {isPinning ? 'Pinning...' : isPinned ? 'Unpin' : 'Pin'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PostActionsMenu;
