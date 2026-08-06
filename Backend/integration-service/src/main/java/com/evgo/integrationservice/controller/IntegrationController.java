package com.evgo.integrationservice.controller;

import com.evgo.integrationservice.dto.ChargingStationResponse;
import com.evgo.integrationservice.dto.RouteResponse;
import com.evgo.integrationservice.service.IntegrationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/integration")
public class IntegrationController {

    private final IntegrationService integrationService;

    public IntegrationController(IntegrationService integrationService) {
        this.integrationService = integrationService;
    }

    @GetMapping("/route")
    public RouteResponse calculateRoute(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam Double batteryCapacity,
            @RequestParam Double drivingRange,
            @RequestParam(defaultValue = "100") Double currentBatteryPercent) {

        return integrationService.calculateRoute(source, destination, batteryCapacity, drivingRange, currentBatteryPercent);
    }

    @GetMapping("/stations")
    public List<ChargingStationResponse> getChargingStations(
            @RequestParam Double latitude,
            @RequestParam Double longitude) {

        return integrationService.getChargingStations(latitude, longitude);
    }
}