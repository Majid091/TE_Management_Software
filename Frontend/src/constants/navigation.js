import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Building2,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { ROLES } from './roles';

/**
 * Main navigation items
 */
export const MAIN_NAVIGATION = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    id: 'employees',
    label: 'Employees',
    path: '/employees',
    icon: Users,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: FolderKanban,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    id: 'departments',
    label: 'Departments',
    path: '/departments',
    icon: Building2,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    id: 'revenue',
    label: 'Revenue',
    path: '/revenue',
    icon: DollarSign,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
];

/**
 * Secondary navigation items (bottom of sidebar)
 */
export const SECONDARY_NAVIGATION = [
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
];

/**
 * User menu items
 */
export const USER_MENU_ITEMS = [
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
  {
    id: 'logout',
    label: 'Logout',
    action: 'logout',
    icon: LogOut,
  },
];

/**
 * Breadcrumb configuration
 */
export const BREADCRUMB_CONFIG = {
  dashboard: { label: 'Dashboard', path: '/dashboard' },
  employees: { label: 'Employees', path: '/employees' },
  projects: { label: 'Projects', path: '/projects' },
  departments: { label: 'Departments', path: '/departments' },
  revenue: { label: 'Revenue', path: '/revenue' },
  analytics: { label: 'Analytics', path: '/analytics' },
  settings: { label: 'Settings', path: '/settings' },
  new: { label: 'Create New' },
  edit: { label: 'Edit' },
};
