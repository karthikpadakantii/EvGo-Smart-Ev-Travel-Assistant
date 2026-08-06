package com.evgo.integrationservice.service.impl;

import com.evgo.integrationservice.client.GeocodingClient;
import com.evgo.integrationservice.client.OpenChargeMapClient;
import com.evgo.integrationservice.client.RoutingClient;
import com.evgo.integrationservice.dto.ChargingStationResponse;
import com.evgo.integrationservice.dto.ChargingStop;
import com.evgo.integrationservice.dto.RouteResponse;
import com.evgo.integrationservice.exception.UpstreamServiceException;
import com.evgo.integrationservice.service.IntegrationService;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;

import java.util.ArrayList;
import java.util.List;


@Service
public class IntegrationServiceImpl implements IntegrationService {


    private final RoutingClient routingClient;

    private final GeocodingClient geocodingClient;

    private final OpenChargeMapClient openChargeMapClient;


    @Value("${opencharge.api.key}")
    private String apiKey;



    public IntegrationServiceImpl(
            RoutingClient routingClient,
            GeocodingClient geocodingClient,
            OpenChargeMapClient openChargeMapClient
    ) {

        this.routingClient = routingClient;
        this.geocodingClient = geocodingClient;
        this.openChargeMapClient = openChargeMapClient;

    }




    @Override
    public RouteResponse calculateRoute(
            String source,
            String destination,
            Double batteryCapacity,
            Double drivingRange,
            Double currentBatteryPercent
    ) {

        // Clamp currentBatteryPercent to [0, 100]
        double currentPct = Math.max(0, Math.min(100, currentBatteryPercent));

        double[] sourceCoords = geocode(source);
        double sourceLat = sourceCoords[0];
        double sourceLng = sourceCoords[1];

        double[] destinationCoords = geocode(destination);
        double destinationLat = destinationCoords[0];
        double destinationLng = destinationCoords[1];


        String routeResponse;
        try {
            routeResponse =
                    routingClient.getRoute(
                            String.valueOf(sourceLat),
                            String.valueOf(sourceLng),
                            String.valueOf(destinationLat),
                            String.valueOf(destinationLng)
                    );
        } catch (HttpStatusCodeException e) {
            throw new UpstreamServiceException(
                    describeGeoapifyFailure("Route lookup", e),
                    e.getStatusCode().value()
            );
        }

        JSONObject routeJson = new JSONObject(routeResponse);

        // Geoapify returns GeoJSON FeatureCollection
        JSONArray features = routeJson.optJSONArray("features");
        if (features == null || features.length() == 0) {
            throw new UpstreamServiceException(
                    "No routes found between the source and destination.",
                    404
            );
        }

        JSONObject routeFeature = features.getJSONObject(0);
        JSONObject properties = routeFeature.getJSONObject("properties");

        // Geoapify returns distance in meters and time in seconds
        double distanceMeters = properties.getDouble("distance");
        double distanceKm = distanceMeters / 1000;

        double durationSeconds = properties.getDouble("time");

        // Geoapify returns a MultiLineString geometry. Coordinates are wrapped
        // in an extra array level: [ [ [lng1,lat1], [lng2,lat2], ... ] ].
        // Flatten all segments into a single list of [lat, lng] pairs for Leaflet.
        JSONArray geometryCoordinates =
                routeFeature
                        .getJSONObject("geometry")
                        .getJSONArray("coordinates");

        List<double[]> routeGeometry = new ArrayList<>();
        for (int s = 0; s < geometryCoordinates.length(); s++) {
            JSONArray segment = geometryCoordinates.getJSONArray(s);
            for (int i = 0; i < segment.length(); i++) {
                JSONArray point = segment.getJSONArray(i);
                // GeoJSON is [lng, lat], swap to [lat, lng] for Leaflet
                routeGeometry.add(new double[]{point.getDouble(1), point.getDouble(0)});
            }
        }


        // ---- Battery calculations based on current charge level ----
        // efficiency = km the vehicle can travel per 1 kWh
        double efficiency = drivingRange / batteryCapacity;

        // Total energy (kWh) needed for the trip
        double energyRequired = distanceKm / efficiency;

        // How much energy (kWh) is available right now
        double availableEnergy = (currentPct / 100.0) * batteryCapacity;

        // Energy shortfall — how much more energy we need beyond current charge
        double energyShortfall = energyRequired - availableEnergy;

        // Battery required as % of total capacity (for display — how much of the
        // full battery the trip consumes overall, regardless of current level)
        double batteryRequiredPct = (energyRequired / batteryCapacity) * 100;

        // Charging stops: assume each stop charges to 80% (usable per stop = 80% of capacity)
        double usablePerCharge = batteryCapacity * 0.80;
        int chargingStops;
        if (energyShortfall <= 0) {
            // Current charge is enough — no stops needed
            chargingStops = 0;
        } else {
            chargingStops = (int) Math.ceil(energyShortfall / usablePerCharge);
        }

        chargingStops = Math.max(chargingStops, 0);

        // ---- Calculate charging stop positions along the route ----
        List<ChargingStop> chargingStopList = new ArrayList<>();
        if (chargingStops > 0 && routeGeometry.size() >= 2) {
            // Cumulative distances along the route in km
            double[] cumulativeDistKm = computeCumulativeDistances(routeGeometry);

            // Usable range per charge in km (charge to 80% each stop)
            double usableRangeKm = drivingRange * 0.80;

            // First stop: use whatever range is left from current battery
            double firstLegRange = (currentPct / 100.0) * drivingRange;
            // If first leg already exceeds the distance to first stop interval,
            // space stops evenly from the start using usableRangeKm
            double stopInterval = (firstLegRange > usableRangeKm * 0.5)
                    ? usableRangeKm
                    : firstLegRange;

            for (int i = 0; i < chargingStops; i++) {
                double targetDistKm;
                if (i == 0) {
                    targetDistKm = Math.min(firstLegRange, distanceKm - usableRangeKm * 0.5);
                    targetDistKm = Math.max(targetDistKm, usableRangeKm * 0.5);
                } else {
                    targetDistKm = (i == 0 ? firstLegRange : stopInterval * i + firstLegRange);
                    targetDistKm = Math.min(targetDistKm, distanceKm - usableRangeKm * 0.3);
                }

                double[] position = findPositionOnRoute(routeGeometry, cumulativeDistKm, targetDistKm);
                if (position == null) continue;

                List<ChargingStationResponse> nearbyStations = findStationsNear(position[0], position[1]);

                chargingStopList.add(new ChargingStop(
                        position[0], position[1],
                        Math.round(targetDistKm * 10.0) / 10.0,
                        i + 1,
                        nearbyStations
                ));
            }
        }


        RouteResponse response = new RouteResponse();

        response.setDistanceKm(
                Math.round(distanceKm * 100.0) / 100.0
        );

        response.setEstimatedDurationMinutes(
                (int) (durationSeconds / 60)
        );

        response.setBatteryRequired(
                Math.round(batteryRequiredPct * 100.0) / 100.0
        );

        response.setRecommendedChargingStops(
                chargingStops
        );

        response.setOriginLat(sourceLat);
        response.setOriginLng(sourceLng);

        response.setDestinationLat(destinationLat);
        response.setDestinationLng(destinationLng);

        response.setRouteGeometry(routeGeometry);

        response.setChargingStops(chargingStopList);

        return response;
    }

