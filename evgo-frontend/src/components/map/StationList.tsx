import type { ChargingStationResponse, ChargingStop } from '@/types/integration';

interface Props {
  chargingStops?: ChargingStop[];
  stations?: ChargingStationResponse[];
  onReserve: (station: ChargingStationResponse) => void;
}

export default function StationList({ chargingStops = [], stations = [], onReserve }: Props) {
  const openNavigation = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasStops = chargingStops.length > 0;
  const allStations = hasStops
    ? chargingStops.flatMap((s) => s.stations)
    : stations;

  if (allStations.length === 0) {
    return (
      <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div className="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h3>No stations found</h3>
        <p>We couldn't find charging stations along the route. Try a different route or check back later.</p>
      </div>
    );
  }

  const renderStationCard = (s: ChargingStationResponse, key: string | number) => (
    <div key={key} className="card card-compact">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ marginBottom: 'var(--space-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {s.stationName || 'Charging Station'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            {s.address || 'Address not available'}
          </p>
        </div>
        <span className="badge">{s.connectorType}</span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          onClick={() => openNavigation(s.latitude, s.longitude)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Navigate
        </button>
        <button
          className="btn btn-outline btn-sm"
          style={{ flex: 1 }}
          onClick={() => onReserve(s)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Reserve
        </button>
      </div>
    </div>
  );

  if (!hasStops) {
    // Fallback: no stop grouping, just render all stations flat
    return (
      <div className="grid-2" style={{ marginTop: 'var(--space-4)' }}>
        {allStations.map((s, i) => renderStationCard(s, `flat-${i}`))}
      </div>
    );
  }

  // Grouped by stop
  return (
    <div style={{ marginTop: 'var(--space-4)' }}>
      {chargingStops.map((stop) => (
        <div key={stop.stopNumber} style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-3)',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#f59e0b',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {stop.stopNumber}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Stop {stop.stopNumber}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                ~{stop.distanceFromOriginKm} km from origin · {stop.stations.length} station{stop.stations.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {stop.stations.length === 0 ? (
            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
            }}>
              No stations found near this stop. You may need to plan an alternate charging point.
            </div>
          ) : (
            <div className="grid-2">
              {stop.stations.map((s, i) => renderStationCard(s, `stop-${stop.stopNumber}-${i}`))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
