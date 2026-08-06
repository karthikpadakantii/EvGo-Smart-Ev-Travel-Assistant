// WORKAROUND for a missing backend capability.
//
// The PRD requires "Journey History" and "Reservation History" (US-006),
// but the provided JourneyController and ChargingController only expose
// single-record lookups (GET /journeys/{id}, GET /reservations/{id}) and a
// per-journey reservation list (GET /reservations/journey/{journeyId}) —
// there is no endpoint to list all journeys or reservations for a user.
//
// As a stopgap, the frontend records the ID of every journey the current
// user plans (client-side, per browser) so the History page can re-fetch
// each one by ID. This is NOT a substitute for real backend history: it is
// local to one browser, lost on cache clear, and invisible across devices.
// Recommend adding GET /users/{userId}/journeys server-side.

const storageKey = (userId: number) => `evgo_journey_ids_${userId}`;

export function recordJourneyId(userId: number, journeyId: number): void {
  const existing = getJourneyIds(userId);
  if (!existing.includes(journeyId)) {
    localStorage.setItem(
      storageKey(userId),
      JSON.stringify([journeyId, ...existing])
    );
  }
}

export function getJourneyIds(userId: number): number[] {
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}