    /**
     * Geocodes a place name using Geoapify and returns [lat, lng].
     * Prefers city-level results over amenities/roads for journey planning.
     * Throws a clear, actionable exception when the provider rejects the request
     * or the place couldn't be found.
     */
    private double[] geocode(String place) {

        // Normalize spacing around commas so Geoapify can parse the input.
        // Handles: "Vijayawada,AndhraPradesh", "Noida ,Uttar Pradesh , India", etc.
        String normalized = place.replaceAll("\\s*,\\s*", ", ");

        // Attempt 1: geocode the full query (e.g. "Chandigarh, Punjab, India")
        double[] result = tryGeocode(normalized);
        if (result != null) {
            return result;
        }

        // Attempt 2: extract just the city name (first part before comma) and retry.
        // This handles cases like "Chandigarh, Punjab, India" where the state info
        // confuses Geoapify (Chandigarh is a UT, not in Punjab).
        String cityOnly = normalized.contains(",")
                ? normalized.substring(0, normalized.indexOf(",")).trim()
                : null;

        if (cityOnly != null && !cityOnly.isEmpty() && !cityOnly.equalsIgnoreCase(normalized)) {
            result = tryGeocode(cityOnly);
            if (result != null) {
                return result;
            }
        }

        // Attempt 3: try the original (un-normalized) text in case normalization broke something
        if (!place.equals(normalized)) {
            result = tryGeocode(place);
            if (result != null) {
                return result;
            }
        }

        throw new UpstreamServiceException(
                "Couldn't find a location for \"" + place + "\". "
                        + "Check the spelling, or try a simpler name "
                        + "(e.g. just the city name like \"Chandigarh\").",
                404
        );
    }

