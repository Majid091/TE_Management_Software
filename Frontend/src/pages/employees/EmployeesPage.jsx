import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Grid, List, Filter, RefreshCw } from 'lucide-react';
import { Button, SearchInput, DataTable, Card } from '../../components/common';
import { EmployeeCard, EmployeeFilters } from '../../components/features/employees';
import { Breadcrumb } from '../../components/common/navigation';
import { employeeService, departmentService } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { useDebounce } from '../../hooks/useDebounce';
import { canManageEmployees } from '../../helpers/roleHelpers';
import { EMPLOYEE_AVAILABILITY_LABELS, EMPLOYEE_AVAILABILITY_COLORS } from '../../constants/status';

/**
 * Employees list page
 */
const EmployeesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, setEmployeesData, setEmployeesLoading } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      setEmployeesLoading(true);
      const response = await employeeService.getAll({
        search: debouncedSearch,
        page,
        limit,
        ...filters,
      });
      setEmployeesData(response.data, response.pagination);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, [debouncedSearch, page, limit, filters, setEmployeesData, setEmployeesLoading]);

  // Fetch departments for filters
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAll();
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch employees on mount and when filters change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const { data: employees, loading, pagination } = state.employees;

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (_, row) => (
        <div className="employee-cell">
          <div className="employee-avatar-small">
            {row.avatar ? (
              <img src={row.avatar} alt={`${row.firstName} ${row.lastName}`} />
            ) : (
              <span>{row.firstName?.[0]}{row.lastName?.[0]}</span>
            )}
          </div>
          <div>
            <p className="employee-name">{row.firstName} {row.lastName}</p>
            <p className="employee-email">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      label: 'Position',
    },
    {
      key: 'department',
      label: 'Department',
      render: (dept) => dept?.name || '-',
    },
    {
      key: 'availability',
      label: 'Status',
      render: (status) => {
        const colors = EMPLOYEE_AVAILABILITY_COLORS[status];
        return (
          <span className={`status-badge ${colors?.bg || ''} ${colors?.text || ''}`}>
            {EMPLOYEE_AVAILABILITY_LABELS[status]}
          </span>
        );
      },
    },
  ];

  return (
    <div className="employees-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your team members</p>
        </div>
        <div className="page-header-actions">
          {canManageEmployees(user) && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/employees/new')}
            >
              Add Employee
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
            placeholder="Search employees..."
          />
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </Button>
        </div>
        <div className="toolbar-right">
          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={fetchEmployees}
            disabled={loading}
          >
            Refresh
          </Button>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <EmployeeFilters
            filters={filters}
            departments={departments}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="page-content">
        {viewMode === 'grid' ? (
          <motion.div
            className="employees-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {loading ? (
              <div className="loading-grid">Loading...</div>
            ) : employees.length === 0 ? (
              <Card className="empty-state">
                <p>No employees found</p>
              </Card>
            ) : (
              employees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))
            )}
          </motion.div>
        ) : (
          <Card padding="none">
            <DataTable
              columns={columns}
              data={employees}
              loading={loading}
              pagination={pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
              onRowClick={(row) => navigate(`/employees/${row.id}`)}
              emptyMessage="No employees found"
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
