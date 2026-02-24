'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './LoginScreen.module.css';

type Mode = 'signin' | 'signup';

export function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(mode);

    const errMsg = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password);

    setSubmitting('');

    if (errMsg) {
      setError(errMsg);
    } else if (mode === 'signup') {
      setError('Check your email to confirm your account, then sign in.');
    }
  };

  const toggleMode = () => {
    setMode(m => m === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.meshBackground}>
        <div className={styles.meshOrb} />
      </div>

      <div className={styles.card}>
        <h1 className={styles.logo}>
          Vibe <span className={styles.logoAccent}>PM</span>
        </h1>
        <p className={styles.tagline}>
          {mode === 'signin' ? 'Sign in to your workspace' : 'Create your workspace'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={!!submitting}>
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" className={styles.toggleLink} onClick={toggleMode}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
