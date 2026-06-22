import { useState, useEffect, useCallback } from 'react';
import { getStoredUser } from '../../hooks/useAuth';
import { listUsers, inviteUser, suspendUser, listFacilities } from '../../api/tenant';
import Topbar from '../../components/layout/Topbar';
import styles from './TenantTeam.module.css';

const ROLE_LABELS = {
  tenant_admin: 'Tenant Admin',
  manager:      'Manager',
  analyst:      'Analyst',
  doctor:       'Doctor',
  ops:          'Ops',
  viewer:       'Viewer',
};

const INVITE_ROLES = ['manager', 'analyst', 'doctor'];

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

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

export default function TenantTeam() {
  const user       = getStoredUser();
  const tenantId   = user?.tenant_id;
  const isAdmin    = user?.role === 'tenant_admin';

  const [users, setUsers]           = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm]             = useState({ name: '', email: '', role: 'analyst', facility_id: '' });
  const [formError, setFormError]   = useState('');
  const [sending, setSending]       = useState(false);

  const load = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    setError('');
    try {
      const [usersData, facsData] = await Promise.all([
        listUsers(tenantId),
        isAdmin ? listFacilities(tenantId) : Promise.resolve([]),
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setFacilities(Array.isArray(facsData) ? facsData : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tenantId, isAdmin]);

  useEffect(() => { load(); }, [load]);

  async function handleInvite(e) {
    e.preventDefault();
    setFormError('');
    setSending(true);
    try {
      const payload = {
        name:        form.name,
        email:       form.email,
        role:        form.role,
        facility_id: form.facility_id || undefined,
      };
      await inviteUser(tenantId, payload);
      setShowInvite(false);
      setForm({ name: '', email: '', role: 'analyst', facility_id: '' });
      setSuccessMsg(`Invite sent to ${form.email}`);
      await load();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function handleSuspend(userId, name) {
    if (!window.confirm(`Suspend ${name}? They will no longer be able to log in.`)) return;
    try {
      await suspendUser(tenantId, userId);
      setSuccessMsg(`${name} suspended`);
      await load();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <Topbar title="Team" subtitle="Users in your organisation" />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Team members</h1>
            <p className={styles.subtitle}>
              {users.length} {users.length === 1 ? 'user' : 'users'} in this tenant
            </p>
          </div>
          {isAdmin && (
            <button className={styles.btnPrimary} onClick={() => setShowInvite(true)}>
              + Invite user
            </button>
          )}
        </div>

        {successMsg && <div className={styles.successBanner}>{successMsg}</div>}
        {error      && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Loading…</div>
          ) : users.length === 0 ? (
            <div className={styles.empty}>No users found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Facility</th>
                  <th>Status</th>
                  <th>Joined</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id} className={styles.row}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>{initials(u.name || u.email)}</div>
                        <div>
                          <div className={styles.userName}>{u.name || '—'}</div>
                          <div className={styles.userEmail}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.roleBadge} data-role={u.role}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className={styles.facility}>{u.facility_name || '—'}</td>
                    <td>
                      <span className={styles.statusBadge} data-status={u.status}>
                        {u.status}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    {isAdmin && (
                      <td>
                        {u.role !== 'tenant_admin' && u.status !== 'suspended' && (
                          <button
                            className={styles.btnDanger}
                            onClick={() => handleSuspend(u.user_id, u.name || u.email)}
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showInvite && (
          <Modal
            title="Invite team member"
            onClose={() => { setShowInvite(false); setFormError(''); }}
          >
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
              <label className={styles.label}>
                Role
                <select
                  className={styles.input}
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  {INVITE_ROLES.map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                  ))}
                </select>
              </label>
              {facilities.length > 0 && (
                <label className={styles.label}>
                  Facility (optional)
                  <select
                    className={styles.input}
                    value={form.facility_id}
                    onChange={e => setForm(f => ({ ...f, facility_id: e.target.value }))}
                  >
                    <option value="">— No facility —</option>
                    {facilities.map(f => (
                      <option key={f.facility_id} value={f.facility_id}>{f.name}</option>
                    ))}
                  </select>
                </label>
              )}
              {formError && <div className={styles.formError}>{formError}</div>}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => { setShowInvite(false); setFormError(''); }}
                >
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
    </>
  );
}
