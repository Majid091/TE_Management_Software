import React from 'react';
import { motion } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { Select } from '../../common/inputs';
import { Button } from '../../common/buttons';
import {
  EMPLOYEE_AVAILABILITY,
  EMPLOYEE_AVAILABILITY_LABELS,
} from '../../../constants/status';

/**
 * Employee filters component
 */
const EmployeeFilters = ({
  filters,
  departments,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}) => {
  const availabilityOptions = Object.values(EMPLOYEE_AVAILABILITY).map((status) => ({
    value: status,
    label: EMPLOYEE_AVAILABILITY_LABELS[status],
  }));

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  return (
    <motion.div
      className="employee-filters"
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
          label="Department"
          placeholder="All Departments"
          options={departmentOptions}
          value={filters.department || ''}
          onChange={(e) => onFilterChange('department', e.target.value)}
          fullWidth={false}
        />

        <Select
          label="Availability"
          placeholder="All Status"
          options={availabilityOptions}
          value={filters.availability || ''}
          onChange={(e) => onFilterChange('availability', e.target.value)}
          fullWidth={false}
        />
      </div>
    </motion.div>
  );
};

export default EmployeeFilters;
