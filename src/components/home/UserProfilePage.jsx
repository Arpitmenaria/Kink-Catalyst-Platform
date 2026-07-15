import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimatedNav from "./AnimatedNav";
import PostCard from "./PostCard";
import SkeletonImg from "../SkeletonImg";
import ReportModal from "./ReportModal";
import { EventsTab } from "./ProfilePage";
import { followUser, unfollowUser, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from "../../store/slices/usersSlice";
import { normalizePost, setViewedPosts as setViewedPostsAction } from "../../store/slices/postsSlice";
import { showToast } from "../../store/slices/toastSlice";
import { apiRequest } from "../../services/api";

const TABS = ["Feed", "About", "Connections", "Photos", "Events"];

function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function MsgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function PersonAddIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ⚠️ TEMPORARY MOCK — used as a fallback when the real API call fails (e.g.
// because post.author has no _id yet, or the /users/:id endpoints don't
// exist on the backend yet). Lets you confirm the click → navigate → render
// chain works end-to-end before the backend is wired up. Delete this once
// the real fetch succeeds reliably.
const MOCK_USER = {
  _id: "mock-arpit",
  fullName: "Arpit",
  role: "Frontend Developer",
  location: "Ahmedabad, India",
  joinedAt: "2022-03-14",
  avatar: "",
  bio: "This is placeholder bio text for Arpit — replace once the real /users/:id endpoint is wired up.",
  followersCount: 128,
  followingCount: 96,
  postsCount: 12,
  isFollowing: false,
};

const MOCK_POSTS = [
  {
    _id: "mock-post-1",
    author: { _id: "mock-arpit", fullName: "Arpit", avatar: "" },
    caption: "Just shipped a new feature 🚀",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likes: ["user1", "user2", "user3"],
    comments: [
      {
        _id: "mock-comment-1",
        author: { _id: "mock-user-1", fullName: "Sara Khan", avatar: "" },
        text: "This looks awesome! Great work 🔥",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        likes: 2,
        replies: [
          {
            _id: "mock-reply-1",
            author: { _id: "mock-user-4", fullName: "Arpit", avatar: "" },
            text: "Thanks Sara! 🙏",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
            likes: 1,
          },
        ],
      },
      {
        _id: "mock-comment-2",
        author: { _id: "mock-user-2", fullName: "Dev Patel", avatar: "" },
        text: "Nice, when's it going live?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        likes: 0,
        replies: [],
      },
    ],
    shares: [],
  },
  {
    _id: "mock-post-2",
    author: { _id: "mock-arpit", fullName: "Arpit", avatar: "" },
    caption: "Coffee + code = perfect Sunday ☕️",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800&q=80",
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    likes: ["user4", "user5"],
    comments: [
      {
        _id: "mock-comment-3",
        author: { _id: "mock-user-3", fullName: "Priya Shah", avatar: "" },
        text: "Same energy here 😄",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        likes: 1,
        replies: [],
      },
    ],
    shares: ["user6"],
  },
  {
    _id: "mock-post-3",
    author: { _id: "mock-arpit", fullName: "Arpit", avatar: "" },
    caption: "Weekend hike with the team 🏔️",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    likes: ["user1", "user6", "user7", "user8"],
    comments: [],
    shares: [],
  },
];

const MOCK_PHOTOS = [
  { id: "mock-photo-1", images: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80"] },
  { id: "mock-photo-2", images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"] },
  { id: "mock-photo-3", images: ["https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80"] },
  { id: "mock-photo-4", images: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"] },
  { id: "mock-photo-5", images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80"] },
  { id: "mock-photo-6", images: ["https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80"] },
];

export default function UserProfilePage({
  userId, onBack, onMessageUser, onEventsClick, onEventsCreateClick,
  onGroupsClick, onCoursesClick, onLibraryClick, onMinisitesClick, onUserClick, onEventClick,
}) {
  const dispatch = useDispatch();
  const { user: authUser, token } = useSelector((s) => s.auth);
  const { followingIds, friendStatusMap } = useSelector((s) => s.users);
  // Posts live in Redux (not local state) so PostCard's like/comment/reply/share
  // dispatches — which update state.posts.viewedPosts — are reflected here.
  const viewedPosts = useSelector((s) => s.posts.viewedPosts);

  // ⚠️ Local state standing in for Redux until profileSlice.js gets by-id thunks
  const [viewedUser, setViewedUser] = useState(null);
  const [viewedPhotos, setViewedPhotos] = useState([]);
  const [viewedConnections, setViewedConnections] = useState(null); // null = not yet loaded
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Feed");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followHover, setFollowHover] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    dispatch(setViewedPostsAction([]));
    Promise.all([
      apiRequest(`/api/users/${userId}`, { token }),
      apiRequest(`/api/users/${userId}/posts`, { token }),
    ])
      .then(([userRes, postsRes]) => {
        if (cancelled) return;
        setViewedUser(userRes?.user ?? userRes);
        dispatch(setViewedPostsAction((postsRes?.posts ?? postsRes ?? []).map(normalizePost)));
      })
      .catch((err) => {
        // Fallback to static mock data so the UI/navigation can be verified
        // before the real /users/:id endpoints exist.
        console.warn("Falling back to mock profile data:", err.message);
        if (cancelled) return;
        setViewedUser(MOCK_USER);
        dispatch(setViewedPostsAction(MOCK_POSTS));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, token, dispatch]);

  useEffect(() => {
    if (activeTab !== "Photos" || !userId) return;
    apiRequest(`/api/users/${userId}/photos`, { token })
      .then((res) => setViewedPhotos(res?.photos ?? res ?? []))
      .catch((err) => {
        console.warn("Falling back to mock photos:", err.message);
        setViewedPhotos(MOCK_PHOTOS);
      });
  }, [activeTab, userId, token]);

  useEffect(() => {
    if (activeTab !== "Connections" || !userId || viewedConnections !== null) return;
    setConnectionsLoading(true);
    apiRequest(`/api/users/${userId}/connections`, { token })
      .then((res) => setViewedConnections(res?.connections ?? res ?? []))
      .catch((err) => {
        console.warn("Could not load connections for this user:", err.message);
        setViewedConnections([]);
      })
      .finally(() => setConnectionsLoading(false));
  }, [activeTab, userId, token, viewedConnections]);

  useEffect(() => {
    setIsFollowing(
      followingIds.includes(userId) || !!viewedUser?.isFollowing,
    );
  }, [followingIds, userId, viewedUser]);

  // Viewing your own profile from somewhere else in the app — bounce to the
  // normal editable ProfilePage rather than rendering the read-only one.
  const isSelf = authUser?._id === userId;

  // Relationship: optimistic override wins, else the flag from the profile fetch.
  const friendStatus = friendStatusMap[userId] ?? viewedUser?.friendStatus ?? 'none';
  const isConnected  = friendStatus === 'connected';

  function handleFollowToggle() {
    setIsFollowing((prev) => !prev);
    dispatch(isFollowing ? unfollowUser(userId) : followUser(userId));
  }

  function handleConnect()  { dispatch(sendFriendRequest(userId)); }
  function handleAccept()   { dispatch(acceptFriendRequest(userId)); }
  function handleReject()   { dispatch(rejectFriendRequest(userId)); }

  function handleChatClick() {
    if (!isConnected) {
      dispatch(showToast({ message: `Connect with ${displayName.split(' ')[0]} to start messaging.`, type: 'error' }));
      return;
    }
    onMessageUser?.(userId);
  }

  function handleNav(id) {
    if (id === "home")      onBack?.();
    if (id === "events")    onEventsClick?.();
    if (id === "friends")   onGroupsClick?.();
    if (id === "messages")  handleChatClick();
    if (id === "courses")   onCoursesClick?.();
    if (id === "library")   onLibraryClick?.();
    if (id === "minisites") onMinisitesClick?.();
  }

  if (loading && !viewedUser) {
    return (
      <div className="prof-page">
        <AnimatedNav activeId="home" avatarUrl={authUser?.avatar} onNavigate={handleNav} />
        <div className="prof-main">
          <div style={{ textAlign: "center", padding: "80px 0", color: "#5c6a8c" }}>
            Loading profile…
          </div>
        </div>
      </div>
    );
  }

  const displayName = viewedUser?.fullName ?? "User";
  const role = viewedUser?.profession ?? viewedUser?.role ?? "";

  const rawAvatar = viewedUser?.avatar ?? "";
  const avatarUrl = rawAvatar?.startsWith?.("http") && rawAvatar.trim() ? rawAvatar : "";
  const coverUrl = viewedUser?.coverPhoto?.startsWith?.("http")
    ? viewedUser.coverPhoto
    : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90&fit=crop";

  const followersCount = viewedUser?.followersCount ?? 0;
  const followingCount = viewedUser?.followingCount ?? 0;
  const postsCount = viewedUser?.postsCount ?? viewedPosts.length;

  return (
    <>
    <div className="prof-page">
      <AnimatedNav activeId="home" avatarUrl={authUser?.avatar} onNavigate={handleNav} />

      <div className="prof-main">
        {/* ── Cover (no edit button — read-only) ── */}
        <div className="prof-cover" style={{ position: "relative", overflow: "hidden" }}>
          <SkeletonImg src={coverUrl} alt="cover" className="prof-cover-img" />
          <button className="prof-cover-back-btn" onClick={onBack} title="Back to Feed">
            <BackArrowIcon />
          </button>
        </div>

        {/* ── Identity ── */}
        <div className="prof-identity">
          <div className="prof-avatar-wrap" style={{ position: "relative", overflow: "hidden", cursor: "default" }}>
            <SkeletonImg
              src={avatarUrl}
              alt={displayName}
              className="prof-avatar-img"
              fallback={
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "2rem", fontWeight: 700, color: "#fff" }}>
                  {initials(displayName)}
                </span>
              }
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
              <span className="prof-meta-item"><PinIcon /> {viewedUser?.location ?? "Unknown"}</span>
              <span className="prof-meta-sep">·</span>
              <span className="prof-meta-item">
                <CalIcon />{" "}
                {viewedUser?.joinedAt
                  ? `Joined on ${new Date(viewedUser.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : ""}
              </span>
            </div>
            <div className="prof-counts-row">
              <button className="prof-count-item">
                <span className="prof-count-num">{followersCount.toLocaleString()}</span>
                <span className="prof-count-lbl">Followers</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item">
                <span className="prof-count-num">{followingCount.toLocaleString()}</span>
                <span className="prof-count-lbl">Following</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item">
                <span className="prof-count-num">{postsCount}</span>
                <span className="prof-count-lbl">Posts</span>
              </button>
            </div>
          </div>

          {/* ── Action buttons (replaces the edit/avatar controls on own profile) ── */}
          {!isSelf && (
            <div className="prof-actions">
              {/* Primary relationship button */}
              {friendStatus === 'incoming' ? (
                <>
                  <button
                    className="prof-edit-btn"
                    style={{ background: "#2563eb", border: "1px solid #2563eb", color: "#fff" }}
                    onClick={handleAccept}
                  >
                    <CheckIcon /> Accept
                  </button>
                  <button
                    className="prof-edit-btn"
                    style={{ background: "#1a2338", border: "1px solid #1e2a42", color: "#cbd5e1" }}
                    onClick={handleReject}
                  >
                    Ignore
                  </button>
                </>
              ) : friendStatus === 'connected' ? (
                <button
                  className="prof-edit-btn"
                  style={{ background: "#2563eb", border: "1px solid #2563eb", color: "#fff" }}
                  onClick={() => onMessageUser?.(userId)}
                >
                  <MsgIcon /> Message
                </button>
              ) : friendStatus === 'requested' ? (
                <button
                  className="prof-edit-btn"
                  style={{ background: "#1a2338", border: "1px solid #1e2a42", color: "#cbd5e1" }}
                  onClick={handleReject}
                  title="Cancel request"
                >
                  <ClockIcon /> Pending
                </button>
              ) : (
                <button
                  className="prof-edit-btn"
                  style={{ background: "#2563eb", border: "1px solid #2563eb", color: "#fff" }}
                  onClick={handleConnect}
                >
                  <PersonAddIcon /> Connect
                </button>
              )}

              {/* Follow toggle — independent of connection */}
              <button
                className="prof-edit-btn"
                style={
                  isFollowing
                    ? {
                        background: followHover ? "rgba(239,68,68,0.15)" : "#1a2338",
                        border: `1px solid ${followHover ? "#ef4444" : "#1e2a42"}`,
                        color: followHover ? "#ef4444" : "#cbd5e1",
                      }
                    : undefined
                }
                onMouseEnter={() => setFollowHover(true)}
                onMouseLeave={() => setFollowHover(false)}
                onClick={handleFollowToggle}
              >
                {isFollowing ? (
                  followHover ? <>Unfollow</> : <><CheckIcon /> Following</>
                ) : (
                  <><PersonAddIcon /> Follow</>
                )}
              </button>

              {/* Chat — only when not connected show a disabled hint; connected uses Message above */}
              {friendStatus !== 'connected' && (
                <button
                  className="prof-edit-btn"
                  style={{ background: "#1a2338", border: "1px solid #1e2a42", color: "#5c6a8c", opacity: 0.6, cursor: "not-allowed" }}
                  onClick={handleChatClick}
                  title={`Connect with ${displayName.split(' ')[0]} to message`}
                >
                  <MsgIcon /> Chat
                </button>
              )}

              <button
                className="prof-edit-btn"
                style={{ background: "#1a2338", border: "1px solid #1e2a42", color: "#ef4444" }}
                onClick={() => setReportOpen(true)}
              >
                <ReportIcon /> Report
              </button>
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="prof-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`prof-tab${activeTab === tab ? " prof-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === "Connections" && viewedConnections?.length > 0 && (
                <span className="prof-tab-badge">{viewedConnections.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div
          className={`prof-content${(activeTab === "Photos" || activeTab === "Events" || activeTab === "Connections") ? " prof-content--wide" : ""}`}
          style={activeTab === "Feed" ? { width: "100%", maxWidth: "100%", boxSizing: "border-box" } : undefined}
        >
          {activeTab === "Feed" && (
            <div className="prof-feed" style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
              {viewedPosts.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px", color: "#5c6a8c", fontSize: 14 }}>
                  No posts yet.
                </div>
              )}
              {viewedPosts.map((post) => (
                <div key={post._id} style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
                  <PostCard post={post} onUserClick={onUserClick} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "Photos" && (
            <div className="prof-conn-layout">
              <div className="media-tab" style={{ flex: 1 }}>
                <div className="media-header">
                  <h2 className="media-title">Photos</h2>
                </div>
                <div className="media-grid">
                  {viewedPhotos.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px", color: "#5c6a8c", fontSize: 14 }}>
                      No photos yet.
                    </div>
                  )}
                  {viewedPhotos.map((photo) => (
                    <div key={photo.id} className="media-photo-card">
                      <div className="media-photo-wrap">
                        <SkeletonImg src={photo.images?.[0]} alt="" className="media-photo-img" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "About" && (
            <div className="about-tab">
              <h2 className="about-section-title">Profile Info</h2>
              <div className="about-card">
                <div className="about-card-header">
                  <span className="about-card-label">Overview</span>
                </div>
                {viewedUser?.bio ? (
                  <p className="about-bio-text">{viewedUser.bio}</p>
                ) : (
                  <p className="about-bio-empty">No overview added yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Connections" && (
            <div className="prof-conn-tab">
              <div className="prof-conn-header">
                <div className="prof-conn-header-left">
                  <h3 className="prof-conn-title">Connections</h3>
                  <span className="prof-conn-count">{viewedConnections?.length ?? 0}</span>
                </div>
              </div>
              {connectionsLoading && (
                <div style={{ textAlign: "center", padding: "32px", color: "#5c6a8c", fontSize: 14 }}>
                  Loading connections…
                </div>
              )}
              {!connectionsLoading && (viewedConnections?.length ?? 0) === 0 && (
                <div style={{ textAlign: "center", padding: "32px", color: "#5c6a8c", fontSize: 14 }}>
                  No connections to show.
                </div>
              )}
              {!connectionsLoading && viewedConnections?.length > 0 && (
                <div className="prof-conn-list">
                  {viewedConnections.map((conn) => {
                    const cid = conn.id ?? conn._id;
                    const name = conn.name ?? conn.fullName ?? "Unknown";
                    const avatar = conn.avatar?.startsWith?.("http") ? conn.avatar : "";
                    return (
                      <div key={cid} className="prof-conn-item">
                        <div
                          className="prof-conn-avatar-wrap"
                          style={{ cursor: onUserClick ? "pointer" : "default" }}
                          onClick={() => onUserClick?.(cid)}
                        >
                          {avatar
                            ? <img src={avatar} alt={name} className="prof-conn-avatar" />
                            : <span className="prof-conn-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#3b82f6", color: "#fff", fontWeight: 700 }}>{initials(name)}</span>
                          }
                        </div>
                        <div className="prof-conn-info">
                          <div className="prof-conn-name-row">
                            <span
                              className="prof-conn-name"
                              style={{ cursor: onUserClick ? "pointer" : "default" }}
                              onClick={() => onUserClick?.(cid)}
                            >
                              {name}
                            </span>
                          </div>
                          {conn.role && <span className="prof-conn-role">{conn.role}</span>}
                          {typeof conn.mutual === "number" && conn.mutual > 0 && (
                            <div className="prof-conn-shared">
                              <span className="prof-conn-shared-text"><UsersIcon /> {conn.mutual} mutual connections</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "Events" && (
            <EventsTab onEventsClick={onEventsClick} onCreateEvent={onEventsCreateClick} onEventClick={onEventClick} readOnly />
          )}
        </div>
      </div>
    </div>

    {reportOpen && <ReportModal userId={userId} onClose={() => setReportOpen(false)} />}
    </>
  );
}
