import axiosInstance from '../interceptors/axiosInstance';
import { API_ENDPOINTS } from '../../constants/api';

/**
 * Revenue service for analytics and reporting
 */
const revenueService = {
  /**
   * Get revenue summary
   * @returns {Promise<object>} Revenue summary data
   */
  getSummary: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVENUE.SUMMARY);
    return response.data;
  },

  /**
   * Get monthly revenue data
   * @param {object} params - Query parameters (year)
   * @returns {Promise<object[]>} Monthly revenue data
   */
  getMonthly: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVENUE.MONTHLY, { params });
    return response.data;
  },

  /**
   * Get yearly revenue data
   * @param {object} params - Query parameters
   * @returns {Promise<object[]>} Yearly revenue data
   */
  getYearly: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVENUE.YEARLY, { params });
    return response.data;
  },

  /**
   * Get revenue by date range
   * @param {object} params - { startDate, endDate }
   * @returns {Promise<object>} Revenue data for range
   */
  getByDateRange: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVENUE.BY_DATE_RANGE, { params });
    return response.data;
  },

  /**
   * Get revenue by project
   * @param {string} projectId - Project ID
   * @returns {Promise<object>} Project revenue data
   */
  getByProject: async (projectId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVENUE.BY_PROJECT(projectId));
    return response.data;
  },

  /**
   * Get revenue by department
   * @param {string} departmentId - Department ID (optional)
   * @returns {Promise<object[]>} Department revenue data
   */
  getByDepartment: async (departmentId = null) => {
    const endpoint = departmentId
      ? API_ENDPOINTS.REVENUE.BY_DEPARTMENT(departmentId)
      : API_ENDPOINTS.REVENUE.BASE + '/by-department';
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  /**
   * Get all projects revenue
   * @returns {Promise<object[]>} Revenue by project
   */
  getProjectsRevenue: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVENUE.BASE + '/by-project');
    return response.data;
  },
};

export default revenueService;
