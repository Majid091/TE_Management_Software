import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for handling search with filters
 * @param {Array} data - Data to search/filter
 * @param {object} options - Search options
 * @returns {object} Search state and functions
 */
export const useSearch = (data = [], options = {}) => {
  const { searchFields = [], debounceDelay = 300 } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  /**
   * Filter data based on search term
   */
  const searchedData = useMemo(() => {
    if (!debouncedSearchTerm || searchFields.length === 0) {
      return data;
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();

    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [data, debouncedSearchTerm, searchFields]);

  /**
   * Filter data based on active filters
   */
  const filteredData = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined
    );

    if (activeFilters.length === 0) {
      return searchedData;
    }

    return searchedData.filter((item) => {
      return activeFilters.every(([key, filterValue]) => {
        const itemValue = key.split('.').reduce((obj, k) => obj?.[k], item);

        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }

        return itemValue === filterValue;
      });
    });
  }, [searchedData, filters]);

  /**
   * Sort data
   */
  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return filteredData;
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  /**
   * Update search term
   */
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  /**
   * Update a specific filter
   */
  const handleFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Update multiple filters at once
   */
  const setMultipleFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  /**
   * Clear a specific filter
   */
  const clearFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  /**
   * Clear all filters and search
   */
  const clearAll = useCallback(() => {
    setSearchTerm('');
    setFilters({});
    setSortConfig({ key: null, direction: 'asc' });
  }, []);

  /**
   * Handle sort
   */
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    // State
    searchTerm,
    filters,
    sortConfig,
    // Results
    results: sortedData,
    totalResults: sortedData.length,
    // Functions
    handleSearch,
    handleFilter,
    setFilters: setMultipleFilters,
    clearFilter,
    clearAll,
    handleSort,
  };
};

export default useSearch;
