import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    to: '/vehicles',
    accent: '#0891b2',
    iconBg: 'rgba(8, 145, 178, 0.1)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Manage Vehicles',
    desc: 'Register your EV, set battery capacity and driving range for accurate trip planning.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=300&fit=crop&auto=format',
  },
  {
    to: '/journeys/plan',
    accent: '#d97706',
    iconBg: 'rgba(217, 119, 6, 0.1)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    title: 'Plan a Journey',
    desc: 'Get optimized routes with battery analysis, charging stops, and real-time distance calculations.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=300&fit=crop&auto=format',
  },
  {
    to: '/history',
    accent: '#059669',
    iconBg: 'rgba(5, 150, 105, 0.1)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Trip History',
    desc: 'Review past journeys, routes taken, and charging reservations made along the way.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=300&fit=crop&auto=format',
  },
];

function HeroEV() {
  return (
    <svg viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Road */}
      <path d="M0 280 Q130 260 260 270 Q390 280 520 260" stroke="rgba(255,255,255,0.12)" strokeWidth="3" fill="none" />
      <path d="M0 290 Q130 270 260 280 Q390 290 520 270" stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />

      {/* Car body */}
      <g transform="translate(160, 180)">
        {/* Shadow */}
        <ellipse cx="100" cy="100" rx="90" ry="12" fill="rgba(0,0,0,0.15)" />

        {/* Body */}
        <rect x="10" y="40" width="180" height="55" rx="12" fill="rgba(255,255,255,0.95)" />
        <rect x="40" y="15" width="120" height="40" rx="10" fill="rgba(255,255,255,0.9)" />

        {/* Windows */}
        <rect x="48" y="20" width="45" height="30" rx="6" fill="#0891b2" opacity="0.7" />
        <rect x="100" y="20" width="52" height="30" rx="6" fill="#0891b2" opacity="0.6" />

        {/* Headlights */}
        <rect x="178" y="52" width="14" height="8" rx="4" fill="#fbbf24" />
        <rect x="178" y="65" width="14" height="8" rx="4" fill="#fbbf24" opacity="0.6" />

        {/* Taillights */}
        <rect x="6" y="52" width="10" height="8" rx="3" fill="#f87171" />
        <rect x="6" y="65" width="10" height="8" rx="3" fill="#f87171" opacity="0.6" />

        {/* Wheels */}
        <circle cx="55" cy="98" r="16" fill="#1e293b" />
        <circle cx="55" cy="98" r="8" fill="#475569" />
        <circle cx="55" cy="98" r="3" fill="#94a3b8" />

        <circle cx="150" cy="98" r="16" fill="#1e293b" />
        <circle cx="150" cy="98" r="8" fill="#475569" />
        <circle cx="150" cy="98" r="3" fill="#94a3b8" />

        {/* Lightning bolt on side */}
        <path d="M95 50 L105 50 L100 60 L108 60 L93 78 L98 65 L90 65 Z" fill="#0891b2" opacity="0.8" />
      </g>

      {/* Charging station */}
      <g transform="translate(400, 170)">
        <rect x="0" y="0" width="8" height="110" rx="4" fill="rgba(255,255,255,0.9)" />
        <rect x="-10" y="10" width="28" height="20" rx="6" fill="#0891b2" />
        <path d="M4 17 L4 23" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="4" cy="25" r="2" fill="#fbbf24" />

        {/* Cable */}
        <path d="M4 30 Q4 50 20 60 Q40 70 60 80 Q80 90 90 100" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 4" />

        {/* Glow */}
        <circle cx="4" cy="20" r="20" fill="rgba(8, 145, 178, 0.15)" />
      </g>

      {/* Trees */}
      <g transform="translate(50, 220)">
        <rect x="8" y="30" width="6" height="30" rx="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="11" cy="20" r="18" fill="rgba(5, 150, 105, 0.3)" />
      </g>
      <g transform="translate(480, 230)">
        <rect x="8" y="20" width="5" height="25" rx="2" fill="rgba(255,255,255,0.12)" />
        <circle cx="10" cy="12" r="14" fill="rgba(5, 150, 105, 0.25)" />
      </g>

      {/* Floating particles */}
      <circle cx="80" cy="100" r="2" fill="rgba(255,255,255,0.2)">
        <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="80" r="1.5" fill="rgba(251, 191, 36, 0.3)">
        <animate attributeName="cy" values="80;70;80" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="300" cy="60" r="2.5" fill="rgba(8, 145, 178, 0.25)">
        <animate attributeName="cy" values="60;50;60" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="app-shell">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(255,255,255,0.15)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 'var(--space-4)',
            backdropFilter: 'blur(8px)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Smart EV Travel
          </div>
          <h1>{greeting}{user ? `, ${user.firstName}` : ''}</h1>
          <p>Plan your next electric journey with intelligent route optimization and charging station discovery across India.</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Link to="/journeys/plan" className="btn" style={{
              background: '#fff',
              color: '#0891b2',
              fontWeight: 600,
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Plan a trip
            </Link>
            <Link to="/vehicles" className="btn" style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
            }}>
              Add your vehicle
            </Link>
          </div>
        </div>
        <div className="hero-illustration">
          <HeroEV />
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h2>Get started</h2>
        <p style={{ marginBottom: 'var(--space-6)' }}>Everything you need for smart EV travel.</p>
      </div>

      <div className="grid-3">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="card feature-card"
            style={{ textDecoration: 'none', color: 'inherit', '--feature-accent': f.accent } as React.CSSProperties}
          >
            <img
              src={f.image}
              alt={f.title}
              className="feature-card-image"
              loading="lazy"
            />
            <div
              className="feature-card-icon"
              style={{ background: f.iconBg }}
            >
              {f.icon}
            </div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>{f.title}</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.85rem', lineHeight: 1.55 }}>
              {f.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
