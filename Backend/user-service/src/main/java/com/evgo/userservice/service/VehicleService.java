package com.evgo.userservice.service;

import com.evgo.userservice.dto.VehicleRequest;
import com.evgo.userservice.dto.VehicleResponse;

import java.util.List;

public interface VehicleService {

    VehicleResponse addVehicle(Long userId, VehicleRequest request);

    List<VehicleResponse> getVehiclesByUser(Long userId);

    VehicleResponse updateVehicle(Long vehicleId, VehicleRequest request);

    void deleteVehicle(Long vehicleId);
}