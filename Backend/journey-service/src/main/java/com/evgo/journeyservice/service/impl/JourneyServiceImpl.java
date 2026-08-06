package com.evgo.journeyservice.service.impl;

import com.evgo.journeyservice.client.IntegrationClient;
import com.evgo.journeyservice.dto.JourneyRequest;
import com.evgo.journeyservice.dto.JourneyResponse;
import com.evgo.journeyservice.dto.integration.RouteResponse;
import com.evgo.journeyservice.entity.Journey;
import com.evgo.journeyservice.exception.JourneyNotFoundException;
import com.evgo.journeyservice.repository.JourneyRepository;
import com.evgo.journeyservice.service.JourneyService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class JourneyServiceImpl implements JourneyService {


    private final JourneyRepository journeyRepository;

    private final IntegrationClient integrationClient;


    public JourneyServiceImpl(
            JourneyRepository journeyRepository,
            IntegrationClient integrationClient) {

        this.journeyRepository = journeyRepository;
        this.integrationClient = integrationClient;
    }



    @Override
    public JourneyResponse planJourney(JourneyRequest request) {


        Journey journey = new Journey();


        journey.setUserId(request.getUserId());

        journey.setSource(request.getSource());

        journey.setDestination(request.getDestination());


        RouteResponse routeResponse =
                integrationClient.calculateRoute(
                        request.getSource(),
                        request.getDestination(),
                        request.getBatteryCapacity(),
                        request.getDrivingRange(),
                        request.getCurrentBatteryPercent() != null ? request.getCurrentBatteryPercent() : 100.0
                );


        journey.setDistance(
                routeResponse.getDistanceKm()
        );


        journey.setEstimatedTime(
                formatMinutes(routeResponse.getEstimatedDurationMinutes())
        );


        journey.setBatteryRequired(
                routeResponse.getBatteryRequired()
        );


        journey.setRecommendedChargingStops(
                routeResponse.getRecommendedChargingStops()
        );


        journey.setOriginLat(routeResponse.getOriginLat());
        journey.setOriginLng(routeResponse.getOriginLng());
        journey.setDestinationLat(routeResponse.getDestinationLat());
        journey.setDestinationLng(routeResponse.getDestinationLng());


        journey.setJourneyDate(
                LocalDateTime.now()
        );


        journey.setStatus("PLANNED");

        journey.setBatteryCapacity(request.getBatteryCapacity());
        journey.setDrivingRange(request.getDrivingRange());
        journey.setCurrentBatteryPercent(
                request.getCurrentBatteryPercent() != null ? request.getCurrentBatteryPercent() : 100.0
        );

        Journey savedJourney =
                journeyRepository.save(journey);


        JourneyResponse response = mapToResponse(savedJourney);

        // routeGeometry isn't persisted on the entity (see Journey), so it's
        // only available here, straight off the integration-service call -
        // stitch it onto the response the frontend gets back from planning.
        response.setRouteGeometry(routeResponse.getRouteGeometry());

        return response;
    }



    @Override
    public List<JourneyResponse> getJourneysByUser(Long userId) {


        List<Journey> journeys =
                journeyRepository.findByUserId(userId);


        List<JourneyResponse> response =
                new ArrayList<>();


        for(Journey journey : journeys){

            response.add(
                    mapToResponse(journey)
            );
        }


        return response;
    }



    @Override
    public JourneyResponse getJourneyById(Long journeyId) {

        Journey journey =
                journeyRepository.findById(journeyId)
                        .orElseThrow(
                                () -> new JourneyNotFoundException(
                                        "Journey not found"
                                )
                        );

        JourneyResponse response = mapToResponse(journey);

        // Re-fetch the route from integration-service to get fresh
        // routeGeometry and charging stops (not persisted on entity).
        if (journey.getBatteryCapacity() != null && journey.getDrivingRange() != null) {
            try {
                RouteResponse routeResponse = integrationClient.calculateRoute(
                        journey.getSource(),
                        journey.getDestination(),
                        journey.getBatteryCapacity(),
                        journey.getDrivingRange(),
                        journey.getCurrentBatteryPercent() != null ? journey.getCurrentBatteryPercent() : 100.0
                );
                response.setRouteGeometry(routeResponse.getRouteGeometry());
                response.setChargingStops(routeResponse.getChargingStops());
            } catch (Exception e) {
                // If integration-service is down, return journey without geometry
            }
        }

        return response;
    }



    @Override
    public void deleteJourney(Long journeyId) {


        Journey journey =
                journeyRepository.findById(journeyId)
                        .orElseThrow(
                                () -> new JourneyNotFoundException(
                                        "Journey not found"
                                )
                        );


        journeyRepository.delete(journey);
    }



    private String formatMinutes(Integer minutes) {

        if (minutes == null) {
            return null;
        }

        int hours = minutes / 60;
        int remainingMinutes = minutes % 60;

        if (hours > 0) {
            return hours + "h " + remainingMinutes + "m";
        }

        return remainingMinutes + "m";
    }


    private JourneyResponse mapToResponse(Journey journey){


        JourneyResponse response =
                new JourneyResponse();


        response.setJourneyId(
                journey.getJourneyId()
        );


        response.setSource(
                journey.getSource()
        );


        response.setDestination(
                journey.getDestination()
        );


        response.setDistance(
                journey.getDistance()
        );


        response.setEstimatedTime(
                journey.getEstimatedTime()
        );


        response.setBatteryRequired(
                journey.getBatteryRequired()
        );


        response.setRecommendedChargingStops(
                journey.getRecommendedChargingStops()
        );


        response.setOriginLat(journey.getOriginLat());
        response.setOriginLng(journey.getOriginLng());
        response.setDestinationLat(journey.getDestinationLat());
        response.setDestinationLng(journey.getDestinationLng());


        response.setJourneyDate(
                journey.getJourneyDate()
        );


        response.setStatus(
                journey.getStatus()
        );

        response.setBatteryCapacity(journey.getBatteryCapacity());
        response.setDrivingRange(journey.getDrivingRange());
        response.setCurrentBatteryPercent(journey.getCurrentBatteryPercent());

        return response;
    }
}