    /**
     * Calls Geoapify geocoding and picks the best city-level result.
     * Returns null if no features were returned.
     */
    private double[] tryGeocode(String query) {

        String responseBody;
        try {
            responseBody = geocodingClient.getCoordinates(query);
        } catch (HttpStatusCodeException e) {
            // If the API itself fails (401, 429, etc.), propagate immediately
            int status = e.getStatusCode().value();
            if (status != 404 && status != 400) {
                throw new UpstreamServiceException(
                        describeGeoapifyFailure("Geocoding \"" + query + "\"", e),
                        status
                );
            }
            return null;
        }

        JSONObject json = new JSONObject(responseBody);

        JSONArray features;
        try {
            features = json.getJSONArray("features");
        } catch (JSONException e) {
            return null;
        }

        if (features.length() == 0) {
            return null;
        }

        // Prefer city-level results over amenities, roads, etc.
        // Score: city/populated_place gets +1.0 bonus, state/country gets +0.5.
        // If best score < 1.0, the result is just an amenity/street — not reliable
        // for journey planning, so return null and let the fallback retry with
        // a simpler query (e.g. just the city name).
        JSONObject bestFeature = features.getJSONObject(0);
        double bestScore = -1;
        for (int i = 0; i < features.length(); i++) {
            JSONObject feature = features.getJSONObject(i);
            JSONObject props = feature.getJSONObject("properties");
            String resultType = props.optString("result_type", "");
            double confidence = props
                    .getJSONObject("rank")
                    .optDouble("confidence", 0);

            double score = confidence;
            if ("city".equals(resultType) || "populated_place".equals(resultType)) {
                score += 1.0;
            } else if ("state".equals(resultType) || "country".equals(resultType)
                    || "county".equals(resultType)) {
                score += 0.5;
            }

            if (score > bestScore) {
                bestScore = score;
                bestFeature = feature;
            }
        }

        if (bestScore < 1.0) {
            // Only amenities/streets found — not useful for journey planning
            return null;
        }

        // GeoJSON coordinates are [lng, lat]
        JSONArray coordinates =
                bestFeature
                        .getJSONObject("geometry")
                        .getJSONArray("coordinates");

        return new double[]{coordinates.getDouble(1), coordinates.getDouble(0)};
    }

    private String describeGeoapifyFailure(String action, HttpStatusCodeException e) {

        int status = e.getStatusCode().value();

        if (status == 401 || status == 403) {
            return action + " failed: Geoapify API rejected the request "
                    + "(" + status + " " + e.getStatusText() + "). This almost always means "
                    + "the API key (geoapify.api.key) is missing, invalid, or has hit its "
                    + "daily quota - check https://my.geoapify.com/";
        }

        if (status == 429) {
            return action + " failed: Geoapify API rate limit hit (429). "
                    + "Wait a moment and try again.";
        }

        return action + " failed: Geoapify API returned "
                + status + " " + e.getStatusText() + ".";
    }

    /**
     * Computes cumulative distances in km along a list of [lat, lng] points.
     * Returns an array where cumulativeDist[i] is the total distance from the
     * first point to point i.
     */
    private double[] computeCumulativeDistances(List<double[]> routeGeometry) {
        double[] cumulative = new double[routeGeometry.size()];
        cumulative[0] = 0;
        for (int i = 1; i < routeGeometry.size(); i++) {
            double[] prev = routeGeometry.get(i - 1);
            double[] curr = routeGeometry.get(i);
            cumulative[i] = cumulative[i - 1] + haversineKm(prev[0], prev[1], curr[0], curr[1]);
        }
        return cumulative;
    }

