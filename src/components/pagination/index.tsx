import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import styles from './styles.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  classNames?: string;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const { currentPage, totalPages, onPageChange, classNames } = props;
  const maxPages = 4;
  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let endPage = startPage + maxPages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePrevPage = useCallback(() => {
    onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    onPageChange(currentPage + 1);
  }, [currentPage, onPageChange]);

  const handleLastPage = useCallback(() => {
    onPageChange(totalPages);
  }, [totalPages, onPageChange]);

  const handlePageChange = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const page = Number(e.currentTarget.value);
    onPageChange(page);
  }, [onPageChange]);

  return (
    <div className={cn(
      'flex gap-2',
      classNames,
    )}
    >
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={cn(
          'p-[10px] text-dev-pink-500',
          styles['pg-btn'],
        )}
      >
        <Icon
          size={[16]}
          name="icon-smallArrow"
          className=""
        />
      </button >
      <div className="flex space-x-2">
        {pages.map((page) => (
          <button
            key={page}
            value={page}
            onClick={handlePageChange}
            className={cn(
              styles['pg-btn'],
              'h-10 w-10',
              { 'border-dev-pink-500 text-dev-pink-500': page === currentPage },
            )}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            <span className="flex size-10 items-center justify-center">...</span>
            <button
              value={totalPages}
              onClick={handleLastPage}
              className={cn(
                styles['pg-btn'],
                'h-10 w-10',
                { 'border-dev-pink-500 text-dev-pink-500': totalPages === currentPage },
              )}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={cn(
          'p-[10px] text-dev-pink-500',
          styles['pg-btn'],
        )}
      >
        <Icon
          size={[16]}
          name="icon-smallArrow"
          className="rotate-180"
        />
      </button>
    </div >
  );
};

export default Pagination;
