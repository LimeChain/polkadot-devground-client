import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { Icon } from '@components/icon';
import { Navigation } from '@components/navigation';
import { PDScrollArea } from '@components/pdScrollArea';
import {
  useStoreChain,
  useStoreUI,
} from '@stores';
import { cn } from '@utils/helpers';

import type { IEventBusClickLink } from '@custom-types/eventBus';

export const BurgerMenu = () => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);
  const currentChain = useStoreChain.use.chain();
  const { pathname } = useLocation();

  const isHomePage = pathname === '/';

  const { toggleTheme } = useStoreUI.use.actions();
  const theme = useStoreUI.use.theme?.();

  const handleMenuClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEventBus<IEventBusClickLink>('@@-click-link', () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  if (isHomePage) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleMenuClick}
      >
        <Icon name="icon-menu" />
      </button>
      <div
        className={cn(
          'fixed right-0 top-0',
          'pb-12 pt-6',
          'size-full ',
          'transition-transform duration-300 ease-in-out',
          'bg-dev-purple-50 shadow-lg dark:bg-dev-black-1000',
          {
            ['transform translate-x-full']: !isOpen,
          },
        )}
      >
        <PDScrollArea className="px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon
                name={currentChain.icon}
                size={[28]}
              />
              <h5 className="ml-1 mr-3 font-h5-bold">
                {currentChain.name}
              </h5>
            </div>
            <button
              className="p-4"
              onClick={handleMenuClick}
            >
              <Icon name="icon-close" />
            </button>
          </div>
          <Navigation classNames="grid gap-2 mt-2" />
        </PDScrollArea>
        <button
          onClick={toggleTheme}
          className={cn(
            'mt-2 px-5',
            'flex items-center',
          )}
        >
          <Icon
            name={theme === 'light' ? 'icon-lightMode' : 'icon-darkMode'}
            size={[24]}
          />
          <span className="ml-2">
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </>
  );
};
