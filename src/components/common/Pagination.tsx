import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { Pagination as PaginationType } from '../../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);
  
  if (totalPages <= 1) {
    return null;
  }
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of the middle pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(page + 1, totalPages - 1);
      
      // Adjust start and end to always show 3 pages in the middle
      if (startPage === 2) {
        endPage = Math.min(4, totalPages - 1);
      }
      if (endPage === totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>
        
        {getPageNumbers().map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className="px-3 py-1.5 text-gray-400">...</span>
            ) : (
              <Button
                variant={pageNum === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                disabled={pageNum === page}
              >
                {pageNum}
              </Button>
            )}
          </React.Fragment>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;