import axiosClient from './axiosClient';
import type { VehicleRequest, VehicleResponse } from '@/types/vehicle';

// Maps to com.evgo.userservice.controller.VehicleController

export const addVehicle = (userId: number, payload: VehicleRequest) =>
  axiosClient
    .post<VehicleResponse>(`/users/${userId}/vehicles`, payload)
    .then((r) => r.data);

export const getVehiclesByUser = (userId: number) =>
  axiosClient
    .get<VehicleResponse[]>(`/users/${userId}/vehicles`)
    .then((r) => r.data);

export const updateVehicle = (vehicleId: number, payload: VehicleRequest) =>
  axiosClient
    .put<VehicleResponse>(`/vehicles/${vehicleId}`, payload)
    .then((r) => r.data);

export const deleteVehicle = (vehicleId: number) =>
  axiosClient.delete<string>(`/vehicles/${vehicleId}`).then((r) => r.data);
