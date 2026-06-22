import { NavLink, useNavigate } from 'react-router-dom';
import { getStoredUser, clearAuth } from '../../hooks/useAuth';
import styles from './Sidebar.module.css';

const ROLE_LABELS = {
  tenant_admin: 'Tenant Admin',
  manager:      'Manager',
  analyst:      'Analyst',
  doctor:       'Doctor',
  ops:          'Ops',
  viewer:       'Viewer',
};

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

const navGroups = [
  {
    section: 'Overview',
    roles: null,
    items: [
      { to: '/',          label: 'Dashboard',   icon: '⬛' },
      { to: '/analytics', label: 'Analytics',   icon: '📊' },
    ],
  },
  {
    section: 'Pipeline',
    roles: null,
    items: [
      { to: '/documents', label: 'Documents',        icon: '📄' },
      { to: '/queue',     label: 'Processing queue', icon: '⏳' },
      { to: '/failures',  label: 'Failures',         icon: '⚠', badge: '3' },
    ],
  },
  {
    section: 'Data',
    roles: null,
    items: [
      { to: '/patients',     label: 'Patients',     icon: '👤' },
      { to: '/facilities',   label: 'Facilities',   icon: '🏥' },
      { to: '/ai-assistant', label: 'AI assistant', icon: '🤖' },
    ],
  },
  {
    section: 'Admin',
    roles: ['tenant_admin', 'manager'],
    items: [
      { to: '/team',  label: 'Team',       icon: '👥' },
      { to: '/audit', label: 'Audit logs', icon: '📋' },
    ],
  },
];

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

export default function Sidebar() {
  const navigate = useNavigate();
  const user     = getStoredUser();

  const name      = user?.name || user?.email || 'Unknown';
  const roleKey   = user?.role || '';
  const roleLabel = ROLE_LABELS[roleKey] || roleKey;

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
          <div className={styles.brandSub}>Data Platform</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navGroups.map(group => {
          if (group.roles && !group.roles.includes(roleKey)) return null;
          return (
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
          );
        })}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/profile" className={styles.userBlock}>
          <div className={styles.avatar}>{initials(name)}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{name}</div>
            <div className={styles.userRole}>{roleLabel}</div>
          </div>
        </NavLink>
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
