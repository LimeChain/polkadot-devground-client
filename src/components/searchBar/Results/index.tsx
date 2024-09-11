import {
  useCallback,
  useState,
} from 'react';

import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

import type { IMappedBlockExtrinsic } from '@custom-types/block';

interface IButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  type: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IResultProps {
  results: {
    blockNumber: number | null;
    extrinsics: IMappedBlockExtrinsic[];
  };
  handleOpenModal: (e: React.MouseEvent<HTMLDivElement>) => void;
  type: string;
  classNames?: string;
}

const Button = (props: IButtonProps) => {
  const { children, isActive, type, onClick } = props;
  return (
    <button
      data-filter-type={type}
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
};

export const Results = (props: IResultProps) => {
  const { results, handleOpenModal, type, classNames } = props;
  const { blockNumber, extrinsics } = results;
  const [filter, setFilter] = useState<string>(type ?? '');

  const showExtrinsics = filter === 'all' || filter === 'extrinsics';
  const showBlock = filter === 'all' || filter === 'block';

  const handleFilter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const type = e.currentTarget.getAttribute('data-filter-type');

    type ? setFilter(type) : setFilter('all');
  }, []);

  return (
    <div className={cn(
      'absolute z-50 w-[38rem] p-2',
      'bg-dev-black-1000 dark:bg-dev-purple-50',
      'pointer-events-none -translate-y-2',
      classNames,
    )}
    >
      <div className="flex gap-2 border-b border-dev-purple-700 px-2 font-geist dark:border-dev-purple-300 dark:text-dev-black-800">
        <Button
          isActive={filter === 'all'}
          type="all"
          onClick={handleFilter}
        >
          All
        </Button>
        <Button
          isActive={filter === 'block'}
          type="block"
          onClick={handleFilter}
        >
          Blocks ({blockNumber ? 1 : 0})
        </Button>
        <Button
          isActive={filter === 'extrinsics'}
          type="extrinsics"
          onClick={handleFilter}
        >
          Extrinsics ({extrinsics?.length || 0})
        </Button>
      </div>
      <PDScrollArea
        verticalScrollClassNames="py-4"
        verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
        className="flex max-h-80 flex-col gap-4"
      >
        {showBlock && blockNumber && (
          <>
            <p className={cn(
              'my-4 border-b p-1',
              'font-geist text-dev-white-1000 font-body2-regular dark:text-dev-black-1000',
            )}
            >
              Blocks ({blockNumber ? 1 : 0})
            </p>
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
              <p className="font-geist text-dev-white-1000 font-body2-regular dark:text-dev-black-1000">
                Block
              </p>
            </PDLink>
          </>
        )}

        {showExtrinsics && extrinsics?.length > 0 && (
          <>
            <p className={cn(
              'my-4 border-b p-1',
              'font-geist text-dev-white-1000 font-body2-regular dark:text-dev-black-1000',
            )}
            >
              Extrinsics ({extrinsics?.length})
            </p>

            {extrinsics?.map((extrinsic) => (
              <div
                key={extrinsic?.id}
                data-extrinsic-id={extrinsic?.id}
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
                  <span className="font-body2-bold"> {extrinsic?.id}</span>
                </p>
                <p className="font-geist text-dev-white-1000 font-body2-regular dark:text-dev-black-1000">
                  Extrinsic
                </p>
              </div>
            ))}
          </>
        )}

        {!(showBlock && blockNumber) && !(showExtrinsics && extrinsics?.length) && (
          <div className={cn(
            'p-4',
            'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
          )}
          >
            No results found
          </div>
        )}
      </PDScrollArea>
    </div>
  );
};
