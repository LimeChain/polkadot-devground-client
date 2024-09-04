import { useState } from 'react';

import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

const Button = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={cn(
      'px-2 py-2.5 font-body2-regular hover:border-dev-pink-500',
      'text-dev-white-400 hover:text-dev-white-200 dark:text-dev-black-800 dark:hover:text-dev-black-1000',
      'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
      'duration-300 ease-in',
      isActive && 'border-b-dev-pink-500',
    )}
  >
    {children}
  </button>
);

export const Results = ({ blockNumber, extrinsics = [], handleOpenModal, type, classNames }) => {
  const [filter, setFilter] = useState(type);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredExtrinsics = filter === 'all' || filter === 'extrinsics' ? extrinsics : [];
  const showBlock = filter === 'all' || filter === 'block';

  return (
    <div className={cn(
      'absolute z-[101] w-[38rem] p-2',
      'bg-dev-black-1000 dark:bg-dev-purple-50',
      'pointer-events-none -translate-y-2',
      classNames,
    )}
    >
      <div className="mb-4 flex gap-2 border-b border-dev-purple-700 px-2 font-geist dark:border-dev-purple-300 dark:text-dev-black-800">
        <Button onClick={() => handleFilterChange('all')} isActive={filter === 'all'}>All</Button>
        <Button onClick={() => handleFilterChange('block')} isActive={filter === 'block'}>Blocks ({blockNumber ? 1 : 0})</Button>
        <Button onClick={() => handleFilterChange('extrinsics')} isActive={filter === 'extrinsics'}>Extrinsics ({extrinsics?.length || 0})</Button>
      </div>
      <PDScrollArea
        verticalScrollClassNames="py-4"
        verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
        className="h-80 lg:h-full"
      >
        <div className="flex flex-col gap-4">
          {showBlock && (
            <>
              <div className={cn(
                'border-b p-1',
                'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
              )}
              >
                Blocks
              </div>
              <PDLink
                to={`/explorer/${blockNumber}`}
                className={cn(
                  'flex w-full items-center justify-between',
                  'px-4 py-3.5',
                  'transition-[background] duration-300',
                  'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                )}
              >
                <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  Block#
                  <span className="font-body2-bold"> {blockNumber}</span>
                </p>
                <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  Block
                </p>
              </PDLink>
            </>
          )}

          {filteredExtrinsics?.length > 0 && (
            <>
              <div className={cn(
                'border-b p-1',
                'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
              )}
              >
                Extrinsics ({filteredExtrinsics?.length})
              </div>

              {filteredExtrinsics?.map(({ id }) => (
                <div
                  key={id}
                  data-extrinsic-id={id}
                  onClick={handleOpenModal}
                  className={cn(
                    'flex w-full items-center justify-between',
                    'cursor-pointer px-4 py-3.5',
                    'transition-[background] duration-300',
                    'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                  )}
                >
                  <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  Extrinsic#
                    <span className="font-body2-bold"> {id}</span>
                  </p>
                  <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  Extrinsic
                  </p>
                </div>
              ))}
            </>
          )}

          {blockNumber || filteredExtrinsics?.length > 0 ? null : (
            <div className={cn(
              'p-4',
              'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
            )}
            >
              No results found
            </div>
          )}
        </div>
      </PDScrollArea>
    </div>
  );
};
