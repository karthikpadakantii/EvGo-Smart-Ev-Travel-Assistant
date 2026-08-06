import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '@/api/userApi';
import ErrorMessage from '@/components/common/ErrorMessage';
import { isRequired, isValidEmail, minLength } from '@/utils/validators';
import type { ApiError } from '@/types/common';

function RegisterIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background rings */}
      <circle cx="200" cy="220" r="160" fill="rgba(5, 150, 105, 0.05)" />
      <circle cx="200" cy="220" r="110" fill="rgba(5, 150, 105, 0.07)" />

      {/* Map pin */}
      <g transform="translate(170, 100)">
        <path d="M30 0C13.4 0 0 13.4 0 30c0 22.5 30 50 30 50s30-27.5 30-50C60 13.4 46.6 0 30 0z" fill="#0891b2" />
        <circle cx="30" cy="28" r="12" fill="#fff" />
        <circle cx="30" cy="28" r="5" fill="#0891b2" />
      </g>

      {/* Route line */}
      <path d="M200 170 Q160 220 180 280 Q200 340 240 360" stroke="#0891b2" strokeWidth="3" fill="none" strokeDasharray="8 6" opacity="0.5" />

      {/* Dots on route */}
      <circle cx="200" cy="170" r="6" fill="#0891b2" />
      <circle cx="180" cy="280" r="5" fill="#d97706" />
      <circle cx="240" cy="360" r="6" fill="#059669" />

      {/* Car icon */}
      <g transform="translate(155, 240)">
        <rect x="5" y="10" width="50" height="22" rx="6" fill="#fff" stroke="#0891b2" strokeWidth="1.5" />
        <rect x="14" y="2" width="32" height="16" rx="4" fill="#fff" stroke="#0891b2" strokeWidth="1.5" />
        <rect x="18" y="5" width="10" height="10" rx="2" fill="#0891b2" opacity="0.3" />
        <rect x="32" y="5" width="10" height="10" rx="2" fill="#0891b2" opacity="0.2" />
        <circle cx="16" cy="34" r="5" fill="#1e293b" />
        <circle cx="44" cy="34" r="5" fill="#1e293b" />
      </g>

      {/* Floating particles */}
      <circle cx="80" cy="150" r="3" fill="#0891b2" opacity="0.2">
        <animate attributeName="cy" values="150;135;150" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="330" cy="200" r="2.5" fill="#d97706" opacity="0.25">
        <animate attributeName="cy" values="200;188;200" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="380" r="4" fill="#059669" opacity="0.15">
        <animate attributeName="cy" values="380;368;380" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="400" r="3" fill="#0891b2" opacity="0.2">
        <animate attributeName="cy" values="400;390;400" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const next: Record<string, string> = {};
    if (!isRequired(firstName)) next.firstName = 'Enter your first name.';
    if (!isRequired(lastName)) next.lastName = 'Enter your last name.';
    if (!isValidEmail(email)) next.email = 'Enter a valid email address.';
    if (!minLength(password, 8)) next.password = 'Password must be at least 8 characters.';
    if (!isRequired(phoneNumber)) next.phoneNumber = 'Enter your phone number.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerUser({ firstName, lastName, email, password, phoneNumber });
      navigate('/login', { state: { justRegistered: true } });
    } catch (err) {
      setApiError((err as ApiError).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Left: Illustration */}
      <div
        className="register-illustration-panel"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 360, width: '100%' }}>
          <RegisterIllustration />
        </div>

      </div>

      {/* Right: Form */}
      <div
        className="register-form-panel"
        style={{
          width: 520,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8)',
          flexShrink: 0,
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
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
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Create your account</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Join EvGo to plan EV journeys and manage charging reservations
            </p>
          </div>

          <ErrorMessage message={apiError} />

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="phoneNumber">Phone number</label>
              <input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91 98765 43210" />
              {fieldErrors.phoneNumber && <span className="field-error">{fieldErrors.phoneNumber}</span>}
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting} style={{ marginTop: 'var(--space-3)' }}>
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .register-illustration-panel { display: none !important; }
          .register-form-panel { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
