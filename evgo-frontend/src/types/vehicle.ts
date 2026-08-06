// Matches com.evgo.userservice.dto.VehicleRequest, VehicleResponse

export interface VehicleRequest {
  vehicleModel: string;
  batteryCapacity: number;
  drivingRange: number;
  connectorType: string;
}

export interface VehicleResponse {
  vehicleId: number;
  vehicleModel: string;
  batteryCapacity: number;
  drivingRange: number;
  connectorType: string;
}
