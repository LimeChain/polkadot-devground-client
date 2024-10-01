import { useLocation } from 'react-router-dom';

import { NAVIGATION_ITEMS } from '@constants/navigation';
import { cn } from '@utils/helpers';

import { NavigationItem } from './navigationItem';

interface INavigation {
  classNames?: string;
}

export const Navigation = (props: INavigation) => {
  const { classNames } = props;
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return null;
  }

  return (
    <div className={cn(
      'hidden items-center gap-3 md:flex',
      'font-geist font-body2-regular',
      classNames,
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
