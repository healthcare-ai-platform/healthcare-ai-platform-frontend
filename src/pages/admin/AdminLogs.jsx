import { useState, useEffect, useCallback } from 'react';
import { platformLogs, listTenants } from '../../api/admin';
import { useDebounce } from '../../hooks/useApi';
import styles from './AdminLogs.module.css';

export default function AdminLogs() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [tenantFilter, setTenant] = useState('');
  const [page, setPage]           = useState(1);
  const [tenants, setTenants]     = useState([]);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    listTenants().then(t => setTenants(Array.isArray(t) ? t : [])).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await platformLogs({ search: debouncedSearch, tenant_id: tenantFilter || undefined, page });
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, tenantFilter, page]);

  useEffect(() => { load(); }, [load]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.ceil(total / 20) || 1;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Platform logs</h1>
          <p className={styles.subtitle}>Cross-tenant audit trail · {total} entries</p>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Search by user, action, or tenant…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className={styles.select}
          value={tenantFilter}
          onChange={e => { setTenant(e.target.value); setPage(1); }}
        >
          <option value="">All tenants</option>
          {tenants.map(t => (
            <option key={t.tenant_id} value={t.tenant_id}>{t.name}</option>
          ))}
        </select>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>Loading…</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>No log entries found</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Tenant</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {items.map(log => (
                <tr key={log.id}>
                  <td className={styles.mono}>{log.time}</td>
                  <td>{log.user}</td>
                  <td><span className={styles.action}>{log.action}</span></td>
                  <td className={styles.resource}>{log.resource}</td>
                  <td>{log.tenant}</td>
                  <td className={styles.ip}>{log.ip || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ← Prev
          </button>
          <span className={styles.pageInfo}>Page {page} of {pages}</span>
          <button className={styles.pageBtn} onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
