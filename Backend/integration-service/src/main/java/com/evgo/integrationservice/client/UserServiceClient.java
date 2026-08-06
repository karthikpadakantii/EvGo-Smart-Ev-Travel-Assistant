package com.evgo.integrationservice.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserServiceClient {

    private final RestTemplate restTemplate;

    public UserServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getVehicle(Long userId) {

        String url =
                "http://localhost:8001/users/"
                        + userId
                        + "/vehicle";

        return restTemplate.getForObject(
                url,
                String.class
        );
    }
}