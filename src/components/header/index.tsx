import { useLocation } from 'react-router-dom';

import ChainSelectButton from '@components/chainSelectButton';
import { Logo } from '@components/logo';
import { Navigation } from '@components/navigation';
import { ToggleTheme } from '@components/toggleTheme';

export const Header = () => {
  const { pathname } = useLocation();

  const { toggleTheme } = useStoreUI.use.actions();
  const theme = useStoreUI.use.theme?.();

  const isHomePage = pathname === '/';

  return (
    <nav className="flex items-center justify-between px-6 ">
      <div className="flex items-center gap-12">
        <Logo />
        {
          !isHomePage
          && <Navigation />
        }
      </div>
      <div className="flex gap-5">
        {
          !isHomePage
          && <ChainSelectButton />
        }
        <ToggleTheme />
      </div>
    </nav>
  );
};

Header.displayName = 'Header';
