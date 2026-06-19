import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MetricCard from '../components/ui/MetricCard';
import { pipelineQueue } from '../data/mockData';
import { statusConfig } from '../utils/helpers';
import styles from './Queue.module.css';

export default function Queue() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? pipelineQueue
    : pipelineQueue.filter(d => d.status === filter);

  const counts = pipelineQueue.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <Topbar title="Processing queue" subtitle="All documents in pipeline" />
      <div className={styles.content}>
        <div className={styles.metrics}>
          <MetricCard label="Total in queue" value={pipelineQueue.length.toString()} />
          <MetricCard label="Extracting" value={(counts.extracting || 0).toString()} deltaType="neutral" />
          <MetricCard label="Failed" value={(counts.failed || 0).toString()} deltaType="negative" delta="Needs retry" />
          <MetricCard label="Loaded" value={(counts.loaded || 0).toString()} deltaType="positive" />
        </div>

        <div className={styles.filterBar}>
          {['all', 'loaded', 'extracting', 'ocr', 'queued', 'failed'].map(s => {
            const cfg = statusConfig[s];
            return (
              <button
                key={s}
                className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
                onClick={() => setFilter(s)}
                style={filter === s && cfg ? { background: cfg.bg, color: cfg.color, borderColor: cfg.bg } : {}}
              >
                {s === 'all' ? 'All' : cfg?.label || s}
                {s !== 'all' && counts[s] ? <span className={styles.filterCount}>{counts[s]}</span> : null}
              </button>
            );
          })}
        </div>

        <Card>
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
              {filtered.map(doc => {
                const s = statusConfig[doc.status];
                return (
                  <tr key={doc.id} className={styles.row}>
                    <td><span className={styles.mono}>{doc.id}</span></td>
                    <td><span className={styles.docName}>{doc.name}</span></td>
                    <td className={styles.muted}>{doc.type}</td>
                    <td className={styles.muted}>{doc.tenant}</td>
                    <td><Badge label={s.label} bg={s.bg} color={s.color} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
