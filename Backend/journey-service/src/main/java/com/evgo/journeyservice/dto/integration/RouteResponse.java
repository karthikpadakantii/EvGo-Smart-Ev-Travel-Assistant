package com.evgo.journeyservice.dto.integration;

/**
 * Mirrors the JSON actually returned by integration-service's
 * /integration/route endpoint (see IntegrationServiceImpl / dto.RouteResponse
 * on that side). Field names here must match those JSON keys exactly,
 * since Jackson binds this DTO by property name - they had drifted
 * (distance/estimatedTime vs distanceKm/estimatedDurationMinutes), which
 * silently left distance and estimatedTime null on every planned journey.
 */
import java.util.List;

public class RouteResponse {

    private Double distanceKm;
    private Integer estimatedDurationMinutes;
    private Double batteryRequired;
    private Integer recommendedChargingStops;

    // integration-service also returns these (see its dto.RouteResponse) but
    // they weren't mirrored here, so the coordinates needed to plot the
    // journey on a map were silently dropped the same way distance/time used
    // to be - Jackson just leaves unmapped-here fields unread.
    private Double originLat;
    private Double originLng;
    private Double destinationLat;
    private Double destinationLng;
    private List<double[]> routeGeometry;
    private List<ChargingStop> chargingStops;

    public RouteResponse() {
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getEstimatedDurationMinutes() {
        return estimatedDurationMinutes;
    }

    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) {
        this.estimatedDurationMinutes = estimatedDurationMinutes;
    }

    public Double getBatteryRequired() {
        return batteryRequired;
    }

    public void setBatteryRequired(Double batteryRequired) {
        this.batteryRequired = batteryRequired;
    }

    public Integer getRecommendedChargingStops() {
        return recommendedChargingStops;
    }

    public void setRecommendedChargingStops(Integer recommendedChargingStops) {
        this.recommendedChargingStops = recommendedChargingStops;
    }

    public Double getOriginLat() {
        return originLat;
    }

    public void setOriginLat(Double originLat) {
        this.originLat = originLat;
    }

    public Double getOriginLng() {
        return originLng;
    }

    public void setOriginLng(Double originLng) {
        this.originLng = originLng;
    }

    public Double getDestinationLat() {
        return destinationLat;
    }

    public void setDestinationLat(Double destinationLat) {
        this.destinationLat = destinationLat;
    }

    public Double getDestinationLng() {
        return destinationLng;
    }

    public void setDestinationLng(Double destinationLng) {
        this.destinationLng = destinationLng;
    }

    public List<double[]> getRouteGeometry() {
        return routeGeometry;
    }

    public void setRouteGeometry(List<double[]> routeGeometry) {
        this.routeGeometry = routeGeometry;
    }

    public List<ChargingStop> getChargingStops() {
        return chargingStops;
    }

    public void setChargingStops(List<ChargingStop> chargingStops) {
        this.chargingStops = chargingStops;
    }
}
