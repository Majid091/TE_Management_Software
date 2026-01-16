import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import clsx from 'clsx';

/**
 * Pagination component
 */
const Pagination = ({
  page,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblingCount = 1,
  className = '',
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // + 2 for ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      for (let i = 1; i <= leftItemCount; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1);
      pages.push('...');
      const rightItemCount = 3 + 2 * siblingCount;
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = generatePageNumbers();

  return (
    <nav className={clsx('pagination', className)} aria-label="Pagination">
      {showFirstLast && (
        <button
          className="pagination-btn"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft size={16} />
        </button>
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="pagination-pages">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              className={clsx('pagination-page', { active: pageNum === page })}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight size={16} />
      </button>

      {showFirstLast && (
        <button
          className="pagination-btn"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Go to last page"
        >
          <ChevronsRight size={16} />
        </button>
      )}
    </nav>
  );
};

export default Pagination;
