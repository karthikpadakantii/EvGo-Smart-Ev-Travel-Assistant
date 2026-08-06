package com.evgo.userservice.service.impl;

import com.evgo.userservice.dto.LoginRequest;
import com.evgo.userservice.dto.RegisterUserRequest;
import com.evgo.userservice.dto.UserResponse;
import com.evgo.userservice.dto.VehicleResponse;
import com.evgo.userservice.entity.User;
import com.evgo.userservice.entity.Vehicle;
import com.evgo.userservice.exception.InvalidCredentialsException;
import com.evgo.userservice.exception.UserAlreadyExistsException;
import com.evgo.userservice.exception.UserNotFoundException;
import com.evgo.userservice.repository.UserRepository;
import com.evgo.userservice.repository.VehicleRepository;
import com.evgo.userservice.service.UserService;
import com.evgo.userservice.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public UserServiceImpl(
            UserRepository userRepository,
            VehicleRepository vehicleRepository) {

        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public UserResponse registerUser(RegisterUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(PasswordUtil.hash(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();

        response.setUserId(savedUser.getUserId());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setEmail(savedUser.getEmail());
        response.setPhoneNumber(savedUser.getPhoneNumber());

        return response;
    }

    @Override
    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        if (!PasswordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        UserResponse response = new UserResponse();

        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());

        return response;
    }

    @Override
    public UserResponse getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        UserResponse response = new UserResponse();

        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());

        return response;
    }

    @Override
    public List<VehicleResponse> getUserVehicles(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        List<Vehicle> vehicles = vehicleRepository.findByUserUserId(userId);

        List<VehicleResponse> responseList = new ArrayList<>();

        for (Vehicle vehicle : vehicles) {

            VehicleResponse response = new VehicleResponse();

            response.setVehicleId(vehicle.getVehicleId());
            response.setVehicleModel(vehicle.getVehicleModel());
            response.setBatteryCapacity(vehicle.getBatteryCapacity());
            response.setDrivingRange(vehicle.getDrivingRange());
            response.setConnectorType(vehicle.getConnectorType());

            responseList.add(response);
        }

        return responseList;
    }
}