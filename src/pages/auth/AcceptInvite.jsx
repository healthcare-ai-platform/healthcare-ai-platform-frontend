import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { acceptInvite } from '../../api/auth';
import { storeAuth, roleHomeRoute } from '../../hooks/useAuth';
import styles from './Auth.module.css';

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const tokens = await acceptInvite(token, password);
      storeAuth(tokens);
      const payload = JSON.parse(atob(tokens.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      navigate(roleHomeRoute(payload.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.error}>No invite token found in URL.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>H</div>
          <div>
            <div className={styles.brandName}>HealthAI</div>
            <div className={styles.brandSub}>Data Platform</div>
          </div>
        </div>

        <h1 className={styles.heading}>Set your password</h1>
        <p className={styles.sub}>You have been invited to the platform. Create a password to activate your account.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            New password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
              autoFocus
            />
          </label>

          <label className={styles.label}>
            Confirm password
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Setting password…' : 'Activate account'}
          </button>
        </form>
      </div>
    </div>
  );
}
