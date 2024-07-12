import {
  Link,
  useLocation,
} from 'react-router-dom';

import ChainSelectButton from '@components/chainSelectButton';
import { Icon } from '@components/icon';
import { Button } from '@components/ui';
import { useStoreUI } from '@stores';
import { cn } from '@utils/helpers';
import { useAuthStore } from 'src/stores/auth';

export const Header = () => {
  const jwtToken = useAuthStore.use.jwtToken();
  const { logout, authorize } = useAuthStore.use.actions();

  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const { toggleTheme } = useStoreUI.use.actions();
  const theme = useStoreUI.use.theme?.();

  return (
    <div className="flex items-center justify-between px-6 ">
      <div className="flex items-center gap-12">
        <Link
          to="/"
          className="-mt-2 text-current hover:text-current"
        >
          <Icon name="logo-polkadot" size={[128, 40]} />
        </Link>
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
        />
        {
          jwtToken
            ? (
              <Button onClick={logout}>
                  Logout
              </Button>
            )
            : (
              <Button onClick={authorize}>
                Login
              </Button>
            )
        }
      </div>
      <div className="flex">
        <button type="button" onClick={handleChangeTheme}>
          <Icon
            name={theme ? 'icon-lightMode' : 'icon-darkMode'}
            size={[24]}
            className="text-dev-black-600 dark:text-dev-purple-100"
          />
        </button>
      </div>
    </div>
  );
};

Header.displayName = 'Header';
