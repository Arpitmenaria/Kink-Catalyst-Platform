import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './EventsPage.css';
import AnimatedNav from './AnimatedNav';
import CreatePostModal from './CreatePostModal';
import { CustomDatePicker, CustomTimePicker } from './DateTimePicker';
import {
  fetchEvents, fetchEventDetail, createEvent, deleteEvent,
  bookEvent, cancelBooking, saveEvent, unsaveEvent,
  fetchMyBooked, fetchMySaved, fetchMyCreated,
  fetchComments, postComment, likeComment,
} from '../../store/slices/eventsSlice';
import { showToast } from '../../store/slices/toastSlice';
import { joinEventRoom, leaveEventRoom } from '../../services/socket';

/* ── Sidebar nav icons ── */
function FeedNavIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function EventNavIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function GroupsNavIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CalendarNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="8" y="14" width="2" height="2" rx="0.5"/></svg>; }
function MessagesNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }

/* ── Event type icons ── */
function OnlineIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function OfflineIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }

/* ── Misc icons ── */
function ChevronDownIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function ArrowRightIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }
function ArrowLeftIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function StarIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function TicketIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>; }
function ClockIcon()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function PlusIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function CalendarIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MapPinIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ParkingIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>; }
function OrganizerIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function MonitorIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function PinMapIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ExternalLinkIcon(){ return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
function EditIcon()        { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function SearchIcon()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function LinkIcon()        { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>; }
function FacebookIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function TwitterXIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function WhatsAppIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>; }

/* ── Discovery mock data ── */
const DISC_CATEGORIES = ['All', 'Music', 'Tech', 'Business', 'Art', 'Workshop', 'Social'];

export const BOOKED_EVENTS = [
  {
    id: 'b1', day: '05', month: 'OCT', monthFull: 'October',
    fullDate: 'Sunday 5 October 2025 at 09:00',
    img: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80&fit=crop',
    category: 'Tech', catColor: '#0891b2', location: 'San Jose, CA',
    title: 'Design Systems Summit 2024',
    desc: 'A deep dive into scalable design systems, component libraries and tooling for modern teams.',
    attending: '3.2k', seats: null, soldOut: false, responded: '3,200',
    about: 'Design Systems Summit brings together the world\'s leading design engineers, product designers, and engineering leaders for two days of in-depth workshops and talks. Explore token-based theming, component governance, accessibility at scale, and the future of collaborative design tooling. Whether you\'re just starting a design system or scaling one across hundreds of teams, this is the event for you.',
    venue: 'San Jose Convention Center, South Hall',
  },
  {
    id: 'b2', day: '18', month: 'OCT', monthFull: 'October',
    fullDate: 'Saturday 18 October 2025 at 18:00',
    img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80&fit=crop',
    category: 'Business', catColor: '#059669', location: 'Seattle, WA',
    title: 'Founders Forum 2024',
    desc: 'An exclusive gathering of founders, VCs and operators sharing lessons from building companies.',
    attending: '1.8k', seats: '10 seats left', soldOut: false, responded: '1,800',
    about: 'Founders Forum is the most intimate gathering of builders and investors in the Pacific Northwest. Hear candid stories from founders who\'ve navigated product-market fit, rapid scaling, and pivots. Connect one-on-one with top-tier VCs, angels, and operators in a setting designed for real conversations, not pitches. Applications are reviewed — only verified founders and operators gain entry.',
    venue: 'Hyatt Regency Seattle, Grand Ballroom',
  },
  {
    id: 'b3', day: '30', month: 'OCT', monthFull: 'October',
    fullDate: 'Thursday 30 October 2025 at 09:00',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80&fit=crop',
    category: 'Workshop', catColor: '#f59e0b', location: 'Remote',
    title: 'Full-Stack Web Dev Bootcamp',
    desc: 'Intensive 2-day workshop covering React, Node.js and cloud deployment with hands-on projects.',
    attending: '540', seats: '5 seats left', soldOut: false, responded: '540',
    about: 'This hands-on 2-day intensive covers the modern full-stack JavaScript ecosystem from scratch to deployment. Day one focuses on React 19 patterns, state management, and component architecture. Day two dives into Node.js APIs, database integration, and deploying on cloud platforms. You\'ll leave with a fully built project, reviewed code, and a mentor\'s feedback on your architecture decisions.',
    venue: 'Virtual — Zoom + Discord',
  },
];

export const DISC_EVENTS = [
  {
    id: 'd1', day: '24', month: 'OCT', monthFull: 'October',
    fullDate: 'Thursday 24 October 2025 at 21:00',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80&fit=crop',
    category: 'Live Music', catColor: '#7c3aed', location: 'Austin, TX',
    title: 'Neon Beats: Electronic Night',
    desc: 'Experience the pulse of modern electronic beats in an immersive 360-degree sound environment.',
    attending: '1.2k', seats: '45 seats left', soldOut: false, responded: '1,200',
    about: 'Neon Beats is Austin\'s most anticipated underground electronic music event. An immersive 360-degree audio-visual experience featuring headlining DJs from Berlin, Amsterdam, and Tokyo, laser installations, and a lineup that spans house, techno, and ambient electronica. Doors open at 9 PM, headliners hit the stage at midnight. General and VIP areas available.',
    venue: 'Austin360 Amphitheatre, Circuit of the Americas',
  },
  {
    id: 'd2', day: '15', month: 'NOV', monthFull: 'November',
    fullDate: 'Saturday 15 November 2025 at 09:00',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&fit=crop',
    category: 'Tech & Startup', catColor: '#0891b2', location: 'San Francisco, CA',
    title: 'Future of AI: Innovation Summit',
    desc: 'Join industry leaders for a deep dive into the next generation of artificial intelligence and technology.',
    attending: '2.5k', seats: '120 seats left', soldOut: false, responded: '2,500',
    about: 'The Future of AI Summit assembles researchers, founders, and enterprise leaders building the next generation of intelligent systems. Tracks cover foundation models, multimodal AI, agentic systems, AI safety, and enterprise adoption. Expect live demos, panel debates, and direct access to the minds shaping the trajectory of artificial intelligence over the next decade.',
    venue: 'Moscone Center, West Hall',
  },
  {
    id: 'd3', day: '02', month: 'DEC', monthFull: 'December',
    fullDate: 'Tuesday 2 December 2025 at 19:00',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&fit=crop',
    category: 'Business', catColor: '#059669', location: 'New York, NY',
    title: 'Executive Networking Mixer',
    desc: 'An exclusive evening for senior executives and entrepreneurs to connect in a premium setting.',
    attending: '800', seats: '25 seats left', soldOut: false, responded: '800',
    about: 'A curated evening of high-signal networking for C-suite leaders, serial entrepreneurs, and Fortune 500 decision-makers. Hosted in a private penthouse setting with a 3-course dinner, open bar, and structured introductions — no pitches, no slides, just genuine conversation. Attendees are vetted. Each ticket grants access to our private Slack community for ongoing connections.',
    venue: 'The Pierre Hotel, Grand Ballroom',
  },
  {
    id: 'd4', day: '12', month: 'DEC', monthFull: 'December',
    fullDate: 'Friday 12 December 2025 at 10:00',
    img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80&fit=crop',
    category: 'Art & Design', catColor: '#db2777', location: 'London, UK',
    title: 'Creative Design Workshop',
    desc: 'Master the fundamentals of modern UI/UX design in this hands-on intensive workshop.',
    attending: '300', seats: null, soldOut: true, responded: '300',
    about: 'This sold-out intensive workshop covers the full design thinking process from user research to high-fidelity prototyping. Led by senior designers from top studios, the day is structured around real briefs with peer critique sessions. Participants receive Figma templates, a curated resource pack, and lifetime access to workshop recordings. Entry is no longer available — join the waitlist for future dates.',
    venue: 'The Design Museum, Commonwealth Room, London',
  },
  {
    id: 'd5', day: '20', month: 'JAN', monthFull: 'January',
    fullDate: 'Tuesday 20 January 2026 at 19:30',
    img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80&fit=crop',
    category: 'Music', catColor: '#7c3aed', location: 'Chicago, IL',
    title: 'Jazz Under the Stars',
    desc: 'A magical evening of live jazz performances under the open sky with top artists from around the world.',
    attending: '950', seats: '60 seats left', soldOut: false, responded: '950',
    about: 'Jazz Under the Stars is a landmark event in Chicago\'s annual music calendar. Set against the iconic skyline, the evening features four headline acts spanning bebop, fusion, and contemporary jazz. Guests are invited to bring blankets, enjoy curated food vendors, and lose themselves in two hours of uninterrupted live performance. Weather contingency plan in place — event will move to the indoor pavilion if needed.',
    venue: 'Millennium Park, Jay Pritzker Pavilion',
  },
  {
    id: 'd6', day: '28', month: 'JAN', monthFull: 'January',
    fullDate: 'Wednesday 28 January 2026 at 14:00',
    img: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=600&q=80&fit=crop',
    category: 'Workshop', catColor: '#f59e0b', location: 'Berlin, DE',
    title: 'Startup Pitch Competition',
    desc: 'Present your startup idea to top-tier investors and win funding, mentorship, and global recognition.',
    attending: '420', seats: '15 seats left', soldOut: false, responded: '420',
    about: 'Berlin\'s premier startup pitch competition returns for its 8th edition. Teams of up to 3 founders get 5 minutes to pitch and 5 minutes of Q&A in front of a panel of 12 leading European VCs. Top 3 teams win cash prizes (€50k, €20k, €10k), 6 months of co-working space, and fast-track consideration from participating funds. Apply early — only 30 slots available across 8 verticals.',
    venue: 'Factory Berlin, Görlitzer Park Campus',
  },
];

const EVENT_GALLERY_POOL = [
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80&fit=crop',
  'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=1200&q=80&fit=crop',
];

function getEventImages(ev) {
  if (!ev) return [];
  if (Array.isArray(ev.images) && ev.images.length) return ev.images;
  const base = ev.img?.split('?')[0];
  const fillers = EVENT_GALLERY_POOL.filter(url => !url.startsWith(base));
  return [ev.img, ...fillers.slice(0, 4)];
}

function ChevronLeftIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevronRightIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }

