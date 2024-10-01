import {
  type ReactNode,
  useCallback,
  useState,
} from 'react';

import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

import type { IMappedBlockExtrinsic } from '@custom-types/block';

interface IButtonProps {
  children: ReactNode;
  isActive: boolean;
  type: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: IButtonProps) => {
  const { children, isActive, type, onClick } = props;
  return (
    <button
      data-filter-type={type}
      onClick={onClick}
      className={cn(
        'h-10 px-2',
        'font-body2-regular',
        'text-dev-white-400 hover:text-dev-white-200',
        'dark:text-dev-black-800 dark:hover:text-dev-black-1000',
        'border-t-[3px] border-t-transparent',
        'border-b-[3px] border-b-transparent hover:border-b-dev-pink-500',
        'duration-300 ease-in',
        {
          ['border-b-dev-pink-500']: isActive,
        },
      )}
    >
      {children}
    </button>
  );
};

interface IResultProps {
  results: {
    blockNumber: number | null;
    extrinsics: IMappedBlockExtrinsic[];
  };
  type: string;
  handleOpenModal: (e?: React.MouseEvent<HTMLDivElement>) => void;
  classNames?: string;
}
export const Results = (props: IResultProps) => {
  const {
    results,
    type,
    handleOpenModal,
    classNames,
  } = props;
  const { blockNumber, extrinsics } = results;

  const [
    filter,
    setFilter,
  ] = useState<string>(type);

  const showExtrinsics = filter === 'all' || filter === 'extrinsics';
  const showBlock = filter === 'all' || filter === 'block';

  const handleFilter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const type = e.currentTarget.getAttribute('data-filter-type') ?? 'all';
    setFilter(type);
  }, []);

  return (
    <div
      className={cn(
        'absolute left-0 top-full',
        'p-2',
        'w-full',
        'bg-dev-black-1000 dark:bg-dev-purple-50',
        'pointer-events-none translate-y-0',
        classNames,
      )}
    >
      <div
        className={cn(
          'relative',
          'flex gap-2 px-2 font-geist dark:text-dev-black-800',
          'before:absolute before:inset-0 before:top-auto before:content-[""]',
          'before:border-dev-purple-700 before:dark:border-dev-purple-300',
          'before:z-[-1] before:border-b',
        )}
      >
        <Button
          isActive={filter === 'all'}
          onClick={handleFilter}
          type="all"
        >
          All
        </Button>
        <Button
          isActive={filter === 'block'}
          onClick={handleFilter}
          type="block"
        >
          Blocks (
          {blockNumber ? 1 : 0}
          )
        </Button>
        <Button
          isActive={filter === 'extrinsics'}
          onClick={handleFilter}
          type="extrinsics"
        >
          Extrinsics (
          {extrinsics?.length || 0}
          )
        </Button>
      </div>
      <PDScrollArea
        className="flex max-h-80 flex-col gap-4"
        verticalScrollClassNames="py-4"
        verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
      >
        {
          showBlock && blockNumber && (
            <>
              <p className={cn(
                'my-4 border-b p-1',
                'font-geist text-dev-white-1000 font-body2-regular dark:text-dev-black-1000',
              )}
              >
                Blocks (
                {blockNumber ? 1 : 0}
                )
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
                  {' '}
                  <span className="font-body2-bold">
                    {' '}
                    {blockNumber}
                  </span>
                </p>
                <p className="font-geist text-dev-white-1000 font-body3-regular dark:text-dev-black-1000">
                  Block
                </p>
              </PDLink>
            </>
          )
        }

        {
          (showExtrinsics && extrinsics?.length > 0) && (
            <>
              <p
                className={cn(
                  'my-4 border-b p-1',
                  'font-geist text-dev-white-1000 font-body2-regular dark:text-dev-black-1000',
                )}
              >
                Extrinsics (
                {extrinsics?.length}
                )
              </p>

              {
                extrinsics?.map((extrinsic) => (
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
                      {' '}
                      <span className="font-body2-bold">
                        {' '}
                        {extrinsic?.id}
                      </span>
                    </p>
                    <p className="font-geist text-dev-white-1000 font-body3-regular dark:text-dev-black-1000">
                      Extrinsic
                    </p>
                  </div>
                ))
              }
            </>
          )
        }

        {
          !(showBlock && blockNumber) && !(showExtrinsics && extrinsics?.length) && (
            <div
              className={cn(
                'p-4',
                'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
              )}
            >
              No results found
            </div>
          )
        }
      </PDScrollArea>

    </div>
  );
};
