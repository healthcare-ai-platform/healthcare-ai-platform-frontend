import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuth, getStoredUser } from '../../hooks/useAuth';
import styles from './Sidebar.module.css';

const nav = [
  { section: 'Tenants', items: [
    { to: '/admin/tenants', label: 'Tenants',  icon: '🏢' },
    { to: '/admin/billing', label: 'Billing',  icon: '💳' },
  ]},
  { section: 'Platform', items: [
    { to: '/admin/health', label: 'System health', icon: '❤' },
    { to: '/admin/logs',   label: 'Platform logs', icon: '📋' },
    { to: '/admin/users',  label: 'Admin users',   icon: '👤' },
  ]},
];

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

function LogOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function AdminSidebar() {
  const navigate = useNavigate();
  const user     = getStoredUser();
  const name     = user?.name || 'Admin';

  function handleSignOut() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>H</div>
        <div>
          <div className={styles.brandName}>HealthAI</div>
          <div className={styles.brandSub}>Platform Admin</div>
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
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userBlock} style={{ cursor: 'default' }}>
          <div className={styles.avatar}>{initials(name)}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{name}</div>
            <div className={styles.userRole}>Platform Admin</div>
          </div>
        </div>
        <button
          className={styles.signOutBtn}
          onClick={handleSignOut}
          title="Sign out"
        >
          <LogOutIcon />
        </button>
      </div>
    </aside>
  );
}
