import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  handleClick?: () => void;
}

export const NavigationDropdown = ({
  title,
  items,
  className,
  handleClick,
  ...props
}: INavigationDropdown) => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        {...props}
        onClick={toggleDropdown}
        className={cn(
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
          name="icon-dropdownArrow"
          size={[16]}
          className={cn(
            'transition-transform duration-300',
            { 'rotate-180': isOpen },
          )}
        />
      </button>
      <ul
        className={cn(
          'top-100 left-0 md:absolute',
          'flex flex-col gap-1 p-2',
          'bg-dev-black-1000 dark:bg-dev-purple-50',
          'whitespace-nowrap',
          'min-w-[256px]',
          'transition-all duration-300',
          { 'hidden': !isOpen, 'flex': isOpen },
          'animate-slide-down-fade',
        )}
      >
        {
          items.map((item, index) => {
            return (
              <NavigationDropdownItem
                key={`nav-dropdown-item-${item.to}-${index}`}
                onClick={handleClick}
                {...item}
              />
            );
          })
        }
      </ul>
    </div>
  );
};
