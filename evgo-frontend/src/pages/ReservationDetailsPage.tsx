import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getJourneyById } from '@/api/journeyApi';
import { getChargingStations } from '@/api/integrationApi';
import { reserveStation, getReservationsByJourney } from '@/api/chargingApi';
import type { JourneyResponse } from '@/types/journey';
import type { ChargingStationResponse } from '@/types/integration';
import type { ReservationResponse } from '@/types/charging';
import StationList from '@/components/map/StationList';
import ReservationForm from '@/components/reservation/ReservationForm';
import ReservationCard from '@/components/reservation/ReservationCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { ApiError } from '@/types/common';

export default function ReservationDetailsPage() {
  const { journeyId } = useParams();
  const { user } = useAuth();
  const id = Number(journeyId);

  const [journey, setJourney] = useState<JourneyResponse | null>(null);
  const [stations, setStations] = useState<ChargingStationResponse[]>([]);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [reservingStation, setReservingStation] = useState<ChargingStationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    (async () => {
      try {
        const j = await getJourneyById(id);
        setJourney(j);

        const [stationsData, reservationsData] = await Promise.all([
          getChargingStations(j.destinationLat, j.destinationLng),
          getReservationsByJourney(id),
        ]);
        setStations(stationsData);
        setReservations(reservationsData);
      } catch (err) {
        setError((err as ApiError).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleReserve = async (reservationTime: string) => {
    if (!reservingStation || !user) return;
    setError(null);
    try {
      const reservation = await reserveStation({
        userId: user.userId,
        journeyId: id,
        stationName: reservingStation.stationName,
        stationAddress: reservingStation.address,
        connectorType: reservingStation.connectorType,
        reservationTime,
      });
      setReservations((prev) => [reservation, ...prev]);
      setReservingStation(null);
    } catch (err) {
      setError((err as ApiError).message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading reservations..." />;

  return (
    <div className="app-shell">
      <div className="page-header">
        <div className="eyebrow">Charging</div>
        <h1>Charging stops for trip</h1>
        {journey && (
          <p>
            {journey.source} → {journey.destination} — {journey.distance} km
          </p>
        )}
      </div>

      <ErrorMessage message={error} />

      <h2>Available stations near destination</h2>
      <StationList stations={stations} onReserve={setReservingStation} />

      {reservingStation && (
        <ReservationForm
          station={reservingStation}
          onSubmit={handleReserve}
          onCancel={() => setReservingStation(null)}
        />
      )}

      <h2 style={{ marginTop: 'var(--space-8)' }}>Your reservations</h2>
      {reservations.length === 0 ? (
        <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-6)' }}>
          <p style={{ margin: 0 }}>No reservations yet. Select a station above to reserve a slot.</p>
        </div>
      ) : (
        reservations.map((r) => <ReservationCard key={r.reservationId} reservation={r} />)
      )}
    </div>
  );
}
