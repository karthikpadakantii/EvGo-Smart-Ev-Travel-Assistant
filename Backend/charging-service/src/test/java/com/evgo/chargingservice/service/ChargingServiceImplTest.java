package com.evgo.chargingservice.service;

import com.evgo.chargingservice.dto.ReservationRequest;
import com.evgo.chargingservice.dto.ReservationResponse;
import com.evgo.chargingservice.entity.ChargingReservation;
import com.evgo.chargingservice.exception.ReservationNotFoundException;
import com.evgo.chargingservice.repository.ChargingReservationRepository;
import com.evgo.chargingservice.service.impl.ChargingServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChargingServiceImplTest {

    @Mock
    private ChargingReservationRepository chargingReservationRepository;

    @InjectMocks
    private ChargingServiceImpl chargingService;

    @Test
    void reserveStation_Success() {
        ReservationRequest request = new ReservationRequest();
        request.setUserId(1L);
        request.setJourneyId(10L);
        request.setStationName("Station A");
        request.setStationAddress("123 Main St");
        request.setConnectorType("CCS");
        request.setReservationTime(LocalDateTime.of(2026, 8, 10, 9, 0));

        ChargingReservation savedEntity = new ChargingReservation();
        savedEntity.setReservationId(100L);
        savedEntity.setUserId(1L);
        savedEntity.setJourneyId(10L);
        savedEntity.setStationName("Station A");
        savedEntity.setStationAddress("123 Main St");
        savedEntity.setConnectorType("CCS");
        savedEntity.setReservationTime(LocalDateTime.of(2026, 8, 10, 9, 0));
        savedEntity.setStatus("BOOKED");

        when(chargingReservationRepository.save(any(ChargingReservation.class))).thenReturn(savedEntity);

        ReservationResponse response = chargingService.reserveStation(request);

        assertNotNull(response);
        assertEquals(100L, response.getReservationId());
        assertEquals(1L, response.getUserId());
        assertEquals(10L, response.getJourneyId());
        assertEquals("Station A", response.getStationName());
        assertEquals("123 Main St", response.getStationAddress());
        assertEquals("CCS", response.getConnectorType());
        assertEquals("BOOKED", response.getStatus());
        verify(chargingReservationRepository, times(1)).save(any(ChargingReservation.class));
    }

    @Test
    void getReservationById_Success() {
        ChargingReservation reservation = new ChargingReservation();
        reservation.setReservationId(1L);
        reservation.setUserId(1L);
        reservation.setJourneyId(10L);
        reservation.setStationName("Station A");
        reservation.setStationAddress("123 Main St");
        reservation.setConnectorType("CCS");
        reservation.setReservationTime(LocalDateTime.of(2026, 8, 10, 9, 0));
        reservation.setStatus("BOOKED");

        when(chargingReservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        ReservationResponse response = chargingService.getReservationById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getReservationId());
        assertEquals("Station A", response.getStationName());
        assertEquals("BOOKED", response.getStatus());
        verify(chargingReservationRepository, times(1)).findById(1L);
    }

    @Test
    void getReservationById_NotFound_ThrowsException() {
        when(chargingReservationRepository.findById(999L)).thenReturn(Optional.empty());

        ReservationNotFoundException exception = assertThrows(
                ReservationNotFoundException.class,
                () -> chargingService.getReservationById(999L)
        );

        assertEquals("Reservation not found", exception.getMessage());
        verify(chargingReservationRepository, times(1)).findById(999L);
    }

    @Test
    void getReservationsByJourney_Success() {
        ChargingReservation res1 = new ChargingReservation();
        res1.setReservationId(1L);
        res1.setUserId(1L);
        res1.setJourneyId(10L);
        res1.setStationName("Station A");
        res1.setStationAddress("123 Main St");
        res1.setConnectorType("CCS");
        res1.setReservationTime(LocalDateTime.of(2026, 8, 10, 9, 0));
        res1.setStatus("BOOKED");

        ChargingReservation res2 = new ChargingReservation();
        res2.setReservationId(2L);
        res2.setUserId(1L);
        res2.setJourneyId(10L);
        res2.setStationName("Station B");
        res2.setStationAddress("456 Second St");
        res2.setConnectorType("CHAdeMO");
        res2.setReservationTime(LocalDateTime.of(2026, 8, 10, 10, 0));
        res2.setStatus("BOOKED");

        when(chargingReservationRepository.findByJourneyId(10L)).thenReturn(List.of(res1, res2));

        List<ReservationResponse> responses = chargingService.getReservationsByJourney(10L);

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Station A", responses.get(0).getStationName());
        assertEquals("Station B", responses.get(1).getStationName());
        verify(chargingReservationRepository, times(1)).findByJourneyId(10L);
    }

    @Test
    void cancelReservation_Success() {
        ChargingReservation reservation = new ChargingReservation();
        reservation.setReservationId(1L);
        reservation.setUserId(1L);
        reservation.setJourneyId(10L);
        reservation.setStationName("Station A");
        reservation.setStationAddress("123 Main St");
        reservation.setConnectorType("CCS");
        reservation.setReservationTime(LocalDateTime.of(2026, 8, 10, 9, 0));
        reservation.setStatus("BOOKED");

        when(chargingReservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        chargingService.cancelReservation(1L);

        verify(chargingReservationRepository, times(1)).findById(1L);
        verify(chargingReservationRepository, times(1)).delete(reservation);
    }
}
