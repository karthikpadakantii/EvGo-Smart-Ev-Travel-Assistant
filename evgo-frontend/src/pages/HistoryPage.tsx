import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getJourneyIds } from '@/utils/localHistory';
import { getJourneyById } from '@/api/journeyApi';
import { getReservationsByJourney } from '@/api/chargingApi';
import type { JourneyResponse } from '@/types/journey';
import type { ReservationResponse } from '@/types/charging';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { ApiError } from '@/types/common';

interface JourneyWithReservations {
  journey: JourneyResponse;
  reservations: ReservationResponse[];
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<JourneyWithReservations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const ids = getJourneyIds(user.userId);
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map(async (journeyId) => {
        const journey = await getJourneyById(journeyId);
        const reservations = await getReservationsByJourney(journeyId);
        return { journey, reservations };
      })
    )
      .then(setItems)
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="app-shell">
      <div className="page-header">
        <div className="eyebrow">History</div>
        <h1>Trip &amp; reservation history</h1>
        <p>Revisit your planned journeys and charging reservations.</p>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner label="Loading history..." />
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3>No trips yet</h3>
          <p>Plan your first journey to see it appear here.</p>
          <Link to="/journeys/plan" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            Plan a trip
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {items.map(({ journey, reservations }) => (
            <Link
              key={journey.journeyId}
              to={`/journeys/${journey.journeyId}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <h3 style={{ marginBottom: 'var(--space-1)' }}>
                  {journey.source} → {journey.destination}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  {journey.distance} km · {reservations.length} reservation{reservations.length === 1 ? '' : 's'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span className="badge">#{journey.journeyId}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
