import React, {
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { useStoreChain } from '@stores';
import {
  cn,
  findBlockByNumber,
  findExtrinsicById,
} from '@utils/helpers';

import { Results } from './results';

interface SearchBarProps {
  label: string;
  classNames?: string;
  type: 'all' | 'block' | 'extrinsics';
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ label, classNames, type }: SearchBarProps) => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const [blockNumber, setBlockNumber] = useState<string | null>(null);
  const [extrinsics, setExtrinsics] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');

  const searchAll = useCallback((value: string) => {
    const block = findBlockByNumber(blocksData, value);
    const extrinsicMatch = /^([0-9]+)-[0-9]+$/.test(value);

    if (extrinsicMatch) {
      const extrinsic = findExtrinsicById(blocksData, value);
      setExtrinsics([extrinsic]);
    } else {
      setBlockNumber(block?.header.number ?? null);
      setExtrinsics(block?.body?.extrinsics ?? null);
    }
  },
  [blocksData],
  );

  const searchBlock = useCallback((value: string) => {
    if (value.startsWith('0x')) {
      console.log('Hexadecimal input detected');
    }

    const block = findBlockByNumber(blocksData, value);
    setBlockNumber(block?.header.number ?? null);
  }, [blocksData]);

  const searchExtrinsic = useCallback((value: string) => {
    if (/^([0-9]+)-[0-9]+$/.test(value)) {
      const extrinsic = findExtrinsicById(blocksData, value);
      setExtrinsics([extrinsic]);
    }
  }, [blocksData]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    switch (type) {
      case 'all':
        searchAll(value);
        break;
      case 'block':
        searchBlock(value);
        break;
      case 'extrinsics':
        searchExtrinsic(value);
        break;
      default:
        break;
    }
  }, [searchAll, searchBlock, searchExtrinsic, type]);

  return (
    <>
      <div className={cn(
        'flex items-center', classNames,
      )}
      >
        <div
          className={cn(
            'flex w-96 items-center gap-1 p-3',
            'border-b border-gray-300',
            'dark:border-dev-purple-700 dark:bg-transparent',
            'duration-300 ease-out hover:border-dev-pink-500',
          )}
        >
          <Icon name="icon-search" />
          <input
            type="text"
            placeholder={label}
            value={searchInput}
            onChange={handleSearchInputChange}
            className={cn(
              'w-full dark:bg-transparent',
              'caret-dev-pink-500 focus-visible:outline-none',
              'placeholder:font-geist placeholder:font-body2-regular dark:placeholder-dev-purple-300',
            )}
          />
        </div>
        <button
          className={cn(
            'ml-4 px-6 py-2',
            'bg-dev-purple-700 text-dev-purple-300',
            'transition-all duration-300 hover:bg-dev-purple-900',
            'dark:bg-dev-purple-50 dark:text-dev-black-1000 dark:hover:bg-dev-purple-200',
          )}
        >
          <span className="font-geist font-body2-bold">Search</span>
        </button>
      </div>
      <Results
        blockNumber={blockNumber}
        extrinsics={extrinsics}
        classNames={cn(
          'opacity-0 transition-all',
          {
            'opacity-100 translate-y-0 pointer-events-auto': searchInput,
          })
        }
      />
    </>
  );
};
