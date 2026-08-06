import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getJourneyById } from '@/api/journeyApi';
import { reserveStation, getReservationsByJourney } from '@/api/chargingApi';
import type { JourneyResponse } from '@/types/journey';
import type { RouteResponse, ChargingStationResponse } from '@/types/integration';
import type { ReservationResponse } from '@/types/charging';
import JourneySummary from '@/components/journey/JourneySummary';
import RouteMap from '@/components/map/RouteMap';
import StationList from '@/components/map/StationList';
import ReservationForm from '@/components/reservation/ReservationForm';
import ReservationCard from '@/components/reservation/ReservationCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { ApiError } from '@/types/common';

function parseEstimatedTime(timeStr: string): number {
  const match = timeStr.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/);
  if (!match) return parseInt(timeStr, 10) || 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

function buildRouteFromJourney(journey: JourneyResponse): RouteResponse {
  const estimatedMinutes = parseEstimatedTime(journey.estimatedTime);
  return {
    distanceKm: journey.distance,
    estimatedDurationMinutes: estimatedMinutes,
    batteryRequired: journey.batteryRequired,
    recommendedChargingStops: journey.recommendedChargingStops,
    originLat: journey.originLat,
    originLng: journey.originLng,
    destinationLat: journey.destinationLat,
    destinationLng: journey.destinationLng,
    routeGeometry: journey.routeGeometry,
    chargingStops: journey.chargingStops,
  };
}

export default function JourneyDetailsPage() {
  const { journeyId } = useParams();
  const { user } = useAuth();
  const id = Number(journeyId);

  const [journey, setJourney] = useState<JourneyResponse | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [reservingStation, setReservingStation] = useState<ChargingStationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const journeyData = await getJourneyById(id);
        setJourney(journeyData);

        const routeData = buildRouteFromJourney(journeyData);
        setRoute(routeData);

        const reservationsData = await getReservationsByJourney(id).catch((err: ApiError) => {
          console.warn('Failed to load reservations:', err.message);
          return [] as ReservationResponse[];
        });
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

  if (loading) return <LoadingSpinner label="Loading journey details..." />;

  const openGoogleMaps = () => {
    if (!route) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${route.originLat},${route.originLng}&destination=${route.destinationLat},${route.destinationLng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="app-shell">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div className="eyebrow">Journey #{id}</div>
          <h1>
            {journey ? `${journey.source} → ${journey.destination}` : 'Journey'}
          </h1>
          {journey && (
            <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>{journey.distance} km</span>
              <span style={{ color: 'var(--color-border)' }}>·</span>
              <span>{journey.estimatedTime}</span>
            </p>
          )}
        </div>
        {route && (
          <button className="btn btn-primary" onClick={openGoogleMaps} style={{ flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Start Journey
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      {route && <JourneySummary route={route} />}

      {route && (
        <div style={{ margin: 'var(--space-6) 0' }}>
          <RouteMap route={route} onReserve={setReservingStation} />
        </div>
      )}

      <h2 style={{ marginTop: 'var(--space-8)' }}>Charging stations along route</h2>
      <div className="assumption-note">
        Stations discovered near each charging stop. Tap Navigate to open in Google Maps.
      </div>
      <StationList chargingStops={route?.chargingStops} onReserve={setReservingStation} />

      {reservingStation && (
        <ReservationForm
          station={reservingStation}
          onSubmit={handleReserve}
          onCancel={() => setReservingStation(null)}
        />
      )}

      <h2 style={{ marginTop: 'var(--space-8)' }}>Reservations</h2>
      {reservations.length === 0 ? (
        <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-6)' }}>
          <p style={{ margin: 0 }}>No reservations yet for this journey.</p>
        </div>
      ) : (
        reservations.map((r) => <ReservationCard key={r.reservationId} reservation={r} />)
      )}
    </div>
  );
}
