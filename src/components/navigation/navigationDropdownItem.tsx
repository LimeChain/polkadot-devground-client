import {
  Icon,
  type SVGIconProps,
} from '@components/icon';
import {
  type IPDLink,
  PDLink,
} from '@components/pdLink';
import { cn } from '@utils/helpers';

export interface INavigationDropdownItem extends IPDLink {
  title: string;
  icon: SVGIconProps['name'];
  onClick?: () => void;
}

export const NavigationDropdownItem = ({
  title,
  icon,
  to,
  className,
  ...linkProps
}: INavigationDropdownItem) => {

  return (
    <PDLink
      to={to}
      {...linkProps}
      // eslint-disable-next-line react/jsx-no-bind
      className={({ isActive }) => cn(
        'flex w-full items-center gap-3 px-4 py-[14px]',
        'font-geist font-body2-regular',
        'transition-colors',
        '!text-dev-white-200 dark:!text-dev-black-1000',
        'hover:bg-dev-black-800 dark:hover:bg-dev-purple-300',
        {
          ['dark:bg-dev-purple-200 bg-dev-black-900']: isActive,
        },
        className,
      )}
    >
      <Icon
        className="text-dev-pink-500"
        name={icon}
        size={[20]}
      />
      {title}
    </PDLink>
  );
};
