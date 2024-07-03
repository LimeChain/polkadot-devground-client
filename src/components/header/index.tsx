import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { useTheme } from '@utils/hooks/useTheme';

export const Header = () => {

  const { isDarkTheme, changeTheme } = useTheme();

  const handleChangeTheme = useCallback(async () => {
    await changeTheme(isDarkTheme() ? 'light' : 'dark');
  }, [isDarkTheme, changeTheme]);
  
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Link to={'/'} className="text-current hover:text-current">
        <Icon name="logo-polkadot" size={[128, 40]} />
      </Link>
      <div className={cn('flex')}>
        <button type="button" onClick={handleChangeTheme}>
          <Icon
            name="icon-lightMode"
            size={[24]}
            className={cn('hidden text-dev-purple-100 dark:block')}
          />
          <Icon
            name="icon-darkMode"
            size={[24]}
            className={cn('block text-dev-black-600 dark:hidden')}
          />
        </button>
      </div>
    </div>
  );
};

Header.displayName = 'Header';
