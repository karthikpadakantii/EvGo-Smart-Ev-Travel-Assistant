import axiosClient from './axiosClient';
import type { RouteResponse, ChargingStationResponse } from '@/types/integration';

// Maps to com.evgo.integrationservice.controller.IntegrationController

export const calculateRoute = (
  source: string,
  destination: string,
  batteryCapacity: number,
  drivingRange: number,
  currentBatteryPercent: number = 100
) =>
  axiosClient
    .get<RouteResponse>('/integration/route', {
      params: { source, destination, batteryCapacity, drivingRange, currentBatteryPercent },
    })
    .then((r) => r.data);

export const getChargingStations = (latitude: number, longitude: number) =>
  axiosClient
    .get<ChargingStationResponse[]>('/integration/stations', {
      params: { latitude, longitude },
    })
    .then((r) => r.data);
