import { useClock } from '../../hooks/useLive';
import styles from './Topbar.module.css';

export default function Topbar({ title, subtitle }) {
  const time = useClock();

  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.right}>
        <span className={styles.livePill}>
          <span className={styles.liveDot} />
          Live · {time}
        </span>
        <div className={styles.alert}>
          ⚠ <span>3 alerts</span>
        </div>
      </div>
    </header>
  );
}
