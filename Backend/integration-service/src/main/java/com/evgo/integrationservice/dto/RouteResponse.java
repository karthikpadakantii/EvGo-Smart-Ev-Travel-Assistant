package com.evgo.integrationservice.dto;

import java.util.List;

public class RouteResponse {

    private Double distanceKm;
    private Integer estimatedDurationMinutes;
    private Double batteryRequired;
    private Integer recommendedChargingStops;

    private Double originLat;
    private Double originLng;

    private Double destinationLat;
    private Double destinationLng;

    // Full driving-route polyline, as [lat, lng] pairs in travel order, so the
    // frontend map can draw the actual road path instead of a straight line
    // between origin and destination. Sourced from ORS's GeoJSON geometry
    // (which comes back as [lng, lat] - swapped here to [lat, lng] since
    // that's what Leaflet's Polyline expects).
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