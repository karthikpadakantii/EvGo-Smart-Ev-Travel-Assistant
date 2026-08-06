import { useState } from 'react';
import type { ChargingStationResponse } from '@/types/integration';

interface Props {
  station: ChargingStationResponse;
  onSubmit: (reservationTime: string) => void;
  onCancel: () => void;
}

export default function ReservationForm({ station, onSubmit, onCancel }: Props) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    onSubmit(`${date}T${time}`);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3 style={{ marginBottom: 'var(--space-1)' }}>Reserve charger</h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{station.stationName}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="assumption-note" style={{ marginBottom: 'var(--space-5)' }}>
          <strong>{station.connectorType}</strong> — {station.address}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="res-date">Date</label>
              <input id="res-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="res-time">Time</label>
              <input id="res-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Confirm reservation
            </button>
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
