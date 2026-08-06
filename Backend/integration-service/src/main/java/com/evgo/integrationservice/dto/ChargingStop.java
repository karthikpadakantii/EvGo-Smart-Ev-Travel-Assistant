package com.evgo.integrationservice.dto;

import java.util.List;

public class ChargingStop {

    private double latitude;
    private double longitude;
    private double distanceFromOriginKm;
    private int stopNumber;
    private List<ChargingStationResponse> stations;

    public ChargingStop() {
    }

    public ChargingStop(double latitude, double longitude, double distanceFromOriginKm, int stopNumber, List<ChargingStationResponse> stations) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceFromOriginKm = distanceFromOriginKm;
        this.stopNumber = stopNumber;
        this.stations = stations;
    }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getDistanceFromOriginKm() { return distanceFromOriginKm; }
    public void setDistanceFromOriginKm(double distanceFromOriginKm) { this.distanceFromOriginKm = distanceFromOriginKm; }

    public int getStopNumber() { return stopNumber; }
    public void setStopNumber(int stopNumber) { this.stopNumber = stopNumber; }

    public List<ChargingStationResponse> getStations() { return stations; }
    public void setStations(List<ChargingStationResponse> stations) { this.stations = stations; }
}
