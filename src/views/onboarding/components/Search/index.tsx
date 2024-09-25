import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

const Search = ({ onChange }) => {

  return (
    <div
      className="relative z-50 mb-10 flex w-full items-end gap-4"
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
          type="text"
          onChange={onChange}
          placeholder={'Search by keyword'}
          className={cn(
            'w-full bg-transparent',
            'caret-dev-pink-500 focus-visible:outline-none',
            'placeholder:font-geist placeholder:font-body2-regular dark:placeholder-dev-purple-300',
          )}
        />
      </div>
    </div>
  );
};

export default Search;
