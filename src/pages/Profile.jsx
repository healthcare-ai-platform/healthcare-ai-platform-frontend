import { useState, useEffect } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getMe } from '../api/auth';
import styles from './Profile.module.css';

const ROLE_LABELS = {
  tenant_admin: 'Tenant Admin',
  manager:      'Manager',
  analyst:      'Analyst',
  doctor:       'Doctor',
  ops:          'Ops',
  viewer:       'Viewer',
  platform_admin: 'Platform Admin',
};

const ROLE_COLORS = {
  tenant_admin:   { bg: '#f0eeff', color: '#534ab7' },
  platform_admin: { bg: '#f0eeff', color: '#534ab7' },
  manager:        { bg: '#faeeda', color: '#854f0b' },
  analyst:        { bg: 'var(--color-blue-50)', color: 'var(--color-blue-500)' },
  doctor:         { bg: 'var(--color-green-50)', color: 'var(--color-green-500)' },
  default:        { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' },
};

const DEFAULT_PREFS = [
  { key: 'email_alerts',  label: 'Email alerts for DLQ spikes',    enabled: true  },
  { key: 'sla_warnings',  label: 'In-app SLA breach warnings',      enabled: true  },
  { key: 'daily_digest',  label: 'Daily pipeline digest',           enabled: false },
  { key: 'audit_notify',  label: 'Notify on export events',         enabled: false },
];

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      className={`${styles.toggle} ${enabled ? styles.toggleOn : ''}`}
      onClick={() => onChange(!enabled)}
      role="switch"
      aria-checked={enabled}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [prefs, setPrefs]     = useState(DEFAULT_PREFS);

  useEffect(() => {
    getMe()
      .then(setProfile)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function togglePref(key) {
    setPrefs(p => p.map(item => item.key === key ? { ...item, enabled: !item.enabled } : item));
  }

  const roleKey    = profile?.role || '';
  const roleLabel  = ROLE_LABELS[roleKey] || roleKey;
  const roleColor  = ROLE_COLORS[roleKey] || ROLE_COLORS.default;
  const statusColor = profile?.status === 'active'
    ? { bg: 'var(--color-green-50)', color: 'var(--color-green-500)' }
    : { bg: 'var(--color-red-50)',   color: 'var(--color-red-500)'   };

  return (
    <div className={styles.page}>
      <Topbar title="Profile" subtitle="Account settings and preferences" />
      <div className={styles.content}>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* ── Header card ── */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>
            {loading ? '…' : initials(profile?.name || profile?.email || '')}
          </div>
          <div className={styles.profileMeta}>
            {loading ? (
              <div className={styles.skeleton} style={{ width: 160, height: 22, marginBottom: 8 }} />
            ) : (
              <>
                <div className={styles.profileName}>{profile?.name || '—'}</div>
                <div className={styles.profileEmail}>{profile?.email || '—'}</div>
                <div className={styles.tagRow}>
                  <Badge label={roleLabel} bg={roleColor.bg} color={roleColor.color} />
                  <Badge
                    label={profile?.status || '—'}
                    bg={statusColor.bg}
                    color={statusColor.color}
                  />
                  {profile?.created_at && (
                    <Badge
                      label={`Joined ${formatDate(profile.created_at)}`}
                      bg="var(--color-bg-tertiary)"
                      color="var(--color-text-secondary)"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.col}>
            {/* ── Account info ── */}
            <Card title="Account information" subtitle="Your profile details">
              <div className={styles.fieldList}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Full name</span>
                  <span className={styles.fieldValue}>
                    {loading ? '—' : profile?.name || '—'}
                  </span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fieldValue}>
                    {loading ? '—' : profile?.email || '—'}
                  </span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Role</span>
                  <span className={styles.fieldValue}>{loading ? '—' : roleLabel}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Status</span>
                  <span className={styles.fieldValue}>
                    {loading ? '—' : (
                      <Badge
                        label={profile?.status || '—'}
                        bg={statusColor.bg}
                        color={statusColor.color}
                      />
                    )}
                  </span>
                </div>
                {profile?.facility_name && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Facility</span>
                    <span className={styles.fieldValue}>{profile.facility_name}</span>
                  </div>
                )}
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Member since</span>
                  <span className={styles.fieldValue}>
                    {loading ? '—' : formatDate(profile?.created_at)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.col}>
            {/* ── Notification prefs ── */}
            <Card title="Notification preferences" subtitle="Saved locally in this browser">
              <div className={styles.prefList}>
                {prefs.map(p => (
                  <div key={p.key} className={styles.prefRow}>
                    <span className={styles.prefLabel}>{p.label}</span>
                    <Toggle enabled={p.enabled} onChange={() => togglePref(p.key)} />
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Security ── */}
            <Card title="Security" subtitle="Authentication details">
              <div className={styles.secSection}>
                <div className={styles.secRow}>
                  <div>
                    <div className={styles.secLabel}>Authentication</div>
                    <div className={styles.secSub}>Email and password</div>
                  </div>
                  <Badge label="Active" bg="var(--color-green-50)" color="var(--color-green-500)" />
                </div>
                <div className={styles.secRow}>
                  <div>
                    <div className={styles.secLabel}>Session tokens</div>
                    <div className={styles.secSub}>JWT · expires in 60 min</div>
                  </div>
                  <Badge label="Stateless" bg="var(--color-bg-tertiary)" color="var(--color-text-secondary)" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ── Recent activity ── */}
        <Card title="Recent activity" subtitle="Your last 6 audit events">
          {loading ? (
            <div className={styles.loadingRow}>Loading activity…</div>
          ) : !profile?.recent_activity?.length ? (
            <div className={styles.loadingRow}>No activity recorded yet</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>IP address</th>
                </tr>
              </thead>
              <tbody>
                {profile.recent_activity.map(log => (
                  <tr key={log.id} className={styles.tableRow}>
                    <td><span className={styles.mono}>{formatDateTime(log.time)}</span></td>
                    <td><span className={styles.action}>{log.action}</span></td>
                    <td className={styles.muted}>{log.resource}</td>
                    <td><span className={styles.mono}>{log.ip || '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

      </div>
    </div>
  );
}
