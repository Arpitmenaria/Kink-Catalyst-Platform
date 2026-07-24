import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import { AllSuggestionsModal } from './LeftSidebar';
import { fetchSuggestions, followUser, unfollowUser, dismissSuggestion, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, fetchFriendRequests, fetchAllUsers, fetchBlockedUsers, unblockUser } from '../../store/slices/usersSlice';
import {
  fetchUserProfile, updateAvatar, updateCover, updateProfile, updateEducation,
  fetchConnections, removeConnection, fetchPhotos, uploadPhoto,
  fetchFollowers, fetchFollowing, fetchGallery,
  fetchAlbums, createAlbum,
} from '../../store/slices/profileSlice';
import { fetchMyPosts } from '../../store/slices/postsSlice';
import { fetchEvents } from '../../store/slices/eventsSlice';
import { showToast } from '../../store/slices/toastSlice';
import { PROFILE_TABS } from './mockData';
import SkeletonImg from '../SkeletonImg';
import { CustomDatePicker } from './DateTimePicker';
import ImageCropper from './ImageCropper';
import './ProfilePage.css';

const TABS = PROFILE_TABS;

// Latest allowed DOB = today − 18 years (must be 18+, no future dates).
const MAX_DOB = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();


const PERSONAL_INFO = [
  { id: 'name',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,     label: 'Full Name' },
  { id: 'dob',     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: 'Date of Birth' },
  { id: 'gender',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><line x1="12" y1="14" x2="12" y2="21"/><line x1="9" y1="19" x2="15" y2="19"/></svg>, label: 'Gender' },
  { id: 'status',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label: 'Relationship Status' },
  { id: 'location',icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Location' },
  { id: 'email',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email' },
  { id: 'phone',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'Phone' },
  { id: 'website', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: 'Website' },
];

function BriefcaseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function PinIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function CalIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function GradCapIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2 2 6 2s6-1 6-2v-5"/></svg>; }
function EditIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function ImagePlaceholderIcon() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>; }
function BackArrowIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function MoreIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }
function PhotosIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function VideoIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>; }
function EventIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function PlusCircle()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function LockIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }


function CameraIcon() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function HeartFillIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function MsgIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }

function ChevronDown() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
}
function CheckIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function PersonAddIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
}

function initials(name = '') {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function MutualIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 3 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function SuggLocationIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 3 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}

