import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import { auditLogs } from '../data/mockData';
import styles from './Audit.module.css';

const actionColor = (action) => {
  if (action.includes('Export')) return { bg: '#faeeda', color: '#854f0b' };
  if (action.includes('Created')) return { bg: '#eeedfe', color: '#534ab7' };
  if (action.includes('retry')) return { bg: '#e6f1fb', color: '#185fa5' };
  return { bg: '#f1f3f7', color: '#4b5669' };
};

export default function Audit() {
  const [search, setSearch] = useState('');
  const filtered = auditLogs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.tenant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <Topbar title="Audit logs" subtitle="All user actions · immutable record" />
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Search by user, action, or tenant…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className={styles.count}>{filtered.length} events</div>
        </div>

        <Card>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Tenant</th>
                <th>IP address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const ac = actionColor(log.action);
                return (
                  <tr key={log.id} className={styles.row}>
                    <td><span className={styles.mono}>{log.time}</span></td>
                    <td><span className={styles.user}>{log.user}</span></td>
                    <td>
                      <span className={styles.actionBadge} style={{ background: ac.bg, color: ac.color }}>
                        {log.action}
                      </span>
                    </td>
                    <td className={styles.muted}>{log.resource}</td>
                    <td className={styles.muted}>{log.tenant}</td>
                    <td><span className={styles.mono}>{log.ip}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className={styles.empty}>No audit events match this search.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
