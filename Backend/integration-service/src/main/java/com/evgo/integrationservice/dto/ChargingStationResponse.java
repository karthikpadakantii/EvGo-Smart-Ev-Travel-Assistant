package com.evgo.integrationservice.dto;


public class ChargingStationResponse {


    private String stationName;

    private String address;

    private String connectorType;

    private Double latitude;

    private Double longitude;


    public ChargingStationResponse() {

    }


    public String getStationName() {
        return stationName;
    }


    public void setStationName(String stationName) {
        this.stationName = stationName;
    }


    public String getAddress() {
        return address;
    }


    public void setAddress(String address) {
        this.address = address;
    }


    public String getConnectorType() {
        return connectorType;
    }


    public void setConnectorType(String connectorType) {
        this.connectorType = connectorType;
    }


    public Double getLatitude() {
        return latitude;
    }


    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }


    public Double getLongitude() {
        return longitude;
    }


    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

}