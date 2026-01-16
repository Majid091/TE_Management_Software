import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage/localStorage';

/**
 * Get initial theme from localStorage or system preference
 */
const getInitialTheme = () => {
  const stored = getStorageItem('app_theme', null);
  if (stored) return stored;
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * Get initial language from localStorage
 */
const getInitialLanguage = () => {
  return getStorageItem('app_language', 'en');
};

/**
 * Initial state for the application
 */
const initialState = {
  // Employees state
  employees: {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  },
  // Projects state
  projects: {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  },
  // Departments state
  departments: {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  },
  // Revenue state
  revenue: {
    summary: null,
    monthly: [],
    byDepartment: [],
    loading: false,
    error: null,
  },
  // Analytics state
  analytics: {
    dashboard: null,
    loading: false,
    error: null,
  },
  // UI state
  ui: {
    sidebarCollapsed: false,
    theme: getInitialTheme(),
    language: getInitialLanguage(),
    notifications: [],
  },
};

/**
 * Action types
 */
const ACTION_TYPES = {
  // Employees
  SET_EMPLOYEES_LOADING: 'SET_EMPLOYEES_LOADING',
  SET_EMPLOYEES_DATA: 'SET_EMPLOYEES_DATA',
  SET_EMPLOYEES_ERROR: 'SET_EMPLOYEES_ERROR',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',

  // Projects
  SET_PROJECTS_LOADING: 'SET_PROJECTS_LOADING',
  SET_PROJECTS_DATA: 'SET_PROJECTS_DATA',
  SET_PROJECTS_ERROR: 'SET_PROJECTS_ERROR',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',

  // Departments
  SET_DEPARTMENTS_LOADING: 'SET_DEPARTMENTS_LOADING',
  SET_DEPARTMENTS_DATA: 'SET_DEPARTMENTS_DATA',
  SET_DEPARTMENTS_ERROR: 'SET_DEPARTMENTS_ERROR',
  ADD_DEPARTMENT: 'ADD_DEPARTMENT',
  UPDATE_DEPARTMENT: 'UPDATE_DEPARTMENT',
  DELETE_DEPARTMENT: 'DELETE_DEPARTMENT',

  // Revenue
  SET_REVENUE_LOADING: 'SET_REVENUE_LOADING',
  SET_REVENUE_DATA: 'SET_REVENUE_DATA',
  SET_REVENUE_ERROR: 'SET_REVENUE_ERROR',

  // Analytics
  SET_ANALYTICS_LOADING: 'SET_ANALYTICS_LOADING',
  SET_ANALYTICS_DATA: 'SET_ANALYTICS_DATA',
  SET_ANALYTICS_ERROR: 'SET_ANALYTICS_ERROR',

  // UI
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
};

/**
 * Reducer function
 */
const appReducer = (state, action) => {
  switch (action.type) {
    // Employees reducers
    case ACTION_TYPES.SET_EMPLOYEES_LOADING:
      return {
        ...state,
        employees: { ...state.employees, loading: action.payload, error: null },
      };
    case ACTION_TYPES.SET_EMPLOYEES_DATA:
      return {
        ...state,
        employees: {
          ...state.employees,
          data: action.payload.data,
          pagination: action.payload.pagination,
          loading: false,
          error: null,
        },
      };
    case ACTION_TYPES.SET_EMPLOYEES_ERROR:
      return {
        ...state,
        employees: { ...state.employees, loading: false, error: action.payload },
      };
    case ACTION_TYPES.ADD_EMPLOYEE:
      return {
        ...state,
        employees: {
          ...state.employees,
          data: [...state.employees.data, action.payload],
        },
      };
    case ACTION_TYPES.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: {
          ...state.employees,
          data: state.employees.data.map((emp) =>
            emp.id === action.payload.id ? action.payload : emp
          ),
        },
      };
    case ACTION_TYPES.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: {
          ...state.employees,
          data: state.employees.data.filter((emp) => emp.id !== action.payload),
        },
      };

    // Projects reducers
    case ACTION_TYPES.SET_PROJECTS_LOADING:
      return {
        ...state,
        projects: { ...state.projects, loading: action.payload, error: null },
      };
    case ACTION_TYPES.SET_PROJECTS_DATA:
      return {
        ...state,
        projects: {
          ...state.projects,
          data: action.payload.data,
          pagination: action.payload.pagination,
          loading: false,
          error: null,
        },
      };
    case ACTION_TYPES.SET_PROJECTS_ERROR:
      return {
        ...state,
        projects: { ...state.projects, loading: false, error: action.payload },
      };
    case ACTION_TYPES.ADD_PROJECT:
      return {
        ...state,
        projects: {
          ...state.projects,
          data: [...state.projects.data, action.payload],
        },
      };
    case ACTION_TYPES.UPDATE_PROJECT:
      return {
        ...state,
        projects: {
          ...state.projects,
          data: state.projects.data.map((proj) =>
            proj.id === action.payload.id ? action.payload : proj
          ),
        },
      };
    case ACTION_TYPES.DELETE_PROJECT:
      return {
        ...state,
        projects: {
          ...state.projects,
          data: state.projects.data.filter((proj) => proj.id !== action.payload),
        },
      };

    // Departments reducers
    case ACTION_TYPES.SET_DEPARTMENTS_LOADING:
      return {
        ...state,
        departments: { ...state.departments, loading: action.payload, error: null },
      };
    case ACTION_TYPES.SET_DEPARTMENTS_DATA:
      return {
        ...state,
        departments: {
          ...state.departments,
          data: action.payload.data,
          pagination: action.payload.pagination,
          loading: false,
          error: null,
        },
      };
    case ACTION_TYPES.SET_DEPARTMENTS_ERROR:
      return {
        ...state,
        departments: { ...state.departments, loading: false, error: action.payload },
      };
    case ACTION_TYPES.ADD_DEPARTMENT:
      return {
        ...state,
        departments: {
          ...state.departments,
          data: [...state.departments.data, action.payload],
        },
      };
    case ACTION_TYPES.UPDATE_DEPARTMENT:
      return {
        ...state,
        departments: {
          ...state.departments,
          data: state.departments.data.map((dept) =>
            dept.id === action.payload.id ? action.payload : dept
          ),
        },
      };
    case ACTION_TYPES.DELETE_DEPARTMENT:
      return {
        ...state,
        departments: {
          ...state.departments,
          data: state.departments.data.filter((dept) => dept.id !== action.payload),
        },
      };

    // Revenue reducers
    case ACTION_TYPES.SET_REVENUE_LOADING:
      return {
        ...state,
        revenue: { ...state.revenue, loading: action.payload, error: null },
      };
    case ACTION_TYPES.SET_REVENUE_DATA:
      return {
        ...state,
        revenue: {
          ...state.revenue,
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case ACTION_TYPES.SET_REVENUE_ERROR:
      return {
        ...state,
        revenue: { ...state.revenue, loading: false, error: action.payload },
      };

    // Analytics reducers
    case ACTION_TYPES.SET_ANALYTICS_LOADING:
      return {
        ...state,
        analytics: { ...state.analytics, loading: action.payload, error: null },
      };
    case ACTION_TYPES.SET_ANALYTICS_DATA:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          dashboard: action.payload,
          loading: false,
          error: null,
        },
      };
    case ACTION_TYPES.SET_ANALYTICS_ERROR:
      return {
        ...state,
        analytics: { ...state.analytics, loading: false, error: action.payload },
      };

    // UI reducers
    case ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
      };
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload },
      };
    case ACTION_TYPES.SET_LANGUAGE:
      return {
        ...state,
        ui: { ...state.ui, language: action.payload },
      };
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload],
        },
      };
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter((n) => n.id !== action.payload),
        },
      };
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        ui: { ...state.ui, notifications: [] },
      };

    default:
      return state;
  }
};

