import { useState } from 'react';
import './CalendarPage.css';

/* ── Sidebar nav icons ── */
function FeedNavIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function EventNavIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function GroupsNavIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CalendarNavIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg>; }
function MessagesNavIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }

/* ── Calendar icons ── */
function ChevronLeftIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>; }
function ChevronRightIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
function ClockIcon()        { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function PlusIcon()         { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function CalHeaderIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function MapPinIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function XIcon()            { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }

/* ── Constants ── */
const HOUR_HEIGHT  = 80;
const GRID_START   = 9;
const HOURS        = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const MONTH_NAMES  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_DAY_NAMES = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
const MONTH_COL_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

/* Week view events */
const WEEK_EVENTS = [
  { id: 1, dayIdx: 0, title: 'Standup',          sH: 9,  sM: 0,  eH: 9,  eM: 30, color: 'blue'  },
  { id: 2, dayIdx: 1, title: 'Product Workshop', sH: 10, sM: 30, eH: 12, eM: 30, color: 'blue'  },
  { id: 3, dayIdx: 2, title: 'Lunch Break',      sH: 12, sM: 0,  eH: 13, eM: 0,  color: 'slate' },
  { id: 4, dayIdx: 4, title: 'Weekly Recap',     sH: 10, sM: 0,  eH: 12, eM: 15, color: 'slate' },
  { id: 5, dayIdx: 0, title: 'Design Review',    sH: 14, sM: 0,  eH: 15, eM: 30, color: 'slate' },
  { id: 6, dayIdx: 1, title: 'Deep Work',        sH: 14, sM: 0,  eH: 15, eM: 15, color: 'blue'  },
];

/* Month view events — day-of-month relative so they populate any month */
const MONTH_EVENTS = [
  { id: 'm1', startDay: 2,  endDay: 2,  title: 'Team Sync',      color: 'blue'  },
  { id: 'm2', startDay: 4,  endDay: 6,  title: 'Ad Campaign',    color: 'teal'  },
  { id: 'm3', startDay: 11, endDay: 13, title: 'Project Review', color: 'blue'  },
  { id: 'm4', startDay: 11, endDay: 15, title: 'Video Edit',     color: 'slate' },
  { id: 'm5', startDay: 19, endDay: 21, title: 'Launch Day',     color: 'red'   },
];

const TODAY_EVENTS = [
  { id: 1, tag: 'INTERNAL', tagType: 'gray', title: 'Team Sync',           time: '10:00 AM' },
  { id: 2, tag: 'MEETING',  tagType: 'blue', title: 'Client Presentation', time: '01:30 PM' },
  { id: 3, tag: 'INTERNAL', tagType: 'gray', title: 'Project Review',      time: '04:00 PM' },
];

/* ── Helpers ── */
function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(monday) {
  return WEEK_DAY_NAMES.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    return { label, date: d.getDate(), isToday };
  });
}

function formatWeekRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${MONTH_NAMES[monday.getMonth()]} ${monday.getDate()} — ${sunday.getDate()}, ${monday.getFullYear()}`;
}

function formatMonthHeader(date) {
  return `${MONTH_NAMES[date.getMonth()]}, ${date.getFullYear()}`;
}

function formatHourLabel(h) {
  if (h === 12) return '12:00 PM';
  if (h > 12)   return `${String(h - 12).padStart(2, '0')}:00 PM`;
  return `${String(h).padStart(2, '0')}:00 AM`;
}

function fmtT(h, m) {
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(dh).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function fmtPeriod(h) { return h >= 12 ? 'PM' : 'AM'; }
function evTop(sH, sM)            { return ((sH - GRID_START) + sM / 60) * HOUR_HEIGHT; }
function evH(sH, sM, eH, eM)      { return ((eH * 60 + eM) - (sH * 60 + sM)) / 60 * HOUR_HEIGHT; }

/* Build a 42-cell grid for the given month */
function getMonthGrid(year, month) {
  const firstDow    = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevTotal   = new Date(year, month, 0).getDate();
  const today       = new Date();

  const cells = [];
  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ day: prevTotal - i, current: false, isToday: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({
      day: d, current: true,
      isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d,
    });
  let next = 1;
  while (cells.length < 42) cells.push({ day: next++, current: false, isToday: false });
  return cells;
}

/* Get events visible within one week row, with column positions */
function getEventsInWeek(week, events) {
  const curCells = week.map((c, i) => ({ ...c, col: i })).filter(c => c.current);
  if (!curCells.length) return [];
  const minDay = curCells[0].day;
  const maxDay = curCells[curCells.length - 1].day;

  const result = [];
  events.forEach((ev, evIdx) => {
    if (ev.endDay < minDay || ev.startDay > maxDay) return;
    const cs = Math.max(ev.startDay, minDay);
    const ce = Math.min(ev.endDay, maxDay);
    const colStart = week.findIndex(c => c.current && c.day === cs);
    let colEnd = -1;
    for (let i = week.length - 1; i >= 0; i--) {
      if (week[i].current && week[i].day === ce) { colEnd = i; break; }
    }
    if (colStart < 0 || colEnd < 0) return;
    result.push({ ...ev, colStart, colEnd, showTitle: ev.startDay >= minDay, slot: result.length });
  });
  return result;
}

/* ── Create Event Modal ── */
function todayValue() {
  const d = new Date();
  return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`;
}

