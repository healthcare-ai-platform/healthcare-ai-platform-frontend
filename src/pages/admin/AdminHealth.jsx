import { useState, useEffect } from 'react';
import { systemHealth } from '../../api/admin';
import styles from './AdminHealth.module.css';

function Metric({ label, value, color }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricValue} style={{ color }}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

export default function AdminHealth() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    systemHealth()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.page}><div className={styles.loading}>Loading…</div></div>;
  if (error)   return <div className={styles.page}><div className={styles.error}>{error}</div></div>;

  const pipelineEntries = data?.pipeline ? Object.entries(data.pipeline) : [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>System health</h1>
        <p className={styles.subtitle}>Live platform status · today</p>
      </div>

      <div className={styles.metrics}>
        <Metric label="Total tenants"   value={data.total_tenants} />
        <Metric label="Docs today"      value={data.docs_today} />
        <Metric label="In progress"     value={data.in_progress} color="var(--color-amber-500)" />
        <Metric label="Failed today"    value={data.failed_today} color={data.failed_today > 0 ? 'var(--color-red-500)' : undefined} />
      </div>

      <div className={styles.row}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Pipeline breakdown</div>
          {pipelineEntries.length === 0 ? (
            <div className={styles.empty}>No documents today</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr><th>Status</th><th>Count</th></tr>
              </thead>
              <tbody>
                {pipelineEntries.map(([status, count]) => (
                  <tr key={status}>
                    <td><span className={styles.statusChip} data-status={status}>{status}</span></td>
                    <td className={styles.countCell}>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.card} style={{ flex: 2 }}>
          <div className={styles.cardTitle}>Per-tenant activity</div>
          {(!data.per_tenant || data.per_tenant.length === 0) ? (
            <div className={styles.empty}>No data</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr><th>Tenant</th><th>Docs today</th><th>In progress</th><th>Failed</th></tr>
              </thead>
              <tbody>
                {data.per_tenant.map(t => (
                  <tr key={t.tenant_id}>
                    <td className={styles.orgName}>{t.name}</td>
                    <td>{t.docs_today}</td>
                    <td>{t.in_progress}</td>
                    <td style={{ color: t.failed > 0 ? 'var(--color-red-500)' : undefined }}>{t.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
