package com.evgo.journeyservice.repository;

import com.evgo.journeyservice.entity.Journey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JourneyRepository extends JpaRepository<Journey, Long> {

    List<Journey> findByUserId(Long userId);

    List<Journey> findByStatus(String status);

}