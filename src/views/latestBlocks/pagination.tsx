import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

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

  return (
    <div className={cn(
      'flex gap-2',
      classNames,
    )}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={
          cn(
            'p-[10px]',
            'border border-dev-black-300 ',
            'text-dev-pink-500 disabled:text-dev-black-1000',
          )
        }
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
            onClick={() => onPageChange(page)}
            className={cn(
              'h-10 w-10',
              'font-geist font-body2-regular',
              'border border-dev-black-300 ',
              'transition-all duration-300 hover:border-dev-pink-500',
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
              onClick={() => onPageChange(totalPages)}
              className={cn(
                'h-10 w-10',
                'font-geist font-body2-regular',
                'border border-dev-black-300 ',
                'transition-all duration-300 hover:border-dev-pink-500',
                { 'border-dev-pink-500 text-dev-pink-500': totalPages === currentPage },
              )}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-[10px]',
          'border border-dev-black-300 ',
          'text-dev-pink-500 disabled:text-dev-black-1000',

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
