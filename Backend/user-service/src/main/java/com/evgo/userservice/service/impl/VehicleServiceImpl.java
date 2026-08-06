package com.evgo.userservice.service.impl;

import com.evgo.userservice.dto.VehicleRequest;
import com.evgo.userservice.dto.VehicleResponse;
import com.evgo.userservice.entity.User;
import com.evgo.userservice.entity.Vehicle;
import com.evgo.userservice.exception.UserNotFoundException;
import com.evgo.userservice.exception.VehicleNotFoundException;
import com.evgo.userservice.repository.UserRepository;
import com.evgo.userservice.repository.VehicleRepository;
import com.evgo.userservice.service.VehicleService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository,
                              UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public VehicleResponse addVehicle(Long userId, VehicleRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleModel(request.getVehicleModel());
        vehicle.setBatteryCapacity(request.getBatteryCapacity());
        vehicle.setDrivingRange(request.getDrivingRange());
        vehicle.setConnectorType(request.getConnectorType());
        vehicle.setUser(user);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return mapToResponse(savedVehicle);
    }

    @Override
    public List<VehicleResponse> getVehiclesByUser(Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Vehicle> vehicles = vehicleRepository.findByUserUserId(userId);

        List<VehicleResponse> responseList = new ArrayList<>();

        for (Vehicle vehicle : vehicles) {
            responseList.add(mapToResponse(vehicle));
        }

        return responseList;
    }

    @Override
    public VehicleResponse updateVehicle(Long vehicleId, VehicleRequest request) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found"));

        vehicle.setVehicleModel(request.getVehicleModel());
        vehicle.setBatteryCapacity(request.getBatteryCapacity());
        vehicle.setDrivingRange(request.getDrivingRange());
        vehicle.setConnectorType(request.getConnectorType());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);

        return mapToResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Long vehicleId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found"));

        vehicleRepository.delete(vehicle);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {

        VehicleResponse response = new VehicleResponse();

        response.setVehicleId(vehicle.getVehicleId());
        response.setVehicleModel(vehicle.getVehicleModel());
        response.setBatteryCapacity(vehicle.getBatteryCapacity());
        response.setDrivingRange(vehicle.getDrivingRange());
        response.setConnectorType(vehicle.getConnectorType());

        return response;
    }
}