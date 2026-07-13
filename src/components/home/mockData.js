/* ── Avatars ── */
export const ALEX_AVATAR   = 'https://i.pravatar.cc/150?img=68';
export const ELENA_AVATAR  = 'https://i.pravatar.cc/150?img=47';

/* ── Profile page tabs (used by ProfilePage + UserProfilePage) ── */
export const PROFILE_TABS = ['Feed', 'About', 'Connections', 'Photos', 'Events'];

/* ── Users (keyed by _id, used by UserProfilePage) ── */
export const MOCK_USERS = {
  'elena-moretti': {
    _id: 'elena-moretti',
    fullName: 'Elena Moretti',
    avatar: ELENA_AVATAR,
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90&fit=crop',
    role: 'Creative Director',
    location: 'Milan, Italy',
    joinedAt: '2021-09-02',
  },
  'sarah-chen': {
    _id: 'sarah-chen',
    fullName: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=44',
    coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=90&fit=crop',
    role: 'Product Designer',
    location: 'San Francisco, CA',
    joinedAt: '2022-01-18',
    bio: 'Designing thoughtful, human-centered products. Coffee enthusiast and weekend hiker.',
  },
  'marcus-tye-b': {
    _id: 'marcus-tye-b',
    fullName: 'Marcus Tye',
    avatar: 'https://i.pravatar.cc/150?img=51',
    coverUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1400&q=90&fit=crop',
    role: 'Software Engineer',
    location: 'Austin, TX',
    joinedAt: '2021-11-05',
    bio: 'Building scalable backend systems. Open source contributor.',
  },
  'marcus-tye-c': {
    _id: 'marcus-tye-c',
    fullName: 'Marcus Tye',
    avatar: 'https://i.pravatar.cc/150?img=52',
    coverUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=90&fit=crop',
    role: 'Marketing Lead',
    location: 'Chicago, IL',
    joinedAt: '2023-03-22',
    bio: 'Growth marketing and brand storytelling.',
  },
  'priya-nair': {
    _id: 'priya-nair',
    fullName: 'Priya Nair',
    avatar: 'https://i.pravatar.cc/150?img=5',
    coverUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1400&q=90&fit=crop',
    role: 'Event Enthusiast',
    location: 'Bengaluru, India',
    joinedAt: '2022-06-10',
  },
  'rohan-mehta': {
    _id: 'rohan-mehta',
    fullName: 'Rohan Mehta',
    avatar: 'https://i.pravatar.cc/150?img=12',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=90&fit=crop',
    role: 'Community Organizer',
    location: 'Mumbai, India',
    joinedAt: '2021-08-14',
  },
  'sneha-kapoor': {
    _id: 'sneha-kapoor',
    fullName: 'Sneha Kapoor',
    avatar: 'https://i.pravatar.cc/150?img=20',
    coverUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1400&q=90&fit=crop',
    role: 'UX Researcher',
    location: 'Pune, India',
    joinedAt: '2023-02-01',
  },
};

export const FRIEND_SUGGESTIONS = [
  { id: 1, _id: 'sarah-chen',   name: 'Sarah Chen',  sub: '4 mutual friends', color: '#0ea5e9', avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: 2, _id: 'marcus-tye-b', name: 'Marcus Tye',  sub: '2 mutual friends', color: '#f97316', avatar: 'https://i.pravatar.cc/150?img=51' },
  { id: 3, _id: 'marcus-tye-c', name: 'Marcus Tye',  sub: '2 mutual friends', color: '#8b5cf6', avatar: 'https://i.pravatar.cc/150?img=52' },
];

export const GROUPS = [
  { id: 1, name: 'UI Designers',     members: '2.4k members', color: '#3b82f6' },
  { id: 2, name: 'Product Thinkers', members: '1.8k members', color: '#10b981' },
  { id: 3, name: 'Tech Innovators',  members: '3.1k members', color: '#8b5cf6' },
];

