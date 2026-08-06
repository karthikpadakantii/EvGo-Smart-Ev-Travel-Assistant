# Backend fixes applied

This is your original backend with the following fixes applied. Everything
else is untouched.

## 1. api-gateway: missing route for vehicle endpoints
`VehicleController` exposes `PUT /vehicles/{id}` and `DELETE /vehicles/{id}`
(not under `/users/**`), but the gateway only had a route matching
`/api/users/**`. Any client going through the gateway got a 404 trying to
update or delete a vehicle. Added a dedicated route:

```properties
spring.cloud.gateway.server.webflux.routes[1].id=user-service-vehicles
spring.cloud.gateway.server.webflux.routes[1].uri=lb://USER-SERVICE
spring.cloud.gateway.server.webflux.routes[1].predicates[0]=Path=/api/vehicles/**
spring.cloud.gateway.server.webflux.routes[1].filters[0]=StripPrefix=1
```

(subsequent route indices were bumped accordingly)

## 2. journey-service: silently dropped distance/time on every journey
`journey-service`'s Feign client deserializes integration-service's route
response into `dto/integration/RouteResponse.java`. That DTO's field names
(`distance`, `estimatedTime`) didn't match the JSON integration-service
actually returns (`distanceKm`, `estimatedDurationMinutes`) — Jackson binds
by field name, so both fields silently deserialized to `null` on every
planned journey, and got persisted that way.

Fixed by renaming the DTO's fields to match the real JSON
(`distanceKm: Double`, `estimatedDurationMinutes: Integer`) and updating
`JourneyServiceImpl.planJourney()` to map from the corrected fields,
converting minutes to a display string (e.g. `"2h 15m"`) for the
`Journey.estimatedTime` column, which was left as-is.

Also removed `journey-service/.../dto/RouteResponse.java`, an unused
duplicate of the same (broken) shape that nothing referenced.

## 3. integration-service: geocoding broke on multi-word place names
`GeocodingClient` built the OpenRouteService geocoding URL by string
concatenation with no encoding, so a place name like `"New York, NY"` (or
anything with a space, comma, or other reserved character) produced a
malformed request. Switched to `UriComponentsBuilder` with `.encode()`.

## 4. user-service: passwords stored and compared in plain text
`UserServiceImpl` stored `request.getPassword()` directly and compared it
with `.equals()` at login. Added a small `PasswordUtil` (SHA-256, JDK-only,
no new dependency) and used it for both registration and login.

**This is a floor, not a target.** A salted, slow hash via
`BCryptPasswordEncoder` (`spring-security-crypto`) is the right long-term
choice, but that requires adding a new Maven dependency, and this
environment had no network access to fetch and verify one. Swap
`PasswordUtil` for BCrypt when you have connectivity to update `pom.xml`
and confirm the build.

## 5. journey-service: added missing endpoints
`JourneyServiceImpl` already implemented `getJourneysByUser` and
`deleteJourney`, but `JourneyController` never exposed them. Added:

```
GET    /journeys/user/{userId}
DELETE /journeys/{journeyId}
```

The frontend's journey history page depends on both.

## 6. Map data was computed but never reached the frontend

The frontend had no map at all, and the coordinates needed to draw one were
being silently dropped one layer up the chain — the same class of bug as #2.

- `integration-service`'s `RouteResponse` now also returns the full
  road-following route polyline (`routeGeometry`), extracted from
  OpenRouteService's GeoJSON `geometry` array and swapped from `[lng, lat]`
  to `[lat, lng]` for direct use with Leaflet.
- `journey-service`'s mirrored `dto/integration/RouteResponse.java` was
  missing `originLat/Lng`, `destinationLat/Lng`, and the new
  `routeGeometry` entirely, so Jackson silently discarded them on every
  planned journey. Added all four.
- `Journey` entity now has `originLat/Lng` and `destinationLat/Lng` columns
  (`ddl-auto=update` will add them automatically) so map data survives for
  journey history/detail views. The full polyline isn't persisted — it's
  only returned inline from `POST /journeys/plan`, since it can be a few
  hundred points; history/detail views fall back to a straight line between
  origin and destination on the frontend.
- `JourneyResponse` and `JourneyServiceImpl` updated to carry all of the
  above through to the frontend on both the plan response and persisted
  journeys.

`ChargingStationResponse` (nearby stations) already had `latitude`/
`longitude` — that data just wasn't being used anywhere on the frontend.

## 7. Upstream API failures (e.g. ORS 403) leaked raw stack traces to the user

`integration-service` had an empty, unused `exception` package — nothing
caught failures from OpenRouteService or OpenChargeMap, so they fell
through to Spring Boot's default error page. With `spring-boot-devtools`
active (as it is here), that page includes the full stack trace in the
JSON body. journey-service's Feign client then wrapped that whole body
verbatim into its own exception message, and the generic catch-all
handler put it straight into the `message` field the frontend displays —
so a plain 403 from an expired/quota-exhausted API key showed up as a wall
of Java internals instead of a one-line explanation.

Fixed on both sides:

- `integration-service`: added `GlobalExceptionHandler` +
  `UpstreamServiceException`. Geocoding, route, and station calls are now
  wrapped so a 401/403 from ORS or OpenChargeMap comes back as a clean
  `502` with a message like *"OpenRouteService rejected the request (403
  Forbidden). This almost always means the ORS API key is missing,
  invalid, or has hit its daily quota."* A geocode with zero results (e.g.
  a misspelled place name) now returns a clear 404 ("Couldn't find a
  location for ...") instead of throwing an unhandled `JSONException`
  further down.
- `journey-service`: `GlobalExceptionHandler` now has a `FeignException`
  handler that parses the JSON body from the downstream service, pulls out
  its `message`, and forwards the real status code — instead of letting
  Feign's own dump-everything exception message hit the generic 500
  handler.

**This does not fix an actual expired/invalid ORS key** — if you're
seeing `403 Forbidden` from OpenRouteService, that's a problem with the key
itself (`ors.api.key` in `integration-service/application.properties`):
check it's still valid and hasn't hit its daily quota at
https://openrouteservice.org/dev/#/home. What this fix does is make that
failure show up as one clear sentence instead of an opaque 500.

---

## Not changed, worth knowing about

- No authentication/session layer — `POST /users/login` just returns the
  user record with no token. Fine for a local/demo setup; not suitable
  as-is if this is ever exposed publicly.
- Build/tests were not run in this environment (no network access to
  resolve Maven dependencies), so review the diffs before deploying. The
  `target/` directories from your original zip were removed since they're
  build output, not source.
