import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
}
