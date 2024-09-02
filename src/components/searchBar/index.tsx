import {
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import { Results } from './results';

interface SearchBarProps {
  label: string;
  classNames?: string;
  type: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  const { label, classNames, type } = props;
  const blocksData = useStoreChain?.use?.blocksData?.();
  const [blockNumber, setBlockNumber] = useState('');
  const [extrinsics, setExtrinsics] = useState('');

  const searchAll = useCallback((value: string) => {
    const block = Array.from(blocksData.values()).find(block => block.header.number === Number(value));

    setBlockNumber(block?.header.number);
    setExtrinsics(block?.body?.extrinsics);
    return block;
  }, [blocksData]);

  const searchBlock = useCallback((value: string) => {

    if (value.startsWith('0x')) {
      console.log('asdas');
    }

    const block = Array.from(blocksData.values()).find(block => block.header.number === Number(value));

    setBlockNumber(block?.header.number);
    return block;
  }, [blocksData]);

  const searchExtrinsic = useCallback((value: string) => {
    const pattern = /^([0-9]+)-[0-9]+$/;
    if (pattern.test(value)) {
      console.log('da');
      const extrinsics = Array.from(blocksData.values())
        .flatMap(block => block?.body?.extrinsics?.slice(2) ?? [])
        .find(extrinsic => extrinsic.id === value);

      console.log(extrinsics);
      return extrinsics;
    }
    return null;
  }, [blocksData]);

  const [searchInput, setSearchInput] = useState('');

  const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    switch (type) {
      case 'all':
        searchAll(event.target.value);
        break;
      case 'block':
        searchBlock(event.target.value);
        break;
      case 'extrinsics':
        searchExtrinsic(event.target.value);
        break;
      default:
        break;
    }
  }, [searchAll, searchBlock, searchExtrinsic, type]);

  return (
    <>
      <div className={cn(
        'flex items-center',
        classNames,
      )}
      >
        <div className={cn(
          'flex w-96 items-center gap-1 p-3',
          'border-b border-gray-300',
          'dark:border-dev-purple-700 dark:bg-transparent',
          'duration-300 ease-out hover:border-dev-pink-500',
        )}
        >
          <Icon name="icon-search"/>
          <input
            type="text"
            placeholder={label}
            value={searchInput}
            onChange={handleSearchInputChange}
            className={cn(
              'w-full',
              'caret-dev-pink-500 focus-visible:outline-none',
              'dark:bg-transparent',
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
          <span className="font-geist font-body2-bold">
          Search
          </span>
        </button>
      </div>

      <div className={cn(
        'absolute top-40 z-50 w-96 p-2',
        'bg-dev-black-1000 dark:bg-dev-purple-50',
        'pointer-events-none -translate-y-2',
        'transition-all',
        'opacity-0',
        {
          ['opacity-100 translate-y-0 pointer-events-auto']: true,
        },
      )}
      >
        <Results block={blockNumber} extrinsics={extrinsics}/>
      </div>
    </>
  );
};
