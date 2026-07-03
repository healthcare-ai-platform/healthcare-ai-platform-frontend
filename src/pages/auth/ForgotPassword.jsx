import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
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

        <h1 className={styles.heading}>Reset your password</h1>
        <p className={styles.sub}>
          Enter the email address on your account and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className={styles.successBox}>
            If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your inbox.
          </div>
        ) : (
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

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <Link to="/login" className={styles.backLink}>← Back to sign in</Link>
      </div>
    </div>
  );
}
