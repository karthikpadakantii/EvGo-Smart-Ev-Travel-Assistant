import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RouteResponse, ChargingStationResponse } from '@/types/integration';

const startIcon = new L.DivIcon({
  className: 'marker-start',
  html: '<div class="pulse-marker pulse-marker--start"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const endIcon = new L.DivIcon({
  className: 'marker-end',
  html: '<div class="pulse-marker pulse-marker--end"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const stationIcon = new L.DivIcon({
  className: 'marker-station',
  html: '<div class="marker-station-dot"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function stopIcon(stopNumber: number) {
  return new L.DivIcon({
    className: 'marker-stop',
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:#f59e0b;color:#fff;font-size:12px;font-weight:700;
      display:flex;align-items:center;justify-content:center;
      border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);
    ">${stopNumber}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitBounds({ route }: { route: RouteResponse }) {
  const map = useMap();
  const bounds = L.latLngBounds([
    [route.originLat, route.originLng],
    [route.destinationLat, route.destinationLng],
  ]);
  map.fitBounds(bounds, { padding: [50, 50] });
  return null;
}

interface Props {
  route: RouteResponse;
  stations?: ChargingStationResponse[];
  onReserve?: (station: ChargingStationResponse) => void;
}

export default function RouteMap({ route, stations = [], onReserve }: Props) {
  const center: [number, number] = [
    (route.originLat + route.destinationLat) / 2,
    (route.originLng + route.destinationLng) / 2,
  ];

  const routePositions: [number, number][] = (route.routeGeometry ?? []).map(
    (p) => [p[0], p[1]] as [number, number]
  );

  const linePositions: [number, number][] =
    routePositions.length > 0
      ? routePositions
      : [
          [route.originLat, route.originLng],
          [route.destinationLat, route.destinationLng],
        ];

  const openNavigation = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Flatten stops into station markers for map display
  const chargingStops = route.chargingStops ?? [];
  const allStopsStations = chargingStops.flatMap((stop) => stop.stations);

  // Use passed stations prop as fallback if no embedded stops
  const displayStations = chargingStops.length > 0 ? allStopsStations : stations;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: '420px', width: '100%' }}>
        <MapContainer
          center={center}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <FitBounds route={route} />

          {/* Route polyline */}
          <Polyline
            positions={linePositions}
            pathOptions={{
              color: '#0891b2',
              weight: 4,
              opacity: 0.8,
              dashArray: routePositions.length === 0 ? '8 8' : undefined,
            }}
          />

          {/* Origin marker */}
          <Marker position={[route.originLat, route.originLng]} icon={startIcon}>
            <Popup>
              <strong>Origin</strong>
              <br />
              {route.originLat.toFixed(4)}, {route.originLng.toFixed(4)}
            </Popup>
          </Marker>

          {/* Destination marker */}
          <Marker position={[route.destinationLat, route.destinationLng]} icon={endIcon}>
            <Popup>
              <strong>Destination</strong>
              <br />
              {route.destinationLat.toFixed(4)}, {route.destinationLng.toFixed(4)}
            </Popup>
          </Marker>

          {/* Charging stop markers (numbered) */}
          {chargingStops.map((stop) => (
            <Marker
              key={`stop-${stop.stopNumber}`}
              position={[stop.latitude, stop.longitude]}
              icon={stopIcon(stop.stopNumber)}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>Charging Stop {stop.stopNumber}</strong>
                  <br />
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    ~{stop.distanceFromOriginKm} km from origin
                  </span>
                  <br />
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                    {stop.stations.length} station{stop.stations.length !== 1 ? 's' : ''} nearby
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Station markers */}
          {displayStations.map((s, i) => (
            <Marker
              key={i}
              position={[s.latitude, s.longitude]}
              icon={stationIcon}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>{s.stationName || 'Charging Station'}</strong>
                  <br />
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>{s.address}</span>
                  <br />
                  <span style={{ fontSize: '0.75rem', color: '#0891b2', fontWeight: 600 }}>{s.connectorType}</span>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openNavigation(s.latitude, s.longitude)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: 'none',
                        background: '#0891b2',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      Navigate
                    </button>
                    {onReserve && (
                      <button
                        onClick={() => onReserve(s)}
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: '1px solid #0891b2',
                          background: 'transparent',
                          color: '#0891b2',
                          cursor: 'pointer',
                        }}
                      >
                        Reserve
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-4)',
        borderTop: '1px solid var(--color-border)',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-success)' }} />
          Origin
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-danger)' }} />
          Destination
        </div>
        {chargingStops.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            Charging Stop
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-cyan)' }} />
          Station
        </div>
      </div>
    </div>
  );
}
