import React from 'react';
import { motion } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { Select } from '../../common/inputs';
import { Button } from '../../common/buttons';
import {
  PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
} from '../../../constants/status';

/**
 * Project filters component
 */
const ProjectFilters = ({
  filters,
  departments,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}) => {
  const statusOptions = Object.values(PROJECT_STATUS).map((status) => ({
    value: status,
    label: PROJECT_STATUS_LABELS[status],
  }));

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <motion.div
      className="project-filters"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={16} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="small"
            icon={X}
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="filters-content">
        <Select
          label="Status"
          placeholder="All Statuses"
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          fullWidth={false}
        />

        <Select
          label="Department"
          placeholder="All Departments"
          options={departmentOptions}
          value={filters.department || ''}
          onChange={(e) => onFilterChange('department', e.target.value)}
          fullWidth={false}
        />

        <Select
          label="Priority"
          placeholder="All Priorities"
          options={priorityOptions}
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          fullWidth={false}
        />
      </div>
    </motion.div>
  );
};

export default ProjectFilters;
