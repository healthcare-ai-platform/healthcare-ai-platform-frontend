import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import { useFetch, useDebounce } from '../hooks/useApi';
import styles from './Audit.module.css';

const actionColor = (action) => {
  if (action.includes('export') || action.includes('Export')) return { bg: '#faeeda', color: '#854f0b' };
  if (action.includes('create') || action.includes('Created')) return { bg: '#eeedfe', color: '#534ab7' };
  if (action.includes('retry') || action.includes('validate')) return { bg: '#e6f1fb', color: '#185fa5' };
  return { bg: '#f1f3f7', color: '#4b5669' };
};

export default function Audit() {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const debouncedSearch = useDebounce(search);

  const params = new URLSearchParams({ page, page_size: 20 });
  if (debouncedSearch) params.set('search', debouncedSearch);

  const { data, loading, error } = useFetch(`/api/v1/audit/?${params}`);

  const logs  = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 0;

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div className={styles.page}>
      <Topbar title="Audit logs" subtitle="All user actions · immutable record" />
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Search by user, action, or tenant…"
            value={search}
            onChange={handleSearch}
          />
          <div className={styles.count}>{loading ? '…' : `${total} events`}</div>
        </div>

        <Card>
          {error ? (
            <div className={styles.empty} style={{ color: '#a32d2d' }}>Failed to load: {error}</div>
          ) : (
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
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {[1,2,3,4,5,6].map(j => (
                        <td key={j}><div style={{ height: 14, background: 'var(--color-bg-tertiary)', borderRadius: 4 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : logs.map(log => {
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
          )}
          {!loading && !error && logs.length === 0 && (
            <div className={styles.empty}>No audit events match this search.</div>
          )}
        </Card>

        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid var(--color-border)', cursor: 'pointer' }}>
              ← Prev
            </button>
            <span style={{ padding: '4px 8px', fontSize: 13, color: 'var(--color-text-muted)' }}>
              Page {page} of {pages}
            </span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid var(--color-border)', cursor: 'pointer' }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
