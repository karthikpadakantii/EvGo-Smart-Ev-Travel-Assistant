// Matches com.evgo.integrationservice.dto.RouteResponse, ChargingStationResponse, ChargingStop

export interface ChargingStationResponse {
  stationName: string;
  address: string;
  connectorType: string;
  latitude: number;
  longitude: number;
}

export interface ChargingStop {
  latitude: number;
  longitude: number;
  distanceFromOriginKm: number;
  stopNumber: number;
  stations: ChargingStationResponse[];
}

export interface RouteResponse {
  distanceKm: number;
  estimatedDurationMinutes: number;
  batteryRequired: number;
  recommendedChargingStops: number;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  routeGeometry?: number[][];
  chargingStops?: ChargingStop[];
}
