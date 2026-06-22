import { useState, useEffect, useCallback } from 'react';
import { listTenants, createTenant, suspendTenant } from '../../api/admin';
import styles from './AdminTenants.module.css';

const PLANS = ['starter', 'growth', 'enterprise'];

function StatusBadge({ status }) {
  const map = {
    active:    { bg: 'var(--color-green-50)',  color: 'var(--color-green-500)'  },
    suspended: { bg: 'var(--color-red-50)',    color: 'var(--color-red-500)'    },
    invited:   { bg: 'var(--color-amber-50)',  color: 'var(--color-amber-500)'  },
  };
  const s = map[status] || map.invited;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: '2px 8px',
      borderRadius: 999, background: s.bg, color: s.color,
    }}>
      {status}
    </span>
  );
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

export default function AdminTenants() {
  const [tenants, setTenants]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [suspending, setSuspending] = useState(null);

  const [form, setForm] = useState({ org_name: '', plan: 'starter', admin_name: '', admin_email: '' });
  const [formError, setFormError]   = useState('');
  const [creating, setCreating]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTenants();
      setTenants(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      await createTenant(form);
      setShowCreate(false);
      setForm({ org_name: '', plan: 'starter', admin_name: '', admin_email: '' });
      setSuccessMsg(`Tenant "${form.org_name}" created — invite email sent to ${form.admin_email}`);
      await load();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleSuspend(tenantId, name) {
    if (!window.confirm(`Suspend "${name}"? All users will lose access.`)) return;
    setSuspending(tenantId);
    try {
      await suspendTenant(tenantId);
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setSuspending(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tenants</h1>
          <p className={styles.subtitle}>Manage all organizations on the platform</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
          + New tenant
        </button>
      </div>

      {successMsg && <div className={styles.successBanner}>{successMsg}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>Loading…</div>
        ) : tenants.length === 0 ? (
          <div className={styles.empty}>No tenants yet. Create the first one.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.tenant_id}>
                  <td className={styles.orgCell}>
                    <div className={styles.orgAvatar}>{t.name.slice(0, 2).toUpperCase()}</div>
                    <span>{t.name}</span>
                  </td>
                  <td><span className={styles.planTag}>{t.plan}</span></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className={styles.dateCell}>
                    {t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    {t.status !== 'suspended' && (
                      <button
                        className={styles.btnDanger}
                        onClick={() => handleSuspend(t.tenant_id, t.name)}
                        disabled={suspending === t.tenant_id}
                      >
                        {suspending === t.tenant_id ? '…' : 'Suspend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && (
        <Modal title="Create new tenant" onClose={() => { setShowCreate(false); setFormError(''); }}>
          <form onSubmit={handleCreate} className={styles.modalForm}>
            <label className={styles.label}>
              Organization name
              <input
                className={styles.input}
                value={form.org_name}
                onChange={e => setForm(f => ({ ...f, org_name: e.target.value }))}
                placeholder="Acme Health System"
                required
              />
            </label>

            <label className={styles.label}>
              Plan
              <select
                className={styles.input}
                value={form.plan}
                onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
              >
                {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </label>

            <label className={styles.label}>
              Admin name
              <input
                className={styles.input}
                value={form.admin_name}
                onChange={e => setForm(f => ({ ...f, admin_name: e.target.value }))}
                placeholder="Jane Doe"
                required
              />
            </label>

            <label className={styles.label}>
              Admin email
              <input
                type="email"
                className={styles.input}
                value={form.admin_email}
                onChange={e => setForm(f => ({ ...f, admin_email: e.target.value }))}
                placeholder="jane@acmehealth.com"
                required
              />
            </label>

            {formError && <div className={styles.formError}>{formError}</div>}

            <div className={styles.modalActions}>
              <button type="button" className={styles.btnSecondary} onClick={() => { setShowCreate(false); setFormError(''); }}>
                Cancel
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={creating}>
                {creating ? 'Creating…' : 'Create & send invite'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
