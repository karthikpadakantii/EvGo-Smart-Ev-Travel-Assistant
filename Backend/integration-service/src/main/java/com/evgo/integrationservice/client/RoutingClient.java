package com.evgo.integrationservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RoutingClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${geoapify.api.key}")
    private String apiKey;

    private static final String BASE_URL =
            "https://api.geoapify.com/v1/routing";

    /**
     * Gets driving route using Geoapify Routing API.
     * Returns the raw JSON response string in GeoJSON format.
     */
    public String getRoute(
            String originLat,
            String originLng,
            String destinationLat,
            String destinationLng
    ) {

        // Geoapify expects waypoints as: lat1,lng1|lat2,lng2
        // Build URL manually to avoid UriComponentsBuilder encoding the pipe character
        String url = BASE_URL
                + "?waypoints=" + originLat + "," + originLng + "|" + destinationLat + "," + destinationLng
                + "&mode=drive"
                + "&apiKey=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }
}
