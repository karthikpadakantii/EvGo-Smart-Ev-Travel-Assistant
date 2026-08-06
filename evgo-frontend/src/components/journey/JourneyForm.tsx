import { useState } from 'react';
import type { VehicleResponse } from '@/types/vehicle';

interface Props {
  vehicles: VehicleResponse[];
  onSubmit: (source: string, destination: string, vehicleId: number, batteryPercent: number) => void;
  submitting?: boolean;
}

const SUGGESTED_CITIES = [
  'Vijayawada, Andhra Pradesh',
  'Noida, Uttar Pradesh, India',
  'Hyderabad, Telangana',
  'Bengaluru, Karnataka',
  'Chennai, Tamil Nadu',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Chandigarh',
  'Delhi',
  'Kolkata, West Bengal',
];

export default function JourneyForm({ vehicles, onSubmit, submitting }: Props) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState<number>(vehicles[0]?.vehicleId ?? 0);
  const [batteryPercent, setBatteryPercent] = useState(80);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const filteredSource = source
    ? SUGGESTED_CITIES.filter((c) => c.toLowerCase().includes(source.toLowerCase())).slice(0, 5)
    : SUGGESTED_CITIES.slice(0, 5);

  const filteredDest = destination
    ? SUGGESTED_CITIES.filter((c) => c.toLowerCase().includes(destination.toLowerCase())).slice(0, 5)
    : SUGGESTED_CITIES.slice(0, 5);

  const selectedVehicle = vehicles.find((v) => v.vehicleId === vehicleId);
  const availableKm = selectedVehicle ? Math.round((batteryPercent / 100) * selectedVehicle.drivingRange) : 0;

  const getBatteryColor = () => {
    if (batteryPercent >= 60) return 'var(--color-success)';
    if (batteryPercent >= 30) return 'var(--color-amber)';
    return 'var(--color-danger)';
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(source, destination, vehicleId, batteryPercent); }}>
      <div className="form-grid-2">
        <div className="form-field" style={{ position: 'relative' }}>
          <label htmlFor="source">Source city</label>
          <input
            id="source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            onFocus={() => setShowSourceSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 150)}
            required
            placeholder="e.g. Vijayawada"
          />
          {showSourceSuggestions && filteredSource.length > 0 && (
            <div className="suggestions-list">
              {filteredSource.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="suggestion-item"
                  onMouseDown={() => { setSource(city); setShowSourceSuggestions(false); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="form-field" style={{ position: 'relative' }}>
          <label htmlFor="destination">Destination city</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setShowDestSuggestions(true)}
            onBlur={() => setTimeout(() => setShowDestSuggestions(false), 150)}
            required
            placeholder="e.g. Noida"
          />
          {showDestSuggestions && filteredDest.length > 0 && (
            <div className="suggestions-list">
              {filteredDest.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="suggestion-item"
                  onMouseDown={() => { setDestination(city); setShowDestSuggestions(false); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-field" style={{ marginTop: 'var(--space-2)' }}>
        <label htmlFor="vehicle">Select your vehicle</label>
        <select id="vehicle" value={vehicleId} onChange={(e) => setVehicleId(Number(e.target.value))} required>
          {vehicles.length === 0 && <option value={0} disabled>No vehicles registered</option>}
          {vehicles.map((v) => (
            <option key={v.vehicleId} value={v.vehicleId}>
              {v.vehicleModel} ({v.batteryCapacity} kWh / {v.drivingRange} km)
            </option>
          ))}
        </select>
      </div>

      {/* Battery percentage input */}
      <div className="form-field" style={{ marginTop: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <label htmlFor="batteryPercent" style={{ margin: 0 }}>Current battery level</label>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: getBatteryColor(),
            }}
          >
            {batteryPercent}%
          </span>
        </div>

        {/* Battery visual */}
        <div style={{
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-3)',
        }}>
          {/* Battery bar */}
          <div style={{
            width: '100%',
            height: '10px',
            background: 'var(--color-border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: 'var(--space-3)',
          }}>
            <div style={{
              width: `${batteryPercent}%`,
              height: '100%',
              background: getBatteryColor(),
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.2s ease, background 0.3s ease',
              boxShadow: `0 0 8px ${getBatteryColor()}40`,
            }} />
          </div>

          {/* Range slider */}
          <input
            id="batteryPercent"
            type="range"
            min={0}
            max={100}
            step={5}
            value={batteryPercent}
            onChange={(e) => setBatteryPercent(Number(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: 'transparent',
              cursor: 'pointer',
              accentColor: getBatteryColor(),
            }}
          />

          {/* Quick select buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            {[20, 40, 60, 80, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setBatteryPercent(pct)}
                style={{
                  flex: 1,
                  padding: '0.3rem 0',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${batteryPercent === pct ? getBatteryColor() : 'var(--color-border)'}`,
                  background: batteryPercent === pct ? `${getBatteryColor()}15` : 'var(--color-surface)',
                  color: batteryPercent === pct ? getBatteryColor() : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Available range info */}
        {selectedVehicle && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
          }}>
            <span>Available range</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {availableKm} km of {selectedVehicle.drivingRange} km
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={submitting || vehicles.length === 0}
        style={{ marginTop: 'var(--space-5)' }}
      >
        {submitting ? (
          'Calculating route...'
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Plan route
          </>
        )}
      </button>
    </form>
  );
}
