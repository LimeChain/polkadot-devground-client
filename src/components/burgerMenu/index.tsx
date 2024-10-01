import {
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { Navigation } from '@components/navigation';
import {
  useStoreChain,
  useStoreUI,
} from '@stores';
import { cn } from '@utils/helpers';

const BurgerMenu = () => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);
  const currentChain = useStoreChain.use.chain();

  const { toggleTheme } = useStoreUI.use.actions();
  const theme = useStoreUI.use.theme?.();

  const handleMenuClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

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
          'px-5 py-6',
          'size-full bg-dev-black-1000 shadow-lg',
          'transition-transform duration-300 ease-in-out',
          {
            ['transform translate-x-full']: !isOpen,
          },
        )}
      >
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
        <div className="absolute bottom-5">
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              type="button"
              className={cn(
                'navSpacer',
              )}
            >
              <Icon
                className="text-dev-purple-100"
                name={'icon-lightMode'}
                size={[24]}
              />
            </button>
            <span className="ml-2 text-dev-white-200">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
