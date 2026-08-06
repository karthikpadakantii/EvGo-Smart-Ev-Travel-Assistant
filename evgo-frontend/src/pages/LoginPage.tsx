import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '@/api/userApi';
import { useAuth } from '@/context/AuthContext';
import ErrorMessage from '@/components/common/ErrorMessage';
import { isValidEmail, isRequired } from '@/utils/validators';
import type { ApiError } from '@/types/common';

function LoginIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background circles */}
      <circle cx="200" cy="250" r="180" fill="rgba(8, 145, 178, 0.06)" />
      <circle cx="200" cy="250" r="130" fill="rgba(8, 145, 178, 0.08)" />
      <circle cx="200" cy="250" r="80" fill="rgba(8, 145, 178, 0.1)" />

      {/* Charging plug */}
      <g transform="translate(160, 160)">
        <rect x="20" y="0" width="40" height="120" rx="20" fill="#0891b2" />
        <rect x="30" y="110" width="20" height="40" rx="4" fill="#0e7490" />
        <rect x="26" y="140" width="28" height="8" rx="4" fill="#155e75" />

        {/* Prongs */}
        <rect x="30" y="-20" width="8" height="25" rx="4" fill="#475569" />
        <rect x="42" y="-20" width="8" height="25" rx="4" fill="#475569" />

        {/* Lightning */}
        <path d="M38 50 L46 50 L42 65 L50 65 L35 90 L39 72 L32 72 Z" fill="#fbbf24" />
      </g>

      {/* Floating dots */}
      <circle cx="80" cy="120" r="4" fill="#0891b2" opacity="0.2">
        <animate attributeName="cy" values="120;105;120" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="180" r="3" fill="#d97706" opacity="0.25">
        <animate attributeName="cy" values="180;165;180" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="350" r="5" fill="#059669" opacity="0.15">
        <animate attributeName="cy" values="350;335;350" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="300" cy="380" r="3" fill="#0891b2" opacity="0.2">
        <animate attributeName="cy" values="380;368;380" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { justRegistered?: boolean } };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!isValidEmail(email)) next.email = 'Enter a valid email address.';
    if (!isRequired(password)) next.password = 'Enter your password.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const userResponse = await loginUser({ email, password });
      await login(userResponse.userId);
      navigate('/dashboard');
    } catch (err) {
      setApiError((err as ApiError).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
    }}>
      {/* Left: Illustration */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f7fa 50%, #f0f9ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="login-illustration-panel"
      >
        <div style={{ maxWidth: 360, width: '100%' }}>
          <LoginIllustration />
        </div>

      </div>

      {/* Right: Form */}
      <div style={{
        width: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        flexShrink: 0,
      }}
        className="login-form-panel"
      >
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Logo */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: 'var(--space-6)' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>
                EvGo
              </span>
            </Link>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Welcome back</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Sign in to plan your next EV journey
            </p>
          </div>

          {location.state?.justRegistered && (
            <div className="success-banner" style={{ marginBottom: 'var(--space-5)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Account created successfully. Sign in to continue.
            </div>
          )}

          <ErrorMessage message={apiError} />

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting} style={{ marginTop: 'var(--space-3)' }}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-illustration-panel { display: none !important; }
          .login-form-panel { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
