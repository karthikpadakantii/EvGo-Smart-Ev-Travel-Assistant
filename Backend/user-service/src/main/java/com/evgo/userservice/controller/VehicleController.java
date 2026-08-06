package com.evgo.userservice.controller;

import com.evgo.userservice.dto.VehicleRequest;
import com.evgo.userservice.dto.VehicleResponse;
import com.evgo.userservice.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/users/{userId}/vehicles")
    public ResponseEntity<VehicleResponse> addVehicle(
            @PathVariable Long userId,
            @Valid @RequestBody VehicleRequest request) {

        return new ResponseEntity<>(
                vehicleService.addVehicle(userId, request),
                HttpStatus.CREATED);
    }

    @GetMapping("/users/{userId}/vehicles")
    public ResponseEntity<List<VehicleResponse>> getVehicles(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                vehicleService.getVehiclesByUser(userId));
    }

    @PutMapping("/vehicles/{vehicleId}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long vehicleId,
            @Valid @RequestBody VehicleRequest request) {

        return ResponseEntity.ok(
                vehicleService.updateVehicle(vehicleId, request));
    }

    @DeleteMapping("/vehicles/{vehicleId}")
    public ResponseEntity<String> deleteVehicle(
            @PathVariable Long vehicleId) {

        vehicleService.deleteVehicle(vehicleId);

        return ResponseEntity.ok("Vehicle deleted successfully");
    }
}