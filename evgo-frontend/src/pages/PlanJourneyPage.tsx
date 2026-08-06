import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getVehiclesByUser } from '@/api/vehicleApi';
import { calculateRoute } from '@/api/integrationApi';
import { planJourney } from '@/api/journeyApi';
import { recordJourneyId } from '@/utils/localHistory';
import type { VehicleResponse } from '@/types/vehicle';
import type { RouteResponse } from '@/types/integration';
import JourneyForm from '@/components/journey/JourneyForm';
import JourneySummary from '@/components/journey/JourneySummary';
import RouteMap from '@/components/map/RouteMap';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { ApiError } from '@/types/common';

export default function PlanJourneyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponse | undefined>();
  const [batteryPercent, setBatteryPercent] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingJourney, setPendingJourney] = useState<{ source: string; destination: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    getVehiclesByUser(user.userId)
      .then(setVehicles)
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setLoadingVehicles(false));
  }, [user]);

  const handlePlan = async (source: string, destination: string, vehicleId: number, currentBatteryPercent: number) => {
    setError(null);
    setCalculating(true);
    setRoute(null);
    try {
      const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
      if (!vehicle) throw new Error('Selected vehicle not found');
      const result = await calculateRoute(source, destination, vehicle.batteryCapacity, vehicle.drivingRange, currentBatteryPercent);
      setRoute(result);
      setSelectedVehicle(vehicle);
      setBatteryPercent(currentBatteryPercent);
      setPendingJourney({ source, destination });
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setCalculating(false);
    }
  };

  const handleSaveJourney = async () => {
    if (!user || !pendingJourney || !selectedVehicle) return;
    setError(null);
    setSaving(true);
    try {
      const journey = await planJourney({
        userId: user.userId,
        ...pendingJourney,
        batteryCapacity: selectedVehicle.batteryCapacity,
        drivingRange: selectedVehicle.drivingRange,
        currentBatteryPercent: batteryPercent,
      });
      recordJourneyId(user.userId, journey.journeyId);
      navigate(`/journeys/${journey.journeyId}`);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-header">
        <div className="eyebrow">Plan Trip</div>
        <h1>Plan a journey</h1>
        <p>Enter your source and destination to get an optimized route with battery analysis and charging recommendations.</p>
      </div>

      <ErrorMessage message={error} />

      {loadingVehicles ? (
        <LoadingSpinner label="Loading your vehicles..." />
      ) : (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <JourneyForm vehicles={vehicles} onSubmit={handlePlan} submitting={calculating} />
        </div>
      )}

      {route && (
        <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <JourneySummary route={route} vehicle={selectedVehicle} currentBatteryPercent={batteryPercent} />
          <div style={{ margin: 'var(--space-4) 0' }}>
            <RouteMap route={route} />
          </div>
          <button className="btn btn-primary btn-block" onClick={handleSaveJourney} disabled={saving} style={{ marginTop: 'var(--space-2)' }}>
            {saving ? (
              'Saving journey...'
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save journey & find charging stations
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
