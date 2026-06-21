import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MetricCard from '../components/ui/MetricCard';
import { statusConfig } from '../utils/helpers';
import { useFetch } from '../hooks/useApi';
import styles from './Queue.module.css';

const FILTER_STATUSES = ['all', 'loaded', 'extracting', 'ocr', 'received', 'failed'];

export default function Queue() {
  const [filter, setFilter] = useState('all');
  const [page, setPage]     = useState(1);

  const params = new URLSearchParams({ page, page_size: 20 });
  if (filter !== 'all') params.set('status', filter);

  const { data, loading, error } = useFetch(`/api/v1/queue/?${params}`);
  const { data: allData }        = useFetch('/api/v1/queue/?page_size=100');

  const docs  = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 0;

  const allDocs = allData?.items ?? [];
  const counts  = allDocs.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  function handleFilter(s) {
    setFilter(s);
    setPage(1);
  }

  return (
    <div className={styles.page}>
      <Topbar title="Processing queue" subtitle="All documents in pipeline" />
      <div className={styles.content}>
        <div className={styles.metrics}>
          <MetricCard label="Total in queue"  value={allData ? allDocs.length.toString() : '…'} />
          <MetricCard label="Extracting"      value={(counts.extracting || 0).toString()} deltaType="neutral" />
          <MetricCard label="Failed"          value={(counts.failed || 0).toString()} deltaType="negative" delta="Needs retry" />
          <MetricCard label="Loaded"          value={(counts.loaded || 0).toString()} deltaType="positive" />
        </div>

        <div className={styles.filterBar}>
          {FILTER_STATUSES.map(s => {
            const cfg = statusConfig[s];
            return (
              <button
                key={s}
                className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
                onClick={() => handleFilter(s)}
                style={filter === s && cfg ? { background: cfg.bg, color: cfg.color, borderColor: cfg.bg } : {}}
              >
                {s === 'all' ? 'All' : cfg?.label || s}
                {s !== 'all' && counts[s] ? <span className={styles.filterCount}>{counts[s]}</span> : null}
              </button>
            );
          })}
        </div>

        <Card>
          {error ? (
            <div style={{ padding: 24, color: '#a32d2d' }}>Failed to load: {error}</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Document ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Tenant</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {[1,2,3,4,5].map(j => (
                        <td key={j}><div style={{ height: 14, background: 'var(--color-bg-tertiary)', borderRadius: 4 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : docs.map(doc => {
                  const s = statusConfig[doc.status] ?? { label: doc.status, bg: '#f1f3f7', color: '#4b5669' };
                  return (
                    <tr key={doc.id} className={styles.row}>
                      <td><span className={styles.mono}>{doc.id.slice(0, 8)}</span></td>
                      <td><span className={styles.docName}>{doc.name}</span></td>
                      <td className={styles.muted}>{doc.type}</td>
                      <td className={styles.muted}>{doc.tenant}</td>
                      <td><Badge label={s.label} bg={s.bg} color={s.color} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>

        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid var(--color-border)', cursor: 'pointer' }}>
              ← Prev
            </button>
            <span style={{ padding: '4px 8px', fontSize: 13, color: 'var(--color-text-muted)' }}>
              Page {page} of {pages} · {total} total
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
