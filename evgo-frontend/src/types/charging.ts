// Matches com.evgo.chargingservice.dto.ReservationRequest, ReservationResponse, MessageResponse

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ReservationRequest {
  userId: number;
  journeyId: number;
  stationName: string;
  stationAddress: string;
  connectorType: string;
  reservationTime: string; // ISO datetime
}

export interface ReservationResponse {
  reservationId: number;
  userId: number;
  journeyId: number;
  stationName: string;
  stationAddress: string;
  connectorType: string;
  reservationTime: string;
  status: ReservationStatus;
}
