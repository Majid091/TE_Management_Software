import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT, HTTP_STATUS } from '../../constants/api';
import APP_CONFIG from '../../config/app.config';
import { getStorageItem, removeStorageItem, setStorageItem } from '../../utils/storage';

/**
 * Create axios instance with default configuration
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Add auth token to headers
 * - Add any other request modifications
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStorageItem(APP_CONFIG.auth.tokenKey);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handle common error responses
 * - Handle token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // If this is not a retry and not a login request
      if (!originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          const refreshToken = getStorageItem(APP_CONFIG.auth.refreshTokenKey);

          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });
            const { token, refreshToken: newRefreshToken } = response.data;
            setStorageItem(APP_CONFIG.auth.tokenKey, token);
            if (newRefreshToken) {
              setStorageItem(APP_CONFIG.auth.refreshTokenKey, newRefreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Clear auth data and redirect to login
          removeStorageItem(APP_CONFIG.auth.tokenKey);
          removeStorageItem(APP_CONFIG.auth.refreshTokenKey);
          removeStorageItem(APP_CONFIG.auth.userKey);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Clear auth and redirect if refresh failed or wasn't attempted
      removeStorageItem(APP_CONFIG.auth.tokenKey);
      removeStorageItem(APP_CONFIG.auth.refreshTokenKey);
      removeStorageItem(APP_CONFIG.auth.userKey);
      window.location.href = '/login';
    }

    // Handle 400 Bad Request (validation errors)
    if (error.response?.status === HTTP_STATUS.BAD_REQUEST) {
      const message = error.response?.data?.message;
      console.error('Validation error:', Array.isArray(message) ? message.join(', ') : message);
    }

    // Handle 403 Forbidden
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      console.error('Access forbidden:', error.response?.data?.message);
    }

    // Handle 404 Not Found
    if (error.response?.status === HTTP_STATUS.NOT_FOUND) {
      console.error('Resource not found:', error.response?.data?.message);
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      console.error('Server error:', error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
