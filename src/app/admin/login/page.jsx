'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Invalid password');
        return;
      }

      router.push('/admin/products');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left branding section */}
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <ShieldCheck size={36} className={styles.logoIcon} />
            <h2>BK Admin</h2>
          </div>
          <h1 className={styles.brandTitle}>
            Secure Portal Access
          </h1>
          <p className={styles.brandDesc}>
            Manage your product catalog, review quote requests, and keep your inventory up to date.
          </p>
        </div>

        {/* Right login form section */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <Lock size={24} />
              </div>
              <h2 className={styles.title}>Welcome Back</h2>
              <p className={styles.subtitle}>Enter your password to continue</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Admin Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={styles.input}
                  required
                  autoFocus
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" disabled={loading} className={styles.btn}>
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <a href="/" className={styles.backLink}>Return to Public Website</a>
          </div>
        </div>
      </div>
    </div>
  );
}
