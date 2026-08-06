package com.evgo.chargingservice.repository;

import com.evgo.chargingservice.entity.ChargingReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChargingReservationRepository extends JpaRepository<ChargingReservation, Long> {

    List<ChargingReservation> findByJourneyId(Long journeyId);

}