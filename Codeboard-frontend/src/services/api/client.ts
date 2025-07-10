/**
 * API Client Configuration
 *
 * Sets up and exports the shared API client instance
 * used across the application.
 */

import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
  status?: number;
}

/**
 * Standard paginated response format
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

interface ApiErrorResponse {
  message: string;
  code?: string;
}

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api", // This will be proxied by Vite in development
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

// Debug request and response for development
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 [API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ [API] Request error:", error);
    return Promise.reject(error);
  }
);

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    let apiError: ApiError = {
      message: "An unexpected error occurred",
      status: 500,
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      apiError = {
        message: error.response.data?.message || "Server error",
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      // Connection errors (ECONNREFUSED, etc)
      const isConnRefused =
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error");

      // The request was made but no response was received
      apiError = {
        message: isConnRefused
          ? "Backend server is not running or unreachable"
          : "No response received from server",
        status: 0,
        code: isConnRefused ? "BACKEND_UNREACHABLE" : "NETWORK_ERROR",
      };
    }

    // Add error logging or monitoring here if needed
    console.error("[API Error]", apiError);

    return Promise.reject(apiError);
  }
);
