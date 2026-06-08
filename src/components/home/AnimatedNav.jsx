import { useEffect, useRef, useState } from 'react';
import {
  IconHome,
  IconBook2,
  IconBooks,
  IconPlus,
  IconCalendar,
  IconUsers,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from '@tabler/icons-react';
import './AnimatedNav.css';

const MAIN_ITEMS = [
  { id: 'home',     Icon: IconHome,          label: 'Home'              },
  { id: 'courses',  Icon: IconBook2,         label: 'Courses'           },
  { id: 'library',  Icon: IconBooks,         label: 'Library'           },
  { id: 'events',   Icon: IconCalendar,      label: 'Events'            },
  { id: 'friends',  Icon: IconUsers,         label: 'Friends'           },
  { id: 'messages', Icon: IconMessageCircle, label: 'Messages', badge: 3 },
];

export default function AnimatedNav({ activeId = 'home', avatarUrl, onNavigate }) {
  const rippleRefs   = useRef({});
  const iconRefs     = useRef({});
  const [badgeAnim, setBadgeAnim] = useState(false);

  /* demo notification shake on mount */
  useEffect(() => {
    const t = setTimeout(() => {
      setBadgeAnim(true);
      const msgIcon = iconRefs.current['messages'];
      if (msgIcon) {
        msgIcon.classList.remove('notif-shake');
        void msgIcon.offsetWidth;
        msgIcon.classList.add('notif-shake');
      }
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  function fireRipple(id) {
    const el = rippleRefs.current[id];
    if (!el) return;
    el.classList.remove('go');
    void el.offsetWidth;
    el.classList.add('go');
  }

  function handleClick(id) {
    fireRipple(id);
    if (id === 'settings') {
      const icon = iconRefs.current['settings'];
      if (icon) {
        icon.classList.remove('wiggle');
        void icon.offsetWidth;
        icon.classList.add('wiggle');
      }
    }
    onNavigate?.(id);
  }

  return (
    <nav className="anim-nav" aria-label="Main navigation">
      <ul className="anim-nav-list">
        {MAIN_ITEMS.map((item, i) => {
          const { Icon } = item;
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <button
                className={`nav-item${isActive ? ' nav-item--active' : ''}`}
                style={{ '--i': i }}
                onClick={() => handleClick(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className="nav-icon"
                  ref={el => { if (el) iconRefs.current[item.id] = el; }}
                >
                  <Icon size={17} stroke={1.8} />
                  {item.badge && (
                    <span className={`nav-badge${badgeAnim ? ' nav-badge--pop' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="nav-label">{item.label}</span>
                <span
                  className="ripple-el"
                  ref={el => { if (el) rippleRefs.current[item.id] = el; }}
                />
              </button>
            </li>
          );
        })}

        <li className="nav-divider-li" aria-hidden="true">
          <div className="nav-divider" />
        </li>

        <li>
          <button
            className={`nav-item${activeId === 'settings' ? ' nav-item--active' : ''}`}
            style={{ '--i': MAIN_ITEMS.length + 1 }}
            onClick={() => handleClick('settings')}
            aria-label="Settings"
            aria-current={activeId === 'settings' ? 'page' : undefined}
          >
            <span
              className="nav-icon"
              ref={el => { if (el) iconRefs.current['settings'] = el; }}
            >
              <IconSettings size={17} stroke={1.8} />
            </span>
            <span className="nav-label">Settings</span>
            <span
              className="ripple-el"
              ref={el => { if (el) rippleRefs.current['settings'] = el; }}
            />
          </button>
        </li>
      </ul>

      <div className="nav-avatar" aria-hidden="true">
        {avatarUrl
          ? <img src={avatarUrl} alt="" className="nav-avatar-img" />
          : <span className="nav-avatar-fallback">U</span>
        }
      </div>
    </nav>
  );
}
