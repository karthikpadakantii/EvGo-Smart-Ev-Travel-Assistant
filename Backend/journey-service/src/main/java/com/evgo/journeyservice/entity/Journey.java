package com.evgo.journeyservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "journeys")
public class Journey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long journeyId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    private Double distance;

    private String estimatedTime;

    private Double batteryRequired;

    private Integer recommendedChargingStops;

    // Needed to plot the journey on a map (origin/destination markers).
    // Not the full route polyline - that's only returned inline from
    // /journeys/plan, not persisted, since it can be a few hundred points.
    private Double originLat;
    private Double originLng;
    private Double destinationLat;
    private Double destinationLng;

    private LocalDateTime journeyDate;

    private String status;

    private Double batteryCapacity;

    private Double drivingRange;

    private Double currentBatteryPercent;


    public Journey() {
    }


    public Long getJourneyId() {
        return journeyId;
    }

    public void setJourneyId(Long journeyId) {
        this.journeyId = journeyId;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
}