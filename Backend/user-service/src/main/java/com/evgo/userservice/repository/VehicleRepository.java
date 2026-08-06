package com.evgo.userservice.repository;

import com.evgo.userservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByUserUserId(Long userId);

    Optional<Vehicle> findFirstByUserUserId(Long userId);

}