export const SIDEBAR_EVENTS = [
  { id: 1, name: 'Tech Meetup',     date: 'Oct 23 · 10:00 AM', img: 'https://picsum.photos/seed/ev-tech/40/40'    },
  { id: 2, name: 'Design Workshop', date: 'Nov 02 · 02:00 PM', img: 'https://picsum.photos/seed/ev-design/40/40'  },
  { id: 3, name: 'Design Workshop', date: 'Nov 03 · 02:00 PM', img: 'https://picsum.photos/seed/ev-design2/40/40' },
];

export const GALLERY_IMAGES = [
  'https://picsum.photos/seed/gal-1/100/100',
  'https://picsum.photos/seed/gal-2/100/100',
  'https://picsum.photos/seed/gal-3/100/100',
  'https://picsum.photos/seed/gal-4/100/100',
  'https://picsum.photos/seed/gal-5/100/100',
  'https://picsum.photos/seed/gal-6/100/100',
];

export const LIKED_PAGES = [
  { id: 1, name: 'Chrimson Agency', sub: 'Clothing Store · +15k',  color: '#f97316', initial: 'C' },
  { id: 2, name: 'Digital Pixel',   sub: 'Software Company · +8k', color: '#3b82f6', initial: 'D' },
  { id: 3, name: 'The Angle Bar',   sub: 'Disco Bar · +8k',        color: '#6366f1', initial: 'T' },
  { id: 4, name: 'Fivestar Food',   sub: 'Restaurant · +106k',     color: '#10b981', initial: 'F' },
  { id: 5, name: 'Royal Watch',     sub: 'Watch Shop · +65k',      color: '#f59e0b', initial: 'R' },
];

export const MOCK_POSTS = [
  {
    _id: 'p1',
    author: { _id: 'elena-moretti', fullName: 'Elena Moretti', avatar: ELENA_AVATAR },
    caption: "Exploring the intersection of architectural minimalism and digital landscapes. This weekend's creative retreat was absolutely transformative.",
    media: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=90&fit=crop' }],
    title: 'Celebration new album song launched',
    tags: '#Musiccelebration, #music, #party, #music',
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. has been the industry's standard dummy text ever since the 1500s.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 75,
    comments: 4565,
    shares: 985,
    peopleReact: 12,
  },
  {
    _id: 'p2',
    author: { _id: 'elena-moretti', fullName: 'Elena Moretti', avatar: ELENA_AVATAR },
    caption: "Exploring the intersection of architectural minimalism and digital landscapes. This weekend's creative retreat was absolutely transformative.",
    media: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90&fit=crop' }],
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    likes: 3,
    comments: 128,
    shares: 45,
    peopleReact: 0,
  },
  {
    _id: 'p3',
    author: { _id: 'sarah-chen', fullName: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=44' },
    caption: "Wrapped up a design sprint with the team today — reworked our onboarding flow from the ground up. So proud of what we shipped this week.",
    media: [{ url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=90&fit=crop' }],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    likes: 41,
    comments: 12,
    shares: 6,
    peopleReact: 4,
  },
  {
    _id: 'p4',
    author: { _id: 'sarah-chen', fullName: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=44' },
    caption: "Weekend hike above the fog line. Best way to reset before a big product review on Monday.",
    media: [{ url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=90&fit=crop' }],
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    likes: 27,
    comments: 5,
    shares: 1,
    peopleReact: 2,
  },
  {
    _id: 'p5',
    author: { _id: 'marcus-tye-b', fullName: 'Marcus Tye', avatar: 'https://i.pravatar.cc/150?img=51' },
    caption: "Finally got our API response times down by 40% after migrating the caching layer. Open-sourcing the benchmarks next week.",
    media: [{ url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=90&fit=crop' }],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    likes: 63,
    comments: 19,
    shares: 14,
    peopleReact: 7,
  },
  {
    _id: 'p6',
    author: { _id: 'marcus-tye-c', fullName: 'Marcus Tye', avatar: 'https://i.pravatar.cc/150?img=52' },
    caption: "Our latest campaign just crossed 1M impressions in its first 48 hours. Huge thanks to the whole growth team.",
    media: [{ url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90&fit=crop' }],
    createdAt: new Date(Date.now() - 25200000).toISOString(),
    likes: 34,
    comments: 8,
    shares: 3,
    peopleReact: 3,
  },
];
