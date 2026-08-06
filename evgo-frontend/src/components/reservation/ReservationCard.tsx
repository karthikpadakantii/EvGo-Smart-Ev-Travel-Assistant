import type { ReservationResponse } from '@/types/charging';

interface Props {
  reservation: ReservationResponse;
}

export default function ReservationCard({ reservation }: Props) {
  const date = new Date(reservation.reservationTime);
  const isConfirmed = reservation.status === 'CONFIRMED';

  return (
    <div className="card card-compact">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ marginBottom: 'var(--space-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {reservation.stationName}
          </h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            {reservation.stationAddress}
          </p>
        </div>
        <span className={`badge ${isConfirmed ? 'badge-success' : 'badge-warning'}`}>
          {reservation.status}
        </span>
      </div>

      <div className="stat-grid" style={{ marginTop: 'var(--space-4)' }}>
        <div className="stat-item">
          <span className="stat-label">Connector</span>
          <span className="stat-value">{reservation.connectorType}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Scheduled</span>
          <span className="stat-value">{date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time</span>
          <span className="stat-value">{date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
