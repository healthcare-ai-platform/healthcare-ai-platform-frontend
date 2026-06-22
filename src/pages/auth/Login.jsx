import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { storeAuth, roleHomeRoute } from '../../hooks/useAuth';
import styles from './Auth.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await login(email, password);
      storeAuth(tokens);
      const payload = JSON.parse(atob(tokens.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      navigate(roleHomeRoute(payload.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

        <h1 className={styles.heading}>Sign in to your account</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email address
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
