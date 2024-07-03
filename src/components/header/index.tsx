import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@components/icon';
import { useTheme } from '@utils/hooks/useTheme';

export const Header = () => {

  const { isDarkTheme, changeTheme } = useTheme();

  const handleChangeTheme = useCallback(async () => {
    await changeTheme(isDarkTheme ? 'light' : 'dark');
  }, [isDarkTheme, changeTheme]);
  
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-current hover:text-current">
        <Icon name="logo-polkadot" size={[128, 40]} />
      </Link>
      <div className="flex">
        <button type="button" onClick={handleChangeTheme}>
          <Icon
            name={isDarkTheme ? 'icon-lightMode' : 'icon-darkMode'}
            size={[24]}
            className="text-dev-black-600 dark:text-dev-purple-100"
          />
        </button>
      </div>
    </div>
  );
};

Header.displayName = 'Header';
