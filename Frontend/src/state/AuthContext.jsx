import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api';
import APP_CONFIG from '../config/app.config';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import toast from 'react-hot-toast';

/**
 * Authentication Context
 */
export const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from storage
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getStorageItem(APP_CONFIG.auth.userKey);
        const token = getStorageItem(APP_CONFIG.auth.tokenKey);

        if (storedUser && token) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any corrupted auth data
        removeStorageItem(APP_CONFIG.auth.tokenKey);
        removeStorageItem(APP_CONFIG.auth.refreshTokenKey);
        removeStorageItem(APP_CONFIG.auth.userKey);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${response.user.firstName}!`);
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      removeStorageItem(APP_CONFIG.auth.tokenKey);
      removeStorageItem(APP_CONFIG.auth.refreshTokenKey);
      removeStorageItem(APP_CONFIG.auth.userKey);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
    const storedUser = getStorageItem(APP_CONFIG.auth.userKey);
    setStorageItem(APP_CONFIG.auth.userKey, { ...storedUser, ...userData });
  }, []);

  /**
   * Check if user has required role(s)
   */
  const hasRole = useCallback(
    (roles) => {
      if (!user || !user.role) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    },
    [user]
  );

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
