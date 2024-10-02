import { useLocation } from 'react-router-dom';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import {
  type INavigationDropdownItem,
  NavigationDropdownItem,
} from './navigationDropdownItem';

export interface INavigationDropdown extends React.ComponentProps<'button'> {
  title: string;
  items: INavigationDropdownItem[];
}

export const NavigationDropdown = ({
  title,
  items,
  className,
  ...props
}: INavigationDropdown) => {

  const location = useLocation();

  return (
    <div className="group relative">
      <button
        {...props}
        className={cn(
          'group',
          'relative px-2 py-2',
          'after:absolute after:bottom-0 after:left-0 after:content-[""]',
          'after:h-[3px] after:w-full after:bg-dev-pink-500',
          'after:opacity-0 after:transition-opacity',
          'flex items-center gap-1',
          'text-dev-purple-50 sm:text-dev-black-1000 sm:dark:text-dev-purple-50',
          {
            ['after:opacity-100']: items.some((item) => String(item.to).startsWith(location.pathname)),
          },
          className,
        )}
      >
        {title}
        <Icon
          className="transition-transform group-focus-within:rotate-180"
          name="icon-dropdownArrow"
          size={[16]}
        />
      </button>
      <ul
        className={cn(
          'top-100 absolute left-0',
          'flex flex-col gap-1 p-2',
          'bg-dev-black-1000 dark:bg-dev-purple-50',
          'whitespace-nowrap',
          'min-w-[256px]',
          'hidden group-focus-within:flex',
        )}
      >
        {
          items.map((item, index) => {
            return (
              <NavigationDropdownItem
                key={`nav-dropdown-item-${item.to}-${index}`}
                {...item}
              />
            );
          })
        }
      </ul>
    </div>
  );
};
