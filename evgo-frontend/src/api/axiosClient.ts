import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types/common';

// All requests go through the Spring Cloud Gateway (single entry point for
// every microservice), so one Axios instance + base URL is enough.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// The backend currently has no JWT/token auth mechanism, so no auth header
// is attached. If JWT support is added later, attach the token here from
// localStorage('evgo_token').

// Normalize errors so every page can render a consistent message.
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const apiError: ApiError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        error.message ||
        'Something went wrong. Please try again.',
    };
    return Promise.reject(apiError);
  }
);

export default axiosClient;
