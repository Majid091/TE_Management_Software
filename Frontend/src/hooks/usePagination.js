import { useState, useMemo, useCallback } from 'react';
import { PAGINATION } from '../constants/api';

/**
 * Custom hook for handling pagination state
 * @param {object} options - Pagination options
 * @returns {object} Pagination state and controls
 */
export const usePagination = (options = {}) => {
  const {
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialLimit = PAGINATION.DEFAULT_LIMIT,
    totalItems = 0,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  /**
   * Calculate total pages
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / limit) || 1;
  }, [totalItems, limit]);

  /**
   * Check if there's a next page
   */
  const hasNextPage = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  /**
   * Check if there's a previous page
   */
  const hasPrevPage = useMemo(() => {
    return page > 1;
  }, [page]);

  /**
   * Calculate offset for API calls
   */
  const offset = useMemo(() => {
    return (page - 1) * limit;
  }, [page, limit]);

  /**
   * Go to a specific page
   */
  const goToPage = useCallback(
    (newPage) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
    },
    [totalPages]
  );

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  /**
   * Go to first page
   */
  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  /**
   * Go to last page
   */
  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  /**
   * Change page size
   */
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  /**
   * Reset pagination
   */
  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  /**
   * Generate page numbers for pagination UI
   */
  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [page, totalPages]);

  return {
    page,
    limit,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    offset,
    pageNumbers,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changeLimit,
    reset,
  };
};

export default usePagination;
