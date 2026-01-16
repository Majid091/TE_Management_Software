import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Grid, List, Filter, RefreshCw } from 'lucide-react';
import { Button, SearchInput, DataTable, Card } from '../../components/common';
import { ProjectCard, ProjectFilters } from '../../components/features/projects';
import { Breadcrumb } from '../../components/common/navigation';
import { projectService, departmentService } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { useDebounce } from '../../hooks/useDebounce';
import { canManageProjects } from '../../helpers/roleHelpers';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../constants/status';
import { formatDate, formatCurrency } from '../../utils/formatters';

/**
 * Projects list page
 */
const ProjectsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, setProjectsData, setProjectsLoading } = useApp();

  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setProjectsLoading(true);
      const response = await projectService.getAll({
        search: debouncedSearch,
        page,
        limit,
        ...filters,
      });
      setProjectsData(response.data, response.pagination);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [debouncedSearch, page, limit, filters, setProjectsData, setProjectsLoading]);

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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

  const { data: projects, loading, pagination } = state.projects;

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Project',
      render: (name, row) => (
        <div className="project-cell">
          <p className="project-name">{name}</p>
          <p className="project-client">{row.client}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const colors = PROJECT_STATUS_COLORS[status];
        return (
          <span className={`status-badge ${colors?.bg || ''} ${colors?.text || ''}`}>
            {PROJECT_STATUS_LABELS[status]}
          </span>
        );
      },
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (progress) => (
        <div className="progress-cell">
          <div className="progress-bar-small">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}%</span>
        </div>
      ),
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (budget) => formatCurrency(budget),
    },
    {
      key: 'endDate',
      label: 'Deadline',
      render: (date) => formatDate(date),
    },
  ];

  return (
    <div className="projects-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage and track your projects</p>
        </div>
        <div className="page-header-actions">
          {canManageProjects(user) && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/projects/new')}
            >
              New Project
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
            placeholder="Search projects..."
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
            onClick={fetchProjects}
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
          <ProjectFilters
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
            className="projects-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {loading ? (
              <div className="loading-grid">Loading...</div>
            ) : projects.length === 0 ? (
              <Card className="empty-state">
                <p>No projects found</p>
              </Card>
            ) : (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </motion.div>
        ) : (
          <Card padding="none">
            <DataTable
              columns={columns}
              data={projects}
              loading={loading}
              pagination={pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
              onRowClick={(row) => navigate(`/projects/${row.id}`)}
              emptyMessage="No projects found"
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
