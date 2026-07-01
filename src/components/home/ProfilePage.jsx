import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNav from './AnimatedNav';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import { MOCK_POSTS, ALEX_AVATAR, FRIEND_SUGGESTIONS, SIDEBAR_EVENTS, GALLERY_IMAGES } from './mockData';
import './ProfilePage.css';

const COVER_URL = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90&fit=crop';
const TABS = ['Feed', 'About', 'Connections', 'Photos', 'Events'];

const DEMO_FOLLOWERS = [
  { id: 1,  name: 'Elena Moretti',    role: 'UX Designer at Figma',          mutual: 12, avatar: 'https://i.pravatar.cc/150?img=47', following: true  },
  { id: 2,  name: 'Sarah Chen',       role: 'Frontend Engineer at Vercel',   mutual: 4,  avatar: 'https://i.pravatar.cc/150?img=44', following: false },
  { id: 3,  name: 'Marcus Tye',       role: 'Product Manager at Notion',     mutual: 2,  avatar: 'https://i.pravatar.cc/150?img=51', following: true  },
  { id: 4,  name: 'Priya Sharma',     role: 'Data Scientist at Google',      mutual: 7,  avatar: 'https://i.pravatar.cc/150?img=48', following: false },
  { id: 5,  name: 'James Okafor',     role: 'DevOps Lead at AWS',            mutual: 3,  avatar: 'https://i.pravatar.cc/150?img=53', following: true  },
  { id: 6,  name: 'Lena Fischer',     role: 'Graphic Designer · Freelance',  mutual: 9,  avatar: 'https://i.pravatar.cc/150?img=49', following: false },
  { id: 7,  name: 'Carlos Rivera',    role: 'Software Architect at Spotify', mutual: 5,  avatar: 'https://i.pravatar.cc/150?img=56', following: true  },
  { id: 8,  name: 'Amara Osei',       role: 'Marketing Lead at HubSpot',     mutual: 1,  avatar: 'https://i.pravatar.cc/150?img=45', following: false },
];

const DEMO_FOLLOWING = [
  { id: 11, name: 'Raj Patel',        role: 'CTO at StartupXYZ',             mutual: 6,  avatar: 'https://i.pravatar.cc/150?img=60', following: true  },
  { id: 12, name: 'Sophie Laurent',   role: 'AI Researcher at OpenAI',       mutual: 8,  avatar: 'https://i.pravatar.cc/150?img=46', following: true  },
  { id: 13, name: 'David Kim',        role: 'iOS Developer at Apple',        mutual: 3,  avatar: 'https://i.pravatar.cc/150?img=57', following: true  },
  { id: 14, name: 'Fatima Al-Zahra',  role: 'Cloud Architect at Microsoft',  mutual: 11, avatar: 'https://i.pravatar.cc/150?img=43', following: true  },
  { id: 15, name: 'Noah Williams',    role: 'Backend Engineer at Stripe',    mutual: 2,  avatar: 'https://i.pravatar.cc/150?img=52', following: true  },
  { id: 16, name: 'Yuki Tanaka',      role: 'Game Developer at Unity',       mutual: 4,  avatar: 'https://i.pravatar.cc/150?img=55', following: true  },
];

