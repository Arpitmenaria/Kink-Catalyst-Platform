import { useState } from 'react';
import './EventsPage.css';
import AnimatedNav from './AnimatedNav';
import CreatePostModal from './CreatePostModal';

/* ── Sidebar nav icons ── */
function FeedNavIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function EventNavIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function GroupsNavIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CalendarNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="8" y="14" width="2" height="2" rx="0.5"/></svg>; }
function MessagesNavIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }

/* ── Event type icons ── */
function OnlineIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>; }
function OfflineIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function HybridIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }

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

const REVIEW_FRIENDS = [
  { id: '1', name: 'Alex Johnson',  color: '#7c3aed' },
  { id: '2', name: 'Sarah Miller',  color: '#0891b2' },
  { id: '3', name: 'David Chen',    color: '#059669' },
];

function reviewInitials(name) { return name.split(' ').map(w => w[0]).join('').toUpperCase(); }

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
  { id: 'hybrid',  label: 'Hybrid',  icon: <HybridIcon /> },
];

export default function EventsPage({ onBack, onEventsClick, onGroupsClick, onCalendarClick, onMessagesClick }) {
  const [step, setStep] = useState(1);
  const [animDir, setAnimDir] = useState('forward');
  const [createPostOpen, setCreatePostOpen] = useState(false);

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
    setAnimDir('back');
    if (step === 1) onBack();
    else setStep(s => s - 1);
  }

  function handleNext() {
    setAnimDir('forward');
    if (step < 4) setStep(s => s + 1);
  }

  return (
    <div className="ev-page">
      <AnimatedNav
        activeId="events"
        onNavigate={id => {
          if (id === 'create')   { setCreatePostOpen(true); return; }
          if (id === 'home')     onBack?.();
          if (id === 'events')   onEventsClick?.();
          if (id === 'friends')  onGroupsClick?.();
          if (id === 'calendar') onCalendarClick?.();
          if (id === 'messages') onMessagesClick?.();
        }}
      />
      {createPostOpen && <CreatePostModal onClose={() => setCreatePostOpen(false)} />}

      {/* Main content */}
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
                    <label className="ev-label">Event Title</label>
                    <input
                      className="ev-input"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Summer Music Festival 2024"
                    />
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
                      <label className="ev-label ev-label--small">Start Date</label>
                      <input className="ev-input" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                    </div>
                    <div className="ev-field">
                      <label className="ev-label ev-label--small">End Date</label>
                      <input className="ev-input" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                    </div>
                    <div className="ev-field" style={{ opacity: form.isAllDay ? 0.35 : 1, pointerEvents: form.isAllDay ? 'none' : undefined }}>
                      <label className="ev-label ev-label--small">Start Time</label>
                      <input className="ev-input" type="time" name="startTime" value={form.startTime} onChange={handleChange} disabled={form.isAllDay} />
                    </div>
                    <div className="ev-field" style={{ opacity: form.isAllDay ? 0.35 : 1, pointerEvents: form.isAllDay ? 'none' : undefined }}>
                      <label className="ev-label ev-label--small">End Time</label>
                      <input className="ev-input" type="time" name="endTime" value={form.endTime} onChange={handleChange} disabled={form.isAllDay} />
                    </div>
                  </div>
                </div>

                {/* Category + Event Type */}
                <div className="ev-field-row">
                  <div className="ev-field">
                    <label className="ev-label">Event Category</label>
                    <div className="ev-select-wrap">
                      <select className="ev-select" name="category" value={form.category} onChange={handleChange}>
                        <option value="">Select a category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDownIcon />
                    </div>
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
                </div>

                {/* Right: registration settings */}
                <div className="ev-s2-right">
                  <p className="ev-s2-section-title">Registration Settings</p>

                  <div className="ev-panel-field">
                    <label className="ev-label ev-label--small">Ticket Price ($)</label>
                    <input className="ev-input" name="ticketPrice" type="number" min="0" value={registration.ticketPrice} onChange={handleRegistrationChange} />
                  </div>

                  <div className="ev-panel-field">
                    <label className="ev-label ev-label--small">Total Seats</label>
                    <input className="ev-input" name="totalSeats" type="number" min="1" value={registration.totalSeats} onChange={handleRegistrationChange} placeholder="e.g. 50" />
                  </div>

                  <div className="ev-panel-field">
                    <label className="ev-label ev-label--small">Max Tickets Per User</label>
                    <div className="ev-select-wrap">
                      <select className="ev-select" name="maxPerUser" value={registration.maxPerUser} onChange={handleRegistrationChange}>
                        {MAX_PER_USER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDownIcon />
                    </div>
                  </div>

                  <div className="ev-panel-field">
                    <label className="ev-label ev-label--small">Registration Deadline</label>
                    <div className="ev-input-icon-wrap">
                      <input className="ev-input" name="deadline" type="date" value={registration.deadline} onChange={handleRegistrationChange} />
                      <span className="ev-input-icon"><CalendarIcon /></span>
                    </div>
                  </div>
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
                            <label className="ev-label ev-label--small">City</label>
                            <input className="ev-input" value={venue.city} onChange={e => setVenue(p => ({ ...p, city: e.target.value }))} placeholder="City" />
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
                        <label className="ev-label ev-label--small">Meeting Link / Platform</label>
                        <input className="ev-input" value={virtual.link} onChange={e => setVirtual(p => ({ ...p, link: e.target.value }))} placeholder="zoom.us//123456789" />
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
                <button type="button" className="ev-publish-btn">Publish Event</button>
                <button type="button" className="ev-draft-btn">Save as Draft</button>
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
            <button className="ev-next-btn" onClick={handleNext}>
              {step < 4 ? 'Next Step' : 'Publish'} <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
