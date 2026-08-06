package com.evgo.userservice.dto;

public class VehicleResponse {

    private Long vehicleId;
    private String vehicleModel;
    private Double batteryCapacity;
    private Double drivingRange;
    private String connectorType;

    public VehicleResponse() {
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
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

    public String getConnectorType() {
        return connectorType;
    }

    public void setConnectorType(String connectorType) {
        this.connectorType = connectorType;
    }
}