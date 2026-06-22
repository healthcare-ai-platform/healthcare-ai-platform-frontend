import { useState, useEffect, useCallback } from 'react';
import { listAdminUsers, inviteAdmin } from '../../api/admin';
import styles from './AdminUsers.module.css';

function Modal({ title, onClose, children }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{title}</span>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function AdminUsers() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm]           = useState({ name: '', email: '' });
  const [formError, setFormError] = useState('');
  const [sending, setSending]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleInvite(e) {
    e.preventDefault();
    setFormError('');
    setSending(true);
    try {
      await inviteAdmin(form);
      setShowInvite(false);
      setForm({ name: '', email: '' });
      setSuccessMsg(`Invite sent to ${form.email}`);
      await load();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin users</h1>
          <p className={styles.subtitle}>Platform administrators with full access</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowInvite(true)}>
          + Invite admin
        </button>
      </div>

      {successMsg && <div className={styles.successBanner}>{successMsg}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>Loading…</div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>No admin users found</div>
        ) : (
          <div className={styles.userList}>
            {users.map(u => (
              <div key={u.user_id} className={styles.userRow}>
                <div className={styles.avatar}>{initials(u.name || u.email)}</div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{u.name || '—'}</div>
                  <div className={styles.userEmail}>{u.email}</div>
                </div>
                <span className={styles.badge} data-status={u.status}>{u.status}</span>
                <span className={styles.joinDate}>
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showInvite && (
        <Modal title="Invite platform admin" onClose={() => { setShowInvite(false); setFormError(''); }}>
          <form onSubmit={handleInvite} className={styles.modalForm}>
            <label className={styles.label}>
              Full name
              <input
                className={styles.input}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jane Smith"
                required
              />
            </label>
            <label className={styles.label}>
              Email address
              <input
                type="email"
                className={styles.input}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@company.com"
                required
              />
            </label>
            {formError && <div className={styles.formError}>{formError}</div>}
            <div className={styles.modalActions}>
              <button type="button" className={styles.btnSecondary} onClick={() => { setShowInvite(false); setFormError(''); }}>
                Cancel
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={sending}>
                {sending ? 'Sending…' : 'Send invite'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