function EventCarousel({ images, alt }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) return null;

  function prev(e) { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }
  function next(e) { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }

  return (
    <>
      <img src={images[idx]} alt={alt} className="ev-detail-cover-img" />
      {images.length > 1 && (
        <>
          <button className="ev-carousel-arrow ev-carousel-arrow--prev" onClick={prev} title="Previous photo"><ChevronLeftIcon /></button>
          <button className="ev-carousel-arrow ev-carousel-arrow--next" onClick={next} title="Next photo"><ChevronRightIcon /></button>
          <div className="ev-carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`ev-carousel-dot${i === idx ? ' ev-carousel-dot--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                title={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

const REVIEW_FRIENDS = [
  { id: '1', name: 'Alex Johnson',  color: '#7c3aed' },
  { id: '2', name: 'Sarah Miller',  color: '#0891b2' },
  { id: '3', name: 'David Chen',    color: '#059669' },
];

function reviewInitials(name) { return name.split(' ').map(w => w[0]).join('').toUpperCase(); }
function CheckIcon()       { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function BackArrowIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function SendIcon()        { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function ThumbUpIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>; }
function BookmarkIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>; }
function BellIcon()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function UnfollowIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>; }
function FlagIcon()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>; }

export const CREATED_EVENTS = [
  {
    id: 'c1', day: '15', month: 'JUL', monthFull: 'July',
    fullDate: 'Wednesday 15 July 2026 at 18:00',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&fit=crop',
    category: 'Tech & Startup', catColor: '#0891b2',
    location: 'Bengaluru, India',
    title: 'DevFest India 2026',
    desc: 'Annual developer festival bringing together 5000+ engineers, designers and product leaders.',
    attending: '4.8k', seats: '200 seats left', soldOut: false, responded: '4,820',
    about: 'DevFest India is the largest annual developer festival in South Asia, bringing together engineers, designers, product managers, and tech leaders from across the country and beyond. This year\'s theme is "Build for Billions" — focusing on AI-first products, scalable infrastructure, and developer experience. Expect 60+ sessions, live demos, hackathons, and networking with the brightest minds in tech.',
    venue: 'KTPO Convention Centre, Whitefield',
  },
  {
    id: 'c2', day: '28', month: 'AUG', monthFull: 'August',
    fullDate: 'Friday 28 August 2026 at 19:30',
    img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80&fit=crop',
    category: 'Art & Design', catColor: '#db2777',
    location: 'Mumbai, India',
    title: 'Design Spectrum 2026',
    desc: 'A premier design conference exploring the intersection of technology, creativity, and human experience.',
    attending: '2.1k', seats: '50 seats left', soldOut: false, responded: '2,140',
    about: 'Design Spectrum is a premier design conference that brings together the world\'s most innovative designers, creative directors, and product thinkers. Explore workshops, keynotes, and exhibitions spanning UI/UX, motion, brand identity, and emerging creative tools. A one-of-a-kind event where craft meets culture.',
    venue: 'Nesco Exhibition Centre, Goregaon',
  },
];

const DISCUSSION_COMMENTS = [
  { id: 1, _id: 'priya-nair',  name: 'Priya Nair',    avatar: 'https://i.pravatar.cc/36?img=5',  time: '2 hours ago',  text: 'Super excited for this! Will there be recordings available for those who miss a session?', likes: 14 },
  { id: 2, _id: 'rohan-mehta', name: 'Rohan Mehta',   avatar: 'https://i.pravatar.cc/36?img=12', time: '5 hours ago',  text: 'Attended last year — absolute top-tier event. The networking alone is worth it.', likes: 31 },
  { id: 3, _id: 'sneha-kapoor', name: 'Sneha Kapoor',  avatar: 'https://i.pravatar.cc/36?img=20', time: '1 day ago',    text: 'Will there be a beginner-friendly track this year? First-time attendee here!', likes: 8 },
];

const RESPONDED_AVATARS = [
  'https://i.pravatar.cc/28?img=1',
  'https://i.pravatar.cc/28?img=3',
  'https://i.pravatar.cc/28?img=7',
  'https://i.pravatar.cc/28?img=9',
];

const TICKET_ICONS = { star: <StarIcon />, ticket: <TicketIcon />, clock: <ClockIcon /> };
const MAX_PER_USER_OPTIONS = ['1', '2', '3', '4', '5', '10', 'Unlimited'];

const EV_NAV = [
  { id: 'feed',     label: 'Feed',     icon: <FeedNavIcon /> },
  { id: 'event',    label: 'Event',    icon: <EventNavIcon />,  active: true },
  { id: 'groups',   label: 'Groups',   icon: <GroupsNavIcon /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarNavIcon /> },
  { id: 'messages', label: 'Messages', icon: <MessagesNavIcon /> },
];

const STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Plans & Pricing' },
  { id: 3, label: 'Location/ Venue' },
  { id: 4, label: 'Review' },
];

const CATEGORIES = [
  'Music', 'Sports', 'Education', 'Business', 'Arts & Culture',
  'Food & Drink', 'Technology', 'Health & Wellness', 'Other',
];

const EVENT_TYPES = [
  { id: 'online',  label: 'Online',  icon: <OnlineIcon /> },
  { id: 'offline', label: 'Offline', icon: <OfflineIcon /> },
];

const HEART_BURST_PATHS = [
  { dx: -36, dy: -52, rot: -30 },
  { dx: -16, dy: -62, rot:  15 },
  { dx:   6, dy: -66, rot: -10 },
  { dx:  28, dy: -52, rot:  25 },
  { dx:  40, dy: -32, rot: -20 },
  { dx: -44, dy: -28, rot:  30 },
  { dx:  -8, dy: -58, rot: -18 },
];

