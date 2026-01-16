/**
 * API Base URL - Configure based on environment
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // Employees
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id) => `/employees/${id}`,
    BY_DEPARTMENT: (deptId) => `/employees/department/${deptId}`,
    AVAILABILITY: (id) => `/employees/${id}/availability`,
    PROJECTS: (id) => `/employees/${id}/projects`,
  },

  // Projects
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    BY_STATUS: (status) => `/projects/status/${status}`,
    ASSIGN_EMPLOYEE: (id) => `/projects/${id}/assign`,
    REMOVE_EMPLOYEE: (id) => `/projects/${id}/remove-employee`,
    TIMELINE: (id) => `/projects/${id}/timeline`,
  },

  // Departments
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
    EMPLOYEES: (id) => `/departments/${id}/employees`,
    PROJECTS: (id) => `/departments/${id}/projects`,
    STATS: (id) => `/departments/${id}/stats`,
  },

  // Revenue & Analytics
  REVENUE: {
    BASE: '/revenue',
    SUMMARY: '/revenue/summary',
    BY_PROJECT: (id) => `/revenue/project/${id}`,
    BY_DEPARTMENT: (id) => `/revenue/department/${id}`,
    BY_DATE_RANGE: '/revenue/range',
    MONTHLY: '/revenue/monthly',
    YEARLY: '/revenue/yearly',
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    EMPLOYEES: '/analytics/employees',
    PROJECTS: '/analytics/projects',
    DEPARTMENTS: '/analytics/departments',
    TRENDS: '/analytics/trends',
  },

  // Reports
  REPORTS: {
    GENERATE: '/reports/generate',
    DOWNLOAD: (id) => `/reports/download/${id}`,
    LIST: '/reports',
  },
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
};
