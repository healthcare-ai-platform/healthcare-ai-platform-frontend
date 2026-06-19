import { NavLink, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const nav = [
  { section: 'Overview', items: [
    { to: '/', label: 'Dashboard', icon: '⬛' },
    { to: '/analytics', label: 'Analytics', icon: '📊' },
  ]},
  { section: 'Pipeline', items: [
    { to: '/documents', label: 'Documents', icon: '📄' },
    { to: '/queue', label: 'Processing queue', icon: '⏳' },
    { to: '/failures', label: 'Failures', icon: '⚠', badge: '3' },
  ]},
  { section: 'Data', items: [
    { to: '/patients', label: 'Patients', icon: '👤' },
    { to: '/facilities', label: 'Facilities', icon: '🏥' },
    { to: '/ai-assistant', label: 'AI assistant', icon: '🤖' },
  ]},
  { section: 'Admin', items: [
    { to: '/access', label: 'Access control', icon: '🔒' },
    { to: '/audit', label: 'Audit logs', icon: '📋' },
  ]},
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>H</div>
        <div>
          <div className={styles.brandName}>HealthAI</div>
          <div className={styles.brandSub}>Data Platform</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {nav.map(group => (
          <div key={group.section}>
            <div className={styles.sectionLabel}>{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {item.badge && (
                  <span className={styles.navBadge}>{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <NavLink to="/profile" className={({ isActive }) => `${styles.userRow} ${isActive ? styles.userRowActive : ''}`}>
        <div className={styles.avatar}>AK</div>
        <div>
          <div className={styles.userName}>Amar K.</div>
          <div className={styles.userRole}>Data Engineer</div>
        </div>
      </NavLink>
    </aside>
  );
}