function FriendSuggestionsPanel({ onUserClick }) {
  const dispatch   = useDispatch();
  const { suggestions, dismissedIds: reduxDismissed, friendStatusMap, followingIds, allUsers, allUsersLoading } = useSelector(s => s.users);

  const [poppingIds, setPoppingIds] = useState(new Set());
  const [removingIds, setRemovingIds] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { dispatch(fetchSuggestions(5)); }, [dispatch]);

  function openAll() { setShowAll(true); dispatch(fetchAllUsers()); }

  function handleAdd(id, status) {
    if (status === 'requested' || status === 'connected') return;
    dispatch(sendFriendRequest(id)).then((result) => {
      if (sendFriendRequest.fulfilled.match(result)) dispatch(fetchSuggestions(5));
    });
    setPoppingIds(p => new Set([...p, id]));
    setTimeout(() => setPoppingIds(p => { const s = new Set(p); s.delete(id); return s; }), 500);
  }

  function handleFollow(id, isFollowing) {
    dispatch(isFollowing ? unfollowUser(id) : followUser(id));
  }

  function handleRemove(id) {
    setRemovingIds(p => new Set([...p, id]));
    setTimeout(() => {
      dispatch(dismissSuggestion(id));
      setRemovingIds(p => { const s = new Set(p); s.delete(id); return s; });
    }, 380);
  }

  const visible = suggestions.filter(f => !reduxDismissed.includes(f.id ?? f._id));

  return (
    <div className="prof-conn-suggestions">
      <div className="prof-sugg-header">
        <span className="prof-sugg-title">Friend Suggestions</span>
        <button className="prof-sugg-see-all" onClick={openAll}>View all</button>
      </div>
      {visible.map(f => {
        const id = f.id ?? f._id;
        const status = friendStatusMap[id] ?? f.friendStatus ?? 'none';
        const isPendingOrConnected = status === 'requested' || status === 'connected';
        const isFollowing = followingIds.includes(id) || !!f.isFollowing;
        const hasMutual = !!f.mutualFriends;
        const locationText = f.location || f.city;
        const sub = hasMutual ? `${f.mutualFriends} mutual` : (locationText || f.sub || '');
        return (
          <div key={id} className={`prof-sugg-item${removingIds.has(id) ? ' prof-sugg-item--removing' : ''}`}>
            <button className="prof-sugg-close" onClick={() => handleRemove(id)} title="Remove" aria-label="Remove suggestion">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="prof-sugg-item-top">
              <div
                className="prof-sugg-avatar"
                style={{ background: f.avatarColor ?? f.color ?? '#3b82f6', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => onUserClick?.(id)}
              >
                {f.avatar
                  ? <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : f.name.split(' ').map(w => w[0]).join('').toUpperCase()
                }
              </div>
              <div className="prof-sugg-info">
                <p className="prof-sugg-name" style={{ cursor: 'pointer' }} onClick={() => onUserClick?.(id)}>{f.name}</p>
                {sub && <p className="prof-sugg-sub">{hasMutual ? <MutualIcon /> : <SuggLocationIcon />}{sub}</p>}
              </div>
            </div>
            <div className="prof-sugg-actions">
              <button
                className={`prof-sugg-add-btn${isPendingOrConnected ? ' prof-sugg-add-btn--added' : ''}${poppingIds.has(id) ? ' prof-sugg-add-btn--pop' : ''}`}
                onClick={() => handleAdd(id, status)}
                disabled={isPendingOrConnected}
              >
                {status === 'connected' ? '✓ Connected' : status === 'requested' ? 'Requested' : 'Add Friend'}
              </button>
              <button
                className={`prof-sugg-follow-btn${isFollowing ? ' prof-sugg-follow-btn--on' : ''}`}
                onClick={() => handleFollow(id, isFollowing)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        );
      })}
      {showAll && (
        <AllSuggestionsModal
          suggestions={allUsers}
          loading={allUsersLoading}
          friendStatusMap={friendStatusMap}
          followingIds={followingIds}
          onClose={() => setShowAll(false)}
          onAddFriend={handleAdd}
          onFollowToggle={handleFollow}
          onDismiss={handleRemove}
          onUserClick={onUserClick}
        />
      )}
    </div>
  );
}

export function ConnectionsTab({ onUserClick, onMessageUser, hideSearch }) {
  const dispatch = useDispatch();
  const { connections, connectionsTotal } = useSelector(s => s.profile);
  const { friendRequests, blockedUsersList, blockedUsersListLoading, blockingId } = useSelector(s => s.users);

  const [viewMode,  setViewMode]  = useState('list');
  const [search,    setSearch]    = useState('');
  const [filterLoc, setFilterLoc] = useState('');
  const [filterInd, setFilterInd] = useState('');
  const [openDrop,  setOpenDrop]  = useState(null); // 'loc' | 'ind' | null
  const [showBlocked, setShowBlocked] = useState(false);
  const filterBarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConnections());
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  useEffect(() => {
    if (showBlocked) dispatch(fetchBlockedUsers());
  }, [showBlocked, dispatch]);

  function handleUnblock(userId) {
    dispatch(unblockUser(userId)).then(action => {
      if (unblockUser.fulfilled.match(action)) {
        dispatch(showToast({ message: 'User unblocked', type: 'success' }));
      } else {
        dispatch(showToast({ message: action.payload || 'Failed to unblock user', type: 'error' }));
      }
    });
  }

  useEffect(() => {
    if (!openDrop) return;
    function onOut(e) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) setOpenDrop(null);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [openDrop]);

  const CONN_LOCATIONS  = [...new Set(connections.map(c => c.location).filter(Boolean))];
  const CONN_INDUSTRIES = [...new Set(connections.map(c => c.industry).filter(Boolean))];

  const hasFilter = filterLoc || filterInd;

  function openConnProfile(conn) {
    onUserClick?.(conn.id ?? conn._id);
  }

  const visible = connections.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filterLoc || c.location === filterLoc) &&
    (!filterInd || c.industry === filterInd)
  );

  function handleRemove(connId) {
    dispatch(removeConnection(connId));
  }

  return (
    <div className="prof-conn-layout">
    <div className="prof-conn-tab">
      {friendRequests.length > 0 && (
        <div className="prof-invites">
          <h3 className="prof-invites-title">Invitations <span className="prof-conn-count">{friendRequests.length}</span></h3>
          <div className="prof-invites-list">
            {friendRequests.map(req => (
              <div key={req.requestId ?? req.userId} className="prof-invite-item">
                <div className="prof-invite-left" style={{ cursor: 'pointer' }} onClick={() => onUserClick?.(req.userId)}>
                  {req.avatar
                    ? <img src={req.avatar} alt={req.name} className="prof-invite-avatar" />
                    : <span className="prof-invite-avatar prof-conn-avatar--fallback">{initials(req.name)}</span>
                  }
                  <span className="prof-invite-name">{req.name}</span>
                </div>
                <div className="prof-invite-actions">
                  <button className="prof-invite-btn prof-invite-btn--accept" onClick={() => dispatch(acceptFriendRequest(req.userId)).then(() => dispatch(fetchConnections()))}>Accept</button>
                  <button className="prof-invite-btn prof-invite-btn--ignore" onClick={() => dispatch(rejectFriendRequest(req.userId))}>Ignore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="prof-conn-header">
        <div className="prof-conn-header-left">
          <h3 className="prof-conn-title">Connections</h3>
          <span className="prof-conn-count">{connectionsTotal}</span>
        </div>
        <div className="prof-conn-header-right">
          <div className="prof-conn-view-toggle">
            <button
              className={`prof-conn-view-btn${viewMode === 'list' ? ' prof-conn-view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <button
              className={`prof-conn-view-btn${viewMode === 'grid' ? ' prof-conn-view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="prof-conn-filter-bar" ref={filterBarRef}>
        {!hideSearch && (
          <div className="prof-conn-search-wrap">
            <svg className="prof-conn-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="prof-conn-search"
              type="text"
              placeholder="Search connections..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}
        <button
          className={`prof-conn-fbar-pill prof-conn-fbar-pill--label${hasFilter ? ' prof-conn-fbar-pill--has-filter' : ''}`}
          onClick={() => { setFilterLoc(''); setFilterInd(''); setOpenDrop(null); }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters
          {hasFilter && <span className="prof-conn-fbar-dot" />}
        </button>

        <div className="prof-conn-fbar-item">
          <button
            className={`prof-conn-fbar-pill${filterLoc ? ' prof-conn-fbar-pill--active' : ''}${openDrop === 'loc' ? ' prof-conn-fbar-pill--open' : ''}`}
            onClick={() => setOpenDrop(openDrop === 'loc' ? null : 'loc')}
          >
            {filterLoc || 'Location'} <ChevronDown />
          </button>
          {openDrop === 'loc' && (
            <div className="prof-conn-fbar-dropdown">
              {CONN_LOCATIONS.length === 0 && <span className="prof-conn-fbar-empty">No locations</span>}
              {CONN_LOCATIONS.map(loc => (
                <button
                  key={loc}
                  className={`prof-conn-fbar-opt${filterLoc === loc ? ' prof-conn-fbar-opt--active' : ''}`}
                  onClick={() => { setFilterLoc(filterLoc === loc ? '' : loc); setOpenDrop(null); }}
                >
                  {filterLoc === loc && <CheckIcon />}
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="prof-conn-fbar-item">
          <button
            className={`prof-conn-fbar-pill${filterInd ? ' prof-conn-fbar-pill--active' : ''}${openDrop === 'ind' ? ' prof-conn-fbar-pill--open' : ''}`}
            onClick={() => setOpenDrop(openDrop === 'ind' ? null : 'ind')}
          >
            {filterInd || 'Industry'} <ChevronDown />
          </button>
          {openDrop === 'ind' && (
            <div className="prof-conn-fbar-dropdown">
              {CONN_INDUSTRIES.length === 0 && <span className="prof-conn-fbar-empty">No industries</span>}
              {CONN_INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  className={`prof-conn-fbar-opt${filterInd === ind ? ' prof-conn-fbar-opt--active' : ''}`}
                  onClick={() => { setFilterInd(filterInd === ind ? '' : ind); setOpenDrop(null); }}
                >
                  {filterInd === ind && <CheckIcon />}
                  {ind}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className={`prof-conn-fbar-pill${showBlocked ? ' prof-conn-fbar-pill--active' : ''}`}
          onClick={() => setShowBlocked(!showBlocked)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          Blocked
        </button>

        {hasFilter && (
          <button
            className="prof-conn-fbar-clear"
            onClick={() => { setFilterLoc(''); setFilterInd(''); setOpenDrop(null); }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Remove filter
          </button>
        )}
      </div>

      {/* ── Blocked users view ── */}
      {showBlocked && (
        <div className="prof-conn-list">
          {blockedUsersListLoading && blockedUsersList.length === 0 && (
            <p className="prof-conn-empty">Loading blocked users...</p>
          )}
          {!blockedUsersListLoading && blockedUsersList.length === 0 && (
            <p className="prof-conn-empty">You haven't blocked anyone.</p>
          )}
          {blockedUsersList.map(u => (
            <div key={u.id} className="prof-conn-item">
              <div className="prof-conn-avatar-wrap">
                {u.avatar
                  ? <img src={u.avatar} alt={u.name} className="prof-conn-avatar" />
                  : <span className="prof-conn-avatar prof-conn-avatar--fallback">{initials(u.name)}</span>
                }
              </div>
              <div className="prof-conn-info">
                <div className="prof-conn-name-row">
                  <span className="prof-conn-name">{u.name}</span>
                </div>
                <span className="prof-conn-role">{u.role}</span>
                {u.location && (
                  <div className="prof-conn-shared">
                    <span className="prof-conn-shared-text"><SuggLocationIcon />{u.location}</span>
                  </div>
                )}
              </div>
              <div className="prof-conn-actions">
                <button
                  className="prof-conn-btn prof-conn-btn--remove"
                  disabled={blockingId === u.id}
                  onClick={() => handleUnblock(u.id)}
                >
                  {blockingId === u.id ? 'Unblocking...' : 'Unblock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {!showBlocked && viewMode === 'list' && (
        <div className="prof-conn-list">
          {visible.map(conn => (
            <div key={conn.id} className="prof-conn-item">
              <div className="prof-conn-avatar-wrap" style={{ cursor: 'pointer' }} onClick={() => openConnProfile(conn)}>
                {conn.avatar
                  ? <img src={conn.avatar} alt={conn.name} className="prof-conn-avatar" />
                  : <span className="prof-conn-avatar prof-conn-avatar--fallback">{initials(conn.name)}</span>
                }
                <span className={`prof-conn-status-dot${conn.online ? ' prof-conn-status-dot--online' : ''}`} />
              </div>
              <div className="prof-conn-info">
                <div className="prof-conn-name-row">
                  <span className="prof-conn-name" style={{ cursor: 'pointer' }} onClick={() => openConnProfile(conn)}>{conn.name}</span>
                </div>
                <span className="prof-conn-role">{conn.role}</span>
                {conn.location && (
                  <div className="prof-conn-shared">
                    <span className="prof-conn-shared-text"><SuggLocationIcon />{conn.location}</span>
                  </div>
                )}
              </div>
              <div className="prof-conn-actions">
                <button className="prof-conn-btn prof-conn-btn--msg" onClick={() => onMessageUser?.(conn.id)}>Chat</button>
                <button className="prof-conn-btn prof-conn-btn--remove" onClick={() => handleRemove(conn.id)}>Remove from friends</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Grid view ── */}
      {!showBlocked && viewMode === 'grid' && (
        <div className="prof-conn-grid">
          {visible.map(conn => (
            <div key={conn.id} className="prof-conn-card">
              <div className="prof-conn-card-avatar-wrap" style={{ cursor: 'pointer' }} onClick={() => openConnProfile(conn)}>
                {conn.avatar
                  ? <img src={conn.avatar} alt={conn.name} className="prof-conn-card-avatar" />
                  : <span className="prof-conn-card-avatar prof-conn-avatar--fallback">{initials(conn.name)}</span>
                }
                <span className={`prof-conn-status-dot prof-conn-status-dot--card${conn.online ? ' prof-conn-status-dot--online' : ''}`} />
              </div>
              <p className="prof-conn-card-name" style={{ cursor: 'pointer' }} onClick={() => openConnProfile(conn)}>{conn.name}</p>
              <p className="prof-conn-card-role">{conn.role}</p>
              {conn.location && (
                <div className="prof-conn-card-mutual">
                  <span className="prof-conn-shared-text"><SuggLocationIcon />{conn.location}</span>
                </div>
              )}
              <div className="prof-conn-card-actions">
                <button className="prof-conn-btn prof-conn-btn--msg" style={{ flex: 1 }} onClick={() => onMessageUser?.(conn.id)}>Chat</button>
                <button className="prof-conn-btn prof-conn-btn--remove prof-conn-btn--icon-remove" onClick={() => handleRemove(conn.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  <span className="prof-conn-remove-tooltip">Remove from friends</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showBlocked && connectionsTotal > 5 && (
        <button className="prof-conn-load-more">View all connections</button>
      )}
    </div>
    <FriendSuggestionsPanel onUserClick={onUserClick} />
    </div>
  );
}

function MediaCard({ photo }) {
  const [idx, setIdx] = useState(0);
  const multi = photo.images.length > 1;
  const total = photo.images.length;

  function prev(e) { e.stopPropagation(); setIdx(i => (i - 1 + total) % total); }
  function next(e) { e.stopPropagation(); setIdx(i => (i + 1) % total); }

  return (
    <div className="media-photo-card">
      <div className="media-photo-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
        <SkeletonImg src={photo.images[idx]} alt="" className="media-photo-img" />

        {/* Multi-image badge top-right */}
        {multi && (
          <span className="media-multi-badge">{idx + 1}/{total}</span>
        )}

        {/* Swipe arrows — only on multi */}
        {multi && (
          <>
            <button className="media-arrow media-arrow--prev" onClick={prev}>‹</button>
            <button className="media-arrow media-arrow--next" onClick={next}>›</button>
          </>
        )}

        {/* Dot indicators */}
        {multi && (
          <div className="media-dots">
            {photo.images.map((_, i) => (
              <span
                key={i}
                className={`media-dot${i === idx ? ' media-dot--active' : ''}`}
                onClick={e => { e.stopPropagation(); setIdx(i); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryPanel() {
  const { gallery, galleryTotal } = useSelector(s => s.profile);
  const displayed = gallery.slice(0, 6);
  const extra = galleryTotal > 6 ? galleryTotal - 6 : 0;
  return (
    <div className="prof-media-sidebar">
      <div className="right-card">
        <div className="right-section-header" style={{ padding: '12px 14px 10px' }}>
          <p className="right-section-title">Gallery</p>
        </div>
        {displayed.length === 0 && (
          <p style={{ fontSize: 12, color: '#4a5270', margin: '0 14px 14px' }}>No photos yet.</p>
        )}
        <div className="gallery-grid">
          {displayed.map((src, i) => (
            <div key={i} className="gallery-thumb" style={{ overflow: 'hidden', position: 'relative' }}>
              <SkeletonImg src={src} alt="" />
              {i === 5 && extra > 0 && <div className="gallery-more">+{extra}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediaTab({ readOnly }) {
  const dispatch = useDispatch();
  const { photos, albums } = useSelector(s => s.profile);
  const photoInputRef = useRef(null);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [openAlbum, setOpenAlbum] = useState(null);
  const [lbIdx, setLbIdx] = useState(null); // album image lightbox index

  useEffect(() => {
    dispatch(fetchPhotos());
    dispatch(fetchGallery());
    dispatch(fetchAlbums());
  }, [dispatch]);

  function handleFilesChosen(e) {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
    if (files.length === 0) return;
    dispatch(uploadPhoto({ files })).then(() => dispatch(fetchGallery()));
  }

  // Album folder view — clicking an album opens its photos like a real folder.
  if (openAlbum) {
    const current = albums.find(a => a.id === openAlbum.id) ?? openAlbum;
    const albumPhotos = current.photos ?? [];
    const closeLb = () => setLbIdx(null);
    const prevLb = () => setLbIdx(i => (i - 1 + albumPhotos.length) % albumPhotos.length);
    const nextLb = () => setLbIdx(i => (i + 1) % albumPhotos.length);
    return (
      <div className="media-tab">
        <div className="media-header" style={{ justifyContent: 'flex-start', gap: 12 }}>
          <button className="media-album-back" onClick={() => setOpenAlbum(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Albums
          </button>
          <h2 className="media-title">{current.name}</h2>
        </div>
        <div className="media-grid">
          {albumPhotos.length === 0 && (
            <p style={{ gridColumn: '1 / -1', color: '#5c6a8c', fontSize: 13 }}>No photos in this album.</p>
          )}
          {albumPhotos.map((src, i) => (
            <div key={i} className="media-photo-card" style={{ cursor: 'pointer' }} onClick={() => setLbIdx(i)}>
              <div className="media-photo-wrap" style={{ overflow: 'hidden' }}>
                <SkeletonImg src={src} alt="" className="media-photo-img" />
              </div>
            </div>
          ))}
        </div>

        {lbIdx !== null && albumPhotos[lbIdx] && (
          <div className="post-lightbox" onClick={closeLb}>
            <button className="post-lightbox-close" onClick={closeLb} aria-label="Close" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {albumPhotos.length > 1 && <span className="post-lightbox-count">{lbIdx + 1} / {albumPhotos.length}</span>}
            {albumPhotos.length > 1 && (
              <button className="post-lightbox-arrow post-lightbox-arrow--prev" onClick={e => { e.stopPropagation(); prevLb(); }} aria-label="Previous" type="button">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            <div className="post-lightbox-stage" onClick={e => e.stopPropagation()}>
              <img src={albumPhotos[lbIdx]} alt="" className="post-lightbox-media" />
            </div>
            {albumPhotos.length > 1 && (
              <button className="post-lightbox-arrow post-lightbox-arrow--next" onClick={e => { e.stopPropagation(); nextLb(); }} aria-label="Next" type="button">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="media-tab">
      <div className="media-header">
        <h2 className="media-title">Photos</h2>
        {!readOnly && <button className="media-create-btn" onClick={() => setAlbumModalOpen(true)}><PlusIcon /> Create album</button>}
      </div>
      <input ref={photoInputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFilesChosen} />

      {albums.length > 0 && (
        <>
          <h3 className="media-subhead">Albums (These are private directories)</h3>
          <div className="media-album-grid">
            {albums.map(album => (
              <div key={album.id} className="media-album-card" style={{ cursor: 'pointer' }} onClick={() => setOpenAlbum(album)}>
                <div className="media-album-cover">
                  {album.cover
                    ? <SkeletonImg src={album.cover} alt={album.name} className="media-album-cover-img" />
                    : <div className="media-album-cover media-album-cover--empty"><CameraIcon /></div>
                  }
                  <span className="media-album-count">{album.count} photo{album.count === 1 ? '' : 's'}</span>
                </div>
                <p className="media-album-name">{album.name}</p>
              </div>
            ))}
          </div>
          <h3 className="media-subhead">All photos</h3>
        </>
      )}

      <div className="media-grid">
        {!readOnly && (
          <button className="media-add-slot" onClick={() => photoInputRef.current?.click()}>
            <div className="media-add-icon"><CameraIcon /></div>
            <span className="media-add-label">Add photo</span>
          </button>
        )}
        {photos.map(photo => (
          <MediaCard key={photo.id} photo={photo} />
        ))}
      </div>
      {albumModalOpen && <CreateAlbumModal onClose={() => setAlbumModalOpen(false)} />}
    </div>
  );
}

function CreateAlbumModal({ onClose }) {
  const dispatch = useDispatch();
  const { creatingAlbum } = useSelector(s => s.profile);
  const [name, setName] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const ALBUM_MAX = 30;
  function handlePick(e) {
    const picked = [...(e.target.files ?? [])];
    e.target.value = '';
    if (!picked.length) return;
    const room = ALBUM_MAX - files.length;
    if (room <= 0) { setError(`An album can have up to ${ALBUM_MAX} photos.`); return; }
    const toAdd = picked.slice(0, room);
    setFiles(prev => [...prev, ...toAdd]);
    setPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
    setError(picked.length > room ? `An album can have up to ${ALBUM_MAX} photos.` : '');
  }

  function removeAt(idx) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => { URL.revokeObjectURL(prev[idx]); return prev.filter((_, i) => i !== idx); });
  }

  async function handleCreate() {
    if (!name.trim()) { setError('Give your album a name.'); return; }
    if (files.length === 0) { setError('Add at least one photo.'); return; }
    const res = await dispatch(createAlbum({ name: name.trim(), files }));
    if (createAlbum.fulfilled.match(res)) onClose();
    else setError(res.payload || 'Could not create album. Please try again.');
  }

  return (
    <div className="cp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cp-modal" role="dialog" aria-modal="true" style={{ maxWidth: 520 }}>
        <div className="cp-header">
          <div>
            <h2 className="cp-title">Create album</h2>
            <p className="cp-subtitle">Name your album and add photos.</p>
          </div>
          <button className="cp-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="cp-body">
          <input
            className="album-name-input"
            placeholder="Album name"
            value={name}
            onChange={e => { setName(e.target.value); if (error) setError(''); }}
            maxLength={80}
            autoFocus
          />
          <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePick} />
          <div className="media-grid">
            <button type="button" className="media-add-slot" onClick={() => inputRef.current?.click()}>
              <div className="media-add-icon"><CameraIcon /></div>
              <span className="media-add-label">Add photos</span>
            </button>
            {previews.map((src, i) => (
              <div key={i} className="album-thumb">
                <img src={src} alt="" className="album-thumb-img" />
                <button className="cp-remove-media" onClick={() => removeAt(i)} aria-label="Remove">✕</button>
              </div>
            ))}
          </div>
        </div>
        <div className="cp-footer">
          {error && <p className="cp-error">{error}</p>}
          <button className="cp-post-btn" onClick={handleCreate} disabled={creatingAlbum}>
            {creatingAlbum ? 'Creating…' : `Create album${files.length ? ` (${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function UpcomingEventsPanel({ events, onEventClick }) {
  return (
    <div className="prof-ev-sidebar">
      <div className="sidebar-section">
        <div className="section-header">
          <span className="section-title">Upcoming Events</span>
        </div>
        <div className="event-list">
          {events.length === 0 && (
            <p style={{ fontSize: 12, color: '#4a5270', margin: 0 }}>No upcoming events.</p>
          )}
          {events.map(e => (
            <div key={e.id} className="sidebar-event-item" style={{ cursor: 'pointer' }} onClick={() => onEventClick?.(e.id)}>
              <div className="event-thumb" style={{ overflow: 'hidden', borderRadius: 8 }}>
                <img src={e.img} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="friend-info">
                <p className="friend-name">{e.title}</p>
                <p className="friend-sub">{e.month} {e.day}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EventsTab({ onEventsClick, onCreateEvent, onEventClick, readOnly }) {
  const dispatch = useDispatch();
  const { events, eventsLoading } = useSelector(s => s.events);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [openMenuId,    setOpenMenuId]    = useState(null);

  useEffect(() => {
    dispatch(fetchEvents({ tab: 'upcoming', limit: 10 }));
  }, [dispatch]);

  const nextEvent = events[0];

  return (
    <div className="prof-conn-layout">
    <div className="ev-tab">
      <div className="ev-header">
        <h2 className="ev-title">Discover Events</h2>
        {!readOnly && (
          <button className="ev-create-btn" onClick={onCreateEvent ?? onEventsClick}><PlusIcon /> Create events</button>
        )}
      </div>

      {bannerVisible && nextEvent && (
        <div className="ev-banner">
          <span className="ev-banner-text">
            <strong>Upcoming event:</strong> {nextEvent.title} — {nextEvent.fullDate}
          </span>
          <button className="ev-banner-view" onClick={() => onEventClick?.(nextEvent.id)}>View event</button>
          <button className="ev-banner-close" onClick={() => setBannerVisible(false)}>✕</button>
        </div>
      )}

      <div className="ev-list">
        {eventsLoading && <p style={{ color: '#5c6a8c', fontSize: 13, padding: '12px 0' }}>Loading events…</p>}
        {!eventsLoading && events.length === 0 && (
          <p style={{ color: '#5c6a8c', fontSize: 13, padding: '12px 0' }}>No upcoming events.</p>
        )}
        {events.map(ev => (
          <div key={ev.id} className="ev-card">
            <img src={ev.img} alt={ev.title} className="ev-card-img" onClick={() => onEventClick?.(ev.id)} style={{ cursor: 'pointer' }} />
            <div className="ev-card-body">
              <p className="ev-card-title" style={{ cursor: 'pointer' }} onClick={() => onEventClick?.(ev.id)}>{ev.title}</p>
              <div className="ev-card-meta">
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {ev.fullDate}
                </span>
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {ev.location || 'N/A'}
                </span>
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {ev.attending} going
                </span>
              </div>
            </div>
            <div className="ev-card-more-wrap">
              <button className="ev-card-more-btn" onClick={() => setOpenMenuId(openMenuId === ev.id ? null : ev.id)}>
                <MoreIcon />
              </button>
              {openMenuId === ev.id && (
                <div className="ev-card-dropdown">
                  <button className="ev-dd-item" onClick={() => { setOpenMenuId(null); onEventClick?.(ev.id); }}>View event</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    <UpcomingEventsPanel events={events.slice(0, 3)} onEventClick={onEventClick} />
    </div>
  );
}

const BIO_LIMIT = 180;

function toInputDate(displayDate) {
  if (!displayDate) return '';
  try {
    const d = new Date(displayDate);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch { return ''; }
}

function fromInputDate(isoDate) {
  if (!isoDate) return '';
  try {
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return ''; }
}

function profileToPersonal(p) {
  if (!p) return {};
  const fmtDate = iso => {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return ''; }
  };
  return {
    name:     p.fullName             ?? '',
    dob:      fmtDate(p.dateOfBirth),
    gender:   p.gender               ?? '',
    status:   p.relationshipStatus   ?? '',
    location: p.location             ?? '',
    email:    p.email                ?? '',
    phone:    p.phone                ?? '',
    website:  p.website              ?? '',
  };
}

function profileToEdu(p) {
  return (p?.education ?? []).map(e => ({ id: e._id ?? e.id, school: e.school ?? '', degree: e.degree ?? '', years: e.years ?? '', type: e.type ?? '' }));
}

export function AboutTab({ readOnly, autoEditPersonal, onAutoEditConsumed }) {
  const dispatch = useDispatch();
  const { profile } = useSelector(s => s.profile);
  const infoTabsRef = useRef(null);

  const [bio,         setBio]         = useState(() => profile?.bio ?? '');
  const [editingBio,  setEditingBio]  = useState(false);
  const [draftBio,    setDraftBio]    = useState(() => profile?.bio ?? '');
  const [bioExpanded, setBioExpanded] = useState(false);
  const [infoTab,     setInfoTab]     = useState('personal');
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalValues,  setPersonalValues]  = useState(() => profileToPersonal(profile));
  const [personalDraft,   setPersonalDraft]   = useState(() => profileToPersonal(profile));
  const [editingEdu, setEditingEdu] = useState(false);
  const [eduItems,   setEduItems]   = useState(() => profileToEdu(profile));
  const [eduDraft,   setEduDraft]   = useState(() => profileToEdu(profile));

  useEffect(() => {
    if (!profile) return;
    setBio(profile.bio ?? '');
    setDraftBio(profile.bio ?? '');
    const vals = profileToPersonal(profile);
    setPersonalValues(vals);
    setPersonalDraft(vals);
    const edu = profileToEdu(profile);
    setEduItems(edu);
    setEduDraft(edu);
  }, [profile]);

  // Land straight in edit mode on Personal Information — used right after
  // signup + plan selection so the user can fill in their details immediately.
  // Scrolls the section into view too, since a first-time user won't know
  // to scroll past the (empty) Overview card to find it.
  useEffect(() => {
    if (!autoEditPersonal || readOnly) return;
    setInfoTab('personal');
    setPersonalDraft({ ...personalValues });
    setEditingPersonal(true);
    onAutoEditConsumed?.();
    requestAnimationFrame(() => {
      infoTabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [autoEditPersonal]);

  function handleEdit() {
    setDraftBio(bio ?? '');
    setEditingBio(true);
  }
  function handleSave() {
    const trimmed = draftBio.trim();
    setBio(trimmed || null);
    setEditingBio(false);
    dispatch(updateProfile({ bio: trimmed }));
  }
  function handlePersonalSave() {
    setPersonalValues({ ...personalDraft });
    setEditingPersonal(false);
    dispatch(updateProfile({
      fullName:             personalDraft.name,
      dateOfBirth:          toInputDate(personalDraft.dob),
      gender:               personalDraft.gender,
      relationshipStatus:   personalDraft.status,
      location:             personalDraft.location,
      email:                personalDraft.email,
      phone:                personalDraft.phone,
      website:              personalDraft.website,
    }));
  }
  function handleEduSave() {
    setEduItems([...eduDraft]);
    setEditingEdu(false);
    dispatch(updateEducation(eduDraft));
  }

  return (
    <div className="about-tab">
      <h2 className="about-section-title">Profile Info</h2>

      {/* Overview card */}
      <div className="about-card about-card--hoverable">
        <div className="about-card-header">
          <span className="about-card-label">Overview</span>
          {!editingBio && !readOnly && (
            <button className="about-edit-pencil" onClick={handleEdit} title="Edit overview">
              <EditIcon />
            </button>
          )}
        </div>

        {editingBio ? (
          <div className="about-bio-edit">
            <textarea
              className="about-bio-textarea"
              value={draftBio}
              onChange={e => { const v = e.target.value; setDraftBio(v ? v.charAt(0).toUpperCase() + v.slice(1) : v); }}
              rows={5}
              autoFocus
            />
            <div className="about-bio-edit-actions">
              <button className="about-bio-cancel" onClick={() => setEditingBio(false)}>Cancel</button>
              <button className="about-bio-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        ) : bio ? (
          <p className="about-bio-text">
            {bioExpanded || bio.length <= BIO_LIMIT ? bio : bio.slice(0, BIO_LIMIT) + '…'}
            {bio.length > BIO_LIMIT && (
              <button className="about-bio-toggle" onClick={() => setBioExpanded(v => !v)}>
                {bioExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </p>
        ) : (
          <p className="about-bio-empty">No overview added yet.</p>
        )}
      </div>

      {/* Info tabs */}
      <div className="about-info-tabs" ref={infoTabsRef}>
        <div className="about-info-tab-bar">
          <button
            className={`about-info-tab-btn${infoTab === 'personal' ? ' about-info-tab-btn--active' : ''}`}
            onClick={() => setInfoTab('personal')}
          >Personal Information</button>
          <button
            className={`about-info-tab-btn${infoTab === 'education' ? ' about-info-tab-btn--active' : ''}`}
            onClick={() => setInfoTab('education')}
          >Education</button>
          {!readOnly && (
            <button
              className="about-info-tab-edit"
              title={`Edit ${infoTab === 'personal' ? 'Personal Information' : 'Education'}`}
              onClick={() => {
                if (infoTab === 'personal') {
                  setPersonalDraft({ ...personalValues });
                  setEditingPersonal(true);
                } else {
                  setEduDraft(eduItems.map(i => ({ ...i })));
                  setEditingEdu(true);
                }
              }}
            ><EditIcon /></button>
          )}
        </div>

        {infoTab === 'personal' && (
          <div className="about-info-section">
            {PERSONAL_INFO.map(item => (
              <div key={item.id} className="about-info-row">
                <span className="about-info-row-icon">{item.icon}</span>
                <div className="about-info-row-body">
                  <span className="about-info-row-label">{item.label}</span>
                  {item.id === 'email' ? (
                    <span className="about-info-row-value">{personalValues.email}</span>
                  ) : editingPersonal ? (
                    item.id === 'dob' ? (
                      <div style={{ width: 260 }}>
                        <CustomDatePicker
                          value={toInputDate(personalDraft.dob)}
                          onChange={e => setPersonalDraft(d => ({ ...d, dob: fromInputDate(e.target.value) }))}
                          placeholder="Select date of birth"
                          max={MAX_DOB}
                        />
                      </div>
                    ) : item.id === 'gender' ? (
                      <div className="about-select-wrap" style={{ width: 260 }}>
                        <select
                          className="about-select"
                          value={personalDraft.gender ?? ''}
                          onChange={e => setPersonalDraft(d => ({ ...d, gender: e.target.value }))}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    ) : (
                      <input
                        className="about-info-row-input"
                        value={personalDraft[item.id] ?? ''}
                        onChange={e => setPersonalDraft(d => ({ ...d, [item.id]: e.target.value }))}
                      />
                    )
                  ) : (
                    <span className="about-info-row-value">{personalValues[item.id]}</span>
                  )}
                </div>
              </div>
            ))}
            {editingPersonal && (
              <div className="about-info-edit-actions">
                <button className="about-bio-cancel" onClick={() => setEditingPersonal(false)}>Cancel</button>
                <button className="about-bio-save" onClick={handlePersonalSave}>Save</button>
              </div>
            )}
          </div>
        )}

        {infoTab === 'education' && (
          <div className="about-info-section">
            {editingEdu ? (
              <div className="about-edu-edit-list">
                {eduDraft.map((item, idx) => (
                  <div key={item.id ?? idx} className="about-edu-edit-card">
                    <div className="about-edu-edit-card-header">
                      <span className="about-edu-edit-card-num">Education {idx + 1}</span>
                      <button
                        className="about-edu-remove-btn"
                        onClick={() => setEduDraft(d => d.filter((_, i) => i !== idx))}
                        title="Remove"
                        type="button"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                    <div className="about-edu-edit-grid">
                      <div className="about-edu-edit-field">
                        <label className="about-edu-edit-label">School / University</label>
                        <input
                          className="about-edu-edit-input"
                          value={item.school}
                          placeholder="e.g. Massachusetts Institute of Technology"
                          onChange={e => setEduDraft(d => d.map((x, i) => i === idx ? { ...x, school: e.target.value } : x))}
                        />
                      </div>
                      <div className="about-edu-edit-field">
                        <label className="about-edu-edit-label">Type</label>
                        <div className="about-select-wrap">
                          <select
                            className="about-select"
                            value={item.type ?? 'University'}
                            onChange={e => setEduDraft(d => d.map((x, i) => i === idx ? { ...x, type: e.target.value } : x))}
                          >
                            <option value="University">University</option>
                            <option value="High School">High School</option>
                            <option value="Certificate">Certificate</option>
                            <option value="Online Course">Online Course</option>
                            <option value="Bootcamp">Bootcamp</option>
                          </select>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                      </div>
                      <div className="about-edu-edit-field">
                        <label className="about-edu-edit-label">Degree / Certificate</label>
                        <input
                          className="about-edu-edit-input"
                          value={item.degree}
                          placeholder="e.g. B.Sc Computer Science"
                          onChange={e => setEduDraft(d => d.map((x, i) => i === idx ? { ...x, degree: e.target.value } : x))}
                        />
                      </div>
                      <div className="about-edu-edit-field">
                        <label className="about-edu-edit-label">Years</label>
                        <input
                          className="about-edu-edit-input"
                          value={item.years}
                          placeholder="e.g. 2018 – 2022"
                          onChange={e => setEduDraft(d => d.map((x, i) => i === idx ? { ...x, years: e.target.value } : x))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              eduItems.map((item, idx) => (
                <div key={item.id ?? idx} className="about-edu-item">
                  <div className="about-edu-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <div className="about-edu-body">
                    <p className="about-edu-school">{item.school}</p>
                    <p className="about-edu-degree">{item.degree}</p>
                    <p className="about-edu-years">{item.years}</p>
                    <span className="about-edu-badge">{item.type}</span>
                  </div>
                </div>
              ))
            )}
            {editingEdu && (
              <>
                <button
                  onClick={() => setEduDraft(d => [...d, { id: `new_${Date.now()}`, school: '', degree: '', years: '', type: 'University' }])}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px dashed #3b82f6', borderRadius: 8, color: '#3b82f6', fontSize: '13px', fontWeight: 600, padding: '8px 14px', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: 8 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Education
                </button>
                <div className="about-info-edit-actions">
                  <button className="about-bio-cancel" onClick={() => setEditingEdu(false)}>Cancel</button>
                  <button className="about-bio-save" onClick={handleEduSave}>Save</button>
                </div>
              </>
            )}
            {!editingEdu && (
              <button
                onClick={() => { setEduDraft([...eduItems, { id: `new_${Date.now()}`, school: '', degree: '', years: '', type: 'University' }]); setEditingEdu(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px dashed #3b82f6', borderRadius: 8, color: '#3b82f6', fontSize: '13px', fontWeight: 600, padding: '8px 14px', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: 8 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Education
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage({
  onBack, onCoursesClick, onLibraryClick, onEventsClick, onEventsCreateClick,
  onGroupsClick, onMessagesClick, onCalendarClick, onMinisitesClick,
  initialTab, onInitTabConsumed, onUserClick, onEventClick, onMessageUser,
  autoEditPersonal, onAutoEditConsumed,
  initFollowPanel, onInitFollowPanelConsumed,
}) {
  const dispatch = useDispatch();
  const { user: authUser }  = useSelector(s => s.auth);
  const { profile, gallery, galleryTotal, followers, following, connectionsTotal, followersLoading, followingLoading } = useSelector(s => s.profile);
  const { followingIds: reduxFollowingIds } = useSelector(s => s.users);
  const { myPosts, myPostsTotal, myPostsLoading } = useSelector(s => s.posts);

  const rawProfileAvatar = profile?.avatar ?? '';
  const avatarUrl        = rawProfileAvatar?.startsWith?.('http') ? rawProfileAvatar : '';

  const followersCount = profile?.followersCount ?? profile?.followers?.length ?? 0;
  const followingCount = profile?.followingCount ?? profile?.following?.length ?? 0;
  const totalPosts     = authUser?.postsCount ?? profile?.postsCount ?? myPostsTotal;
  const displayName    = profile?.fullName || authUser?.fullName || 'You';
  const role           = profile?.role || '';
  // Degree from the first education entry that has one (shown next to location)
  const degree         = (profile?.education ?? []).find(e => e.degree)?.degree || '';

  const [activeTab,       setActiveTab]       = useState(initialTab || 'Feed');
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchMyPosts({ page: 1, limit: 10 }));
    dispatch(fetchConnections());
  }, [dispatch]);
  useEffect(() => {
    if (initialTab) { setActiveTab(initialTab); onInitTabConsumed?.(); }
  }, [initialTab]);
  const [followPanel,     setFollowPanel]     = useState(null); // 'followers' | 'following' | null
  const [followSearch,    setFollowSearch]    = useState('');
  const [followingIds,    setFollowingIds]    = useState(new Set());
  useEffect(() => {
    if (!initFollowPanel) return;
    setFollowSearch('');
    setFollowPanel(initFollowPanel);
    dispatch(initFollowPanel === 'followers' ? fetchFollowers() : fetchFollowing());
    onInitFollowPanelConsumed?.();
  }, [initFollowPanel]); // eslint-disable-line react-hooks/exhaustive-deps
  const [createPostOpen,  setCreatePostOpen]  = useState(false);
  const [createTab,       setCreateTab]       = useState('photo');
  const [creatorClicked,  setCreatorClicked]  = useState(false);
  const [coverUrl,        setCoverUrl]        = useState(null);
  const [localAvatar,     setAvatarUrl]       = useState(null);
  // Crop flow for avatar/cover: { file, kind: 'avatar'|'cover' } | null
  const [cropTarget,      setCropTarget]      = useState(null);

  function applyCroppedImage(croppedFile) {
    if (!cropTarget) return;
    if (cropTarget.kind === 'cover') {
      setCoverUrl(URL.createObjectURL(croppedFile));
      dispatch(updateCover(croppedFile));
    } else {
      setAvatarUrl(URL.createObjectURL(croppedFile));
      dispatch(updateAvatar(croppedFile));
    }
    setCropTarget(null);
  }

  // Sync cover from profile
  useEffect(() => {
    if (profile?.coverPhoto?.startsWith?.('http')) setCoverUrl(profile.coverPhoto);
  }, [profile?.coverPhoto]);

  // Seed followingIds from API data + Redux (already-followed users)
  useEffect(() => {
    setFollowingIds(new Set([
      ...reduxFollowingIds,
      ...followers.filter(p => p.following).map(p => p.id),
      ...following.map(p => p.id),
    ]));
  }, [followers, following]);

  // Keep in sync when Redux followingIds changes (follow/unfollow from sidebar)
  useEffect(() => {
    setFollowingIds(prev => {
      const next = new Set(prev);
      reduxFollowingIds.forEach(id => next.add(id));
      return next;
    });
  }, [reduxFollowingIds]);
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const displayAvatar = localAvatar ?? avatarUrl;
  const clickTimer = useRef(null);

  function openCreate(tab = 'photo') { setCreateTab(tab); setCreatePostOpen(true); }
  function handleCreatorClick(tab = 'photo') {
    setCreatorClicked(true);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setCreatorClicked(false), 500);
    openCreate(tab);
  }

  function handleNav(id) {
    if (id === 'create')   { setCreatePostOpen(true); return; }
    if (id === 'home')     onBack?.();
    if (id === 'courses')  onCoursesClick?.();
    if (id === 'library')  onLibraryClick?.();
    if (id === 'events')   onEventsClick?.();
    if (id === 'friends')  onGroupsClick?.();
    if (id === 'messages') onMessagesClick?.();
    if (id === 'calendar')  onCalendarClick?.();
    if (id === 'minisites') onMinisitesClick?.();
  }
function BackArrowIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
  return (
    <>
    <div className="prof-page">
      <AnimatedNav activeId="home" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="prof-main">
        <div className="prof-cover" style={{ position: 'relative', overflow: 'hidden' }}>
          {coverUrl
            ? <SkeletonImg src={coverUrl} alt="cover" className="prof-cover-img" />
            : (
              <button
                className="prof-cover-placeholder"
                onClick={() => coverInputRef.current?.click()}
                title="Add a cover photo"
              >
                <ImagePlaceholderIcon />
                <span>Add a cover photo</span>
              </button>
            )
          }

          <button className="prof-cover-back-btn" onClick={onBack} title="Back to Feed">
            <BackArrowIcon />
          </button>

          <button className="prof-cover-edit-btn" onClick={() => coverInputRef.current?.click()} title="Change cover photo">
            <EditIcon />
            <span>Edit Cover</span>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) setCropTarget({ file, kind: 'cover' });
              e.target.value = '';
            }}
          />
        </div>
        <div className="prof-identity">
          <div className="prof-avatar-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
            <SkeletonImg
              src={displayAvatar}
              alt={displayName}
              className="prof-avatar-img"
              fallback={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{displayName[0]?.toUpperCase()}</span>}
            />
            <button className="prof-avatar-edit-btn" onClick={() => avatarInputRef.current?.click()} title="Change profile photo">
              <EditIcon />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setCropTarget({ file, kind: 'avatar' });
                e.target.value = '';
              }}
            />
          </div>
          <div className="prof-info">
            <div className="prof-name-row">
              <h1 className="prof-name">{displayName}</h1>
            </div>
            <div className="prof-meta-row">
              {role && (
                <>
                  <span className="prof-meta-item"><BriefcaseIcon /> {role}</span>
                  <span className="prof-meta-sep">·</span>
                </>
              )}
              {profile?.location && (
                <>
                  <span className="prof-meta-item"><PinIcon /> {profile.location}</span>
                  <span className="prof-meta-sep">·</span>
                </>
              )}
              {degree && (
                <>
                  <span className="prof-meta-item"><GradCapIcon /> {degree}</span>
                  <span className="prof-meta-sep">·</span>
                </>
              )}
              {profile?.dateOfBirth && (
                <>
                  <span className="prof-meta-item"><CalIcon /> DOB: {new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </>
              )}
            </div>
            <div className="prof-counts-row">
              <button className="prof-count-item" onClick={() => { setFollowSearch(''); setFollowPanel('followers'); dispatch(fetchFollowers()); }}>
                <span className="prof-count-num">{followersCount.toLocaleString()}</span>
                <span className="prof-count-lbl">Followers</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item" onClick={() => { setFollowSearch(''); setFollowPanel('following'); dispatch(fetchFollowing()); }}>
                <span className="prof-count-num">{followingCount.toLocaleString()}</span>
                <span className="prof-count-lbl">Following</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item" onClick={() => setActiveTab('Feed')}>
                <span className="prof-count-num">{totalPosts}</span>
                <span className="prof-count-lbl">Posts</span>
              </button>
            </div>
          </div>
        </div>

        <div className="prof-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`prof-tab${activeTab === tab ? ' prof-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'Connections' && connectionsTotal > 0 && <span className="prof-tab-badge">{connectionsTotal}</span>}
            </button>
          ))}
        </div>

        <div className={`prof-content${(activeTab === 'Connections' || activeTab === 'Events' || activeTab === 'Photos') ? ' prof-content--wide' : ''}`}>
          {activeTab === 'Feed' && (
            <div className="prof-feed">
              <div className={`post-creator${creatorClicked ? ' post-creator--clicked' : ''}`}>
                <div className="creator-top">
                  <div className="creator-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <SkeletonImg
                      src={avatarUrl}
                      alt={displayName}
                      fallback={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 700, color: '#fff' }}>{displayName[0]?.toUpperCase()}</span>}
                    />
                  </div>
                  <textarea
                    className="creator-input"
                    placeholder={`What's on your mind, ${displayName.split(' ')[0]}?`}
                    readOnly
                    onClick={() => handleCreatorClick('photo')}
                    rows={3}
                  />
                </div>
                <div className="creator-actions">
                  <button className="creator-media-btn" onClick={() => handleCreatorClick('photo')}><PhotosIcon /> Photos</button>
                  <button className="creator-media-btn" onClick={() => handleCreatorClick('video')}><VideoIcon /> Video</button>
                  <button className="creator-media-btn" onClick={() => handleCreatorClick('event')}><EventIcon /> Event</button>
                  <button className="creator-post-btn"  onClick={() => handleCreatorClick('photo')}>Post</button>
                </div>
              </div>
              {myPostsLoading && myPosts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#5c6a8c', fontSize: 14 }}>Loading posts…</div>
              )}
              {!myPostsLoading && myPosts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#5c6a8c', fontSize: 14 }}>No posts yet.</div>
              )}
              {myPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'About'       && <AboutTab autoEditPersonal={autoEditPersonal} onAutoEditConsumed={onAutoEditConsumed} />}
          {activeTab === 'Connections' && <ConnectionsTab onUserClick={onUserClick} onMessageUser={onMessageUser} />}
          {activeTab === 'Photos'      && <MediaTab />}
          {activeTab === 'Events'      && <EventsTab onEventsClick={onEventsClick} onCreateEvent={onEventsCreateClick} onEventClick={onEventClick} />}

          {activeTab !== 'Feed' && activeTab !== 'About' && activeTab !== 'Photos' && activeTab !== 'Events' && activeTab !== 'Connections' && (
            <div className="prof-empty-tab">
              <p className="prof-empty-title">{activeTab}</p>
              <p className="prof-empty-sub">Nothing here yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    {createPostOpen && <CreatePostModal initialTab={createTab} onClose={() => setCreatePostOpen(false)} onNavigateToEvents={onEventsClick} />}

    {cropTarget && (
      <ImageCropper
        file={cropTarget.file}
        defaultAspect={cropTarget.kind === 'avatar' ? 'square' : 'landscape'}
        cropShape={cropTarget.kind === 'avatar' ? 'round' : 'rect'}
        onCancel={() => setCropTarget(null)}
        onSkip={() => applyCroppedImage(cropTarget.file)}
        onSave={applyCroppedImage}
      />
    )}

    {followPanel && (() => {
      const list = (followPanel === 'followers' ? followers : following)
        .filter(p => p.name.toLowerCase().includes(followSearch.toLowerCase()) || p.role.toLowerCase().includes(followSearch.toLowerCase()));
      const listLoading = followPanel === 'followers' ? followersLoading : followingLoading;
      return (
        <div className="fp-overlay" onClick={() => setFollowPanel(null)}>
          <div className="fp-panel" onClick={e => e.stopPropagation()}>
            <div className="fp-header">
              <div className="fp-tabs">
                <button className={`fp-tab${followPanel === 'followers' ? ' fp-tab--active' : ''}`} onClick={() => { setFollowSearch(''); setFollowPanel('followers'); dispatch(fetchFollowers()); }}>
                  Followers <span className="fp-tab-count">{(authUser?.followerCount ?? profile?.followersCount ?? 0).toLocaleString()}</span>
                </button>
                <button className={`fp-tab${followPanel === 'following' ? ' fp-tab--active' : ''}`} onClick={() => { setFollowSearch(''); setFollowPanel('following'); dispatch(fetchFollowing()); }}>
                  Following <span className="fp-tab-count">{(authUser?.followingCount ?? profile?.followingCount ?? 0).toLocaleString()}</span>
                </button>
              </div>
              <button className="fp-close" onClick={() => setFollowPanel(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="fp-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fp-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="fp-search" placeholder={`Search ${followPanel}…`} value={followSearch} onChange={e => setFollowSearch(e.target.value)} autoFocus />
            </div>
            <div className="fp-list">
              {listLoading && list.length === 0 && (
                <div className="fp-loading">
                  <span className="fp-spinner" />
                  <p style={{ margin: 0 }}>Loading {followPanel}…</p>
                </div>
              )}
              {!listLoading && list.length === 0 && <p className="fp-empty">No results found</p>}
              {list.map(person => (
                <div className="fp-person" key={person.id}>
                  {person.avatar?.startsWith?.('http')
                    ? <img className="fp-avatar" style={{ cursor: 'pointer' }} src={person.avatar} alt={person.name} onClick={() => onUserClick?.(person.id)} />
                    : (
                      <div
                        className="fp-avatar"
                        style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0, cursor: 'pointer' }}
                        onClick={() => onUserClick?.(person.id)}
                      >
                        {initials(person.name)}
                      </div>
                    )
                  }
                  <div className="fp-info">
                    <span className="fp-name" style={{ cursor: 'pointer' }} onClick={() => onUserClick?.(person.id)}>{person.name}</span>
                    <span className="fp-role">{person.role}</span>
                    {person.mutual > 0 && (
                      <span className="fp-mutual">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {person.mutual} mutual connections
                      </span>
                    )}
                  </div>
                  <button
                    className={`fp-follow-btn${followingIds.has(person.id) ? ' fp-follow-btn--following' : ''}`}
                    onClick={() => {
                      const isFollowing = followingIds.has(person.id);
                      // Optimistic UI update
                      setFollowingIds(prev => {
                        const s = new Set(prev);
                        isFollowing ? s.delete(person.id) : s.add(person.id);
                        return s;
                      });
                      // Real API call
                      if (isFollowing) {
                        dispatch(unfollowUser(person.id));
                      } else {
                        dispatch(followUser(person.id));
                      }
                    }}
                  >
                    {followingIds.has(person.id) ? 'Following' : '+ Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    })()}
    </>
  );
}
