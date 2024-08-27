import {
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

interface SearchBarProps {
  label: string;
  classNames?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  const { label, classNames } = props;
  const [searchInput, setSearchInput] = useState('');

  const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  return (
    <form
      className={cn(
        'relative flex items-center',
        classNames,
      )}
    >
      <div className="relative w-96">
        <Icon
          name="icon-search"
          className="absolute left-3 top-1/2 -translate-y-1/2 "
        />
        <input
          type="text"
          name="search"
          placeholder={label}
          value={searchInput}
          onChange={handleSearchInputChange}
          className={cn(
            'w-full p-3 pl-10',
            'font-geist font-body2-regular',
            'rounded border-b border-gray-300',
            'bg-transparent dark:border-dev-purple-700',
            'placeholder:font-geist placeholder:font-body2-regular dark:placeholder-dev-purple-300',
          )}
        />
      </div>
      <button
        disabled
        className={cn(
          'ml-4 px-6 py-2',
          'cursor-pointer bg-dev-purple-700 text-dev-white-200',
          'transition-all duration-300 hover:bg-dev-purple-900',
          'dark:bg-dev-purple-50 dark:text-dev-black-1000 dark:hover:bg-dev-purple-200',
        )}
      >
        <span className="font-geist font-body2-bold">
          Search
        </span>
      </button>
    </form>
  );
};
