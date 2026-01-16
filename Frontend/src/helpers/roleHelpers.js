import { ROLES, ROLE_HIERARCHY, ROLE_LABELS, ROLE_COLORS } from '../constants/roles';

/**
 * Check if user has a specific role
 * @param {object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

/**
 * Check if user has any of the specified roles
 * @param {object} user - User object
 * @param {string[]} roles - Roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !user.role || !roles || roles.length === 0) return false;
  return roles.includes(user.role);
};

/**
 * Check if user has higher or equal role level
 * @param {object} user - User object
 * @param {string} requiredRole - Required minimum role
 * @returns {boolean}
 */
export const hasMinimumRole = (user, requiredRole) => {
  if (!user || !user.role) return false;
  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};

/**
 * Check if user is an admin
 * @param {object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);

/**
 * Check if user is a manager or admin
 * @param {object} user - User object
 * @returns {boolean}
 */
export const isManagerOrAdmin = (user) => hasAnyRole(user, [ROLES.ADMIN, ROLES.MANAGER]);

/**
 * Check if user can manage employees
 * @param {object} user - User object
 * @returns {boolean}
 */
export const canManageEmployees = (user) => isManagerOrAdmin(user);

/**
 * Check if user can manage projects
 * @param {object} user - User object
 * @returns {boolean}
 */
export const canManageProjects = (user) => isManagerOrAdmin(user);

/**
 * Check if user can manage departments
 * @param {object} user - User object
 * @returns {boolean}
 */
export const canManageDepartments = (user) => isAdmin(user);

/**
 * Check if user can view revenue data
 * @param {object} user - User object
 * @returns {boolean}
 */
export const canViewRevenue = (user) => isManagerOrAdmin(user);

/**
 * Check if user can view analytics
 * @param {object} user - User object
 * @returns {boolean}
 */
export const canViewAnalytics = (user) => isManagerOrAdmin(user);

/**
 * Get role display label
 * @param {string} role - Role key
 * @returns {string} Role label
 */
export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

/**
 * Get role colors
 * @param {string} role - Role key
 * @returns {object} Role color classes
 */
export const getRoleColors = (role) => {
  return ROLE_COLORS[role] || ROLE_COLORS[ROLES.EMPLOYEE];
};

/**
 * Filter navigation items based on user role
 * @param {object[]} items - Navigation items
 * @param {object} user - User object
 * @returns {object[]} Filtered items
 */
export const filterNavigationByRole = (items, user) => {
  if (!user || !items) return [];
  return items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return hasAnyRole(user, item.roles);
  });
};
