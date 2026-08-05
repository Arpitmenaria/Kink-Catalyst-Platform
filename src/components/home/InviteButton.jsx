import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inviteUserToGroup } from '../../store/slices/invitationsSlice';
import { showToast } from '../../store/slices/toastSlice';
import './InviteButton.css';

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function InviteButton({ groupId, groupMembers = [] }) {
  const dispatch = useDispatch();
  const { invitingIds } = useSelector((s) => s.invitations);
  const { connections = [] } = useSelector((s) => s.profile);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
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

  const memberIds = new Set((groupMembers || []).map((m) => m._id ?? m.id));
  const filtered = (connections || []).filter((c) => {
    const cid = c._id ?? c.id;
    return !memberIds.has(cid) && (c.name ?? '').toLowerCase().includes(search.toLowerCase());
  });

  function handleInvite(userId) {
    dispatch(inviteUserToGroup({ groupId, userId })).then((action) => {
      if (inviteUserToGroup.fulfilled.match(action)) {
        dispatch(showToast({ message: 'Invitation sent', type: 'success' }));
        setSearch('');
      } else {
        dispatch(showToast({ message: action.payload ?? 'Failed to send invitation', type: 'error' }));
      }
    });
  }

  return (
    <div className="invite-button-wrap" ref={ref}>
      <button className="invite-button" onClick={() => setOpen(!open)}>
        <PlusIcon /> Invite Members
      </button>

      {open && (
        <div className="invite-dropdown">
          <input
            type="text"
            className="invite-search"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          <div className="invite-list">
            {filtered.length === 0 ? (
              <p className="invite-empty">
                {search ? 'No matching connections' : 'No connections to invite'}
              </p>
            ) : (
              filtered.map((user) => {
                const uid = user._id ?? user.id;
                const isInviting = invitingIds.includes(uid);
                return (
                  <button
                    key={uid}
                    className="invite-item"
                    onClick={() => handleInvite(uid)}
                    disabled={isInviting}
                  >
                    <div className="invite-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="invite-avatar-placeholder">{(user.name ?? 'U')[0].toUpperCase()}</div>
                      )}
                    </div>
                    <div className="invite-info">
                      <p className="invite-name">{user.name}</p>
                    </div>
                    <button
                      className="invite-send-btn"
                      disabled={isInviting}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInvite(uid);
                      }}
                    >
                      {isInviting ? '...' : 'Invite'}
                    </button>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InviteButton;
