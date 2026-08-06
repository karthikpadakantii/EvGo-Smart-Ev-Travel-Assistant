package com.evgo.chargingservice.service.impl;

import com.evgo.chargingservice.dto.ReservationRequest;
import com.evgo.chargingservice.dto.ReservationResponse;
import com.evgo.chargingservice.entity.ChargingReservation;
import com.evgo.chargingservice.exception.ReservationNotFoundException;
import com.evgo.chargingservice.repository.ChargingReservationRepository;
import com.evgo.chargingservice.service.ChargingService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChargingServiceImpl implements ChargingService {

    private final ChargingReservationRepository chargingReservationRepository;

    public ChargingServiceImpl(ChargingReservationRepository chargingReservationRepository) {
        this.chargingReservationRepository = chargingReservationRepository;
    }

    @Override
    public ReservationResponse reserveStation(ReservationRequest request) {

        ChargingReservation reservation = new ChargingReservation();

        reservation.setUserId(request.getUserId());
        reservation.setJourneyId(request.getJourneyId());
        reservation.setStationName(request.getStationName());
        reservation.setStationAddress(request.getStationAddress());
        reservation.setConnectorType(request.getConnectorType());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setStatus("BOOKED");

        ChargingReservation savedReservation =
                chargingReservationRepository.save(reservation);

        return mapToResponse(savedReservation);
    }

    @Override
    public List<ReservationResponse> getReservationsByJourney(Long journeyId) {

        List<ChargingReservation> reservations =
                chargingReservationRepository.findByJourneyId(journeyId);

        List<ReservationResponse> response = new ArrayList<>();

        for (ChargingReservation reservation : reservations) {
            response.add(mapToResponse(reservation));
        }

        return response;
    }

    @Override
    public ReservationResponse getReservationById(Long reservationId) {

        ChargingReservation reservation =
                chargingReservationRepository.findById(reservationId)
                        .orElseThrow(() ->
                                new ReservationNotFoundException("Reservation not found"));

        return mapToResponse(reservation);
    }

    @Override
    public void cancelReservation(Long reservationId) {

        ChargingReservation reservation =
                chargingReservationRepository.findById(reservationId)
                        .orElseThrow(() ->
                                new ReservationNotFoundException("Reservation not found"));

        chargingReservationRepository.delete(reservation);
    }

    private ReservationResponse mapToResponse(ChargingReservation reservation) {

        ReservationResponse response = new ReservationResponse();

        response.setReservationId(reservation.getReservationId());
        response.setUserId(reservation.getUserId());
        response.setJourneyId(reservation.getJourneyId());
        response.setStationName(reservation.getStationName());
        response.setStationAddress(reservation.getStationAddress());
        response.setConnectorType(reservation.getConnectorType());
        response.setReservationTime(reservation.getReservationTime());
        response.setStatus(reservation.getStatus());

        return response;
    }
}