export default function EventsPage({ onBack, onEventsClick, onGroupsClick, onCalendarClick, onMessagesClick, onLibraryClick, onCoursesClick, onMinisitesClick, startCreate, initialEventId, onInitEventConsumed, onUserClick }) {
  const [showCreate,    setShowCreate]    = useState(startCreate || false);
  const [discTab,       setDiscTab]       = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [evDetailTab,   setEvDetailTab]   = useState('about');
  const [eventFromHome, setEventFromHome] = useState(false);

  useEffect(() => {
    if (!initialEventId) return;
    const found =
      BOOKED_EVENTS.find(e => e.id === initialEventId) ??
      CREATED_EVENTS.find(e => e.id === initialEventId) ??
      DISC_EVENTS.find(e => e.id === initialEventId);
    if (found) {
      const sourceTab = BOOKED_EVENTS.includes(found) ? 'booked' : CREATED_EVENTS.includes(found) ? 'created' : 'upcoming';
      setSelectedEvent({ ...found, _sourceTab: sourceTab });
      setEvDetailTab('about');
      setEventFromHome(true);
    }
    onInitEventConsumed?.();
  }, [initialEventId]);
  const [goingIds,      setGoingIds]      = useState(new Set());
  const [comment,       setComment]       = useState('');
  const [comments,      setComments]      = useState(DISCUSSION_COMMENTS);
  const [moreOpen,      setMoreOpen]      = useState(false);
  const [discCat,       setDiscCat]       = useState('All');
  const [savedIds,       setSavedIds]       = useState(new Set());
  const [heartingIds,    setHeartingIds]    = useState(new Set());
  const [heartParticles, setHeartParticles] = useState({});
  const [showFilter,    setShowFilter]    = useState(false);
  const [viewMode,      setViewMode]      = useState('grid');
  const [filters,       setFilters]       = useState({ eventType: 'all', categories: new Set(), location: '', radius: 25, amenities: new Set() });
  const [pendingF,      setPendingF]      = useState({ eventType: 'all', categories: new Set(), location: '', radius: 25, amenities: new Set() });
  const [step, setStep] = useState(1);
  const [animDir, setAnimDir] = useState('forward');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  // Redux
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(s => s.auth);
  const {
    events: rdxEvents, eventsLoading,
    bookedEvents, bookedLoading,
    savedEvents, savedLoading,
    createdEvents, createdLoading,
    eventDetail,
    comments: evtComments, commentsLoading,
    bookingLoading, createLoading,
  } = useSelector(s => s.events);

  // Fetch on tab / category change
  useEffect(() => {
    if (discTab === 'upcoming') {
      dispatch(fetchEvents({
        tab: 'upcoming',
        category: discCat !== 'All' ? discCat : '',
        eventType: filters.eventType !== 'all' ? filters.eventType : '',
        location: filters.location,
      }));
    } else if (discTab === 'booked') {
      dispatch(fetchMyBooked());
    } else if (discTab === 'favorites') {
      dispatch(fetchMySaved());
    } else if (discTab === 'created') {
      dispatch(fetchMyCreated());
    }
  }, [discTab, discCat]); // eslint-disable-line

  // Sync savedIds from Redux (for heart animation state)
  useEffect(() => {
    const ids = new Set([
      ...rdxEvents.filter(e => e.isSaved).map(e => e.id),
      ...bookedEvents.filter(e => e.isSaved).map(e => e.id),
      ...savedEvents.map(e => e.id),
    ]);
    setSavedIds(ids);
  }, [rdxEvents, bookedEvents, savedEvents]);

  // Sync goingIds from Redux
  useEffect(() => {
    const ids = new Set([
      ...rdxEvents.filter(e => e.isBooked).map(e => e.id),
      ...bookedEvents.map(e => e.id),
    ]);
    setGoingIds(ids);
  }, [rdxEvents, bookedEvents]);

  // Join socket room + fetch detail when event selected
  useEffect(() => {
    if (!selectedEvent?.id) return;
    dispatch(fetchEventDetail(selectedEvent.id));
    joinEventRoom(selectedEvent.id);
    return () => { leaveEventRoom(selectedEvent.id); };
  }, [selectedEvent?.id]); // eslint-disable-line

  // Fetch comments when discussion tab opens
  useEffect(() => {
    if (evDetailTab === 'discussion' && selectedEvent?.id) {
      dispatch(fetchComments({ eventId: selectedEvent.id }));
    }
  }, [evDetailTab, selectedEvent?.id]); // eslint-disable-line

  // Sync local comments from Redux
  useEffect(() => {
    if (selectedEvent?.id) {
      setComments(evtComments[selectedEvent.id] ?? []);
    }
  }, [evtComments, selectedEvent?.id]); // eslint-disable-line

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  }

  function handlePublish(asDraft = false) {
    // Required field validation
    const publishErrors = [];
    if (!form.title.trim())    publishErrors.push('Event title is required.');
    if (!form.category)        publishErrors.push('Event category is required.');
    if (!form.eventType)       publishErrors.push('Event type (online / offline) is required.');
    if (!form.startDate)       publishErrors.push('Start date is required.');
    if (form.eventType === 'offline' && locationTab === 'physical' && !venue.city.trim()) {
      publishErrors.push('City is required for offline events.');
    }
    if (form.eventType === 'online' && locationTab === 'online' && !virtual.link.trim()) {
      publishErrors.push('Meeting link is required for online events.');
    }
    if (publishErrors.length > 0) {
      dispatch(showToast({ message: publishErrors[0], type: 'error' }));
      // Jump to the step that has the first error
      if (!form.title.trim() || !form.category || !form.eventType || !form.startDate) setStep(1);
      else if (form.eventType === 'offline' && !venue.city.trim()) setStep(3);
      else if (form.eventType === 'online' && !virtual.link.trim()) setStep(3);
      return;
    }

    const fd = new FormData();
    fd.append('title', form.title.trim());
    if (form.tagline) fd.append('tagline', form.tagline);
    if (form.description) {
      fd.append('description', form.description);
      fd.append('about', form.description);
    }
    fd.append('category', form.category);
    fd.append('eventType', form.eventType);
    fd.append('pricingType', pricingType);
    fd.append('status', asDraft ? 'draft' : 'published');
    fd.append('startDate', form.startDate);
    if (form.endDate) fd.append('endDate', form.endDate);
    fd.append('isAllDay', form.isAllDay ? 'true' : 'false');
    if (!form.isAllDay) {
      if (form.startTime) fd.append('startTime', form.startTime);
      if (form.endTime)   fd.append('endTime',   form.endTime);
    }
    if (coverImageFile) fd.append('coverImage', coverImageFile);
    if (locationTab === 'physical') {
      fd.append('location', JSON.stringify({ venue: venue.name, street: venue.street, city: venue.city, state: venue.state, country: venue.country, pinCode: venue.pinCode }));
      if (parking) fd.append('parking', parking);
      fd.append('organizer', JSON.stringify(organizer));
    } else {
      if (virtual.link)         fd.append('virtualLink', virtual.link);
      if (virtual.instructions) fd.append('virtualInstructions', virtual.instructions);
    }
    if (tickets.length > 0) {
      fd.append('tickets', JSON.stringify(tickets.map(t => ({
        name: t.name, description: t.description ?? '', price: parseFloat(t.price) || 0,
        seats: parseInt(t.seats) || 0, maxPerUser: parseInt(t.maxPerUser) || 1, iconType: t.iconType,
      }))));
    }
    fd.append('registration', JSON.stringify({
      ticketPrice: parseFloat(registration.ticketPrice) || 0,
      totalSeats:  parseInt(registration.totalSeats) || 0,
      maxPerUser:  parseInt(registration.maxPerUser) || 4,
      deadline:    registration.deadline,
    }));

    dispatch(createEvent(fd)).then(action => {
      if (createEvent.fulfilled.match(action)) {
        dispatch(showToast({ message: asDraft ? 'Event saved as draft.' : 'Event published successfully!', type: 'success' }));
        setShowCreate(false);
        setStep(1);
        dispatch(fetchMyCreated());
      } else if (createEvent.rejected.match(action)) {
        dispatch(showToast({ message: action.payload ?? 'Failed to publish event.', type: 'error' }));
      }
    });
  }

  function toggleSave(id) {
    const wasSaved = savedIds.has(id);
    setSavedIds(p => {
      const n = new Set(p);
      const adding = !n.has(id);
      adding ? n.add(id) : n.delete(id);
      if (adding) {
        setHeartingIds(h => { const nh = new Set(h); nh.add(id); return nh; });
        setHeartParticles(prev => ({ ...prev, [id]: HEART_BURST_PATHS.map((bp, i) => ({ id: Date.now() + i, ...bp })) }));
        setTimeout(() => {
          setHeartingIds(h => { const nh = new Set(h); nh.delete(id); return nh; });
          setHeartParticles(prev => { const next = { ...prev }; delete next[id]; return next; });
        }, 700);
      }
      return n;
    });
    if (wasSaved) dispatch(unsaveEvent(id));
    else dispatch(saveEvent(id));
  }

  // Step 1 state
  const [form, setForm] = useState({
    title: '', tagline: '', description: '',
    startDate: '', endDate: '', startTime: '', endTime: '',
    isAllDay: false, category: '', eventType: 'offline',
  });

  // Step 2 state
  const [pricingType, setPricingType] = useState('paid');
  const [tickets, setTickets] = useState([
    { id: '1', name: 'VIP Access',         price: '150', seats: '50',  iconType: 'star'   },
    { id: '2', name: 'General Admission',  price: '45',  seats: '150', iconType: 'ticket' },
    { id: '3', name: 'Early Bird',         price: '30',  seats: '100', iconType: 'clock'  },
  ]);
  const [selectedTicketId, setSelectedTicketId] = useState('1');
  const [showNewForm, setShowNewForm] = useState(true);
  const [newTicket, setNewTicket] = useState({ name: '', description: '', price: '0.00', seats: '100', maxPerUser: '1' });
  const [registration, setRegistration] = useState({ ticketPrice: '150', totalSeats: '', maxPerUser: '4', deadline: '' });

  // Step 3 state
  const [locationTab, setLocationTab] = useState('physical');
  const [venue, setVenue] = useState({ name: '', street: '', city: '', state: '', country: '', pinCode: '' });
  const [parking, setParking] = useState('');
  const [organizer, setOrganizer] = useState({ fullName: '', email: '', phone: '' });
  const [virtual, setVirtual] = useState({ link: '', instructions: '' });

  const [dateErrors, setDateErrors] = useState({ startDate: '', endDate: '', endTime: '' });
  const [stepErrors, setStepErrors] = useState({});
  const todayStr = new Date().toISOString().split('T')[0];

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const next = type === 'checkbox' ? checked : value;
    setForm(prev => {
      const updated = { ...prev, [name]: next };
      const errors = { ...dateErrors };
      if (name === 'startDate') {
        errors.startDate = next && next < todayStr ? 'Start date cannot be in the past' : '';
        const ed = updated.endDate;
        errors.endDate = ed && next && ed < next ? 'End date cannot be before start date' : '';
        if (updated.endTime && updated.startTime) {
          const sameDay = next === updated.endDate;
          errors.endTime = sameDay && updated.endTime < updated.startTime ? 'End time cannot be before start time' : '';
        }
      }
      if (name === 'endDate') {
        const sd = updated.startDate;
        errors.endDate = next && sd && next < sd ? 'End date cannot be before start date' : '';
        if (updated.endTime && updated.startTime) {
          const sameDay = updated.startDate === next;
          errors.endTime = sameDay && updated.endTime < updated.startTime ? 'End time cannot be before start time' : '';
        }
      }
      if (name === 'startTime' || name === 'endTime') {
        const st = name === 'startTime' ? next : updated.startTime;
        const et = name === 'endTime'   ? next : updated.endTime;
        const sameDay = updated.startDate && updated.endDate && updated.startDate === updated.endDate;
        errors.endTime = sameDay && et && st && et < st ? 'End time cannot be before start time' : '';
      }
      setDateErrors(errors);
      return updated;
    });
  }

  function handleNewTicketChange(e) {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  }

  function handleRegistrationChange(e) {
    const { name, value } = e.target;
    setRegistration(prev => ({ ...prev, [name]: value }));
  }

  function saveNewTicket() {
    if (!newTicket.name.trim()) return;
    setTickets(prev => [...prev, { id: Date.now().toString(), name: newTicket.name, price: newTicket.price, iconType: 'ticket' }]);
    setNewTicket({ name: '', description: '', price: '0.00', seats: '100', maxPerUser: '1' });
    setShowNewForm(false);
  }

  function handleBack() {
    setStepErrors({});
    setAnimDir('back');
    if (step === 1) { setShowCreate(false); setStep(1); }
    else setStep(s => s - 1);
  }

  function validateStep(s) {
    const errs = {};
    if (s === 1) {
      if (!form.title.trim())  errs.title     = 'Event title is required.';
      if (!form.category)      errs.category  = 'Please select a category.';
      if (!form.startDate)     errs.startDate = 'Start date is required.';
      if (dateErrors.startDate) errs.startDate = dateErrors.startDate;
      if (dateErrors.endDate)   errs.endDate   = dateErrors.endDate;
      if (dateErrors.endTime)   errs.endTime   = dateErrors.endTime;
    }
    if (s === 2) {
      if (pricingType === 'paid' && tickets.length === 0) {
        errs.tickets = 'Add at least one ticket type for a paid event.';
      }
      if (pricingType === 'paid' && tickets.some(t => !t.name.trim())) {
        errs.tickets = 'All ticket types must have a name.';
      }
      if (pricingType === 'paid' && tickets.some(t => parseFloat(t.price) < 0)) {
        errs.tickets = 'Ticket price cannot be negative.';
      }
    }
    if (s === 3) {
      if (form.eventType === 'offline' || locationTab === 'physical') {
        if (!venue.city.trim()) errs.city = 'City is required for offline events.';
      }
      if (locationTab === 'online' || form.eventType === 'online') {
        if (!virtual.link.trim()) errs.virtualLink = 'Meeting link is required for online events.';
      }
    }
    return errs;
  }

  function handleNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setStepErrors(errs);
      return;
    }
    setStepErrors({});
    setAnimDir('forward');
    if (step < 4) setStep(s => s + 1);
  }

  const baseEvents = discTab === 'booked'    ? bookedEvents
    : discTab === 'favorites' ? savedEvents
    : discTab === 'created'   ? createdEvents
    : rdxEvents;
  const filteredEvents = baseEvents.filter(ev => {
    if (discCat !== 'All' && !ev.category.toLowerCase().includes(discCat.toLowerCase())) return false;
    if (filters.categories.size > 0) {
      const matched = [...filters.categories].some(c => ev.category.toLowerCase().includes(c.toLowerCase()));
      if (!matched) return false;
    }
    if (filters.location.trim() && !ev.location.toLowerCase().includes(filters.location.trim().toLowerCase())) return false;
    return true;
  });

  function openFilter() { setPendingF({ ...filters, categories: new Set(filters.categories), amenities: new Set(filters.amenities) }); setShowFilter(true); }
  function applyFilters() {
    const applied = { ...pendingF, categories: new Set(pendingF.categories), amenities: new Set(pendingF.amenities) };
    setFilters(applied);
    setShowFilter(false);
    if (discTab === 'upcoming') {
      dispatch(fetchEvents({
        tab: 'upcoming',
        category: discCat !== 'All' ? discCat : '',
        eventType: applied.eventType !== 'all' ? applied.eventType : '',
        location: applied.location,
      }));
    }
  }
  function resetFilters() { const def = { eventType: 'all', categories: new Set(), location: '', radius: 25, amenities: new Set() }; setPendingF(def); }
  function togglePendingCat(cat) { setPendingF(p => { const s = new Set(p.categories); s.has(cat) ? s.delete(cat) : s.add(cat); return { ...p, categories: s }; }); }
  function togglePendingAmenity(a) { setPendingF(p => { const s = new Set(p.amenities); s.has(a) ? s.delete(a) : s.add(a); return { ...p, amenities: s }; }); }
  const activeFilterCount = filters.categories.size + filters.amenities.size + (filters.eventType !== 'all' ? 1 : 0) + (filters.location.trim() ? 1 : 0);

  return (
    <div className="ev-page">
      <AnimatedNav
        activeId="events"
        onNavigate={id => {
          if (id === 'create')   { setCreatePostOpen(true); return; }
          if (id === 'home')     onBack?.();
          if (id === 'courses')  onCoursesClick?.();
          if (id === 'library')  onLibraryClick?.();
          if (id === 'events')   { setShowCreate(false); setStep(1); return; }
          if (id === 'friends')  onGroupsClick?.();
          if (id === 'calendar') onCalendarClick?.();
          if (id === 'messages')  onMessagesClick?.();
          if (id === 'minisites') onMinisitesClick?.();
        }}
      />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      {/* ── Event detail view ── */}
      {!showCreate && selectedEvent && (
        <div className="ev-detail-page">

          {/* Cover image */}
          <div className="ev-detail-cover">
            <EventCarousel key={selectedEvent.id} images={getEventImages(selectedEvent)} alt={selectedEvent.title} />
            <button className="ev-detail-cover-back-btn" onClick={() => eventFromHome ? onBack?.() : setSelectedEvent(null)} title="Back to Events">
              <BackArrowIcon />
            </button>
          </div>

          {/* Hero row: calendar badge + info */}
          <div className="ev-detail-hero">
            <div className="ev-detail-cal-badge">
              <div className="ev-detail-cal-top">{selectedEvent.month}</div>
              <div className="ev-detail-cal-day">{selectedEvent.day}</div>
            </div>
            <div className="ev-detail-hero-info">
              <p className="ev-detail-datetime">{selectedEvent.fullDate}</p>
              <h1 className="ev-detail-title">{selectedEvent.title}</h1>
              <p className="ev-detail-location"><MapPinIcon /> {selectedEvent.location}</p>
            </div>
          </div>

          {/* Tabs + action row */}
          <div className="ev-detail-tab-row">
            <div className="ev-detail-tabs">
              <button
                className={`ev-detail-tab${evDetailTab === 'about' ? ' ev-detail-tab--active' : ''}`}
                onClick={() => setEvDetailTab('about')}
              >About</button>
              <button
                className={`ev-detail-tab${evDetailTab === 'discussion' ? ' ev-detail-tab--active' : ''}`}
                onClick={() => setEvDetailTab('discussion')}
              >Discussion</button>
            </div>
            <div className="ev-detail-actions">
              {selectedEvent._sourceTab === 'created' ? (
                <button className="ev-detail-going-btn">
                  <EditIcon /> Edit Event
                </button>
              ) : (
                <button
                  className={`ev-detail-going-btn${goingIds.has(selectedEvent.id) ? ' ev-detail-going-btn--active' : ''}`}
                  disabled={bookingLoading}
                  onClick={() => {
                    const isGoing = goingIds.has(selectedEvent.id);
                    setGoingIds(s => { const n = new Set(s); isGoing ? n.delete(selectedEvent.id) : n.add(selectedEvent.id); return n; });
                    if (isGoing) {
                      dispatch(cancelBooking(selectedEvent.id)).then(action => {
                        if (cancelBooking.rejected.match(action)) {
                          setGoingIds(s => { const n = new Set(s); n.add(selectedEvent.id); return n; });
                          dispatch(showToast({ message: action.payload ?? 'Failed to cancel booking.', type: 'error' }));
                        } else {
                          dispatch(showToast({ message: 'Booking cancelled.', type: 'success' }));
                        }
                      });
                    } else {
                      dispatch(bookEvent({ eventId: selectedEvent.id })).then(action => {
                        if (bookEvent.rejected.match(action)) {
                          setGoingIds(s => { const n = new Set(s); n.delete(selectedEvent.id); return n; });
                          dispatch(showToast({ message: action.payload ?? 'Booking failed.', type: 'error' }));
                        } else {
                          dispatch(showToast({ message: 'Booking confirmed!', type: 'success' }));
                        }
                      });
                    }
                  }}
                >
                  {goingIds.has(selectedEvent.id) && <CheckIcon />}
                  {goingIds.has(selectedEvent.id) ? 'Going' : 'Going?'}
                  <ChevronDownIcon />
                </button>
              )}
              <div className="ev-more-wrap">
                <button className="ev-detail-more-btn" onClick={() => setMoreOpen(v => !v)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                </button>
                {moreOpen && (
                  <>
                    <div className="ev-more-backdrop" onClick={() => setMoreOpen(false)} />
                    <div className="ev-more-menu">
                      <div className="ev-more-link-row">
                        <div className="ev-more-icon"><LinkIcon /></div>
                        <div>
                          <p className="ev-more-link-url">https://kick.me/e/{selectedEvent.id}</p>
                          <p className="ev-more-link-sub">Share this link to invite others</p>
                        </div>
                      </div>
                      <div className="ev-more-divider" />
                      {(selectedEvent._sourceTab === 'created' ? [
                        { icon: <EditIcon />,     label: 'Edit Event' },
                        { icon: <BookmarkIcon />, label: 'Save' },
                        { icon: <CalendarIcon />, label: 'Add to Calendar' },
                        { icon: <FlagIcon />,     label: 'Cancel Event' },
                      ] : [
                        { icon: <BookmarkIcon />, label: 'Save' },
                        { icon: <BellIcon />,     label: 'Notification settings' },
                        { icon: <UnfollowIcon />, label: 'Unfollow event' },
                        { icon: <CalendarIcon />, label: 'Add to Calendar' },
                        { icon: <FlagIcon />,     label: 'Report Event' },
                      ]).map(item => (
                        <button key={item.label} className="ev-more-item" onClick={() => setMoreOpen(false)}>
                          <span className="ev-more-item-icon">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Body: main + map sidebar */}
          <div className="ev-detail-body">

            {/* About tab */}
            {evDetailTab === 'about' && (
              <>
                <div className="ev-detail-main">

                  {/* Details card */}
                  <div className="ev-detail-card">
                    <h3 className="ev-detail-card-title">Details</h3>
                    <div className="ev-detail-responded-row">
                      <div className="ev-detail-avatars">
                        {RESPONDED_AVATARS.map((src, i) => (
                          <img key={i} src={src} alt="" className="ev-detail-resp-av" />
                        ))}
                      </div>
                      <span className="ev-detail-responded-txt">{selectedEvent.responded} people responded</span>
                    </div>
                  </div>

                  {/* About card */}
                  <div className="ev-detail-card">
                    <h3 className="ev-detail-card-title">About the Event</h3>
                    <p className="ev-detail-about-text">{selectedEvent.about}</p>
                  </div>

                  {/* Event info card */}
                  <div className="ev-detail-card">
                    <h3 className="ev-detail-card-title">Event Info</h3>
                    <div className="ev-detail-info-rows">
                      <div className="ev-detail-info-row"><CalendarIcon /><span>{selectedEvent.fullDate}</span></div>
                      <div className="ev-detail-info-row"><MapPinIcon /><span>{selectedEvent.venue || selectedEvent.location}</span></div>
                      <div className="ev-detail-info-row"><span className="ev-detail-cat-pill" style={{ background: selectedEvent.catColor + '22', color: selectedEvent.catColor, border: `1px solid ${selectedEvent.catColor}44` }}>{selectedEvent.category}</span></div>
                    </div>
                  </div>

                </div>

                {/* Map sidebar */}
                <div className="ev-detail-sidebar">
                  <div className="ev-detail-map-card">
                    <div className="ev-detail-map-bg">
                      <div className="ev-detail-map-overlay">
                        <span className="ev-detail-map-label"><MapPinIcon /> {selectedEvent.location}</span>
                      </div>
                    </div>
                    <div className="ev-detail-map-footer">
                      <p className="ev-detail-map-venue">{selectedEvent.venue || selectedEvent.location}</p>
                      <button className="ev-detail-map-btn"><ExternalLinkIcon /> Open in Maps</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Discussion tab */}
            {evDetailTab === 'discussion' && (
              <>
                {/* Left: comment feed */}
                <div className="ev-detail-main">

                  {/* Compose */}
                  <div className="ev-disc-compose">
                    {authUser?.avatar
                      ? <img src={authUser.avatar} alt="you" className="ev-disc-compose-av" />
                      : <div className="ev-disc-compose-av" style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{(authUser?.fullName ?? 'U')[0]}</div>
                    }
                    <input
                      className="ev-disc-compose-input"
                      placeholder="Write a comment…"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && comment.trim()) {
                          const text = comment.trim();
                          const temp = { id: `temp_${Date.now()}`, name: authUser?.fullName ?? 'You', avatar: authUser?.avatar ?? null, time: 'Just now', text, likes: 0 };
                          setComments(c => [temp, ...c]);
                          setComment('');
                          dispatch(postComment({ eventId: selectedEvent.id, text })).then(action => {
                            if (postComment.fulfilled.match(action)) {
                              setComments(c => [action.payload.comment, ...c.filter(x => x.id !== temp.id)]);
                            } else {
                              setComments(c => c.filter(x => x.id !== temp.id));
                            }
                          });
                        }
                      }}
                    />
                    <button className="ev-disc-send-btn" onClick={() => {
                      if (!comment.trim()) return;
                      const text = comment.trim();
                      const temp = { id: `temp_${Date.now()}`, name: authUser?.fullName ?? 'You', avatar: authUser?.avatar ?? null, time: 'Just now', text, likes: 0 };
                      setComments(c => [temp, ...c]);
                      setComment('');
                      dispatch(postComment({ eventId: selectedEvent.id, text })).then(action => {
                        if (postComment.fulfilled.match(action)) {
                          setComments(c => [action.payload.comment, ...c.filter(x => x.id !== temp.id)]);
                        } else {
                          setComments(c => c.filter(x => x.id !== temp.id));
                        }
                      });
                    }}><SendIcon /></button>
                  </div>

                  {/* Comments list */}
                  <div className="ev-disc-comments">
                    {comments.map(c => (
                      <div key={c.id} className="ev-disc-comment">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="ev-disc-comment-av"
                          style={{ cursor: c._id ? 'pointer' : 'default' }}
                          onClick={() => onUserClick?.(c._id)}
                        />
                        <div className="ev-disc-comment-body">
                          <div className="ev-disc-comment-bubble">
                            <span
                              className="ev-disc-comment-name"
                              style={{ cursor: c._id ? 'pointer' : 'default' }}
                              onClick={() => onUserClick?.(c._id)}
                            >
                              {c.name}
                            </span>
                            <p className="ev-disc-comment-text">{c.text}</p>
                          </div>
                          <div className="ev-disc-comment-meta">
                            <span>{c.time}</span>
                            <button className="ev-disc-like-btn" onClick={() => dispatch(likeComment({ eventId: selectedEvent.id, commentId: c.id }))}><ThumbUpIcon /> {c.likes > 0 ? c.likes : 'Like'}</button>
                            <button className="ev-disc-reply-btn">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Right: description sidebar */}
                <div className="ev-detail-sidebar">

                  <div className="ev-detail-card">
                    <h3 className="ev-detail-card-title">Description</h3>

                    <div className="ev-detail-info-rows" style={{ marginBottom: 16 }}>
                      <div className="ev-detail-info-row">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <span>{selectedEvent.responded} people responded</span>
                      </div>
                      <div className="ev-detail-info-row">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Alex Vanguard's Event</span>
                      </div>
                      <div className="ev-detail-info-row">
                        <MapPinIcon />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="ev-detail-info-row">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        <span>Public · Anyone can join</span>
                      </div>
                    </div>

                    <p className="ev-detail-about-text">{selectedEvent.about}</p>

                    {selectedEvent.category && (
                      <div style={{ marginTop: 14 }}>
                        <span className="ev-detail-cat-pill" style={{ background: selectedEvent.catColor + '22', color: selectedEvent.catColor, border: `1px solid ${selectedEvent.catColor}44` }}>
                          {selectedEvent.category}
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ── Discovery view ── */}
      {!showCreate && !selectedEvent && (
        <div className="ev-disc-main">
          {/* Top bar */}
          <div className="ev-disc-topbar">
            <div className="ev-disc-tabs">
              <button className={`ev-disc-tab${discTab === 'upcoming' ? ' ev-disc-tab--active' : ''}`} onClick={() => setDiscTab('upcoming')}>Upcoming Events</button>
              <button className={`ev-disc-tab${discTab === 'booked' ? ' ev-disc-tab--active' : ''}`} onClick={() => setDiscTab('booked')}>My Booked Events</button>
              <button className={`ev-disc-tab${discTab === 'favorites' ? ' ev-disc-tab--active' : ''}`} onClick={() => setDiscTab('favorites')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={discTab === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Favorites{savedIds.size > 0 && <span className="ev-fav-count">{savedIds.size}</span>}
              </button>
              <button className={`ev-disc-tab${discTab === 'created' ? ' ev-disc-tab--active' : ''}`} onClick={() => { setDiscTab('created'); setSelectedEvent(null); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
                My Created Events{createdEvents.length > 0 && <span className="ev-fav-count">{createdEvents.length}</span>}
              </button>
            </div>
            <div className="ev-disc-topbar-right">
              <button className="ev-disc-create-btn" onClick={() => { setStep(1); setShowCreate(true); }}>
                <PlusIcon /> Create Event
              </button>
              <button className={`ev-disc-filter-btn${activeFilterCount > 0 ? ' ev-disc-filter-btn--active' : ''}`} onClick={openFilter}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters{activeFilterCount > 0 && <span className="ev-filter-badge">{activeFilterCount}</span>}
              </button>
              <div className="ev-disc-view-toggle">
                <button className={`ev-disc-view-btn${viewMode === 'grid' ? ' ev-disc-view-btn--active' : ''}`} onClick={() => setViewMode('grid')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button className={`ev-disc-view-btn${viewMode === 'list' ? ' ev-disc-view-btn--active' : ''}`} onClick={() => setViewMode('list')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Category chips */}
          <div className="ev-disc-cats">
            {DISC_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`ev-disc-cat${discCat === cat ? ' ev-disc-cat--active' : ''}`}
                onClick={() => setDiscCat(cat)}
              >{cat}</button>
            ))}
          </div>

          {/* Event cards — grid or list */}
          {filteredEvents.length === 0 && (
            <div className="ev-disc-empty">
              {discTab === 'favorites' ? (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <p>No favourites yet — tap the heart on any event to save it here.</p>
                </>
              ) : (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <p>No events found{activeFilterCount > 0 ? ' — try clearing some filters' : ''}.</p>
                </>
              )}
            </div>
          )}
          <div className={viewMode === 'grid' ? 'ev-disc-grid' : 'ev-disc-list'}>
            {filteredEvents.map(ev => viewMode === 'grid' ? (
              <div key={ev.id} className="ev-disc-card ev-disc-card--clickable" onClick={() => { setSelectedEvent({ ...ev, _sourceTab: discTab }); setEvDetailTab('about'); }}>
                <div className="ev-disc-card-img-wrap">
                  <img src={ev.img} alt={ev.title} className="ev-disc-card-img" />
                  <div className="ev-disc-date-badge">
                    <span className="ev-disc-date-day">{ev.day}</span>
                    <span className="ev-disc-date-month">{ev.month}</span>
                  </div>
                  <div className="ev-heart-burst-wrap">
                    <button
                      className={`ev-disc-save-btn${savedIds.has(ev.id) ? ' ev-disc-save-btn--saved' : ''}${heartingIds.has(ev.id) ? ' ev-disc-save-btn--spring' : ''}`}
                      onClick={e => { e.stopPropagation(); toggleSave(ev.id); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={savedIds.has(ev.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                    {(heartParticles[ev.id] || []).map(p => (
                      <span key={p.id} className="ev-heart-particle" style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg` }}>❤️</span>
                    ))}
                  </div>
                </div>
                <div className="ev-disc-card-body">
                  <span className="ev-disc-cat-pill" style={{ background: ev.catColor + '22', color: ev.catColor, border: `1px solid ${ev.catColor}44` }}>{ev.category}</span>
                  <p className="ev-disc-card-loc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {ev.location}</p>
                  <p className="ev-disc-card-title">{ev.title}</p>
                  <p className="ev-disc-card-desc">{ev.desc}</p>
                  <div className="ev-disc-card-footer">
                    <div className="ev-disc-card-meta">
                      <span className="ev-disc-attending">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {ev.attending} attending
                      </span>
                      {ev.seats && <span className="ev-disc-seats">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
                        {ev.seats}
                      </span>}
                    </div>
                    {ev.soldOut
                      ? <button className="ev-disc-book-btn ev-disc-book-btn--sold" onClick={e => e.stopPropagation()}>Sold Out</button>
                      : <button className={`ev-disc-book-btn${discTab === 'booked' ? ' ev-disc-book-btn--booked' : ''}${discTab === 'created' ? ' ev-disc-book-btn--manage' : ''}`} onClick={discTab === 'created' ? undefined : e => e.stopPropagation()}>{discTab === 'created' ? 'Manage Event' : discTab === 'booked' ? 'Booked' : 'Book Now'}</button>
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div key={ev.id} className="ev-list-card ev-disc-card--clickable" onClick={() => { setSelectedEvent({ ...ev, _sourceTab: discTab }); setEvDetailTab('about'); }}>
                <div className="ev-list-img-wrap">
                  <img src={ev.img} alt={ev.title} className="ev-list-img" />
                  <div className="ev-disc-date-badge ev-list-date-badge">
                    <span className="ev-disc-date-day">{ev.day}</span>
                    <span className="ev-disc-date-month">{ev.month}</span>
                  </div>
                </div>
                <div className="ev-list-body">
                  <div className="ev-list-top">
                    <span className="ev-disc-cat-pill" style={{ background: ev.catColor + '22', color: ev.catColor, border: `1px solid ${ev.catColor}44` }}>{ev.category}</span>
                    <p className="ev-disc-card-loc"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {ev.location}</p>
                  </div>
                  <p className="ev-disc-card-title">{ev.title}</p>
                  <p className="ev-list-desc">{ev.desc}</p>
                  <div className="ev-disc-card-footer">
                    <div className="ev-disc-card-meta">
                      <span className="ev-disc-attending">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {ev.attending} attending
                      </span>
                      {ev.seats && <span className="ev-disc-seats">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
                        {ev.seats}
                      </span>}
                    </div>
                    <div className="ev-list-actions">
                      <div className="ev-heart-burst-wrap">
                        <button className={`ev-disc-save-btn${savedIds.has(ev.id) ? ' ev-disc-save-btn--saved' : ''}${heartingIds.has(ev.id) ? ' ev-disc-save-btn--spring' : ''}`} onClick={e => { e.stopPropagation(); toggleSave(ev.id); }} style={{ position: 'static', background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '6px 10px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={savedIds.has(ev.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        </button>
                        {(heartParticles[ev.id] || []).map(p => (
                          <span key={p.id} className="ev-heart-particle" style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg` }}>❤️</span>
                        ))}
                      </div>
                      {ev.soldOut
                        ? <button className="ev-disc-book-btn ev-disc-book-btn--sold" onClick={e => e.stopPropagation()}>Sold Out</button>
                        : <button className={`ev-disc-book-btn${discTab === 'booked' ? ' ev-disc-book-btn--booked' : ''}${discTab === 'created' ? ' ev-disc-book-btn--manage' : ''}`} onClick={discTab === 'created' ? undefined : e => e.stopPropagation()}>{discTab === 'created' ? 'Manage Event' : discTab === 'booked' ? 'Booked' : 'Book Now'}</button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter strip */}
          <div className="ev-disc-newsletter">
            <div className="ev-disc-nl-left">
              <p className="ev-disc-nl-title">Never miss an event that matters to your network.</p>
              <p className="ev-disc-nl-sub">Join 50,000+ professionals and creators receiving weekly updates on the best events in their area.</p>
            </div>
            <div className="ev-disc-nl-right">
              <input className="ev-disc-nl-input" type="email" placeholder="Enter your email" />
              <button className="ev-disc-nl-btn">Subscribe Now</button>
            </div>
          </div>

        </div>
      )}

      {/* ── Filter panel overlay (outside scroll container) ── */}
      {showFilter && (
        <>
          <div className="ev-filter-backdrop" onClick={() => setShowFilter(false)} />
          <div className="ev-filter-panel">
                <div className="ev-filter-panel-header">
                  <span className="ev-filter-panel-title">Refine Discovery</span>
                  <div className="ev-filter-header-actions">
                    <button className="ev-filter-reset-btn" onClick={resetFilters}>Reset All</button>
                    <button className="ev-filter-apply-btn" onClick={applyFilters}>Apply Filters</button>
                    <button className="ev-filter-close-btn" onClick={() => setShowFilter(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>
                <div className="ev-filter-panel-body">
                  {/* Event Type */}
                  <div className="ev-filter-section">
                    <h4 className="ev-filter-section-title">Event Type</h4>
                    <div className="ev-filter-type-row">
                      {['all', 'offline', 'online'].map(t => (
                        <button
                          key={t}
                          className={`ev-filter-type-btn${pendingF.eventType === t ? ' ev-filter-type-btn--active' : ''}`}
                          onClick={() => setPendingF(p => ({ ...p, eventType: t }))}
                        >
                          {t === 'all' ? 'All' : t === 'offline' ? <><OfflineIcon /> In-Person</> : <><OnlineIcon /> Online</>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="ev-filter-section">
                    <div className="ev-filter-section-head">
                      <h4 className="ev-filter-section-title">Categories</h4>
                      {pendingF.categories.size > 0 && <button className="ev-filter-clear-link" onClick={() => setPendingF(p => ({ ...p, categories: new Set() }))}>Clear all</button>}
                    </div>
                    <div className="ev-filter-cats-grid">
                      {['Music', 'Business', 'Tech & Startup', 'Art & Design', 'Workshop', 'Social', 'Sports', 'Food & Drink', 'Health & Wellness'].map(cat => (
                        <label key={cat} className="ev-filter-check-label">
                          <input
                            type="checkbox"
                            className="ev-filter-checkbox"
                            checked={pendingF.categories.has(cat)}
                            onChange={() => togglePendingCat(cat)}
                          />
                          <span className="ev-filter-check-box" />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="ev-filter-section">
                    <h4 className="ev-filter-section-title">Location</h4>
                    <div className="ev-filter-location-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <input
                        className="ev-filter-location-input"
                        placeholder="Enter city (e.g. San Francisco, CA)"
                        value={pendingF.location}
                        onChange={e => setPendingF(p => ({ ...p, location: e.target.value }))}
                      />
                    </div>
                    <div className="ev-filter-slider-row">
                      <span className="ev-filter-slider-label">Distance Radius</span>
                      <span className="ev-filter-slider-val">{pendingF.radius} km</span>
                    </div>
                    <div className="ev-filter-slider-track">
                      <input
                        type="range" min="1" max="100" step="1"
                        value={pendingF.radius}
                        className="ev-filter-slider"
                        style={{ background: `linear-gradient(to right, #2563eb ${pendingF.radius}%, #1a2540 ${pendingF.radius}%)` }}
                        onChange={e => setPendingF(p => ({ ...p, radius: Number(e.target.value) }))}
                      />
                      <div className="ev-filter-slider-range-labels">
                        <span>1 km</span><span>100 km</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="ev-filter-section">
                    <h4 className="ev-filter-section-title">Amenities</h4>
                    <div className="ev-filter-amenities-grid">
                      {[
                        { id: 'parking',    label: 'Parking Available' },
                        { id: 'accessible', label: 'Wheelchair Accessible' },
                        { id: 'streaming',  label: 'Live Streaming' },
                        { id: 'food',       label: 'Food & Beverage' },
                        { id: 'wifi',       label: 'Free Wi-Fi' },
                        { id: 'recording',  label: 'Session Recording' },
                      ].map(a => (
                        <label key={a.id} className="ev-filter-check-label">
                          <input
                            type="checkbox"
                            className="ev-filter-checkbox"
                            checked={pendingF.amenities.has(a.id)}
                            onChange={() => togglePendingAmenity(a.id)}
                          />
                          <span className="ev-filter-check-box" />
                          {a.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

      {/* ── Create event form ── */}
      {showCreate && (
      <div className="ev-main">
        {/* Stepper */}
        <div className="ev-stepper">
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: i < STEPS.length - 1 ? 1 : 0 }}>
              <div className="ev-step-col">
                <div className={`ev-step-circle${step >= s.id ? ' ev-step-circle--active' : ''}`}>{s.id}</div>
                <span className={`ev-step-label${step >= s.id ? ' ev-step-label--active' : ''}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`ev-step-line${step > s.id ? ' ev-step-line--done' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="ev-form-card">
          <div key={step} className={`ev-step-content ev-step-content--${animDir}`}>
          {step === 1 && (
            <>
              <div className="ev-form-header">
                <h2 className="ev-form-title">Step 1: Basic Information</h2>
                <p className="ev-form-subtitle">
                  Set the foundation for your event with essential details that help attendees discover what you're planning.
                </p>
              </div>

              <div className="ev-form-body">
                {/* Title + Tagline */}
                <div className="ev-field-row">
                  <div className="ev-field">
                    <label className="ev-label">Event Title <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      className={`ev-input${stepErrors.title ? ' ev-input--error' : ''}`}
                      name="title"
                      value={form.title}
                      onChange={e => { handleChange(e); if (stepErrors.title) setStepErrors(p => ({ ...p, title: '' })); }}
                      placeholder="e.g. Summer Music Festival 2024"
                    />
                    {stepErrors.title && <span className="ev-field-error">{stepErrors.title}</span>}
                  </div>
                  <div className="ev-field">
                    <label className="ev-label">Short Tagline</label>
                    <input
                      className="ev-input"
                      name="tagline"
                      value={form.tagline}
                      onChange={handleChange}
                      placeholder="A catchy one-liner for your event"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="ev-field">
                  <label className="ev-label">Description / About Event</label>
                  <textarea
                    className="ev-textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell your audience what makes this event special..."
                    rows={5}
                  />
                </div>

                {/* Date & Time */}
                <div>
                  <div className="ev-section-header">
                    <span className="ev-section-title">Date & Time</span>
                    <label className="ev-toggle-label">
                      All Day Event
                      <span className="ev-toggle">
                        <input
                          type="checkbox"
                          name="isAllDay"
                          checked={form.isAllDay}
                          onChange={handleChange}
                        />
                        <span className="ev-toggle-slider" />
                      </span>
                    </label>
                  </div>
                  <div className="ev-date-grid">
                    <div className="ev-field">
                      <label className="ev-label ev-label--small">Start Date <span style={{ color: '#ef4444' }}>*</span></label>
                      <CustomDatePicker name="startDate" value={form.startDate} min={todayStr} onChange={e => { handleChange(e); if (stepErrors.startDate) setStepErrors(p => ({ ...p, startDate: '' })); }} placeholder="Pick start date" hasError={!!dateErrors.startDate || !!stepErrors.startDate} />
                      {(dateErrors.startDate || stepErrors.startDate) && <span className="ev-field-error">{dateErrors.startDate || stepErrors.startDate}</span>}
                    </div>
                    <div className="ev-field">
                      <label className="ev-label ev-label--small">End Date</label>
                      <CustomDatePicker name="endDate" value={form.endDate} min={form.startDate || todayStr} onChange={handleChange} placeholder="Pick end date" hasError={!!dateErrors.endDate} />
                      {dateErrors.endDate && <span className="ev-field-error">{dateErrors.endDate}</span>}
                    </div>
                    <div className="ev-field">
                      <label className="ev-label ev-label--small" style={{ opacity: form.isAllDay ? 0.4 : 1 }}>Start Time</label>
                      <CustomTimePicker name="startTime" value={form.startTime} onChange={handleChange} disabled={form.isAllDay} placeholder="Pick start time" />
                    </div>
                    <div className="ev-field">
                      <label className="ev-label ev-label--small" style={{ opacity: form.isAllDay ? 0.4 : 1 }}>End Time</label>
                      <CustomTimePicker name="endTime" value={form.endTime} onChange={handleChange} disabled={form.isAllDay} placeholder="Pick end time" min={form.startDate === form.endDate ? form.startTime : undefined} hasError={!!dateErrors.endTime} />
                      {dateErrors.endTime && <span className="ev-field-error">{dateErrors.endTime}</span>}
                    </div>
                  </div>
                </div>

                {/* Category + Event Type */}
                <div className="ev-field-row">
                  <div className="ev-field">
                    <label className="ev-label">Event Category <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className={`ev-select-wrap${stepErrors.category ? ' ev-select-wrap--error' : ''}`}>
                      <select className="ev-select" name="category" value={form.category} onChange={e => { handleChange(e); if (stepErrors.category) setStepErrors(p => ({ ...p, category: '' })); }}>
                        <option value="">Select a category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDownIcon />
                    </div>
                    {stepErrors.category && <span className="ev-field-error">{stepErrors.category}</span>}
                  </div>
                  <div className="ev-field">
                    <label className="ev-label">Event Type</label>
                    <div className="ev-type-buttons">
                      {EVENT_TYPES.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          className={`ev-type-btn${form.eventType === t.id ? ' ev-type-btn--active' : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, eventType: t.id }))}
                        >
                          {t.icon}
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Cover Image */}
                <div className="ev-field">
                  <label className="ev-label">Cover Image</label>
                  <label className="ev-cover-upload-label" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '14px 18px', background: 'rgba(255,255,255,0.03)' }}>
                    {coverImagePreview
                      ? <img src={coverImagePreview} alt="cover preview" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 80, height: 50, background: 'rgba(255,255,255,0.06)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 22 }}>+</div>
                    }
                    <div>
                      <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{coverImagePreview ? 'Change cover image' : 'Upload cover image'}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Recommended: 1200 × 628 px · JPG, PNG, WebP</p>
                    </div>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
                  </label>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="ev-form-header">
                <h2 className="ev-form-title">Step 2: Plans & Pricing</h2>
                <p className="ev-form-subtitle">Configure ticket types and pricing options for your attendees.</p>
              </div>

              <div className="ev-s2-layout">
                {/* Left: ticket list + new form */}
                <div className="ev-s2-left">
                  {/* Free / Paid toggle */}
                  <div className="ev-free-paid-toggle">
                    <button
                      type="button"
                      className={`ev-fp-btn${pricingType === 'free' ? ' ev-fp-btn--active' : ''}`}
                      onClick={() => setPricingType('free')}
                    >
                      Free
                    </button>
                    <button
                      type="button"
                      className={`ev-fp-btn${pricingType === 'paid' ? ' ev-fp-btn--active' : ''}`}
                      onClick={() => setPricingType('paid')}
                    >
                      Paid
                    </button>
                  </div>

                  {/* Section title */}
                  <p className="ev-s2-section-title">Ticket Types</p>

                  {/* Ticket list */}
                  <div className="ev-ticket-list">
                    {tickets.map(tk => {
                      const isActive = selectedTicketId === tk.id;
                      return (
                        <div
                          key={tk.id}
                          className={`ev-ticket-item${isActive ? ' ev-ticket-item--active' : ''}`}
                          onClick={() => {
                            setSelectedTicketId(tk.id);
                            setRegistration(prev => ({ ...prev, ticketPrice: tk.price }));
                          }}
                        >
                          <div className="ev-ticket-icon">{TICKET_ICONS[tk.iconType]}</div>
                          <p className="ev-ticket-name">{tk.name}</p>
                          <p className={`ev-ticket-price${isActive ? ' ev-ticket-price--active' : ''}`}>${Number(tk.price).toFixed(2)}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* New ticket form */}
                  {showNewForm && (
                    <div className="ev-new-ticket-form">
                      <div className="ev-new-ticket-header">
                        <span>New Ticket Type</span>
                        <button type="button" className="ev-cancel-ticket-btn" onClick={() => setShowNewForm(false)}>✕</button>
                      </div>
                      <div className="ev-new-ticket-body">
                        <div className="ev-field">
                          <label className="ev-label ev-label--small">Ticket Name</label>
                          <input className="ev-input" name="name" value={newTicket.name} onChange={handleNewTicketChange} placeholder="e.g. Student Discount" />
                        </div>
                        <div className="ev-field">
                          <label className="ev-label ev-label--small">Description</label>
                          <textarea className="ev-textarea ev-textarea--sm" name="description" value={newTicket.description} onChange={handleNewTicketChange} placeholder="e.g. Valid ID required at entry" rows={3} />
                        </div>
                        <div className="ev-field-row">
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">Price ($)</label>
                            <input className="ev-input" name="price" type="number" min="0" value={newTicket.price} onChange={handleNewTicketChange} />
                          </div>
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">Total Seats</label>
                            <input className="ev-input" name="seats" type="number" min="1" value={newTicket.seats} onChange={handleNewTicketChange} placeholder="e.g. 50" />
                          </div>
                        </div>
                        <div className="ev-field">
                          <label className="ev-label ev-label--small">Max Tickets Per User</label>
                          <div className="ev-select-wrap">
                            <select className="ev-select" name="maxPerUser" value={newTicket.maxPerUser} onChange={handleNewTicketChange}>
                              {MAX_PER_USER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <ChevronDownIcon />
                          </div>
                        </div>
                        <div className="ev-new-ticket-actions">
                          <button type="button" className="ev-save-ticket-btn" onClick={saveNewTicket}>Save Ticket</button>
                          <button type="button" className="ev-cancel-ticket-btn-text" onClick={() => setShowNewForm(false)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add another — always visible */}
                  <button type="button" className="ev-add-ticket-btn" onClick={() => setShowNewForm(true)}>
                    <PlusIcon /> Add Another Ticket Type
                  </button>
                  {stepErrors.tickets && <p className="ev-field-error" style={{ marginTop: 8 }}>{stepErrors.tickets}</p>}
                </div>

              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="ev-form-header">
                <h2 className="ev-form-title">Location &amp; Logistics</h2>
              </div>

              <div className="ev-form-body">
                {/* Physical / Online tab toggle */}
                <div className="ev-loc-tabs">
                  <button
                    type="button"
                    className={`ev-loc-tab${locationTab === 'physical' ? ' ev-loc-tab--active' : ''}`}
                    onClick={() => setLocationTab('physical')}
                  >
                    Physical Event
                  </button>
                  <button
                    type="button"
                    className={`ev-loc-tab${locationTab === 'online' ? ' ev-loc-tab--active' : ''}`}
                    onClick={() => setLocationTab('online')}
                  >
                    Online Event
                  </button>
                </div>

                {locationTab === 'physical' && (
                  <>
                    {/* Venue Information */}
                    <div className="ev-loc-section">
                      <div className="ev-loc-section-title">
                        <MapPinIcon /> Venue Information
                      </div>
                      <div className="ev-loc-section-body">
                        <div className="ev-field">
                          <label className="ev-label ev-label--small">Venue Name</label>
                          <input className="ev-input" value={venue.name} onChange={e => setVenue(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Grand Plaza Convention Center" />
                        </div>
                        <div className="ev-field">
                          <label className="ev-label ev-label--small">Street Address</label>
                          <input className="ev-input" value={venue.street} onChange={e => setVenue(p => ({ ...p, street: e.target.value }))} placeholder="123 Event Lane, Downtown" />
                        </div>
                        <div className="ev-field-row">
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">City <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                              className={`ev-input${stepErrors.city ? ' ev-input--error' : ''}`}
                              value={venue.city}
                              onChange={e => { setVenue(p => ({ ...p, city: e.target.value })); if (stepErrors.city) setStepErrors(p => ({ ...p, city: '' })); }}
                              placeholder="City"
                            />
                            {stepErrors.city && <span className="ev-field-error">{stepErrors.city}</span>}
                          </div>
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">State / Province</label>
                            <input className="ev-input" value={venue.state} onChange={e => setVenue(p => ({ ...p, state: e.target.value }))} placeholder="State" />
                          </div>
                        </div>
                        <div className="ev-field-row">
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">Country</label>
                            <input className="ev-input" value={venue.country} onChange={e => setVenue(p => ({ ...p, country: e.target.value }))} placeholder="Country" />
                          </div>
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">Pin Code / ZIP</label>
                            <input className="ev-input" value={venue.pinCode} onChange={e => setVenue(p => ({ ...p, pinCode: e.target.value }))} placeholder="000000" />
                          </div>
                        </div>
                        {/* Map preview */}
                        <div className="ev-map-preview">
                          <div className="ev-map-bg" />
                          <div className="ev-map-actions">
                            <button type="button" className="ev-map-pin-btn"><PinMapIcon /> Pin location on map</button>
                            <button type="button" className="ev-map-open-btn"><ExternalLinkIcon /> Open Interactive Map</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parking & Accessibility */}
                    <div className="ev-loc-section">
                      <div className="ev-loc-section-title">
                        <ParkingIcon /> Parking &amp; Accessibility
                      </div>
                      <div className="ev-loc-section-body">
                        <div className="ev-field">
                          <label className="ev-label ev-label--small">Parking Details</label>
                          <textarea
                            className="ev-textarea"
                            value={parking}
                            onChange={e => setParking(e.target.value)}
                            placeholder="Describe parking availability, valet services, or nearby public transit options..."
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Organizer Details */}
                    <div className="ev-loc-section">
                      <div className="ev-loc-section-title">
                        <OrganizerIcon /> Organizer Details
                      </div>
                      <div className="ev-loc-section-body">
                        <div className="ev-field">
                          <label className="ev-label ev-label--small">Full Name</label>
                          <input className="ev-input" value={organizer.fullName} onChange={e => setOrganizer(p => ({ ...p, fullName: e.target.value }))} placeholder="John Doe" />
                        </div>
                        <div className="ev-field-row">
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">Email Address</label>
                            <input className="ev-input" type="email" value={organizer.email} onChange={e => setOrganizer(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
                          </div>
                          <div className="ev-field">
                            <label className="ev-label ev-label--small">Phone Number</label>
                            <input className="ev-input" type="tel" value={organizer.phone} onChange={e => setOrganizer(p => ({ ...p, phone: e.target.value }))} placeholder="+1(555) 000-0000" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {locationTab === 'online' && (
                  <div className="ev-loc-section">
                    <div className="ev-loc-section-title">
                      <MonitorIcon /> Virtual Access
                    </div>
                    <div className="ev-loc-section-body">
                      <div className="ev-field">
                        <label className="ev-label ev-label--small">Meeting Link / Platform <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          className={`ev-input${stepErrors.virtualLink ? ' ev-input--error' : ''}`}
                          value={virtual.link}
                          onChange={e => { setVirtual(p => ({ ...p, link: e.target.value })); if (stepErrors.virtualLink) setStepErrors(p => ({ ...p, virtualLink: '' })); }}
                          placeholder="https://zoom.us/j/..."
                        />
                        {stepErrors.virtualLink && <span className="ev-field-error">{stepErrors.virtualLink}</span>}
                      </div>
                      <div className="ev-field">
                        <label className="ev-label ev-label--small">Instructions for Joiners</label>
                        <input className="ev-input" value={virtual.instructions} onChange={e => setVirtual(p => ({ ...p, instructions: e.target.value }))} placeholder="Password will be sent via email" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 4 && (
            <div className="ev-s4-wrap">
              {/* Main review cards */}
              <div className="ev-s4-main">
                <h2 className="ev-s4-title">Review &amp; Publish</h2>

                {/* Basic Info card */}
                <div className="ev-review-card">
                  <div className="ev-review-card-header">
                    <span className="ev-review-card-label">Basic Info</span>
                    <button type="button" className="ev-review-edit-btn" onClick={() => setStep(1)}><EditIcon /> Edit</button>
                  </div>
                  <div className="ev-review-card-body">
                    <p className="ev-review-field-label">EVENT TITLE</p>
                    <p className="ev-review-field-value ev-review-title">{form.title || 'Modern Design Collective: Summer Mixer'}</p>
                    <p className="ev-review-field-label" style={{ marginTop: 12 }}>DESCRIPTION</p>
                    <p className="ev-review-field-value ev-review-desc">
                      {form.description || 'Join us for an evening of networking, inspiration, and collaborative discussions on the future of UI/UX design. Meet industry leaders and fresh talent in a vibrant, creative environment.'}
                    </p>
                    <div className="ev-review-tags">
                      {form.category
                        ? <span className="ev-review-tag">{form.category}</span>
                        : <><span className="ev-review-tag">Design</span><span className="ev-review-tag">Networking</span><span className="ev-review-tag">Social</span></>
                      }
                    </div>
                  </div>
                </div>

                {/* Pricing & Tickets card */}
                <div className="ev-review-card">
                  <div className="ev-review-card-header">
                    <span className="ev-review-card-label">Pricing &amp; Tickets</span>
                    <button type="button" className="ev-review-edit-btn" onClick={() => setStep(2)}><EditIcon /> Edit</button>
                  </div>
                  <div className="ev-review-card-body ev-review-card-body--tickets">
                    {tickets.map(tk => (
                      <div key={tk.id} className="ev-review-ticket-row">
                        <div>
                          <p className="ev-review-ticket-name">{tk.name}</p>
                          <p className="ev-review-ticket-cap">Capacity: {tk.seats || '—'} Guests</p>
                        </div>
                        <span className="ev-review-ticket-price">${Number(tk.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location card */}
                <div className="ev-review-card">
                  <div className="ev-review-card-header">
                    <span className="ev-review-card-label">Location</span>
                    <button type="button" className="ev-review-edit-btn" onClick={() => setStep(3)}><EditIcon /> Edit</button>
                  </div>
                  <div className="ev-review-card-body ev-review-location-row">
                    <div>
                      <p className="ev-review-field-label">VENUE NAME</p>
                      <p className="ev-review-field-value ev-review-venue-name">
                        {venue.name || 'The Innovation Hub – Studio B'}
                      </p>
                      <p className="ev-review-field-label" style={{ marginTop: 10 }}>ADDRESS</p>
                      <p className="ev-review-field-value ev-review-address">
                        {venue.street
                          ? `${venue.street}${venue.city ? ', ' + venue.city : ''}${venue.state ? ', ' + venue.state : ''}${venue.pinCode ? ' ' + venue.pinCode : ''}`
                          : '452 Creative Way,\nDowntown Design District,\nSF 94103'
                        }
                      </p>
                    </div>
                    <div className="ev-review-map-thumb">
                      <div className="ev-review-map-inner" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="ev-s4-sidebar">
                {/* Invite Friends */}
                <div className="ev-s4-panel">
                  <p className="ev-s4-panel-title">INVITE FRIENDS</p>
                  <div className="ev-invite-search-wrap">
                    <SearchIcon />
                    <input className="ev-invite-search" type="text" placeholder="Search friends..." />
                  </div>
                  <div className="ev-invite-list">
                    {REVIEW_FRIENDS.map(f => (
                      <div key={f.id} className="ev-invite-friend">
                        <div className="ev-invite-avatar" style={{ background: f.color }}>{reviewInitials(f.name)}</div>
                        <span className="ev-invite-name">{f.name}</span>
                        <button type="button" className="ev-invite-btn">Invite</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Share Event */}
                <div className="ev-s4-panel">
                  <p className="ev-s4-panel-title">SHARE EVENT</p>
                  <div className="ev-share-btns">
                    <button type="button" className="ev-share-btn"><LinkIcon /><span>LINK</span></button>
                    <button type="button" className="ev-share-btn"><FacebookIcon /><span>FACEBOOK</span></button>
                    <button type="button" className="ev-share-btn"><TwitterXIcon /><span>X/TWITTER</span></button>
                    <button type="button" className="ev-share-btn"><WhatsAppIcon /><span>WHATSAPP</span></button>
                  </div>
                </div>

                {/* Publish actions */}
                <button type="button" className="ev-publish-btn" disabled={createLoading} onClick={() => handlePublish(false)}>
                  {createLoading ? 'Publishing…' : 'Publish Event'}
                </button>
                <button type="button" className="ev-draft-btn" disabled={createLoading} onClick={() => handlePublish(true)}>
                  Save as Draft
                </button>
                <p className="ev-publish-notice">By publishing, you agree to our <span>Terms of Service</span> and <span>Event Guidelines.</span></p>
              </div>
            </div>
          )}
          </div>{/* ev-step-content */}

          <div className="ev-form-divider" />
          <div className="ev-form-footer">
            {step === 1 ? (
              <button className="ev-cancel-btn" onClick={handleBack}>Cancel</button>
            ) : (
              <button className="ev-cancel-btn ev-back-btn" onClick={handleBack}>
                <ArrowLeftIcon /> Back
              </button>
            )}
            <button className="ev-next-btn" disabled={step === 4 && createLoading} onClick={step < 4 ? handleNext : () => handlePublish(false)}>
              {step < 4 ? 'Next Step' : (createLoading ? 'Publishing…' : 'Publish')} <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
