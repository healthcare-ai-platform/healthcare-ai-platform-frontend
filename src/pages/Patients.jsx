import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { patientStatusConfig } from '../utils/helpers';
import { useFetch, useDebounce } from '../hooks/useApi';
import styles from './Patients.module.css';

export default function Patients() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage]               = useState(1);

  const debouncedSearch = useDebounce(search);

  const params = new URLSearchParams({ page, page_size: 20 });
  if (debouncedSearch)              params.set('search', debouncedSearch);
  if (statusFilter !== 'all')       params.set('status', statusFilter);

  const { data, loading, error } = useFetch(`/api/v1/patients/?${params}`);

  const patients = data?.items ?? [];
  const total    = data?.total ?? 0;
  const pages    = data?.pages ?? 0;

  function handleFilterChange(s) {
    setStatusFilter(s);
    setPage(1);
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div className={styles.page}>
      <Topbar title="Patients" subtitle="Patient-level report analytics" />
      <div className={styles.content}>
        <div className={styles.filters}>
          <input
            className={styles.search}
            placeholder="Search by name, ID, or facility…"
            value={search}
            onChange={handleSearch}
          />
          <div className={styles.filterGroup}>
            {['all', 'normal', 'review', 'abnormal'].map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${statusFilter === s ? styles.active : ''}`}
                onClick={() => handleFilterChange(s)}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.count}>{loading ? '…' : `${total} patients`}</div>
        </div>

        <Card>
          {error ? (
            <div className={styles.empty} style={{ color: '#a32d2d' }}>Failed to load: {error}</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Doctor</th>
                  <th>Facility</th>
                  <th>Last report</th>
                  <th>Date</th>
                  <th>Reports</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j}><div style={{ height: 14, background: 'var(--color-bg-tertiary)', borderRadius: 4 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : patients.map(p => {
                  const s = patientStatusConfig[p.status] ?? { label: p.status, bg: '#f1f3f7', color: '#4b5669' };
                  return (
                    <tr key={p.id} className={styles.tableRow}>
                      <td><span className={styles.patientId}>{p.id.slice(0, 8)}</span></td>
                      <td><span className={styles.patientName}>{p.name}</span></td>
                      <td className={styles.muted}>{p.age}</td>
                      <td className={styles.muted}>{p.doctor}</td>
                      <td className={styles.muted}>{p.hospital}</td>
                      <td className={styles.muted}>{p.lastReport}</td>
                      <td className={styles.muted}>{p.date}</td>
                      <td><span className={styles.reportCount}>{p.reports}</span></td>
                      <td><Badge label={s.label} bg={s.bg} color={s.color} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && !error && patients.length === 0 && (
            <div className={styles.empty}>No patients match this filter.</div>
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
