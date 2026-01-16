import axiosInstance from '../interceptors/axiosInstance';
import { API_ENDPOINTS } from '../../constants/api';

/**
 * Project service for CRUD operations
 */
const projectService = {
  /**
   * Get all projects with optional filters
   * @param {object} params - Query parameters
   * @returns {Promise<object>} Projects list with pagination
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.BASE, { params });
    return response.data;
  },

  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {Promise<object>} Project data
   */
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new project
   * @param {object} data - Project data
   * @returns {Promise<object>} Created project
   */
  create: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.BASE, data);
    return response.data;
  },

  /**
   * Update project
   * @param {string} id - Project ID
   * @param {object} data - Updated project data
   * @returns {Promise<object>} Updated project
   */
  update: async (id, data) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PROJECTS.BY_ID(id), data);
    return response.data;
  },

  /**
   * Delete project
   * @param {string} id - Project ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await axiosInstance.delete(API_ENDPOINTS.PROJECTS.BY_ID(id));
  },

  /**
   * Assign employee to project
   * @param {string} projectId - Project ID
   * @param {object} data - { employeeId, role }
   * @returns {Promise<object>} Updated project
   */
  assignEmployee: async (projectId, data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.ASSIGN_EMPLOYEE(projectId), data);
    return response.data;
  },

  /**
   * Remove employee from project
   * @param {string} projectId - Project ID
   * @param {string} employeeId - Employee ID
   * @returns {Promise<object>} Updated project
   */
  removeEmployee: async (projectId, employeeId) => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.PROJECTS.REMOVE_EMPLOYEE(projectId)}/${employeeId}`
    );
    return response.data;
  },

  /**
   * Get projects by status
   * @param {string} status - Project status
   * @returns {Promise<object[]>} Projects with specified status
   */
  getByStatus: async (status) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.BY_STATUS(status));
    return response.data;
  },

  /**
   * Update project status
   * @param {string} id - Project ID
   * @param {string} status - New status
   * @returns {Promise<object>} Updated project
   */
  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PROJECTS.BY_ID(id), { status });
    return response.data;
  },
};

export default projectService;
