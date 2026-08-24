import { useState, useRef, useEffect } from 'react';
import './CountryPicker.css';
import { COUNTRIES, flagEmoji, countryByName } from '../../data/countries';

function ChevronDownIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function CheckIcon()       { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function SearchIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }

function useOutsideClose(open, setOpen, setSearch) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// The dropdown defaults to opening downward, which is useless when the
// trigger sits near the bottom of the form (e.g. the Organizer phone field)
// — there's nowhere near enough viewport left below it. Flip it above the
// trigger whenever there isn't reasonable room underneath.
const DROPDOWN_EST_HEIGHT = 300;
function useOpenUpward(open, ref) {
  const [openUpward, setOpenUpward] = useState(false);
  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setOpenUpward(spaceBelow < DROPDOWN_EST_HEIGHT && spaceAbove > spaceBelow);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return openUpward;
}

// Searchable country dropdown — used for the Venue "Country" field. Stores/
// emits the plain country name (matches the existing venue.country string
// field, so no other form-state shape needed to change).
export function CountrySelect({ value, onChange, placeholder = 'Select country', hasError }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useOutsideClose(open, setOpen, setSearch);
  const openUpward = useOpenUpward(open, ref);
  const selected = countryByName(value);

  const filtered = search.trim()
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase()))
    : COUNTRIES;

  return (
    <div className={`ev-cat-wrap${hasError ? ' ev-cat-wrap--error' : ''}`} ref={ref}>
      <button
        type="button"
        className={`ev-cat-select-btn${open ? ' ev-cat-select-btn--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? '' : 'ev-cat-placeholder'}>
          {value ? <>{flagEmoji(selected?.code)} {value}</> : placeholder}
        </span>
        <span className={`ev-vis-chevron${open ? ' ev-vis-chevron--up' : ''}`}><ChevronDownIcon /></span>
      </button>

      {open && (
        <div className={`ev-country-dropdown${openUpward ? ' ev-country-dropdown--up' : ''}`}>
          <div className="ev-country-search-wrap">
            <SearchIcon />
            <input
              autoFocus
              className="ev-country-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country"
            />
          </div>
          <ul className="ev-country-list" role="listbox">
            {filtered.map(c => (
              <li key={c.code} role="option" aria-selected={value === c.name}>
                <button
                  type="button"
                  className={`ev-vis-option${value === c.name ? ' ev-vis-option--active' : ''}`}
                  onClick={() => { onChange(c.name); setOpen(false); setSearch(''); }}
                >
                  <span className="ev-vis-label">{flagEmoji(c.code)} {c.name}</span>
                  {value === c.name && <span className="ev-vis-check"><CheckIcon /></span>}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="ev-country-empty">No matches</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

// Longest-prefix match so e.g. "+1 868 555 0100" resolves to Trinidad and
// Tobago (+1868) rather than falling back to the bare US/Canada "+1".
function matchDialCode(value) {
  if (!value) return null;
  const candidates = COUNTRIES.filter(c => value.startsWith(c.dial));
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.dial.length - a.dial.length)[0];
}

// Dial-code picker + phone number input. `value`/`onChange` carry the single
// combined string (e.g. "+91 98765 43210") so it drops straight into the
// existing organizer.phone field with no other state-shape changes.
export function PhoneInput({ value, onChange, placeholder = '000) 000-0000', hasError }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useOutsideClose(open, setOpen, setSearch);
  const openUpward = useOpenUpward(open, ref);

  const matched = matchDialCode(value);
  const dial = matched?.dial ?? '+1';
  const number = matched ? value.slice(matched.dial.length).trim() : (value ?? '');

  function selectCountry(c) {
    onChange(number ? `${c.dial} ${number}` : `${c.dial} `);
    setOpen(false);
    setSearch('');
  }

  function handleNumberChange(e) {
    const digits = e.target.value.replace(/[^\d\s-]/g, '');
    onChange(digits ? `${dial} ${digits}` : '');
  }

  const filtered = search.trim()
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase()) || c.dial.includes(search.trim()))
    : COUNTRIES;

  return (
    <div className={`ev-phone-wrap${hasError ? ' ev-phone-wrap--error' : ''}`} ref={ref}>
      <button
        type="button"
        className={`ev-phone-code-btn${open ? ' ev-phone-code-btn--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{flagEmoji(matched?.code)} {dial}</span>
        <ChevronDownIcon />
      </button>
      <input
        className="ev-input ev-phone-number-input"
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder}
      />

      {open && (
        <div className={`ev-country-dropdown ev-phone-dropdown${openUpward ? ' ev-country-dropdown--up' : ''}`}>
          <div className="ev-country-search-wrap">
            <SearchIcon />
            <input
              autoFocus
              className="ev-country-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country or code"
            />
          </div>
          <ul className="ev-country-list" role="listbox">
            {filtered.map(c => (
              <li key={c.code} role="option" aria-selected={c.dial === dial}>
                <button
                  type="button"
                  className={`ev-vis-option${c.dial === dial ? ' ev-vis-option--active' : ''}`}
                  onClick={() => selectCountry(c)}
                >
                  <span className="ev-vis-label">{flagEmoji(c.code)} {c.name}</span>
                  <span className="ev-phone-dial-tag">{c.dial}</span>
                  {c.dial === dial && <span className="ev-vis-check"><CheckIcon /></span>}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="ev-country-empty">No matches</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
