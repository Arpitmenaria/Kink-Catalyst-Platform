/* ── Avatars ── */
export const ALEX_AVATAR   = 'https://i.pravatar.cc/150?img=68';
export const ELENA_AVATAR  = 'https://i.pravatar.cc/150?img=47';

export const FRIEND_SUGGESTIONS = [
  { id: 1, name: 'Sarah Chen',  sub: '4 mutual friends', color: '#0ea5e9', avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: 2, name: 'Marcus Tye',  sub: '2 mutual friends', color: '#f97316', avatar: 'https://i.pravatar.cc/150?img=51' },
  { id: 3, name: 'Marcus Tye',  sub: '2 mutual friends', color: '#8b5cf6', avatar: 'https://i.pravatar.cc/150?img=52' },
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
    author: { fullName: 'Elena Moretti', avatar: ELENA_AVATAR },
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
    author: { fullName: 'Elena Moretti', avatar: ELENA_AVATAR },
    caption: "Exploring the intersection of architectural minimalism and digital landscapes. This weekend's creative retreat was absolutely transformative.",
    media: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90&fit=crop' }],
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    likes: 3,
    comments: 128,
    shares: 45,
    peopleReact: 0,
  },
];
