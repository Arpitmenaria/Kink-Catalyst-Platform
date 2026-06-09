import {
  IconHome2,
  IconCalendar,
  IconUsers,
  IconMessageCircle,
  IconBook2,
  IconBooks,
  IconWorld,
} from '@tabler/icons-react';
import './AnimatedNav.css';

const MAIN_ITEMS = [
  { id: 'home',      Icon: IconHome2,          label: 'Feed'      },
  { id: 'events',    Icon: IconCalendar,        label: 'Events'    },
  { id: 'friends',   Icon: IconUsers,           label: 'Groups'    },
  { id: 'messages',  Icon: IconMessageCircle,   label: 'Messages', badge: 3 },
  { id: 'courses',   Icon: IconBook2,           label: 'Courses'   },
  { id: 'library',   Icon: IconBooks,           label: 'Library'   },
  { id: 'minisites', Icon: IconWorld,           label: 'Mini Sites'},
];

export default function AnimatedNav({ activeId = 'home', avatarUrl, onNavigate }) {
  return (
    <nav className="anim-nav" aria-label="Main navigation">
      <ul className="anim-nav-list">
        {MAIN_ITEMS.map(item => {
          const { Icon } = item;
          const isActive = activeId === item.id;
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
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
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
