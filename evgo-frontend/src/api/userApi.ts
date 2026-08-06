import axiosClient from './axiosClient';
import type { RegisterUserRequest, LoginRequest, UserResponse } from '@/types/user';

// Maps to com.evgo.userservice.controller.UserController

export const registerUser = (payload: RegisterUserRequest) =>
  axiosClient.post<UserResponse>('/users/register', payload).then((r) => r.data);

// POST /users/login returns a UserResponse (not a JWT token).
// The backend currently has no JWT/auth mechanism — it simply validates
// credentials and returns the user profile.
export const loginUser = (payload: LoginRequest) =>
  axiosClient.post<UserResponse>('/users/login', payload).then((r) => r.data);

export const getUserById = (id: number) =>
  axiosClient.get<UserResponse>(`/users/${id}`).then((r) => r.data);