    /**
     * Finds the [lat, lng] position on the route at a given distance (km) from
     * the start by interpolating between the two nearest route geometry points.
     */
    private double[] findPositionOnRoute(List<double[]> routeGeometry, double[] cumulativeDist, double targetDistKm) {
        if (routeGeometry.size() < 2) return routeGeometry.get(0);

        // Clamp to route bounds
        double totalDist = cumulativeDist[cumulativeDist.length - 1];
        targetDistKm = Math.max(0, Math.min(targetDistKm, totalDist));

        // Find the segment that contains targetDistKm
        for (int i = 1; i < cumulativeDist.length; i++) {
            if (cumulativeDist[i] >= targetDistKm) {
                double segStart = cumulativeDist[i - 1];
                double segEnd = cumulativeDist[i];
                double segLen = segEnd - segStart;
                if (segLen < 0.001) return routeGeometry.get(i);

                double fraction = (targetDistKm - segStart) / segLen;
                double[] p1 = routeGeometry.get(i - 1);
                double[] p2 = routeGeometry.get(i);
                double lat = p1[0] + fraction * (p2[0] - p1[0]);
                double lng = p1[1] + fraction * (p2[1] - p1[1]);
                return new double[]{lat, lng};
            }
        }
        return routeGeometry.get(routeGeometry.size() - 1);
    }

    /**
     * Haversine distance between two [lat, lng] points in km.
     */
    private double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Finds charging stations near a given position using OpenChargeMap.
     * Returns up to 5 stations within 25 km.
     */
    private List<ChargingStationResponse> findStationsNear(double lat, double lng) {
        List<ChargingStationResponse> stations = new ArrayList<>();
        String response = "[]";
        int[] radii = {25, 50, 100};
        for (int radius : radii) {
            try {
                response = openChargeMapClient.getChargingStations(lat, lng, radius, 5, apiKey);
                JSONArray arr = new JSONArray(response);
                if (arr.length() > 0) break;
            } catch (HttpStatusCodeException e) {
                continue;
            }
        }

        JSONArray array = new JSONArray(response);
        for (int i = 0; i < array.length(); i++) {
            JSONObject station = array.getJSONObject(i);
            JSONObject address = station.optJSONObject("AddressInfo");
            if (address == null) continue;

            ChargingStationResponse dto = new ChargingStationResponse();
            dto.setStationName(address.optString("Title"));
            dto.setAddress(address.optString("AddressLine1"));
            dto.setLatitude(address.optDouble("Latitude"));
            dto.setLongitude(address.optDouble("Longitude"));

            JSONArray connections = station.optJSONArray("Connections");
            String connector = "Unknown";
            if (connections != null && connections.length() > 0) {
                JSONObject connection = connections.getJSONObject(0);
                JSONObject type = connection.optJSONObject("ConnectionType");
                if (type != null) {
                    connector = type.optString("Title", "Unknown");
                }
            }
            dto.setConnectorType(connector);
            stations.add(dto);
        }
        return stations;
    }

    @Override
    public List<ChargingStationResponse> getChargingStations(
            Double latitude,
            Double longitude
    ) {



        List<ChargingStationResponse> stations =
                new ArrayList<>();



        String response;
        try {
            response =
                    openChargeMapClient.getChargingStations(
                            latitude,
                            longitude,
                            25,
                            10,
                            apiKey
                    );
        } catch (HttpStatusCodeException e) {
            int status = e.getStatusCode().value();
            String message = (status == 401 || status == 403)
                    ? "Nearby station lookup failed: OpenChargeMap rejected the request ("
                            + status + " " + e.getStatusText() + "). Check the "
                            + "opencharge.api.key value."
                    : "Nearby station lookup failed: OpenChargeMap returned "
                            + status + " " + e.getStatusText() + ".";
            throw new UpstreamServiceException(message, status);
        }



        JSONArray array =
                new JSONArray(response);




        for(int i=0;i<array.length();i++){



            JSONObject station =
                    array.getJSONObject(i);



            JSONObject address =
                    station.optJSONObject("AddressInfo");



            if(address==null)
                continue;




            ChargingStationResponse dto =
                    new ChargingStationResponse();



            dto.setStationName(
                    address.optString("Title")
            );



            dto.setAddress(
                    address.optString("AddressLine1")
            );



            dto.setLatitude(
                    address.optDouble("Latitude")
            );



            dto.setLongitude(
                    address.optDouble("Longitude")
            );




            JSONArray connections =
                    station.optJSONArray("Connections");



            String connector =
                    "Unknown";



            if(connections!=null &&
                    connections.length()>0){



                JSONObject connection =
                        connections.getJSONObject(0);



                JSONObject type =
                        connection.optJSONObject(
                                "ConnectionType"
                        );



                if(type!=null){

                    connector =
                            type.optString(
                                    "Title",
                                    "Unknown"
                            );

                }

            }



            dto.setConnectorType(connector);



            stations.add(dto);

        }



        return stations;

    }


}
