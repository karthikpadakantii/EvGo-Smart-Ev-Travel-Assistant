import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getVehiclesByUser,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from '@/api/vehicleApi';
import type { VehicleRequest, VehicleResponse } from '@/types/vehicle';
import VehicleCard from '@/components/vehicle/VehicleCard';
import VehicleForm from '@/components/vehicle/VehicleForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { ApiError } from '@/types/common';

export default function VehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<VehicleResponse | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getVehiclesByUser(user.userId)
      .then(setVehicles)
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddOrUpdate = async (payload: VehicleRequest) => {
    if (!user) return;
    setError(null);
    try {
      if (editing) {
        const updated = await updateVehicle(editing.vehicleId, payload);
        setVehicles((prev) => prev.map((v) => (v.vehicleId === updated.vehicleId ? updated : v)));
        setEditing(null);
      } else {
        const created = await addVehicle(user.userId, payload);
        setVehicles((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError((err as ApiError).message);
    }
  };

  const handleDelete = async (vehicleId: number) => {
    setError(null);
    try {
      await deleteVehicle(vehicleId);
      setVehicles((prev) => prev.filter((v) => v.vehicleId !== vehicleId));
    } catch (err) {
      setError((err as ApiError).message);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-header">
        <div className="eyebrow">Vehicles</div>
        <h1>Your vehicles</h1>
        <p>Register your EV's model, battery capacity, and driving range so EvGo can plan accurate charging stops.</p>
      </div>

      <ErrorMessage message={error} />

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ marginBottom: 'var(--space-5)' }}>{editing ? 'Edit vehicle' : 'Register a new vehicle'}</h3>
        <VehicleForm
          initial={editing}
          onSubmit={handleAddOrUpdate}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading your vehicles..." />
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <h3>No vehicles yet</h3>
          <p>Register your first EV above to get started with journey planning.</p>
        </div>
      ) : (
        <div className="grid-2">
          {vehicles.map((v) => (
            <VehicleCard key={v.vehicleId} vehicle={v} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
