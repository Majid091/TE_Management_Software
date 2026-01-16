import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { Button, SearchInput, Card } from '../../components/common';
import { DepartmentCard } from '../../components/features/departments';
import { Breadcrumb } from '../../components/common/navigation';
import { departmentService } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { useDebounce } from '../../hooks/useDebounce';
import { canManageDepartments } from '../../helpers/roleHelpers';

/**
 * Departments list page
 */
const DepartmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, setDepartmentsData, setDepartmentsLoading } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      setDepartmentsLoading(true);
      const response = await departmentService.getAll({
        search: debouncedSearch,
      });
      setDepartmentsData(response.data, response.pagination);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }, [debouncedSearch, setDepartmentsData, setDepartmentsLoading]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const { data: departments, loading } = state.departments;

  return (
    <div className="departments-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage company departments</p>
        </div>
        <div className="page-header-actions">
          {canManageDepartments(user) && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/departments/new')}
            >
              Add Department
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="page-toolbar">
        <div className="toolbar-left">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search departments..."
          />
        </div>
        <div className="toolbar-right">
          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={fetchDepartments}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="page-content">
        <motion.div
          className="departments-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            <div className="loading-grid">Loading...</div>
          ) : departments.length === 0 ? (
            <Card className="empty-state">
              <p>No departments found</p>
            </Card>
          ) : (
            departments.map((department) => (
              <DepartmentCard key={department.id} department={department} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
