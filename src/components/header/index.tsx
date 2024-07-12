import { useLocation } from 'react-router-dom';

import ChainSelectButton from '@components/chainSelectButton';
import { Icon } from '@components/icon';
import { Logo } from '@components/logo';
import { useStoreUI } from '@stores';
import { cn } from '@utils/helpers';

export const Header = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const { toggleTheme } = useStoreUI.use.actions();
  const theme = useStoreUI.use.theme?.();

  return (
    <nav className="flex items-center justify-between px-6 ">
      <div className="flex items-center">
        <Logo />
      </div>
      <div className="flex gap-5">
        {!isHomePage && <ChainSelectButton/> }
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'navSpacer',
            { 'ml-5 ': !isHomePage },
            { 'before:content-none': isHomePage },
          )}
        >
          <Icon
            name={theme ? 'icon-lightMode' : 'icon-darkMode'}
            size={[24]}
            className="text-dev-black-600 dark:text-dev-purple-100"
          />
        </button>
      </div>
    </nav>
  );
};

Header.displayName = 'Header';
