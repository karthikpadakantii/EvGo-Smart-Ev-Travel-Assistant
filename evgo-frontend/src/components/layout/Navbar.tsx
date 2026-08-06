import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'box-shadow var(--transition-base), background var(--transition-base)',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <nav
        className="app-shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link
          to={user ? '/dashboard' : '/login'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0891b2, #0e7490)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--color-text)',
              letterSpacing: '-0.03em',
            }}
          >
            EvGo
          </span>
        </Link>

        {/* Desktop nav */}
        {user && (
          <div
            className="nav-desktop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}
          >
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/vehicles', label: 'Vehicles' },
              { to: '/journeys/plan', label: 'Plan Trip' },
              { to: '/history', label: 'History' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  color: isActive(item.to) ? 'var(--color-cyan)' : 'var(--color-text-secondary)',
                  fontWeight: isActive(item.to) ? 600 : 500,
                  fontSize: '0.875rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition-fast)',
                  background: isActive(item.to) ? 'var(--color-cyan-dim)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 var(--space-2)' }} />

            {/* User chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                  boxShadow: '0 1px 4px rgba(8, 145, 178, 0.25)',
                }}
                title={user.firstName}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Mobile hamburger */}
        {user && (
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              padding: '6px',
              lineHeight: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        )}

        {/* Not logged in */}
        {!user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {user && mobileOpen && (
        <div
          ref={menuRef}
          className="nav-mobile-menu"
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-3) var(--space-6) var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            gap: 'var(--space-1)',
            background: 'var(--color-surface)',
          }}
        >
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/vehicles', label: 'Vehicles' },
            { to: '/journeys/plan', label: 'Plan Trip' },
            { to: '/history', label: 'History' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                color: isActive(item.to) ? 'var(--color-cyan)' : 'var(--color-text-secondary)',
                fontWeight: isActive(item.to) ? 600 : 500,
                fontSize: '0.9rem',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: isActive(item.to) ? 'var(--color-cyan-dim)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--color-border)', margin: 'var(--space-2) 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {user.firstName} {user.lastName}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ fontSize: '0.8rem' }}>
              Sign out
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
