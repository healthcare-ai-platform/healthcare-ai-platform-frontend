import styles from './Card.module.css';

export default function Card({ title, subtitle, children, action, style }) {
  return (
    <div className={styles.card} style={style}>
      {(title || action) && (
        <div className={styles.header}>
          <div>
            <span className={styles.title}>{title}</span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
