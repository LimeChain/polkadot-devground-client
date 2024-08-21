import {
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

interface SearchBarProps {
  label: string;
  classNames?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { label, classNames, onSearch } = props;
  const [searchInput, setSearchInput] = useState('');

  const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  const handleSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchInput);
  }, [onSearch, searchInput]);

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={cn(
        'relative flex items-center',
        classNames,
      )}
    >
      <div className="relative w-96">
        <Icon name="icon-search" className="absolute left-3 top-1/2 -translate-y-1/2 " />
        <input
          type="text"
          placeholder={label}
          value={searchInput}
          onChange={handleSearchInputChange}
          className={cn(
            'w-full p-2 pl-10',
            'font-geist font-body2-regular',
            'rounded border-b border-gray-300',
            'dark:border-dev-purple-700 dark:bg-transparent',
            'focus-visible:border-none',
          )}
        />
      </div>
      <button
        type="submit"
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
    </form>
  );
};

export default SearchBar;
