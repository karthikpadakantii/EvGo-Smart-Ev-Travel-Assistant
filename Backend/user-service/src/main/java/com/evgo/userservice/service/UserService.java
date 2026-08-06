package com.evgo.userservice.service;

import com.evgo.userservice.dto.LoginRequest;
import com.evgo.userservice.dto.RegisterUserRequest;
import com.evgo.userservice.dto.UserResponse;
import com.evgo.userservice.dto.VehicleResponse;

import java.util.List;

public interface UserService {

    UserResponse registerUser(RegisterUserRequest request);

    UserResponse login(LoginRequest request);

    UserResponse getUserById(Long userId);

    List<VehicleResponse> getUserVehicles(Long userId);
}