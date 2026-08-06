package com.evgo.journeyservice.client;

import com.evgo.journeyservice.dto.integration.RouteResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "INTEGRATION-SERVICE")
public interface IntegrationClient {

    @GetMapping("/integration/route")
    RouteResponse calculateRoute(
            @RequestParam("source") String source,
            @RequestParam("destination") String destination,
            @RequestParam("batteryCapacity") Double batteryCapacity,
            @RequestParam("drivingRange") Double drivingRange,
            @RequestParam(value = "currentBatteryPercent", defaultValue = "100") Double currentBatteryPercent
    );
}