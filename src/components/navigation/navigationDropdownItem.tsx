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
        'text-dev-black-1000 dark:text-dev-white-200',
        'md:!text-dev-white-200 md:dark:!text-dev-black-1000',
        'md:hover:bg-dev-black-800 md:dark:hover:bg-dev-purple-300',
        {
          ['dark:bg-dev-black-600 bg-dev-purple-200']: isActive,
          ['md:dark:bg-dev-purple-200 md:bg-dev-black-600']: isActive,
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
