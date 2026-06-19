import { useState } from 'react';
import Topbar from '../components/layout/Topbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { patients } from '../data/mockData';
import { patientStatusConfig } from '../utils/helpers';
import styles from './Patients.module.css';

export default function Patients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.hospital.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>
      <Topbar title="Patients" subtitle="Patient-level report analytics" />
      <div className={styles.content}>
        <div className={styles.filters}>
          <input
            className={styles.search}
            placeholder="Search by name, ID, or facility…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className={styles.filterGroup}>
            {['all', 'normal', 'review', 'abnormal'].map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${statusFilter === s ? styles.active : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.count}>{filtered.length} patients</div>
        </div>

        <Card>
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
              {filtered.map(p => {
                const s = patientStatusConfig[p.status];
                return (
                  <tr key={p.id} className={styles.tableRow}>
                    <td><span className={styles.patientId}>{p.id}</span></td>
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
          {filtered.length === 0 && (
            <div className={styles.empty}>No patients match this filter.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
