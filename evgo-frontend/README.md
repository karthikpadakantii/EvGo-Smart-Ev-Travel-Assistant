# EvGo Frontend

React + Vite + TypeScript frontend for the EvGo Smart EV Travel Assistant,
built against the provided Spring Boot microservices (User, Journey,
Charging, Integration) via the API Gateway.

## Setup

```bash
npm install
cp .env.example .env   # then confirm VITE_API_BASE_URL matches your gateway
npm run dev
```

## ⚠️ Known gaps / assumptions to verify against your real backend

This frontend was built from the PRD plus 5 controller files — the actual
DTO source files (field names) and a couple of PRD-required list endpoints
were not available. These are flagged in code comments too:

0. **Routing provider is OpenRouteService, not Google Directions.** The map
   (`src/components/map/RouteMap.tsx`) uses Leaflet + free OpenStreetMap
   tiles — no client-side API key needed. `RouteResponse.coordinates`
   (GeoJSON-style `[lng, lat]` pairs) is used if present; it falls back to
   decoding `RouteResponse.polyline` (Google-compatible encoded polyline,
   which ORS can also emit via `geometry_format=encodedpolyline`), then
   finally to a straight line between origin and destination. Confirm which
   geometry format your Integration Service actually forwards from ORS and
   make sure the matching field is populated.

1. **No journey/reservation list-by-user endpoint.** `JourneyController` only
   has `planJourney` and `getJourneyById`; `ChargingController` only lists
   reservations *by journey*, not by user. The **History** page (US-006)
   works around this by tracking journey IDs client-side in `localStorage`
   (`src/utils/localHistory.ts`) — it only shows trips planned in the current
   browser. **Recommend adding** `GET /users/{userId}/journeys` and
   `GET /reservations/user/{userId}`.

2. **Login response is a raw string.** `POST /users/login` returns a bare
   `String`, with no user ID. The frontend assumes it's a JWT and decodes a
   `userId`/`id`/`sub` claim from the payload (`src/utils/jwt.ts`) to resolve
   the logged-in user via `GET /users/{id}`. **If your token doesn't carry an
   id claim, either add one or change the endpoint to return
   `{ token, userId }`.**

3. **`GET /integration/stations` takes one lat/lng, not a route.** There's no
   endpoint for "stations along an entire route/polyline," so
   `JourneyDetailsPage` searches near the destination coordinate only.
   **Recommend** accepting a polyline or a list of waypoints for true
   along-the-route discovery.

4. **DTO field names are inferred**, not confirmed, for: `RegisterUserRequest`,
   `LoginRequest`, `UserResponse`, `VehicleRequest`, `VehicleResponse`,
   `JourneyRequest`, `JourneyResponse`, `RouteResponse`,
   `ChargingStationResponse`, `ReservationRequest`, `ReservationResponse`.
   All live in `src/types/*.ts` with comments — reconcile these with your
   actual backend DTO classes before wiring up against a live API.

## Folder structure

```
src/
  api/            axios instance + one file per microservice's endpoints
  types/          TypeScript interfaces mirroring backend DTOs
  context/        AuthContext (token + current user)
  components/     layout, common, map, vehicle, journey, reservation
  pages/          one component per route
  utils/          validators, JWT decode, local history workaround
```

## Pages / API mapping

| Page | Route | Backend calls |
|---|---|---|
| Register | `/register` | `POST /users/register` |
| Login | `/login` | `POST /users/login` |
| Dashboard | `/dashboard` | `GET /users/{id}` |
| Vehicles | `/vehicles` | `GET/POST /users/{userId}/vehicles`, `PUT/DELETE /vehicles/{id}` |
| Plan Journey | `/journeys/plan` | `GET /integration/route`, `POST /journeys/plan` |
| Journey Details | `/journeys/:id` | `GET /journeys/{id}`, `GET /integration/route`, `GET /integration/stations`, `POST /reservations`, `GET /reservations/journey/{id}` |
| Reservation Details | `/reservations/:id` | `GET/DELETE /reservations/{id}` |
| History | `/history` | `GET /journeys/{id}` (looped over locally-tracked IDs), `GET /reservations/journey/{id}` |
