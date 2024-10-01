import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { ModalJSONViewer } from '@components/modals/modalJSONViewer';
import { useStoreChain } from '@stores';
import {
  cn,
  findBlockByNumber,
  findExtrinsicById,
  getBlockNumberByHash,
} from '@utils/helpers';
import { useDebounce } from '@utils/hooks/useDebounce';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';

import { Results } from './results';

import type { IMappedBlockExtrinsic } from '@custom-types/block';
interface ISearchBarProps {
  label: string;
  type: 'all' | 'block' | 'extrinsics';
  onSearch?: (query: string) => void;
}

export const SearchBar = (props: ISearchBarProps) => {
  const {
    label,
    type,
  } = props;

  const refContainer = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const refSelectedExtrinsic = useRef<IMappedBlockExtrinsic | null>(null);

  const blocksData = useStoreChain?.use?.blocksData?.();

  const [
    showResults,
    setShowResults,
  ] = useState(false);

  const [
    results,
    setResults,
  ] = useState({
    blockNumber: null,
    extrinsics: [] as IMappedBlockExtrinsic[],
  });

  const [
    JSONViewerModal,
    toggleVisibility,
    isOpen,
  ] = useToggleVisibility(ModalJSONViewer);

  const handleSearch = useCallback(() => {
    let searchValue = refInput.current?.value || '';

    setShowResults(!!searchValue.length);

    const isHash = searchValue.startsWith('0x');

    if (isHash) {
      searchValue = getBlockNumberByHash(blocksData, searchValue);
    } else {
      searchValue = searchValue.replace(/[.,]/g, '');
    }

    const block = findBlockByNumber(blocksData, searchValue);
    const extrinsicMatch = /^([0-9]+)-[0-9]+$/.test(searchValue);

    if (extrinsicMatch) {
      const extrinsic = findExtrinsicById(blocksData, searchValue);
      setResults({
        blockNumber: block?.header.number,
        extrinsics: extrinsic ? [extrinsic] : [],
      });

      return;
    }

    setResults({
      blockNumber: block?.header.number,
      extrinsics: block?.body?.extrinsics,
    });
  }, [blocksData]);

  const debouncedHandleSearch = useDebounce(handleSearch, 40);

  const handleShowResults = useCallback(() => {
    if (refInput.current?.value) {
      setShowResults(true);
    }
  }, []);

  const handleClickOutside = useCallback(() => {
    if (!isOpen) {
      setShowResults(false);
    }
  }, [isOpen]);

  useOnClickOutside(refContainer, handleClickOutside);

  const handleOpenModal = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {
    const extrinsicId = e?.currentTarget.getAttribute('data-extrinsic-id');
    refSelectedExtrinsic.current = results.extrinsics?.find((extrinsic) => extrinsic.id === extrinsicId) || null;

    toggleVisibility();
  }, [
    results,
    toggleVisibility,
  ]);

  return (
    <div
      ref={refContainer}
      className="relative z-50 flex w-1/2 items-end gap-4"
      onClick={handleShowResults}
    >
      <div
        className={cn(
          'flex w-full items-center gap-3 pl-3',
          'h-12',
          'border-b border-gray-300',
          'dark:border-dev-purple-700 dark:bg-transparent',
          'duration-300 ease-out hover:border-dev-pink-500',
        )}
      >
        <Icon name="icon-search" />
        <input
          ref={refInput}
          onChange={debouncedHandleSearch}
          placeholder={label}
          type="text"
          className={cn(
            'w-full bg-transparent',
            'caret-dev-pink-500 focus-visible:outline-none',
            'placeholder:font-geist placeholder:font-body2-regular dark:placeholder-dev-purple-300',
          )}
        />
      </div>
      <button
        disabled={!refInput.current?.value}
        onClick={handleShowResults}
        className={cn(
          'px-6',
          'h-10',
          'bg-dev-purple-700 text-dev-purple-300',
          'font-geist font-body2-bold',
          'transition-all duration-300 hover:bg-dev-purple-900',
          'dark:bg-dev-purple-50 dark:text-dev-black-1000 dark:hover:bg-dev-purple-200',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        Search
      </button>

      <Results
        handleOpenModal={handleOpenModal}
        results={results}
        type={type}
        classNames={cn(
          'opacity-0 transition-all duration-300',
          {
            ['opacity-100 translate-y-2 pointer-events-auto']: showResults,
          },
        )}
      />

      <JSONViewerModal
        jsonData={refSelectedExtrinsic.current}
        onClose={toggleVisibility}
        title="Extrinsic Details"
      />
    </div>
  );
};