function CreateEventModal({ onClose }) {
  const [form, setForm] = useState({ title:'', date:todayValue(), time:'10:00 AM', location:'', description:'' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <div className="cev-overlay" onClick={onClose}>
      <div className="cev-modal" onClick={e => e.stopPropagation()}>
        <div className="cev-header">
          <h2 className="cev-title">Create New Event</h2>
          <button className="cev-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="cev-body">
          <div className="cev-field">
            <label className="cev-label">Event Title</label>
            <input className="cev-input" placeholder="e.g., Weekly Marketing Sync" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="cev-row">
            <div className="cev-field">
              <label className="cev-label">Date</label>
              <input className="cev-input" value={form.date} onChange={e => set('date', e.target.value)} placeholder="MM/DD/YYYY" />
            </div>
            <div className="cev-field">
              <label className="cev-label">Time</label>
              <input className="cev-input" value={form.time} onChange={e => set('time', e.target.value)} placeholder="10:00 AM" />
            </div>
          </div>
          <div className="cev-field">
            <label className="cev-label">Location</label>
            <div className="cev-input-icon-wrap">
              <span className="cev-input-icon"><MapPinIcon /></span>
              <input className="cev-input cev-input--icon" placeholder="Meeting Room B or Virtual Link" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
          </div>
          <div className="cev-field">
            <label className="cev-label">Description</label>
            <textarea className="cev-textarea" placeholder="Briefly describe the purpose of this event..." value={form.description} onChange={e => set('description', e.target.value)} rows={4} />
          </div>
        </div>
        <div className="cev-footer">
          <button className="cev-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="cev-submit-btn" onClick={onClose}>Create Event</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   Main Component
══════════════════════════════ */
export default function CalendarPage({ onFeedClick, onEventsClick, onGroupsClick, onMessagesClick }) {
  const [monday,    setMonday]   = useState(getMondayOf(new Date()));
  const [monthDate, setMonthDate] = useState(new Date());
  const [view,      setView]      = useState('week');

  /* Derived */
  const weekDays   = getWeekDays(monday);
  const monthGrid  = getMonthGrid(monthDate.getFullYear(), monthDate.getMonth());
  const monthWeeks = Array.from({ length: 6 }, (_, i) => monthGrid.slice(i * 7, i * 7 + 7));

  /* Current-time indicator */
  const now         = new Date();
  const nowTop      = ((now.getHours() - GRID_START) + now.getMinutes() / 60) * HOUR_HEIGHT;
  const showNowLine = now.getHours() >= GRID_START && now.getHours() < GRID_START + HOURS.length;

  /* Unified navigation */
  function prevPeriod() {
    if (view === 'week') {
      const d = new Date(monday); d.setDate(d.getDate() - 7); setMonday(d);
    } else {
      const d = new Date(monthDate); d.setMonth(d.getMonth() - 1); setMonthDate(d);
    }
  }
  function nextPeriod() {
    if (view === 'week') {
      const d = new Date(monday); d.setDate(d.getDate() + 7); setMonday(d);
    } else {
      const d = new Date(monthDate); d.setMonth(d.getMonth() + 1); setMonthDate(d);
    }
  }

  const headerLabel = view === 'week' ? formatWeekRange(monday) : formatMonthHeader(monthDate);

  return (
    <div className="cal-page">

      {/* ── Left sidebar ── */}
      <aside className="cal-sidebar">
        <nav className="cal-nav">
          {[
            { icon: <FeedNavIcon />,     label: 'Feed',     onClick: onFeedClick     },
            { icon: <EventNavIcon />,    label: 'Event',    onClick: onEventsClick   },
            { icon: <GroupsNavIcon />,   label: 'Groups',   onClick: onGroupsClick   },
            { icon: <CalendarNavIcon />, label: 'Calendar', active: true             },
            { icon: <MessagesNavIcon />, label: 'Messages', onClick: onMessagesClick },
          ].map(item => (
            <button key={item.label} className={`cal-nav-item${item.active ? ' cal-nav-item--active' : ''}`} onClick={item.onClick}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main area ── */}
      <main className="cal-main">

        {/* Header */}
        <div className="cal-header">
          <h1 className="cal-title">Weekly Agenda</h1>
          <div className="cal-header-row">
            <div className="cal-view-toggle">
              <button className={`cal-view-btn${view === 'week'  ? ' cal-view-btn--active' : ''}`} onClick={() => setView('week')}>Week</button>
              <button className={`cal-view-btn${view === 'month' ? ' cal-view-btn--active' : ''}`} onClick={() => setView('month')}>Month</button>
            </div>
            <div className="cal-date-nav">
              <button className="cal-arrow-btn" onClick={prevPeriod}><ChevronLeftIcon /></button>
              <span className="cal-date-range">{headerLabel}</span>
              <button className="cal-arrow-btn" onClick={nextPeriod}><ChevronRightIcon /></button>
            </div>
          </div>
        </div>

        {/* ── WEEK VIEW ── */}
        {view === 'week' && (
          <div className="cal-grid-wrap">
            <div className="cal-col-headers">
              <div className="cal-time-header">TIME</div>
              {weekDays.map((d, i) => (
                <div key={i} className={`cal-day-header${d.isToday ? ' cal-day-header--today' : ''}`}>
                  <span className="cal-day-label">{d.label}</span>
                  <span className={`cal-day-num${d.isToday ? ' cal-day-num--today' : ''}`}>{d.date}</span>
                </div>
              ))}
            </div>
            <div className="cal-body">
              <div className="cal-time-col">
                {HOURS.map(h => (
                  <div key={h} className="cal-time-cell"><span>{formatHourLabel(h)}</span></div>
                ))}
              </div>
              <div className="cal-days-area">
                {weekDays.map((d, dayIdx) => (
                  <div key={dayIdx} className={`cal-day-col${d.isToday ? ' cal-day-col--today' : ''}`}>
                    {WEEK_EVENTS.filter(ev => ev.dayIdx === dayIdx).map(ev => (
                      <div key={ev.id} className={`cal-event cal-event--${ev.color}`}
                        style={{ top: evTop(ev.sH, ev.sM), height: evH(ev.sH, ev.sM, ev.eH, ev.eM) }}>
                        <p className="cal-ev-title">{ev.title}</p>
                        <p className="cal-ev-time">{fmtT(ev.sH, ev.sM)} –<br />{fmtT(ev.eH, ev.eM)} {fmtPeriod(ev.eH)}</p>
                      </div>
                    ))}
                  </div>
                ))}
                {showNowLine && (
                  <div className="cal-now-line" style={{ top: nowTop }}>
                    <span className="cal-now-dot" /><span className="cal-now-track" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── MONTH VIEW ── */}
        {view === 'month' && (
          <div className="cal-month-wrap">
            {/* Column headers */}
            <div className="cal-month-col-hdr">
              {MONTH_COL_NAMES.map(d => <div key={d} className="cal-month-col-hdr-cell">{d}</div>)}
            </div>

            {/* Week rows */}
            <div className="cal-month-body">
              {monthWeeks.map((week, wi) => {
                const weekEvs = getEventsInWeek(week, MONTH_EVENTS);
                return (
                  <div key={wi} className="cal-month-week">
                    {/* Day cells */}
                    {week.map((cell, ci) => (
                      <div key={ci} className={`cal-month-cell${cell.isToday ? ' cal-month-cell--today' : ''}${!cell.current ? ' cal-month-cell--other' : ''}`}>
                        <span className={`cal-month-num${cell.isToday ? ' cal-month-num--today' : ''}`}>
                          {cell.day}
                        </span>
                      </div>
                    ))}
                    {/* Event bars — absolutely positioned over the row */}
                    {weekEvs.map(ev => (
                      <div
                        key={ev.id}
                        className={`cal-month-ev cal-month-ev--${ev.color}`}
                        style={{
                          left:   `calc(${ev.colStart} * (100% / 7) + 3px)`,
                          width:  `calc(${ev.colEnd - ev.colStart + 1} * (100% / 7) - 6px)`,
                          top:    `${30 + ev.slot * 22}px`,
                        }}
                      >
                        {ev.showTitle && <span className="cal-month-ev-title">{ev.title}</span>}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* ── Right panel ── */}
      <aside className="cal-right">
        <div className="cal-right-head">
          <h2 className="cal-right-title">Today's Events</h2>
          <button className="cal-right-icon-btn"><CalHeaderIcon /></button>
        </div>
        <div className="cal-today-list">
          {TODAY_EVENTS.map(ev => (
            <div key={ev.id} className="cal-today-card">
              <span className={`cal-tag cal-tag--${ev.tagType}`}>{ev.tag}</span>
              <p className="cal-today-title">{ev.title}</p>
              <p className="cal-today-time"><ClockIcon /> {ev.time}</p>
            </div>
          ))}
        </div>
        <button className="cal-create-btn" onClick={() => onEventsClick?.()}>
          <PlusIcon /> Create Event
        </button>
      </aside>


    </div>
  );
}
