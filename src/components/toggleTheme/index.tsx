import { useLocation } from 'react-router-dom';

import { Icon } from '@components/icon';
import { useStoreUI } from '@stores';
import { cn } from '@utils/helpers';

export const ToggleTheme = () => {

  const { toggleTheme } = useStoreUI.use.actions();
  const theme = useStoreUI.use.theme?.();

  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        'navSpacer',
        {
          ['ml-5']: !isHomePage,
          ['before:content-none']: isHomePage,
        },
      )}
    >
      <Icon
        className="text-dev-black-600 dark:text-dev-purple-100"
        name={theme ? 'icon-lightMode' : 'icon-darkMode'}
        size={[24]}
      />
    </button>
  );
};
