import { useState, useEffect, useCallback } from 'react';
import { getStoredUser } from '../hooks/useAuth';
import { listFacilities, createFacility } from '../api/tenant';
import Topbar from '../components/layout/Topbar';
import styles from './Facilities.module.css';

const TYPE_LABELS = {
  hospital:        'Hospital',
  clinic:          'Clinic',
  lab:             'Lab',
  imaging_center:  'Imaging Center',
  pharmacy:        'Pharmacy',
};

const FACILITY_TYPES = Object.keys(TYPE_LABELS);

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

export default function Facilities() {
  const user     = getStoredUser();
  const tenantId = user?.tenant_id;
  const isAdmin  = user?.role === 'tenant_admin';

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm]             = useState({ name: '', type: 'clinic', city: '', address: '' });
  const [formError, setFormError]   = useState('');
  const [saving, setSaving]         = useState(false);

  const load = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    setError('');
    try {
      const data = await listFacilities(tenantId);
      setFacilities(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await createFacility(tenantId, form);
      setShowCreate(false);
      setForm({ name: '', type: 'clinic', city: '', address: '' });
      setSuccessMsg(`Facility "${form.name}" created`);
      await load();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Facilities" subtitle="Hospitals, clinics, and labs in your organisation" />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Facilities</h1>
            <p className={styles.subtitle}>
              {facilities.length} {facilities.length === 1 ? 'facility' : 'facilities'} on record
            </p>
          </div>
          {isAdmin && (
            <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
              + Add facility
            </button>
          )}
        </div>

        {successMsg && <div className={styles.successBanner}>{successMsg}</div>}
        {error      && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Loading…</div>
          ) : facilities.length === 0 ? (
            <div className={styles.empty}>
              No facilities yet.{isAdmin ? ' Add one to start uploading documents.' : ''}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map(f => (
                  <tr key={f.facility_id} className={styles.row}>
                    <td className={styles.name}>{f.name}</td>
                    <td>
                      <span className={styles.typeBadge} data-type={f.type}>
                        {TYPE_LABELS[f.type] || f.type}
                      </span>
                    </td>
                    <td className={styles.muted}>{f.city || '—'}</td>
                    <td className={styles.muted}>{f.address || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showCreate && (
          <Modal
            title="Add facility"
            onClose={() => { setShowCreate(false); setFormError(''); }}
          >
            <form onSubmit={handleCreate} className={styles.modalForm}>
              <label className={styles.label}>
                Facility name
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Downtown Imaging Center"
                  required
                  autoFocus
                />
              </label>
              <label className={styles.label}>
                Type
                <select
                  className={styles.input}
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  {FACILITY_TYPES.map(t => (
                    <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                City
                <input
                  className={styles.input}
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="New York"
                />
              </label>
              <label className={styles.label}>
                Address
                <input
                  className={styles.input}
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="1 Hospital Blvd, NY 10001"
                />
              </label>
              {formError && <div className={styles.formError}>{formError}</div>}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => { setShowCreate(false); setFormError(''); }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  {saving ? 'Saving…' : 'Add facility'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
}
