package com.evgo.chargingservice.service;

import com.evgo.chargingservice.dto.ReservationRequest;
import com.evgo.chargingservice.dto.ReservationResponse;

import java.util.List;

public interface ChargingService {

    ReservationResponse reserveStation(ReservationRequest request);

    List<ReservationResponse> getReservationsByJourney(Long journeyId);

    ReservationResponse getReservationById(Long reservationId);

    void cancelReservation(Long reservationId);
}