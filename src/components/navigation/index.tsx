import { useLocation } from 'react-router-dom';

import { NAVIGATION_ITEMS } from '@constants/navigation';
import { cn } from '@utils/helpers';

import { NavigationItem } from './navigationItem';

export const Navigation = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return null;
  }

  return (
    <div className={cn(
      'flex items-center gap-3',
      'font-geist font-body2-regular',
    )}
    >
      {
        NAVIGATION_ITEMS.map((item, index) => {
          return (
            <NavigationItem
              key={`nav-item-${index}`}
              {...item}
            />
          );
        })
      }
    </div>
  );
};
