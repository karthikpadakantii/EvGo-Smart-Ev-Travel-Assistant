import type { RouteResponse } from '@/types/integration';
import type { VehicleResponse } from '@/types/vehicle';

interface Props {
  route: RouteResponse;
  vehicle?: VehicleResponse;
  currentBatteryPercent?: number;
}

export default function JourneySummary({ route, vehicle, currentBatteryPercent }: Props) {
  const pct = currentBatteryPercent ?? 100;

  return (
    <div className="card card-compact">
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-item">
          <span className="stat-label">Distance</span>
          <span className="stat-value">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            {route.distanceKm} km
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Est. time</span>
          <span className="stat-value">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {Math.floor(route.estimatedDurationMinutes / 60)}h {route.estimatedDurationMinutes % 60}m
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Battery needed</span>
          <span className="stat-value">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
              <rect x="1" y="6" width="18" height="12" rx="2" />
              <line x1="23" y1="13" x2="23" y2="11" />
            </svg>
            {route.batteryRequired.toFixed(1)}%
          </span>
        </div>
      </div>

      {vehicle && (
        <div style={{
          marginTop: 'var(--space-4)',
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {vehicle.vehicleModel}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {vehicle.batteryCapacity} kWh / {vehicle.drivingRange} km range
            </span>
          </div>

          {/* Current vs Required battery visual */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                <span>Current: {pct}%</span>
                <span>Needs: {route.batteryRequired.toFixed(1)}%</span>
              </div>
              <div style={{ position: 'relative', height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                {/* Current battery fill */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min(pct, 100)}%`,
                  background: pct >= route.batteryRequired ? 'var(--color-success)' : 'var(--color-amber)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease',
                }} />
                {/* Required line */}
                <div style={{
                  position: 'absolute',
                  left: `${Math.min(route.batteryRequired, 100)}%`,
                  top: '-2px',
                  bottom: '-2px',
                  width: '2px',
                  background: 'var(--color-danger)',
                  borderRadius: '1px',
                }} />
              </div>
            </div>
          </div>

          {pct < route.batteryRequired && (
            <div style={{
              marginTop: 'var(--space-3)',
              fontSize: '0.75rem',
              color: 'var(--color-danger)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              You need at least {route.batteryRequired.toFixed(0)}% battery for this trip. Charge before departing.
            </div>
          )}
        </div>
      )}

      {route.recommendedChargingStops > 0 ? (
        <div className="success-banner" style={{ marginTop: 'var(--space-4)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          {route.recommendedChargingStops} charging stop{route.recommendedChargingStops === 1 ? ' is' : 's are'} recommended — you'll need to top up along the way.
        </div>
      ) : (
        <div className="success-banner" style={{ marginTop: 'var(--space-4)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Your current battery is enough for this trip — no charging stops needed.
        </div>
      )}
    </div>
  );
}