const MEDIA_PHOTOS = [
  { id: 'm1', images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&q=80',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80',
    ], likes: '22K', comments: '3K' },
  { id: 'm2', images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80'], likes: '32K', comments: '12K' },
  { id: 'm3', images: ['https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500&q=80'], likes: '21K', comments: '4K' },
  { id: 'm4', images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80',
    ], likes: '32K', comments: '16K' },
  { id: 'm5', images: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&q=80'], likes: '20K', comments: '8K' },
  { id: 'm6', images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=80'], likes: '56K', comments: '12K' },
  // { id: 'm7', images: [
  //     'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=500&q=80',
  //     'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80',
  //     'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&q=80',
  //   ], likes: '18K', comments: '5K' },
  { id: 'm8', images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80'], likes: '41K', comments: '9K' },
  { id: 'm9', images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80'], likes: '29K', comments: '7K' },
];

const PERSONAL_INFO = [
  { id: 'name',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,     label: 'Full Name',           value: 'Alex Rivera' },
  { id: 'dob',     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: 'Date of Birth',       value: 'October 20, 1990' },
  { id: 'gender',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><line x1="12" y1="14" x2="12" y2="21"/><line x1="9" y1="19" x2="15" y2="19"/></svg>, label: 'Gender',               value: 'Male' },
  { id: 'status',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label: 'Relationship Status',  value: 'Single' },
  { id: 'location',icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Location',             value: 'New Hampshire, USA' },
  { id: 'email',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email',               value: 'alex.rivera@example.com' },
  { id: 'phone',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'Phone',               value: '+1 (555) 234-5678' },
  { id: 'website', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: 'Website',             value: 'alexrivera.dev' },
];

const EDUCATION_ITEMS = [
  { id: 'edu1', school: 'University of California, Berkeley', degree: 'B.Sc. Computer Science', years: '2008 – 2012', type: 'University' },
  { id: 'edu2', school: 'Stanford Online',                    degree: 'Machine Learning Certificate', years: '2020',       type: 'Certificate' },
  { id: 'edu3', school: 'Lincoln High School',                degree: 'Science & Mathematics',        years: '2004 – 2008', type: 'High School' },
];

const MOCK_CONNECTIONS = [
  {
    id: 'cn1', name: 'Frances Guerrero', role: 'Full Stack Web Developer',
    location: 'New York', industry: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&fit=crop&crop=face',
    online: true, lastActive: null, mutual: 22,
    sharedAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=30&q=80&fit=crop&crop=face',
    ], extra: '+1',
  },
  {
    id: 'cn2', name: 'Lori Ferguson', role: 'Web Developer | Freelancer',
    location: 'San Francisco', industry: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80&fit=crop&crop=face',
    online: false, lastActive: '2h ago', mutual: 12,
    sharedAvatars: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=30&q=80&fit=crop&crop=face',
    ], extra: '+7',
  },
  {
    id: 'cn3', name: 'Samuel Bishop', role: 'Full Stack Web Developer',
    location: 'London', industry: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&fit=crop&crop=face',
    online: true, lastActive: null, mutual: 5,
    sharedAvatars: [
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=30&q=80&fit=crop&crop=face',
    ], extra: null,
  },
  {
    id: 'cn4', name: 'Dennis Barrett', role: 'Senior Product Designer',
    location: 'Berlin', industry: 'Design',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&fit=crop&crop=face',
    online: false, lastActive: '1d ago', mutual: 117,
    sharedAvatars: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&q=80&fit=crop&crop=face',
    ], extra: null,
  },
  {
    id: 'cn5', name: 'Maria Chen', role: 'UX Designer at Google',
    location: 'San Francisco', industry: 'Design',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80&fit=crop&crop=face',
    online: true, lastActive: null, mutual: 34,
    sharedAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=30&q=80&fit=crop&crop=face',
    ], extra: '+8',
  },
  {
    id: 'cn6', name: 'James Park', role: 'DevOps Engineer | AWS',
    location: 'New York', industry: 'DevOps',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80&fit=crop&crop=face',
    online: false, lastActive: '45m ago', mutual: 9,
    sharedAvatars: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&q=80&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=30&q=80&fit=crop&crop=face',
    ], extra: null,
  },
];

const CONN_LOCATIONS  = ['New York', 'San Francisco', 'London', 'Berlin'];
const CONN_INDUSTRIES = ['Engineering', 'Design', 'DevOps'];

const INTERESTS = [
  { id: 'oracle', bg: '#0070c0', logo: 'O', name: 'Oracle', followers: '7,546,224 followers' },
  { id: 'apple',  bg: '#1c1c1e', logo: '🍎', name: 'Apple',  followers: '102B followers' },
  { id: 'elon',   bg: '#334155', logo: '👤', name: 'Elon Musk', followers: 'CEO and Product Architect of Tesla, Inc 41B followers', small: true },
  { id: 'xfactor',bg: '#7c3aed', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&q=80', name: 'The X Factor', followers: '9,654 followers' },
  { id: 'getbs',  bg: '#6f42c1', logo: 'B', name: 'Getbootstrap', followers: '8,457,224 followers' },
];

function BriefcaseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function PinIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function CalIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function EditIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function BackArrowIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function MoreIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }
function PhotosIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function VideoIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>; }
function EventIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function PlusCircle()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function LockIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }

const DEFAULT_BIO = "He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy. Handsome met debating sir dwelling age material. As style lived he worse dried. Offered related so visitors we private removed. Moderate do subjects to distance.";

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

function MutualIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 3 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}

function FriendSuggestionsPanel() {
  const [addedIds,     setAddedIds]     = useState(new Set());
  const [poppingIds,   setPoppingIds]   = useState(new Set());
  const [removingIds,  setRemovingIds]  = useState(new Set());
  const [dismissedIds, setDismissedIds] = useState(new Set());

  function handleAdd(id) {
    if (addedIds.has(id)) return;
    setAddedIds(p => new Set([...p, id]));
    setPoppingIds(p => new Set([...p, id]));
    setTimeout(() => setPoppingIds(p => { const s = new Set(p); s.delete(id); return s; }), 500);
  }

  function handleRemove(id) {
    setRemovingIds(p => new Set([...p, id]));
    setTimeout(() => {
      setDismissedIds(p => new Set([...p, id]));
      setRemovingIds(p => { const s = new Set(p); s.delete(id); return s; });
    }, 380);
  }

  return (
    <div className="prof-conn-suggestions">
      <div className="prof-sugg-header">
        <span className="prof-sugg-title">Friend Suggestions</span>
        <button className="prof-sugg-see-all">View all</button>
      </div>
      {FRIEND_SUGGESTIONS.filter(f => !dismissedIds.has(f.id)).map(f => (
        <div key={f.id} className={`prof-sugg-item${removingIds.has(f.id) ? ' prof-sugg-item--removing' : ''}`}>
          <div className="prof-sugg-item-top">
            <div className="prof-sugg-avatar" style={{ background: f.color, overflow: 'hidden' }}>
              {f.avatar
                ? <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : f.name.split(' ').map(w => w[0]).join('').toUpperCase()
              }
            </div>
            <div className="prof-sugg-info">
              <p className="prof-sugg-name">{f.name}</p>
              <p className="prof-sugg-sub"><MutualIcon />{f.sub}</p>
            </div>
          </div>
          <div className="prof-sugg-actions">
            <button
              className={`prof-sugg-add-btn${addedIds.has(f.id) ? ' prof-sugg-add-btn--added' : ''}${poppingIds.has(f.id) ? ' prof-sugg-add-btn--pop' : ''}`}
              onClick={() => handleAdd(f.id)}
            >
              {addedIds.has(f.id) ? '✓ Added' : 'Add Friend'}
            </button>
            <button className="prof-sugg-remove-btn" onClick={() => handleRemove(f.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConnectionsTab() {
  const [removed,   setRemoved]   = useState(new Set());
  const [viewMode,  setViewMode]  = useState('list');
  const [search,    setSearch]    = useState('');
  const [filterLoc, setFilterLoc] = useState('');
  const [filterInd, setFilterInd] = useState('');
  const [openDrop,  setOpenDrop]  = useState(null); // 'loc' | 'ind' | null
  const filterBarRef = useRef(null);

  useEffect(() => {
    if (!openDrop) return;
    function onOut(e) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) setOpenDrop(null);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, [openDrop]);

  const hasFilter = filterLoc || filterInd;

  const visible = MOCK_CONNECTIONS.filter(c =>
    !removed.has(c.id) &&
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filterLoc || c.location === filterLoc) &&
    (!filterInd || c.industry === filterInd)
  );

  return (
    <div className="prof-conn-layout">
    <div className="prof-conn-tab">
      <div className="prof-conn-header">
        <div className="prof-conn-header-left">
          <h3 className="prof-conn-title">Connections</h3>
          <span className="prof-conn-count">{MOCK_CONNECTIONS.length * 75}</span>
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

      {/* ── List view ── */}
      {viewMode === 'list' && (
        <div className="prof-conn-list">
          {visible.map(conn => (
            <div key={conn.id} className="prof-conn-item">
              <div className="prof-conn-avatar-wrap">
                <img src={conn.avatar} alt={conn.name} className="prof-conn-avatar" />
                <span className={`prof-conn-status-dot${conn.online ? ' prof-conn-status-dot--online' : ''}`} />
              </div>
              <div className="prof-conn-info">
                <div className="prof-conn-name-row">
                  <span className="prof-conn-name">{conn.name}</span>
                  {conn.online
                    ? <span className="prof-conn-online-badge">Online</span>
                    : <span className="prof-conn-last-active">{conn.lastActive}</span>
                  }
                </div>
                <span className="prof-conn-role">{conn.role}</span>
                <div className="prof-conn-shared">
                  <div className="prof-conn-shared-avatars">
                    {conn.sharedAvatars.map((src, i) => (
                      <img key={i} src={src} alt="" className="prof-conn-shared-dot" />
                    ))}
                    {conn.extra && <span className="prof-conn-shared-extra">{conn.extra}</span>}
                  </div>
                  <span className="prof-conn-shared-text">{conn.mutual} mutual connections</span>
                </div>
              </div>
              <div className="prof-conn-actions">
                <button className="prof-conn-btn prof-conn-btn--msg">Chat</button>
                <button className="prof-conn-btn prof-conn-btn--remove" onClick={() => setRemoved(p => new Set([...p, conn.id]))}>Remove from friends</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Grid view ── */}
      {viewMode === 'grid' && (
        <div className="prof-conn-grid">
          {visible.map(conn => (
            <div key={conn.id} className="prof-conn-card">
              <div className="prof-conn-card-avatar-wrap">
                <img src={conn.avatar} alt={conn.name} className="prof-conn-card-avatar" />
                <span className={`prof-conn-status-dot prof-conn-status-dot--card${conn.online ? ' prof-conn-status-dot--online' : ''}`} />
              </div>
              <p className="prof-conn-card-name">{conn.name}</p>
              <p className="prof-conn-card-role">{conn.role}</p>
              {conn.online
                ? <span className="prof-conn-online-badge">Online</span>
                : <span className="prof-conn-last-active">{conn.lastActive}</span>
              }
              <div className="prof-conn-card-mutual">
                <div className="prof-conn-shared-avatars">
                  {conn.sharedAvatars.slice(0, 2).map((src, i) => (
                    <img key={i} src={src} alt="" className="prof-conn-shared-dot" />
                  ))}
                </div>
                <span className="prof-conn-shared-text">{conn.mutual} mutual</span>
              </div>
              <div className="prof-conn-card-actions">
                <button className="prof-conn-btn prof-conn-btn--msg" style={{ flex: 1 }}>Chat</button>
                <button className="prof-conn-btn prof-conn-btn--remove prof-conn-btn--icon-remove" onClick={() => setRemoved(p => new Set([...p, conn.id]))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  <span className="prof-conn-remove-tooltip">Remove from friends</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="prof-conn-load-more">View all connections</button>
    </div>
    <FriendSuggestionsPanel />
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
      <div className="media-photo-wrap">
        <img src={photo.images[idx]} alt="" className="media-photo-img" />

        {/* gradient overlay + stats (always visible on hover) */}
        <div className="media-photo-overlay">
          <div className="media-photo-stats">
            <span className="media-stat"><HeartFillIcon /> {photo.likes}</span>
            <span className="media-stat"><MsgIcon /> {photo.comments}</span>
          </div>
        </div>

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
  return (
    <div className="prof-media-sidebar">
      <div className="right-card">
        <div className="right-section-header" style={{ padding: '12px 14px 10px' }}>
          <p className="right-section-title">Gallery</p>
          <button className="section-link" style={{ marginLeft: 'auto' }}>View all</button>
        </div>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className="gallery-thumb" style={{ overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === 5 && <div className="gallery-more">+42</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaTab() {
  return (
    <div className="prof-conn-layout">
    <div className="media-tab">
      <div className="media-header">
        <h2 className="media-title">Photos</h2>
        <button className="media-create-btn"><PlusIcon /> Create album</button>
      </div>
      <div className="media-grid">
        <button className="media-add-slot">
          <div className="media-add-icon"><CameraIcon /></div>
          <span className="media-add-label">Add photo</span>
        </button>
        {MEDIA_PHOTOS.map(photo => (
          <MediaCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
    <GalleryPanel />
    </div>
  );
}

const PROFILE_EVENTS = [
  { id: 'e1', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80', title: 'Comedy on the green',         date: 'Mon, Sep 25, 2020 at 9:30 AM',  location: 'San Francisco',  going: 77  },
  { id: 'e2', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80', title: 'Tech Summit 2024',             date: 'Fri, Nov 15, 2024 at 10:00 AM', location: 'New York',       going: 243 },
  { id: 'e3', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80', title: 'Live Music Night at the Park', date: 'Sat, Dec 07, 2024 at 7:00 PM',  location: 'Los Angeles',    going: 512 },
];

function UpcomingEventsPanel() {
  return (
    <div className="prof-ev-sidebar">
      <div className="sidebar-section">
        <div className="section-header">
          <span className="section-title">Upcoming Events</span>
          <button className="section-link">View all</button>
        </div>
        <div className="event-list">
          {SIDEBAR_EVENTS.map(e => (
            <div key={e.id} className="sidebar-event-item">
              <div className="event-thumb" style={{ overflow: 'hidden', borderRadius: 8 }}>
                <img src={e.img} alt={e.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="friend-info">
                <p className="friend-name">{e.name}</p>
                <p className="friend-sub">{e.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsTab({ onEventsClick, onCreateEvent }) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [openMenuId,    setOpenMenuId]    = useState(null);

  return (
    <div className="prof-conn-layout">
    <div className="ev-tab">
      <div className="ev-header">
        <h2 className="ev-title">Discover Events</h2>
        <button className="ev-create-btn" onClick={onCreateEvent ?? onEventsClick}><PlusIcon /> Create events</button>
      </div>

      {bannerVisible && (
        <div className="ev-banner">
          <span className="ev-banner-text">
            <strong>Upcoming event:</strong> The learning conference on Sep 19 2024
          </span>
          <button className="ev-banner-view">View event</button>
          <button className="ev-banner-close" onClick={() => setBannerVisible(false)}>✕</button>
        </div>
      )}

      <div className="ev-list">
        {PROFILE_EVENTS.map(ev => (
          <div key={ev.id} className="ev-card">
            <img src={ev.img} alt={ev.title} className="ev-card-img" />
            <div className="ev-card-body">
              <p className="ev-card-title">{ev.title}</p>
              <div className="ev-card-meta">
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {ev.date}
                </span>
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {ev.location}
                </span>
                <span className="ev-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {ev.going} going
                </span>
              </div>
            </div>
            <div className="ev-card-more-wrap">
              <button className="ev-card-more-btn" onClick={() => setOpenMenuId(openMenuId === ev.id ? null : ev.id)}>
                <MoreIcon />
              </button>
              {openMenuId === ev.id && (
                <div className="ev-card-dropdown">
                  <button className="ev-dd-item" onClick={() => setOpenMenuId(null)}>View event</button>
                  <button className="ev-dd-item" onClick={() => setOpenMenuId(null)}>Share</button>
                  <button className="ev-dd-item ev-dd-item--danger" onClick={() => setOpenMenuId(null)}>Remove</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    <UpcomingEventsPanel />
    </div>
  );
}

const BIO_LIMIT = 180;

function AboutTab() {
  const [bio,         setBio]         = useState(DEFAULT_BIO);
  const [editingBio,  setEditingBio]  = useState(false);
  const [draftBio,    setDraftBio]    = useState(DEFAULT_BIO);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [infoTab,     setInfoTab]     = useState('personal');
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalValues,  setPersonalValues]  = useState(
    () => Object.fromEntries(PERSONAL_INFO.map(i => [i.id, i.value]))
  );
  const [personalDraft,   setPersonalDraft]   = useState(
    () => Object.fromEntries(PERSONAL_INFO.map(i => [i.id, i.value]))
  );
  const [editingEdu, setEditingEdu] = useState(false);
  const [eduItems,   setEduItems]   = useState(EDUCATION_ITEMS);
  const [eduDraft,   setEduDraft]   = useState(EDUCATION_ITEMS);

  function handleEdit() {
    setDraftBio(bio ?? '');
    setEditingBio(true);
  }
  function handleSave() {
    setBio(draftBio.trim() || null);
    setEditingBio(false);
  }

  return (
    <div className="about-tab">
      <h2 className="about-section-title">Profile Info</h2>

      {/* Overview card */}
      <div className="about-card about-card--hoverable">
        <div className="about-card-header">
          <span className="about-card-label">Overview</span>
          {!editingBio && (
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
              onChange={e => setDraftBio(e.target.value)}
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
      <div className="about-info-tabs">
        <div className="about-info-tab-bar">
          <button
            className={`about-info-tab-btn${infoTab === 'personal' ? ' about-info-tab-btn--active' : ''}`}
            onClick={() => setInfoTab('personal')}
          >Personal Information</button>
          <button
            className={`about-info-tab-btn${infoTab === 'education' ? ' about-info-tab-btn--active' : ''}`}
            onClick={() => setInfoTab('education')}
          >Education</button>
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
        </div>

        {infoTab === 'personal' && (
          <div className="about-info-section">
            {PERSONAL_INFO.map(item => (
              <div key={item.id} className="about-info-row">
                <span className="about-info-row-icon">{item.icon}</span>
                <div className="about-info-row-body">
                  <span className="about-info-row-label">{item.label}</span>
                  {editingPersonal ? (
                    <input
                      className="about-info-row-input"
                      value={personalDraft[item.id] ?? ''}
                      onChange={e => setPersonalDraft(d => ({ ...d, [item.id]: e.target.value }))}
                    />
                  ) : (
                    <span className="about-info-row-value">{personalValues[item.id]}</span>
                  )}
                </div>
              </div>
            ))}
            {editingPersonal && (
              <div className="about-info-edit-actions">
                <button className="about-bio-cancel" onClick={() => setEditingPersonal(false)}>Cancel</button>
                <button className="about-bio-save" onClick={() => { setPersonalValues({ ...personalDraft }); setEditingPersonal(false); }}>Save</button>
              </div>
            )}
          </div>
        )}

        {infoTab === 'education' && (
          <div className="about-info-section">
            {(editingEdu ? eduDraft : eduItems).map((item, idx) => (
              <div key={item.id} className="about-edu-item">
                <div className="about-edu-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div className="about-edu-body">
                  {editingEdu ? (
                    <>
                      <input
                        className="about-info-row-input"
                        value={item.school}
                        placeholder="School"
                        onChange={e => setEduDraft(d => d.map((x, i) => i === idx ? { ...x, school: e.target.value } : x))}
                      />
                      <input
                        className="about-info-row-input"
                        value={item.degree}
                        placeholder="Degree"
                        onChange={e => setEduDraft(d => d.map((x, i) => i === idx ? { ...x, degree: e.target.value } : x))}
                      />
                      <input
                        className="about-info-row-input"
                        value={item.years}
                        placeholder="Years"
                        onChange={e => setEduDraft(d => d.map((x, i) => i === idx ? { ...x, years: e.target.value } : x))}
                      />
                    </>
                  ) : (
                    <>
                      <p className="about-edu-school">{item.school}</p>
                      <p className="about-edu-degree">{item.degree}</p>
                      <p className="about-edu-years">{item.years}</p>
                      <span className="about-edu-badge">{item.type}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
            {editingEdu && (
              <div className="about-info-edit-actions">
                <button className="about-bio-cancel" onClick={() => setEditingEdu(false)}>Cancel</button>
                <button className="about-bio-save" onClick={() => { setEduItems([...eduDraft]); setEditingEdu(false); }}>Save</button>
              </div>
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
  initialTab, onInitTabConsumed,
}) {
  const { user: authUser }  = useSelector(s => s.auth);
  const { profile }         = useSelector(s => s.profile);
  const avatarUrl           = profile?.avatar ?? ALEX_AVATAR;
  const displayName         = profile?.fullName || authUser?.fullName || 'Alex Rivera';
  const role                = profile?.role || 'Lead Developer';

  const [activeTab,       setActiveTab]       = useState(initialTab || 'Feed');
  useEffect(() => {
    if (initialTab) { setActiveTab(initialTab); onInitTabConsumed?.(); }
  }, [initialTab]);
  const [followPanel,     setFollowPanel]     = useState(null); // 'followers' | 'following' | null
  const [followSearch,    setFollowSearch]    = useState('');
  const [followingIds,    setFollowingIds]    = useState(new Set([11,12,13,14,15,16,1,3,5,7]));
  const [createPostOpen,  setCreatePostOpen]  = useState(false);
  const [createTab,       setCreateTab]       = useState('photo');
  const [creatorClicked,  setCreatorClicked]  = useState(false);
  const [coverUrl,        setCoverUrl]        = useState(COVER_URL);
  const [localAvatar,     setAvatarUrl]       = useState(null);
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

  return (
    <>
    <div className="prof-page">
      <AnimatedNav activeId="home" avatarUrl={avatarUrl} onNavigate={handleNav} />

      <div className="prof-main">
        <div className="prof-cover">
          <img src={coverUrl} alt="cover" className="prof-cover-img" />
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
              if (file) setCoverUrl(URL.createObjectURL(file));
              e.target.value = '';
            }}
          />
        </div>

        <div className="prof-identity">
          <div className="prof-avatar-wrap">
            <img src={displayAvatar} alt={displayName} className="prof-avatar-img" />
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
                if (file) setAvatarUrl(URL.createObjectURL(file));
                e.target.value = '';
              }}
            />
          </div>
          <div className="prof-info">
            <div className="prof-name-row">
              <h1 className="prof-name">{displayName}</h1>
              {/* <div className="prof-connections">250 connections</div> */}
            </div>
            <div className="prof-meta-row">
              <span className="prof-meta-item"><BriefcaseIcon /> {role}</span>
              <span className="prof-meta-sep">·</span>
              <span className="prof-meta-item"><PinIcon /> New Hampshire</span>
              <span className="prof-meta-sep">·</span>
              <span className="prof-meta-item"><CalIcon /> Joined on Nov 26, 2019</span>
            </div>
            <div className="prof-counts-row">
              <button className="prof-count-item" onClick={() => { setFollowSearch(''); setFollowPanel('followers'); }}>
                <span className="prof-count-num">8,400</span>
                <span className="prof-count-lbl">Followers</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item" onClick={() => { setFollowSearch(''); setFollowPanel('following'); }}>
                <span className="prof-count-num">1,200</span>
                <span className="prof-count-lbl">Following</span>
              </button>
              <span className="prof-count-div" />
              <button className="prof-count-item">
                <span className="prof-count-num">326</span>
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
              {tab === 'Connections' && <span className="prof-tab-badge">300</span>}
            </button>
          ))}
        </div>

        <div className={`prof-content${(activeTab === 'Connections' || activeTab === 'Events' || activeTab === 'Photos') ? ' prof-content--wide' : ''}`}>
          {activeTab === 'Feed' && (
            <div className="prof-feed">
              <div className={`post-creator${creatorClicked ? ' post-creator--clicked' : ''}`}>
                <div className="creator-top">
                  <div className="creator-avatar" style={{ overflow: 'hidden' }}>
                    <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              {MOCK_POSTS.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'About'       && <AboutTab />}
          {activeTab === 'Connections' && <ConnectionsTab />}
          {activeTab === 'Photos'      && <MediaTab />}
          {activeTab === 'Events'      && <EventsTab onEventsClick={onEventsClick} onCreateEvent={onEventsCreateClick} />}

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

    {followPanel && (() => {
      const list = (followPanel === 'followers' ? DEMO_FOLLOWERS : DEMO_FOLLOWING)
        .filter(p => p.name.toLowerCase().includes(followSearch.toLowerCase()) || p.role.toLowerCase().includes(followSearch.toLowerCase()));
      return (
        <div className="fp-overlay" onClick={() => setFollowPanel(null)}>
          <div className="fp-panel" onClick={e => e.stopPropagation()}>
            <div className="fp-header">
              <div className="fp-tabs">
                <button className={`fp-tab${followPanel === 'followers' ? ' fp-tab--active' : ''}`} onClick={() => { setFollowSearch(''); setFollowPanel('followers'); }}>
                  Followers <span className="fp-tab-count">8,400</span>
                </button>
                <button className={`fp-tab${followPanel === 'following' ? ' fp-tab--active' : ''}`} onClick={() => { setFollowSearch(''); setFollowPanel('following'); }}>
                  Following <span className="fp-tab-count">1,200</span>
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
              {list.length === 0 && <p className="fp-empty">No results found</p>}
              {list.map(person => (
                <div className="fp-person" key={person.id}>
                  <img className="fp-avatar" src={person.avatar} alt={person.name} />
                  <div className="fp-info">
                    <span className="fp-name">{person.name}</span>
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
                    onClick={() => setFollowingIds(prev => {
                      const s = new Set(prev);
                      s.has(person.id) ? s.delete(person.id) : s.add(person.id);
                      return s;
                    })}
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
