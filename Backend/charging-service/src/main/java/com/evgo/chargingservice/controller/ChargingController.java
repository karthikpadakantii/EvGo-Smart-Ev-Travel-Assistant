package com.evgo.chargingservice.controller;

import com.evgo.chargingservice.dto.MessageResponse;
import com.evgo.chargingservice.dto.ReservationRequest;
import com.evgo.chargingservice.dto.ReservationResponse;
import com.evgo.chargingservice.service.ChargingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ChargingController {

    private final ChargingService chargingService;

    public ChargingController(ChargingService chargingService) {
        this.chargingService = chargingService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> reserveStation(
            @Valid @RequestBody ReservationRequest request) {

        return new ResponseEntity<>(
                chargingService.reserveStation(request),
                HttpStatus.CREATED);
    }

    @GetMapping("/journey/{journeyId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByJourney(
            @PathVariable Long journeyId) {

        return ResponseEntity.ok(
                chargingService.getReservationsByJourney(journeyId));
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @PathVariable Long reservationId) {

        return ResponseEntity.ok(
                chargingService.getReservationById(reservationId));
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<MessageResponse> cancelReservation(
            @PathVariable Long reservationId) {

        chargingService.cancelReservation(reservationId);

        return ResponseEntity.ok(
                new MessageResponse("Reservation cancelled successfully"));
    }
}