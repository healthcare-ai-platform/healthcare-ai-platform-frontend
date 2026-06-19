import Topbar from '../components/layout/Topbar';
import styles from './Placeholder.module.css';

export default function Placeholder({ title, subtitle, description }) {
  return (
    <div className={styles.page}>
      <Topbar title={title} subtitle={subtitle} />
      <div className={styles.content}>
        <div className={styles.empty}>
          <div className={styles.icon}>📦</div>
          <div className={styles.label}>{description || 'This section is coming in the next phase.'}</div>
        </div>
      </div>
    </div>
  );
}
