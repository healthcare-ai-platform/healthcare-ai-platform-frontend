import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { auditLogs } from '../data/mockData';
import styles from './Profile.module.css';

const user = {
  name: 'Amar Kumar',
  initials: 'AK',
  role: 'Data Engineer',
  email: 'amar.kumar@healthai.io',
  department: 'Platform Engineering',
  location: 'Bengaluru, IN',
  joined: 'March 2024',
  tenants: ['City General Hospital', 'Apollo Diagnostics', 'Sunrise Clinic'],
  bio: 'Manages the HealthAI ingestion pipeline and Redshift data model. Focused on extraction accuracy and SLA compliance across hospital tenants.',
};

const preferences = [
  { key: 'email_alerts', label: 'Email alerts for DLQ spikes', enabled: true },
  { key: 'sla_warnings', label: 'In-app SLA breach warnings', enabled: true },
  { key: 'daily_digest', label: 'Daily pipeline digest', enabled: false },
  { key: 'audit_notify', label: 'Notify on export events', enabled: false },
];

const sessions = [
  { device: 'MacBook Pro · Chrome', location: 'Bengaluru, IN', time: 'Active now', current: true },
  { device: 'iPhone 15 · Safari', location: 'Bengaluru, IN', time: '2 hours ago', current: false },
  { device: 'Windows · Edge', location: 'Mumbai, IN', time: '3 days ago', current: false },
];

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

export default function Profile() {
  const [prefs, setPrefs] = useState(preferences);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);

  const myLogs = auditLogs.filter(l => l.user.includes('admin') || l.user.includes('analyst')).slice(0, 4);

  function togglePref(key) {
    setPrefs(p => p.map(item => item.key === key ? { ...item, enabled: !item.enabled } : item));
  }

  return (
    <div className={styles.page}>
      <Topbar title="Profile" subtitle="Account settings and preferences" />
      <div className={styles.content}>

        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>AK</div>
          <div className={styles.profileMeta}>
            <div className={styles.profileName}>{user.name}</div>
            <div className={styles.profileRole}>{user.role} · {user.department}</div>
            <div className={styles.profileEmail}>{user.email}</div>
            <div className={styles.tagRow}>
              <Badge label="Data Engineer" bg="var(--color-blue-50)" color="var(--color-blue-500)" />
              <Badge label="Platform Engineering" bg="var(--color-purple-50)" color="var(--color-purple-500)" />
              <Badge label={`Joined ${user.joined}`} bg="var(--color-bg-tertiary)" color="var(--color-text-secondary)" />
            </div>
          </div>
          <button className={styles.editBtn} onClick={() => setEditing(e => !e)}>
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.col}>
            <Card title="Personal information" subtitle="Your account details">
              <div className={styles.fieldList}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Full name</span>
                  {editing
                    ? <input className={styles.fieldInput} defaultValue={user.name} />
                    : <span className={styles.fieldValue}>{user.name}</span>
                  }
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  {editing
                    ? <input className={styles.fieldInput} defaultValue={user.email} />
                    : <span className={styles.fieldValue}>{user.email}</span>
                  }
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Role</span>
                  <span className={styles.fieldValue}>{user.role}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Department</span>
                  <span className={styles.fieldValue}>{user.department}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Location</span>
                  {editing
                    ? <input className={styles.fieldInput} defaultValue={user.location} />
                    : <span className={styles.fieldValue}>{user.location}</span>
                  }
                </div>
                <div className={styles.field} style={{ alignItems: 'flex-start' }}>
                  <span className={styles.fieldLabel} style={{ paddingTop: 2 }}>Bio</span>
                  {editing
                    ? <textarea className={styles.fieldTextarea} value={bio} onChange={e => setBio(e.target.value)} rows={3} />
                    : <span className={styles.fieldValue}>{bio}</span>
                  }
                </div>
              </div>
              {editing && (
                <div className={styles.saveRow}>
                  <button className={styles.saveBtn} onClick={() => setEditing(false)}>Save changes</button>
                </div>
              )}
            </Card>

            <Card title="Tenant access" subtitle="Facilities you can view">
              <div className={styles.tenantList}>
                {user.tenants.map(t => (
                  <div key={t} className={styles.tenantItem}>
                    <div className={styles.tenantDot} />
                    <span className={styles.tenantName}>{t}</span>
                    <Badge label="Read access" bg="var(--color-teal-50)" color="var(--color-teal-500)" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className={styles.col}>
            <Card title="Notification preferences" subtitle="Choose what you're alerted about">
              <div className={styles.prefList}>
                {prefs.map(p => (
                  <div key={p.key} className={styles.prefRow}>
                    <span className={styles.prefLabel}>{p.label}</span>
                    <Toggle enabled={p.enabled} onChange={() => togglePref(p.key)} />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Security" subtitle="Password and active sessions">
              <div className={styles.secSection}>
                <div className={styles.secRow}>
                  <div>
                    <div className={styles.secLabel}>Password</div>
                    <div className={styles.secSub}>Last changed 45 days ago</div>
                  </div>
                  <button className={styles.secBtn}>Change password</button>
                </div>
                <div className={styles.secRow}>
                  <div>
                    <div className={styles.secLabel}>Two-factor authentication</div>
                    <div className={styles.secSub}>TOTP via authenticator app</div>
                  </div>
                  <Badge label="Enabled" bg="var(--color-teal-50)" color="var(--color-teal-500)" />
                </div>
              </div>
              <div className={styles.sessionDivider}>Active sessions</div>
              <div className={styles.sessionList}>
                {sessions.map((s, i) => (
                  <div key={i} className={styles.sessionRow}>
                    <div className={styles.sessionDevice}>
                      <span className={styles.sessionName}>{s.device}</span>
                      <span className={styles.sessionLoc}>{s.location} · {s.time}</span>
                    </div>
                    {s.current
                      ? <Badge label="Current" bg="var(--color-green-50)" color="var(--color-green-500)" />
                      : <button className={styles.revokeBtn}>Revoke</button>
                    }
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card title="Recent activity" subtitle="Your last 4 audit events">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Tenant</th>
                <th>IP address</th>
              </tr>
            </thead>
            <tbody>
              {myLogs.map(log => (
                <tr key={log.id} className={styles.tableRow}>
                  <td><span className={styles.mono}>{log.time}</span></td>
                  <td><span className={styles.action}>{log.action}</span></td>
                  <td className={styles.muted}>{log.resource}</td>
                  <td className={styles.muted}>{log.tenant}</td>
                  <td><span className={styles.mono}>{log.ip}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

      </div>
    </div>
  );
}
