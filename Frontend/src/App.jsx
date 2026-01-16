import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages - Lazy loaded for code splitting
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const EmployeesPage = React.lazy(() => import('./pages/employees/EmployeesPage'));
const EmployeeDetailPage = React.lazy(() => import('./pages/employees/EmployeeDetailPage'));
const EmployeeFormPage = React.lazy(() => import('./pages/employees/EmployeeFormPage'));
const ProjectsPage = React.lazy(() => import('./pages/projects/ProjectsPage'));
const ProjectDetailPage = React.lazy(() => import('./pages/projects/ProjectDetailPage'));
const ProjectFormPage = React.lazy(() => import('./pages/projects/ProjectFormPage'));
const DepartmentsPage = React.lazy(() => import('./pages/departments/DepartmentsPage'));
const DepartmentDetailPage = React.lazy(() => import('./pages/departments/DepartmentDetailPage'));
const DepartmentFormPage = React.lazy(() => import('./pages/departments/DepartmentFormPage'));
const RevenuePage = React.lazy(() => import('./pages/revenue/RevenuePage'));
const AnalyticsPage = React.lazy(() => import('./pages/reports/AnalyticsPage'));
const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage'));
const NotFoundPage = React.lazy(() => import('./pages/errors/NotFoundPage'));
const UnauthorizedPage = React.lazy(() => import('./pages/errors/UnauthorizedPage'));

// Components
import LoadingSpinner from './components/common/loaders/LoadingSpinner';
import ProtectedRoute from './components/features/auth/ProtectedRoute';

// Role constants
import { ROLES } from './constants/roles';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Suspense
        fallback={
          <div className="page-loading">
            <LoadingSpinner size="large" />
          </div>
        }
      >
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              }
            />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Employees */}
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route
              path="/employees/new"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <EmployeeFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:id/edit"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <EmployeeFormPage />
                </ProtectedRoute>
              }
            />

            {/* Projects */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route
              path="/projects/new"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <ProjectFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/edit"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <ProjectFormPage />
                </ProtectedRoute>
              }
            />

            {/* Departments */}
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/:id" element={<DepartmentDetailPage />} />
            <Route
              path="/departments/new"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <DepartmentFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/departments/:id/edit"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <DepartmentFormPage />
                </ProtectedRoute>
              }
            />

            {/* Revenue & Analytics */}
            <Route
              path="/revenue"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <RevenuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
