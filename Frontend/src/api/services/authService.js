import axiosInstance from '../interceptors/axiosInstance';
import { API_ENDPOINTS } from '../../constants/api';
import APP_CONFIG from '../../config/app.config';
import { setStorageItem, removeStorageItem, getStorageItem } from '../../utils/storage';

/**
 * Authentication service for handling user authentication
 */
const authService = {
  /**
   * Login user with credentials
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} User data and tokens
   */
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const { user, token, refreshToken } = response.data;

    // Store auth data
    setStorageItem(APP_CONFIG.auth.tokenKey, token);
    setStorageItem(APP_CONFIG.auth.refreshTokenKey, refreshToken);
    setStorageItem(APP_CONFIG.auth.userKey, user);

    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    }

    // Clear all auth data
    removeStorageItem(APP_CONFIG.auth.tokenKey);
    removeStorageItem(APP_CONFIG.auth.refreshTokenKey);
    removeStorageItem(APP_CONFIG.auth.userKey);
  },

  /**
   * Get current user data
   * @returns {Promise<object>} User data
   */
  getCurrentUser: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Refresh authentication token
   * @returns {Promise<object>} New tokens
   */
  refreshToken: async () => {
    const refreshToken = getStorageItem(APP_CONFIG.auth.refreshTokenKey);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data;

    // Update stored tokens
    setStorageItem(APP_CONFIG.auth.tokenKey, token);
    if (newRefreshToken) {
      setStorageItem(APP_CONFIG.auth.refreshTokenKey, newRefreshToken);
    }

    return response.data;
  },

  /**
   * Change user password
   * @param {object} data - { currentPassword, newPassword }
   * @returns {Promise<void>}
   */
  changePassword: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = getStorageItem(APP_CONFIG.auth.tokenKey);
    return !!token;
  },
};

export default authService;
