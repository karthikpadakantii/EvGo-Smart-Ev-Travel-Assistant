package com.evgo.integrationservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class GeocodingClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${geoapify.api.key}")
    private String apiKey;

    /**
     * Geocodes a place name using Geoapify Autocomplete API.
     * Autocomplete is more tolerant of typos and partial names.
     * Returns the raw JSON response string in GeoJSON format.
     */
    public String getCoordinates(String place) {

        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.geoapify.com/v1/geocode/autocomplete")
                .queryParam("text", place)
                .queryParam("apiKey", apiKey)
                .encode()
                .toUriString();

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
