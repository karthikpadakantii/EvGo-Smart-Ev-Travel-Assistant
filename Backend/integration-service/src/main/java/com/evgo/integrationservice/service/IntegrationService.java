package com.evgo.integrationservice.service;

import com.evgo.integrationservice.dto.ChargingStationResponse;
import com.evgo.integrationservice.dto.RouteResponse;

import java.util.List;

public interface IntegrationService {

    RouteResponse calculateRoute(String source, String destination,
                                  Double batteryCapacity, Double drivingRange,
                                  Double currentBatteryPercent);

    List<ChargingStationResponse> getChargingStations(
            Double latitude,
            Double longitude);

}