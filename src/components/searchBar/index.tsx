import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { ModalShowJson } from '@components/modals/modalShowJson';
import { useStoreChain } from '@stores';
import {
  cn,
  debounce,
  findBlockByNumber,
  findExtrinsicById,
  getBlockNumberByHash,
} from '@utils/helpers';

import { Results } from './Results';

import type { IMappedBlockExtrinsic } from '@custom-types/block';
interface SearchBarProps {
  label: string;
  classNames?: string;
  type: 'all' | 'block' | 'extrinsics';
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ label, classNames, type }: SearchBarProps) => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const [searchInput, setSearchInput] = useState('');
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [results, setResults] = useState<{
    blockNumber: number | null;
    extrinsics: IMappedBlockExtrinsic[] | null;
  }>({
    blockNumber: null,
    extrinsics: null,
  });

  const refSelectedExtrinsic = useRef<IMappedBlockExtrinsic | undefined>();
  const searchBarRef = useRef<HTMLDivElement>(null);

  const [ShowJsonModal, toggleVisibility] = useToggleVisibility(ModalShowJson);

  const debounceSearch = debounce((input) => {
    setIsResultsVisible(true);

    let searchValue = input as string;
    const startsWith0x = searchValue.startsWith('0x');

    if (startsWith0x) {
      searchValue = getBlockNumberByHash(blocksData, searchValue);
    } else {
      searchValue = searchValue.replace(/,/g, '');
    }

    const block = findBlockByNumber(blocksData, searchValue);
    const extrinsicMatch = /^([0-9]+)-[0-9]+$/.test(searchValue);

    if (extrinsicMatch) {
      const extrinsic = findExtrinsicById(blocksData, searchValue);

      extrinsic
      && setResults({
        blockNumber: null,
        extrinsics: [extrinsic],
      });
    } else {
      setResults({
        blockNumber: block?.header.number ?? null,
        extrinsics: block?.body?.extrinsics ?? null,
      });
    }

  }, 500);

  const handleOpenModal = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const extrinsicId = e.currentTarget.getAttribute('data-extrinsic-id');
    if (results.extrinsics) {
      refSelectedExtrinsic.current = results.extrinsics.find(extrinsic => extrinsic.id === extrinsicId);
    }
    toggleVisibility();
  }, [results, toggleVisibility]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debounceSearch(e.target.value);
  }, [debounceSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchBarRef} className="w-[38rem]">
      <div className={cn(
        'flex items-center gap-4',
        classNames,
      )}
      >
        <div
          className={cn(
            'flex w-full items-center gap-1 p-3',
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
            'px-6 py-2',
            'bg-dev-purple-700 text-dev-purple-300',
            'transition-all duration-300 hover:bg-dev-purple-900',
            'dark:bg-dev-purple-50 dark:text-dev-black-1000 dark:hover:bg-dev-purple-200',
          )}
        >
          <span className="font-geist font-body2-bold">Search</span>
        </button>
      </div>
      {isResultsVisible && (
        <Results
          results={results}
          handleOpenModal={handleOpenModal}
          type={type}
          classNames={cn(
            'opacity-0 transition-all',
            {
              'opacity-100 translate-y-0 pointer-events-auto': searchInput,
            })
          }
        />
      )}

      {
        refSelectedExtrinsic.current && (
          <ShowJsonModal
            onClose={toggleVisibility}
            extrinsic={refSelectedExtrinsic.current}
          />
        )
      }
    </div>
  );
};
