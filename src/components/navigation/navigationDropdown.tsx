import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';

import {
  type INavigationDropdownItem,
  NavigationDropdownItem,
} from './navigationDropdownItem';

export interface INavigationDropdown extends React.ComponentProps<'button'> {
  title: string;
  items: INavigationDropdownItem[];
  onLinkClick?: () => void;
}

export const NavigationDropdown = (props: INavigationDropdown) => {
  const {
    title,
    items,
    className,
    onLinkClick,
    ...rest
  } = props;

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);
  const location = useLocation();
  const refDropdown = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
    onLinkClick?.();
  }, [onLinkClick]);

  useOnClickOutside(refDropdown, () => {
    setIsOpen(false);
  });

  return (
    <div
      ref={refDropdown}
      className="relative"
    >
      <button
        {...rest}
        onClick={toggleDropdown}
        className={cn(
          'relative px-2 py-2',
          'after:absolute after:bottom-0 after:left-0 after:content-[""]',
          'after:h-[3px] after:w-full after:bg-dev-pink-500',
          'after:opacity-0 after:transition-opacity',
          'flex items-center gap-1',
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
          'bg-dev-purple-50 dark:bg-dev-black-1000',
          'md:bg-dev-black-1000 md:dark:bg-dev-purple-50',
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
                onClick={handleLinkClick}
                {...item}
              />
            );
          })
        }
      </ul>
    </div>
  );
};
