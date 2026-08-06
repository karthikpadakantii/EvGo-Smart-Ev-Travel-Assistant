// Matches com.evgo.journeyservice.dto.JourneyRequest, JourneyResponse

import type { ChargingStop } from './integration';

export interface JourneyRequest {
  userId: number;
  source: string;
  destination: string;
  batteryCapacity: number;
  drivingRange: number;
  currentBatteryPercent?: number;
}

export interface JourneyResponse {
  journeyId: number;
  source: string;
  destination: string;
  distance: number;
  estimatedTime: string;
  batteryRequired: number;
  recommendedChargingStops: number;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  routeGeometry?: number[][];
  chargingStops?: ChargingStop[];
  journeyDate: string;
  status: string;
  batteryCapacity?: number;
  drivingRange?: number;
  currentBatteryPercent?: number;
}
