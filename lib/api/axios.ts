/**
 * Axios instance configuration
 * Provides a configured axios instance for making API requests
 */

import axios from 'axios';

// Base URL for the API (json-server)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - can be used to add auth tokens, logging, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to request for logging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, new Date().toISOString());
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - can be used for error handling, logging, etc.
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
