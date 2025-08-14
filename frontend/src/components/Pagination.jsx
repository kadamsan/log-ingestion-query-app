import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      {/* First page */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={page === 1 ? 'active' : ''}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span>...</span>}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={page === pageNum ? 'active' : ''}
        >
          {pageNum}
        </button>
      ))}

      {/* Last page */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={page === totalPages ? 'active' : ''}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>

      {/* Pagination info */}
      <div className="pagination-info">
        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} logs
      </div>
    </div>
  );
};

export default Pagination;
