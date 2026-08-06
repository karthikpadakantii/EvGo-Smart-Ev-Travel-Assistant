package com.evgo.journeyservice.service;

import com.evgo.journeyservice.client.IntegrationClient;
import com.evgo.journeyservice.dto.JourneyRequest;
import com.evgo.journeyservice.dto.JourneyResponse;
import com.evgo.journeyservice.dto.integration.RouteResponse;
import com.evgo.journeyservice.entity.Journey;
import com.evgo.journeyservice.exception.JourneyNotFoundException;
import com.evgo.journeyservice.repository.JourneyRepository;
import com.evgo.journeyservice.service.impl.JourneyServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JourneyServiceImplTest {

    @Mock
    private JourneyRepository journeyRepository;

    @Mock
    private IntegrationClient integrationClient;

    @InjectMocks
    private JourneyServiceImpl journeyService;

    @Test
    void planJourney_Success() {
        JourneyRequest request = new JourneyRequest();
        request.setUserId(1L);
        request.setSource("Chennai");
        request.setDestination("Bangalore");

        RouteResponse routeResponse = new RouteResponse();
        routeResponse.setDistanceKm(350.0);
        routeResponse.setEstimatedDurationMinutes(300);
        routeResponse.setBatteryRequired(45.5);
        routeResponse.setRecommendedChargingStops(2);
        routeResponse.setOriginLat(13.0827);
        routeResponse.setOriginLng(80.2707);
        routeResponse.setDestinationLat(12.9716);
        routeResponse.setDestinationLng(77.5946);
        routeResponse.setRouteGeometry(Arrays.asList(
                new double[]{13.0827, 80.2707},
                new double[]{12.9716, 77.5946}
        ));

        Journey savedJourney = new Journey();
        savedJourney.setJourneyId(10L);
        savedJourney.setUserId(1L);
        savedJourney.setSource("Chennai");
        savedJourney.setDestination("Bangalore");
        savedJourney.setDistance(350.0);
        savedJourney.setEstimatedTime("5h 0m");
        savedJourney.setBatteryRequired(45.5);
        savedJourney.setRecommendedChargingStops(2);
        savedJourney.setOriginLat(13.0827);
        savedJourney.setOriginLng(80.2707);
        savedJourney.setDestinationLat(12.9716);
        savedJourney.setDestinationLng(77.5946);
        savedJourney.setStatus("PLANNED");

        when(integrationClient.calculateRoute("Chennai", "Bangalore"))
                .thenReturn(routeResponse);
        when(journeyRepository.save(any(Journey.class)))
                .thenReturn(savedJourney);

        JourneyResponse response = journeyService.planJourney(request);

        assertNotNull(response);
        assertEquals("Chennai", response.getSource());
        assertEquals("Bangalore", response.getDestination());
        assertEquals(350.0, response.getDistance());
        assertEquals("5h 0m", response.getEstimatedTime());
        assertEquals(45.5, response.getBatteryRequired());
        assertEquals(2, response.getRecommendedChargingStops());
        assertEquals("PLANNED", response.getStatus());
        assertNotNull(response.getRouteGeometry());
        assertEquals(2, response.getRouteGeometry().size());

        verify(integrationClient).calculateRoute("Chennai", "Bangalore");
        verify(journeyRepository).save(any(Journey.class));
    }

    @Test
    void getJourneyById_Success() {
        Journey journey = new Journey();
        journey.setJourneyId(10L);
        journey.setUserId(1L);
        journey.setSource("Chennai");
        journey.setDestination("Bangalore");
        journey.setDistance(350.0);
        journey.setEstimatedTime("5h 0m");
        journey.setBatteryRequired(45.5);
        journey.setRecommendedChargingStops(2);
        journey.setOriginLat(13.0827);
        journey.setOriginLng(80.2707);
        journey.setDestinationLat(12.9716);
        journey.setDestinationLng(77.5946);
        journey.setStatus("PLANNED");

        when(journeyRepository.findById(10L)).thenReturn(Optional.of(journey));

        JourneyResponse response = journeyService.getJourneyById(10L);

        assertNotNull(response);
        assertEquals(10L, response.getJourneyId());
        assertEquals("Chennai", response.getSource());
        assertEquals("Bangalore", response.getDestination());
        assertEquals(350.0, response.getDistance());
        assertEquals("PLANNED", response.getStatus());
        verify(journeyRepository).findById(10L);
    }

    @Test
    void getJourneyById_NotFound_ThrowsException() {
        when(journeyRepository.findById(99L)).thenReturn(Optional.empty());

        JourneyNotFoundException exception = assertThrows(
                JourneyNotFoundException.class,
                () -> journeyService.getJourneyById(99L)
        );

        assertEquals("Journey not found", exception.getMessage());
        verify(journeyRepository).findById(99L);
    }

    @Test
    void getJourneysByUser_Success() {
        Journey journey1 = new Journey();
        journey1.setJourneyId(10L);
        journey1.setUserId(1L);
        journey1.setSource("Chennai");
        journey1.setDestination("Bangalore");
        journey1.setDistance(350.0);
        journey1.setStatus("PLANNED");

        Journey journey2 = new Journey();
        journey2.setJourneyId(20L);
        journey2.setUserId(1L);
        journey2.setSource("Mumbai");
        journey2.setDestination("Pune");
        journey2.setDistance(150.0);
        journey2.setStatus("COMPLETED");

        when(journeyRepository.findByUserId(1L))
                .thenReturn(Arrays.asList(journey1, journey2));

        List<JourneyResponse> responses = journeyService.getJourneysByUser(1L);

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Chennai", responses.get(0).getSource());
        assertEquals("Mumbai", responses.get(1).getSource());
        verify(journeyRepository).findByUserId(1L);
    }

    @Test
    void deleteJourney_Success() {
        Journey journey = new Journey();
        journey.setJourneyId(10L);
        journey.setUserId(1L);
        journey.setSource("Chennai");
        journey.setDestination("Bangalore");
        journey.setStatus("PLANNED");

        when(journeyRepository.findById(10L)).thenReturn(Optional.of(journey));

        journeyService.deleteJourney(10L);

        verify(journeyRepository).findById(10L);
        verify(journeyRepository).delete(journey);
    }
}
