import {
  IconHome2,
  IconCalendar,
  IconUsers,
  IconMessageCircle,
  IconWorld,
  IconCalendarWeek,
} from '@tabler/icons-react';
import './AnimatedNav.css';

function IconGradCap({ size = 24, stroke = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

const MAIN_ITEMS = [
  { id: 'home',      Icon: IconHome2,          label: 'Feed'      },
  { id: 'events',    Icon: IconCalendar,        label: 'Events'    },
  { id: 'friends',   Icon: IconUsers,           label: 'Groups'    },
  { id: 'messages',  Icon: IconMessageCircle,   label: 'Messages' },
  { id: 'courses',   Icon: IconGradCap,         label: 'Education' },
  { id: 'minisites', Icon: IconWorld,           label: 'Mini Sites'},
  { id: 'calendar',  Icon: IconCalendarWeek,    label: 'Calendar'  },
];

export default function AnimatedNav({ activeId = 'home', avatarUrl, onNavigate, unreadMessages = 0 }) {
  return (
    <nav className="anim-nav" aria-label="Main navigation">
      <ul className="anim-nav-list">
        {MAIN_ITEMS.map(item => {
          const { Icon } = item;
          const isActive = activeId === item.id;
          const badge = item.id === 'messages' ? unreadMessages : 0;
          return (
            <li key={item.id}>
              <button
                className={`nav-item${isActive ? ' nav-item--active' : ''}`}
                onClick={() => onNavigate?.(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-icon-box">
                  <Icon size={22} stroke={1.8} />
                  {badge > 0 && (
                    <span className="nav-badge">{badge > 99 ? '99+' : badge}</span>
                  )}
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

    </nav>
  );
}
