import AdminSidebar from './AdminSidebar';
import styles from './AppLayout.module.css';

export default function AdminLayout({ children }) {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
}
