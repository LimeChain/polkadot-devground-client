import {
  type INavigationDropdown,
  NavigationDropdown,
} from './navigationDropdown';
import {
  type INavigationLink,
  NavigationLink,
} from './navigationLink';

export type TNavItem = {
  type: 'link';
  linkProps: INavigationLink;
} | {
  type: 'dropdown';
  linkProps: INavigationDropdown;
};

export const NavigationItem = ({
  linkProps,
  type,
}: TNavItem) => {
  return (
    <>
      {
        type === 'link'
          ? <NavigationLink {...linkProps} />
          : <NavigationDropdown {...linkProps} />
      }
    </>
  );
};
