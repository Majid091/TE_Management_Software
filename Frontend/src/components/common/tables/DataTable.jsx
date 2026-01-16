import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import clsx from 'clsx';
import { LoadingSpinner } from '../loaders';

/**
 * Data table component with sorting and pagination
 */
const DataTable = ({
  columns,
  data,
  loading = false,
  sortConfig,
  onSort,
  pagination,
  onPageChange,
  onLimitChange,
  emptyMessage = 'No data available',
  className = '',
  rowKey = 'id',
  onRowClick,
  striped = true,
  hoverable = true,
}) => {
  const handleSort = (column) => {
    if (column.sortable !== false && onSort) {
      onSort(column.key);
    }
  };

  const getSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown size={14} className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="sort-icon active" />
    ) : (
      <ChevronDown size={14} className="sort-icon active" />
    );
  };

  const tableClasses = clsx(
    'data-table',
    {
      'data-table-striped': striped,
      'data-table-hoverable': hoverable,
    },
    className
  );

  if (loading) {
    return (
      <div className="data-table-loading">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="data-table-wrapper">
        <table className={tableClasses}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx('data-table-th', {
                    sortable: column.sortable !== false,
                  })}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column)}
                >
                  <div className="th-content">
                    <span>{column.label}</span>
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={row[rowKey] || rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={clsx({ clickable: !!onRowClick })}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="data-table-td">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="data-table-pagination">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} entries
          </div>

          <div className="pagination-controls">
            <select
              className="pagination-limit"
              value={pagination.limit}
              onChange={(e) => onLimitChange && onLimitChange(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((limit) => (
                <option key={limit} value={limit}>
                  {limit} per page
                </option>
              ))}
            </select>

            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                onClick={() => onPageChange && onPageChange(1)}
                disabled={pagination.page === 1}
                aria-label="First page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="pagination-btn"
                onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="pagination-page">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                className="pagination-btn"
                onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="pagination-btn"
                onClick={() => onPageChange && onPageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                aria-label="Last page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
