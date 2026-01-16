import axiosInstance from '../interceptors/axiosInstance';
import { API_ENDPOINTS } from '../../constants/api';

/**
 * Analytics service for dashboard and reporting
 */
const analyticsService = {
  /**
   * Get dashboard overview data
   * @returns {Promise<object>} Dashboard data
   */
  getDashboard: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
    return response.data;
  },

  /**
   * Get employee analytics
   * @returns {Promise<object>} Employee analytics data
   */
  getEmployeeAnalytics: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.EMPLOYEES);
    return response.data;
  },

  /**
   * Get project analytics
   * @returns {Promise<object>} Project analytics data
   */
  getProjectAnalytics: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.PROJECTS);
    return response.data;
  },

  /**
   * Get department analytics
   * @returns {Promise<object>} Department analytics data
   */
  getDepartmentAnalytics: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.DEPARTMENTS);
    return response.data;
  },

  /**
   * Get trend data
   * @param {object} params - Query parameters (type, period)
   * @returns {Promise<object>} Trend data
   */
  getTrends: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.TRENDS, { params });
    return response.data;
  },
};

export default analyticsService;
