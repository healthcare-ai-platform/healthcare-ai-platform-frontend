import { useState, useEffect } from 'react';
import { billing } from '../../api/admin';
import styles from './AdminBilling.module.css';

export default function AdminBilling() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    billing()
      .then(data => setRows(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalDocs  = rows.reduce((s, r) => s + r.docs_this_month, 0);
  const totalUsers = rows.reduce((s, r) => s + r.user_count, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Billing</h1>
        <p className={styles.subtitle}>Usage per tenant · current month</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {!loading && rows.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{rows.length}</span>
            <span className={styles.summaryLabel}>Active tenants</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{totalUsers}</span>
            <span className={styles.summaryLabel}>Total users</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{totalDocs.toLocaleString()}</span>
            <span className={styles.summaryLabel}>Docs this month</span>
          </div>
        </div>
      )}

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>Loading…</div>
        ) : rows.length === 0 ? (
          <div className={styles.empty}>No billing data available</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Users</th>
                <th>Docs this month</th>
                <th>Docs total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.tenant_id}>
                  <td className={styles.orgCell}>
                    <div className={styles.orgAvatar}>{r.name.slice(0, 2).toUpperCase()}</div>
                    <span>{r.name}</span>
                  </td>
                  <td><span className={styles.planTag}>{r.plan}</span></td>
                  <td>
                    <span className={styles.statusDot} data-status={r.status} />
                    <span className={styles.statusLabel}>{r.status}</span>
                  </td>
                  <td>{r.user_count}</td>
                  <td className={styles.highlight}>{r.docs_this_month.toLocaleString()}</td>
                  <td className={styles.muted}>{r.docs_total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
