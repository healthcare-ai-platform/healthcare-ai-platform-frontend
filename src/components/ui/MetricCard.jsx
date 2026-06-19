import styles from './MetricCard.module.css';

export default function MetricCard({ label, value, delta, deltaType = 'neutral' }) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {delta && (
        <div className={`${styles.delta} ${styles[deltaType]}`}>{delta}</div>
      )}
    </div>
  );
}
