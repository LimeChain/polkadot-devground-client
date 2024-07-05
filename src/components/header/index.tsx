import {
  useCallback,
  useEffect,
} from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@components/icon';
import { useStoreUI } from '@stores';
import { useTheme } from '@utils/hooks/useTheme';

export const Header = () => {
  const { isDarkTheme, changeTheme } = useTheme();

  const initStoreUI = useStoreUI.use.init?.();
  const {
    resetStore: resetStoreUI,
    countIncrement,
    countDecrement,
  } = useStoreUI.use.actions();

  const count = useStoreUI.use.count?.();

  useEffect(() => {
    initStoreUI();

    return () => {
      resetStoreUI();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTheme = useCallback(async () => {
    await changeTheme(isDarkTheme ? 'light' : 'dark');
  }, [isDarkTheme, changeTheme]);

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-current hover:text-current">
        <Icon name="logo-polkadot" size={[128, 40]} />
      </Link>
      <div>
        <button type="button" onClick={countDecrement}>
          -
        </button>
        <span className="mx-4 text-xl">
          {count}
        </span>
        <button type="button" onClick={countIncrement}>
          +
        </button>
      </div>
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