/**
 * App Context
 */
export const AppContext = createContext(null);

/**
 * App Provider Component
 */
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply initial theme immediately on mount (before first render)
  useEffect(() => {
    const theme = initialState.ui.theme;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.removeAttribute('data-theme');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
    }
  }, []);

  // Employee actions
  const setEmployeesLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_EMPLOYEES_LOADING, payload: loading });
  }, []);

  const setEmployeesData = useCallback((data, pagination) => {
    dispatch({ type: ACTION_TYPES.SET_EMPLOYEES_DATA, payload: { data, pagination } });
  }, []);

  const setEmployeesError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_EMPLOYEES_ERROR, payload: error });
  }, []);

  const addEmployee = useCallback((employee) => {
    dispatch({ type: ACTION_TYPES.ADD_EMPLOYEE, payload: employee });
  }, []);

  const updateEmployee = useCallback((employee) => {
    dispatch({ type: ACTION_TYPES.UPDATE_EMPLOYEE, payload: employee });
  }, []);

  const deleteEmployee = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_EMPLOYEE, payload: id });
  }, []);

  // Project actions
  const setProjectsLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_PROJECTS_LOADING, payload: loading });
  }, []);

  const setProjectsData = useCallback((data, pagination) => {
    dispatch({ type: ACTION_TYPES.SET_PROJECTS_DATA, payload: { data, pagination } });
  }, []);

  const setProjectsError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_PROJECTS_ERROR, payload: error });
  }, []);

  const addProject = useCallback((project) => {
    dispatch({ type: ACTION_TYPES.ADD_PROJECT, payload: project });
  }, []);

  const updateProject = useCallback((project) => {
    dispatch({ type: ACTION_TYPES.UPDATE_PROJECT, payload: project });
  }, []);

  const deleteProject = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_PROJECT, payload: id });
  }, []);

  // Department actions
  const setDepartmentsLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_DEPARTMENTS_LOADING, payload: loading });
  }, []);

  const setDepartmentsData = useCallback((data, pagination) => {
    dispatch({ type: ACTION_TYPES.SET_DEPARTMENTS_DATA, payload: { data, pagination } });
  }, []);

  const setDepartmentsError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_DEPARTMENTS_ERROR, payload: error });
  }, []);

  const addDepartment = useCallback((department) => {
    dispatch({ type: ACTION_TYPES.ADD_DEPARTMENT, payload: department });
  }, []);

  const updateDepartment = useCallback((department) => {
    dispatch({ type: ACTION_TYPES.UPDATE_DEPARTMENT, payload: department });
  }, []);

  const deleteDepartment = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_DEPARTMENT, payload: id });
  }, []);

  // Revenue actions
  const setRevenueLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_REVENUE_LOADING, payload: loading });
  }, []);

  const setRevenueData = useCallback((data) => {
    dispatch({ type: ACTION_TYPES.SET_REVENUE_DATA, payload: data });
  }, []);

  const setRevenueError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_REVENUE_ERROR, payload: error });
  }, []);

  // Analytics actions
  const setAnalyticsLoading = useCallback((loading) => {
    dispatch({ type: ACTION_TYPES.SET_ANALYTICS_LOADING, payload: loading });
  }, []);

  const setAnalyticsData = useCallback((data) => {
    dispatch({ type: ACTION_TYPES.SET_ANALYTICS_DATA, payload: data });
  }, []);

  const setAnalyticsError = useCallback((error) => {
    dispatch({ type: ACTION_TYPES.SET_ANALYTICS_ERROR, payload: error });
  }, []);

  // UI actions
  const toggleSidebar = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TOGGLE_SIDEBAR });
  }, []);

  const setTheme = useCallback((theme) => {
    dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme });
    setStorageItem('app_theme', theme);
    
    // Apply theme to document immediately
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.removeAttribute('data-theme');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
    }
  }, []);

  const setLanguage = useCallback((language) => {
    dispatch({ type: ACTION_TYPES.SET_LANGUAGE, payload: language });
    setStorageItem('app_language', language);
    document.documentElement.lang = language;
  }, []);

  // Apply theme on mount and when it changes
  useEffect(() => {
    const theme = state.ui.theme;
    const root = document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    root.removeAttribute('data-theme');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        root.setAttribute('data-theme', newTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
    }
  }, [state.ui.theme]);

  // Apply language on mount
  useEffect(() => {
    document.documentElement.lang = state.ui.language;
  }, [state.ui.language]);

  const addNotification = useCallback((notification) => {
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: { ...notification, id: Date.now() },
    });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATIONS });
  }, []);

  const value = {
    state,
    // Employee actions
    setEmployeesLoading,
    setEmployeesData,
    setEmployeesError,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    // Project actions
    setProjectsLoading,
    setProjectsData,
    setProjectsError,
    addProject,
    updateProject,
    deleteProject,
    // Department actions
    setDepartmentsLoading,
    setDepartmentsData,
    setDepartmentsError,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    // Revenue actions
    setRevenueLoading,
    setRevenueData,
    setRevenueError,
    // Analytics actions
    setAnalyticsLoading,
    setAnalyticsData,
    setAnalyticsError,
    // UI actions
    toggleSidebar,
    setTheme,
    setLanguage,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
