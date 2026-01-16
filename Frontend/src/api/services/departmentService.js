import axiosInstance from '../interceptors/axiosInstance';
import { API_ENDPOINTS } from '../../constants/api';

/**
 * Department service for CRUD operations
 */
const departmentService = {
  /**
   * Get all departments
   * @param {object} params - Query parameters
   * @returns {Promise<object>} Departments list
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.BASE, { params });
    return response.data;
  },

  /**
   * Get department by ID
   * @param {string} id - Department ID
   * @returns {Promise<object>} Department data
   */
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new department
   * @param {object} data - Department data
   * @returns {Promise<object>} Created department
   */
  create: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.DEPARTMENTS.BASE, data);
    return response.data;
  },

  /**
   * Update department
   * @param {string} id - Department ID
   * @param {object} data - Updated department data
   * @returns {Promise<object>} Updated department
   */
  update: async (id, data) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.DEPARTMENTS.BY_ID(id), data);
    return response.data;
  },

  /**
   * Delete department
   * @param {string} id - Department ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await axiosInstance.delete(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
  },

  /**
   * Get department employees
   * @param {string} id - Department ID
   * @returns {Promise<object[]>} Department employees
   */
  getEmployees: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.EMPLOYEES(id));
    return response.data;
  },

  /**
   * Get department projects
   * @param {string} id - Department ID
   * @returns {Promise<object[]>} Department projects
   */
  getProjects: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.PROJECTS(id));
    return response.data;
  },

  /**
   * Get department statistics
   * @param {string} id - Department ID
   * @returns {Promise<object>} Department stats
   */
  getStats: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DEPARTMENTS.STATS(id));
    return response.data;
  },
};

export default departmentService;
