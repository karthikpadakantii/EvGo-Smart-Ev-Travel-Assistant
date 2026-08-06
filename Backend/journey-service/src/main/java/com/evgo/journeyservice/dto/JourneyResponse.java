package com.evgo.journeyservice.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.evgo.journeyservice.dto.integration.ChargingStop;

public class JourneyResponse {

    private Long journeyId;

    private String source;

    private String destination;

    private Double distance;

    private String estimatedTime;

    private Double batteryRequired;

    private Integer recommendedChargingStops;

    private Double originLat;
    private Double originLng;
    private Double destinationLat;
    private Double destinationLng;

    // Only populated on the response returned directly from POST
    // /journeys/plan - not persisted, so it's null when a journey is
    // fetched later (getJourneyById / getJourneysByUser). The frontend
    // falls back to a straight line between origin/destination in that case.
    private List<double[]> routeGeometry;

    private LocalDateTime journeyDate;

    private String status;

    private Double batteryCapacity;

    private Double drivingRange;

    private Double currentBatteryPercent;

    private List<ChargingStop> chargingStops;


    public JourneyResponse() {
    }


    public Long getJourneyId() {
        return journeyId;
    }

    public void setJourneyId(Long journeyId) {
        this.journeyId = journeyId;
    }


    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }


    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }


    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }


    public String getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(String estimatedTime) {
        this.estimatedTime = estimatedTime;
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


    public LocalDateTime getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(LocalDateTime journeyDate) {
        this.journeyDate = journeyDate;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getBatteryCapacity() {
        return batteryCapacity;
    }

    public void setBatteryCapacity(Double batteryCapacity) {
        this.batteryCapacity = batteryCapacity;
    }

    public Double getDrivingRange() {
        return drivingRange;
    }

    public void setDrivingRange(Double drivingRange) {
        this.drivingRange = drivingRange;
    }

    public Double getCurrentBatteryPercent() {
        return currentBatteryPercent;
    }

    public void setCurrentBatteryPercent(Double currentBatteryPercent) {
        this.currentBatteryPercent = currentBatteryPercent;
    }

    public List<ChargingStop> getChargingStops() {
        return chargingStops;
    }

    public void setChargingStops(List<ChargingStop> chargingStops) {
        this.chargingStops = chargingStops;
    }
}