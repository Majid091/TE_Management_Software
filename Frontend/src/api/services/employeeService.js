import axiosInstance from '../interceptors/axiosInstance';
import { API_ENDPOINTS } from '../../constants/api';

/**
 * Employee service for CRUD operations
 */
const employeeService = {
  /**
   * Get all employees with optional filters
   * @param {object} params - Query parameters (page, limit, search, department, availability)
   * @returns {Promise<object>} Employees list with pagination
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.BASE, { params });
    return response.data;
  },

  /**
   * Get employee by ID
   * @param {string} id - Employee ID
   * @returns {Promise<object>} Employee data
   */
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    return response.data;
  },

  /**
   * Create new employee
   * @param {object} data - Employee data
   * @returns {Promise<object>} Created employee
   */
  create: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.EMPLOYEES.BASE, data);
    return response.data;
  },

  /**
   * Update employee
   * @param {string} id - Employee ID
   * @param {object} data - Updated employee data
   * @returns {Promise<object>} Updated employee
   */
  update: async (id, data) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.EMPLOYEES.BY_ID(id), data);
    return response.data;
  },

  /**
   * Delete employee
   * @param {string} id - Employee ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await axiosInstance.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
  },

  /**
   * Update employee availability
   * @param {string} id - Employee ID
   * @param {string} availability - New availability status
   * @returns {Promise<object>} Updated employee
   */
  updateAvailability: async (id, availability) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.EMPLOYEES.AVAILABILITY(id), {
      availability,
    });
    return response.data;
  },

  /**
   * Get employees by department
   * @param {string} departmentId - Department ID
   * @returns {Promise<object[]>} Employees in department
   */
  getByDepartment: async (departmentId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.BY_DEPARTMENT(departmentId));
    return response.data;
  },

  /**
   * Get employee's projects
   * @param {string} id - Employee ID
   * @returns {Promise<object[]>} Employee's projects
   */
  getProjects: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.PROJECTS(id));
    return response.data;
  },
};

export default employeeService;
