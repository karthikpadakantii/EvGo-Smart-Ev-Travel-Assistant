package com.evgo.integrationservice.service;

import com.evgo.integrationservice.client.GeocodingClient;
import com.evgo.integrationservice.client.OpenChargeMapClient;
import com.evgo.integrationservice.client.RoutingClient;
import com.evgo.integrationservice.dto.ChargingStationResponse;
import com.evgo.integrationservice.dto.RouteResponse;
import com.evgo.integrationservice.exception.UpstreamServiceException;
import com.evgo.integrationservice.service.impl.IntegrationServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IntegrationServiceImplTest {

    @Mock
    private GeocodingClient geocodingClient;

    @Mock
    private RoutingClient routingClient;

    @Mock
    private OpenChargeMapClient openChargeMapClient;

    @InjectMocks
    private IntegrationServiceImpl service;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(service, "apiKey", "test-key");
    }

    @Test
    void calculateRoute_Success() {
        String sourceGeoJson = """
                {
                  "features": [
                    {
                      "properties": {
                        "result_type": "city",
                        "rank": { "confidence": 0.95 }
                      },
                      "geometry": {
                        "coordinates": [77.1025, 28.7041]
                      }
                    }
                  ]
                }
                """;

        String destinationGeoJson = """
                {
                  "features": [
                    {
                      "properties": {
                        "result_type": "city",
                        "rank": { "confidence": 0.90 }
                      },
                      "geometry": {
                        "coordinates": [77.5946, 12.9716]
                      }
                    }
                  ]
                }
                """;

        // distance = 500000 meters = 500 km, time = 18000 seconds = 300 minutes
        String routeGeoJson = """
                {
                  "features": [
                    {
                      "properties": {
                        "distance": 500000,
                        "time": 18000
                      },
                      "geometry": {
                        "type": "MultiLineString",
                        "coordinates": [
                          [
                            [77.1025, 28.7041],
                            [77.3486, 20.8393],
                            [77.5946, 12.9716]
                          ]
                        ]
                      }
                    }
                  ]
                }
                """;

        when(geocodingClient.getCoordinates("New Delhi, India"))
                .thenReturn(sourceGeoJson);
        when(geocodingClient.getCoordinates("Bangalore, India"))
                .thenReturn(destinationGeoJson);
        when(routingClient.getRoute(
                eq("28.7041"), eq("77.1025"),
                eq("12.9716"), eq("77.5946")))
                .thenReturn(routeGeoJson);

        // batteryCapacity=60, drivingRange=300, currentBattery=100%
        // efficiency = 300/60 = 5.0
        // energyRequired = 500/5.0 = 100 kWh
        // availableEnergy = (100/100)*60 = 60 kWh
        // energyShortfall = 100 - 60 = 40 kWh
        // usablePerCharge = 60*0.8 = 48 kWh
        // chargingStops = ceil(40/48) = 1
        // batteryRequired = (100/60)*100 = 166.67
        RouteResponse result = service.calculateRoute(
                "New Delhi, India", "Bangalore, India", 60.0, 300.0, 100.0);

        assertNotNull(result);
        assertEquals(500.0, result.getDistanceKm(), 0.01);
        assertEquals(300, result.getEstimatedDurationMinutes());
        assertEquals(166.67, result.getBatteryRequired(), 0.01);
        assertEquals(1, result.getRecommendedChargingStops());
        assertEquals(28.7041, result.getOriginLat(), 0.0001);
        assertEquals(77.1025, result.getOriginLng(), 0.0001);
        assertEquals(12.9716, result.getDestinationLat(), 0.0001);
        assertEquals(77.5946, result.getDestinationLng(), 0.0001);
        assertNotNull(result.getRouteGeometry());
        assertFalse(result.getRouteGeometry().isEmpty());

        verify(geocodingClient).getCoordinates("New Delhi, India");
        verify(geocodingClient).getCoordinates("Bangalore, India");
        verify(routingClient).getRoute(
                "28.7041", "77.1025", "12.9716", "77.5946");
    }

    @Test
    void calculateRoute_NoRoutes_ThrowsException() {
        String sourceGeoJson = """
                {
                  "features": [
                    {
                      "properties": {
                        "result_type": "city",
                        "rank": { "confidence": 0.95 }
                      },
                      "geometry": {
                        "coordinates": [77.1025, 28.7041]
                      }
                    }
                  ]
                }
                """;

        String destinationGeoJson = """
                {
                  "features": [
                    {
                      "properties": {
                        "result_type": "city",
                        "rank": { "confidence": 0.90 }
                      },
                      "geometry": {
                        "coordinates": [77.5946, 12.9716]
                      }
                    }
                  ]
                }
                """;

        // Routing returns empty features array
        String emptyRouteGeoJson = """
                {
                  "features": []
                }
                """;

        when(geocodingClient.getCoordinates("New Delhi, India"))
                .thenReturn(sourceGeoJson);
        when(geocodingClient.getCoordinates("Bangalore, India"))
                .thenReturn(destinationGeoJson);
        when(routingClient.getRoute(
                eq("28.7041"), eq("77.1025"),
                eq("12.9716"), eq("77.5946")))
                .thenReturn(emptyRouteGeoJson);

        UpstreamServiceException ex = assertThrows(
                UpstreamServiceException.class,
                () -> service.calculateRoute(
                        "New Delhi, India", "Bangalore, India", 60.0, 300.0, 100.0)
        );

        assertEquals(404, ex.getUpstreamStatus());
        assertTrue(ex.getMessage().contains("No routes found"));
    }

    @Test
    void getChargingStations_Success() {
        String stationsJson = """
                [
                  {
                    "AddressInfo": {
                      "Title": "EV Station Alpha",
                      "AddressLine1": "12 MG Road",
                      "Latitude": 12.9716,
                      "Longitude": 77.5946
                    },
                    "Connections": [
                      {
                        "ConnectionType": {
                          "Title": "Type 2"
                        }
                      }
                    ]
                  },
                  {
                    "AddressInfo": {
                      "Title": "EV Station Beta",
                      "AddressLine1": "45 Park Street",
                      "Latitude": 12.9750,
                      "Longitude": 77.6000
                    },
                    "Connections": [
                      {
                        "ConnectionType": {
                          "Title": "CCS (Type 1)"
                        }
                      }
                    ]
                  }
                ]
                """;

        when(openChargeMapClient.getChargingStations(
                eq(12.9716), eq(77.5946),
                eq(25), eq(10), eq("test-key")))
                .thenReturn(stationsJson);

        List<ChargingStationResponse> result =
                service.getChargingStations(12.9716, 77.5946);

        assertEquals(2, result.size());

        assertEquals("EV Station Alpha", result.get(0).getStationName());
        assertEquals("12 MG Road", result.get(0).getAddress());
        assertEquals(12.9716, result.get(0).getLatitude(), 0.0001);
        assertEquals(77.5946, result.get(0).getLongitude(), 0.0001);
        assertEquals("Type 2", result.get(0).getConnectorType());

        assertEquals("EV Station Beta", result.get(1).getStationName());
        assertEquals("45 Park Street", result.get(1).getAddress());
        assertEquals("CCS (Type 1)", result.get(1).getConnectorType());

        verify(openChargeMapClient).getChargingStations(
                12.9716, 77.5946, 25, 10, "test-key");
    }

    @Test
    void getChargingStations_EmptyResponse_ReturnsEmptyList() {
        String emptyJson = "[]";

        when(openChargeMapClient.getChargingStations(
                eq(12.9716), eq(77.5946),
                eq(25), eq(10), eq("test-key")))
                .thenReturn(emptyJson);

        List<ChargingStationResponse> result =
                service.getChargingStations(12.9716, 77.5946);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getChargingStations_AddressNull_SkipsStation() {
        String stationsJson = """
                [
                  {
                    "AddressInfo": null,
                    "Connections": [
                      {
                        "ConnectionType": {
                          "Title": "Type 2"
                        }
                      }
                    ]
                  },
                  {
                    "AddressInfo": {
                      "Title": "Valid Station",
                      "AddressLine1": "10 Brigade Road",
                      "Latitude": 12.9716,
                      "Longitude": 77.5946
                    },
                    "Connections": [
                      {
                        "ConnectionType": {
                          "Title": "Type 2"
                        }
                      }
                    ]
                  }
                ]
                """;

        when(openChargeMapClient.getChargingStations(
                eq(12.9716), eq(77.5946),
                eq(25), eq(10), eq("test-key")))
                .thenReturn(stationsJson);

        List<ChargingStationResponse> result =
                service.getChargingStations(12.9716, 77.5946);

        assertEquals(1, result.size());
        assertEquals("Valid Station", result.get(0).getStationName());
        assertEquals("10 Brigade Road", result.get(0).getAddress());
        assertEquals("Type 2", result.get(0).getConnectorType());
    }
}
