import type { VehicleResponse } from '@/types/vehicle';

interface Props {
  vehicle: VehicleResponse;
  onEdit: (vehicle: VehicleResponse) => void;
  onDelete: (id: number) => void;
}

export default function VehicleCard({ vehicle, onEdit, onDelete }: Props) {
  return (
    <div className="card card-compact">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
        <div>
          <h3 style={{ marginBottom: 'var(--space-1)' }}>{vehicle.vehicleModel}</h3>
          <span className="badge">{vehicle.connectorType}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(vehicle)} title="Edit vehicle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onDelete(vehicle.vehicleId)} title="Delete vehicle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">Battery</span>
          <span className="stat-value">{vehicle.batteryCapacity} kWh</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Range</span>
          <span className="stat-value">{vehicle.drivingRange} km</span>
        </div>
      </div>
    </div>
  );
}
