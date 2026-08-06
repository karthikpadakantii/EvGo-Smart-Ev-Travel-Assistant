import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        {/* Illustration */}
        <div style={{ marginBottom: 'var(--space-6)', opacity: 0.9 }}>
          <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Road */}
            <path d="M20 140 Q100 120 180 140" stroke="var(--color-border)" strokeWidth="4" fill="none" />
            <path d="M20 148 Q100 128 180 148" stroke="var(--color-border)" strokeWidth="2" fill="none" strokeDasharray="8 6" />

            {/* Sign post */}
            <rect x="96" y="40" width="6" height="100" rx="3" fill="var(--color-border)" />
            <rect x="50" y="36" width="100" height="40" rx="8" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1.5" />

            {/* 404 text on sign */}
            <text x="100" y="62" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize="22" fill="var(--color-text-muted)">
              404
            </text>

            {/* Broken chain links */}
            <circle cx="60" cy="120" r="4" fill="var(--color-border)" />
            <circle cx="72" cy="118" r="4" fill="var(--color-border)" />
            <line x1="64" y1="120" x2="68" y2="118" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="2 2" />

            {/* Car */}
            <g transform="translate(120, 108)">
              <rect x="0" y="6" width="30" height="12" rx="4" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" />
              <rect x="6" y="0" width="18" height="10" rx="3" fill="var(--color-surface-raised)" stroke="var(--color-border)" strokeWidth="1" />
              <circle cx="8" cy="20" r="4" fill="var(--color-text-muted)" />
              <circle cx="24" cy="20" r="4" fill="var(--color-text-muted)" />
            </g>

            {/* Question marks */}
            <text x="35" y="80" fontFamily="var(--font-display)" fontSize="16" fill="var(--color-cyan)" opacity="0.4">?</text>
            <text x="160" y="70" fontFamily="var(--font-display)" fontSize="14" fill="var(--color-amber)" opacity="0.35">?</text>
          </svg>
        </div>

        <h2 style={{ marginBottom: 'var(--space-2)', fontSize: '1.5rem' }}>Page not found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)', fontSize: '0.95rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
