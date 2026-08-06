import axiosClient from './axiosClient';
import type { ReservationRequest, ReservationResponse } from '@/types/charging';
import type { MessageResponse } from '@/types/common';

// Maps to com.evgo.chargingservice.controller.ChargingController

export const reserveStation = (payload: ReservationRequest) =>
  axiosClient
    .post<ReservationResponse>('/reservations', payload)
    .then((r) => r.data);

export const getReservationsByJourney = (journeyId: number) =>
  axiosClient
    .get<ReservationResponse[]>(`/reservations/journey/${journeyId}`)
    .then((r) => r.data);

export const getReservationById = (reservationId: number) =>
  axiosClient
    .get<ReservationResponse>(`/reservations/${reservationId}`)
    .then((r) => r.data);

export const cancelReservation = (reservationId: number) =>
  axiosClient
    .delete<MessageResponse>(`/reservations/${reservationId}`)
    .then((r) => r.data);
