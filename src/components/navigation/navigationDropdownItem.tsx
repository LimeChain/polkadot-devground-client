import { useLocation } from 'react-router-dom';

import {
  Icon,
  type SVGIconProps,
} from '@components/icon';
import {
  type IPDLink,
  PDLink,
} from '@components/ui/PDLink';
import { cn } from '@utils/helpers';

export interface INavigationDropdownItem extends IPDLink {
  title: string;
  icon: SVGIconProps['name'];
}

export const NavigationDropdownItem = ({
  title,
  icon,
  to,
  className,
  ...linkProps
}: INavigationDropdownItem) => {

  const { pathname } = useLocation();

  return (
    <PDLink
      to={to}
      {...linkProps}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-[14px]',
        'font-geist font-body2-regular',
        'transition-colors',
        '!text-dev-white-200 dark:!text-dev-black-1000',
        'hover:bg-dev-black-800 dark:hover:bg-dev-purple-300',
        { 'dark:bg-dev-purple-200 bg-dev-black-900': pathname === to },
        className,
      )}
    >
      <Icon
        size={[20]}
        name={icon}
        className="text-dev-pink-500"
      />
      {title}
    </PDLink>
  );
};
