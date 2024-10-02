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

const BurgerMenu = () => {
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

  const handleToggleTheme = useCallback(() => {
    setIsOpen(false);
    toggleTheme();
  }, [toggleTheme]);

  useEventBus<IEventBusClickLink>('@@-click-link', () => {
    if (isOpen) {
      setIsOpen(false);
      console.log('Menu is closed');
    }

    console.log('Hello World!');
  });

  if (isHomePage) {
    return null;
  }

  return (
    <>
      <button
        className="ml-2"
        onClick={handleMenuClick}
      >
        <Icon name="icon-menu" />
      </button>
      <div
        className={cn(
          'fixed right-0 top-0',
          'px-5 pb-12 pt-6',
          'size-full bg-dev-black-1000 shadow-lg',
          'transition-transform duration-300 ease-in-out',
          {
            ['transform translate-x-full']: !isOpen,
          },
        )}
      >
        <PDScrollArea >
          <div className="flex items-center justify-between text-dev-white-200">
            <div className="flex items-center">
              <Icon
                name={currentChain.icon}
                size={[28]}
              />
              <h5 className="ml-1 mr-3 text-dev-white-200 font-h5-bold">
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
          onClick={handleToggleTheme}
          type="button"
          className={cn(
            'mt-2',
            'flex items-center',
            'navSpacer',
          )}
        >
          <Icon
            className="text-dev-purple-100"
            name={theme === 'light' ? 'icon-lightMode' : 'icon-darkMode'}
            size={[24]}
          />
          <span className="ml-2 text-dev-white-200">
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </>
  );
};

export default BurgerMenu;
