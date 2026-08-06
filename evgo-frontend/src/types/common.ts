// Shared/generic response shapes used across services.

// Matches com.evgo.chargingservice.dto.MessageResponse (also reused as the
// generic shape for any simple string-message backend response).
export interface MessageResponse {
  message: string;
}

export interface ApiError {
  status?: number;
  message: string;
}
