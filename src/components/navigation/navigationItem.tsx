import { busDispatch } from '@pivanov/event-bus';
import { useCallback } from 'react';

import {
  type INavigationDropdown,
  NavigationDropdown,
} from './navigationDropdown';
import {
  type INavigationLink,
  NavigationLink,
} from './navigationLink';

import type { IEventBusNavLinkClick } from '@custom-types/eventBus';

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

  const handleLinkClick = useCallback(() => {
    busDispatch<IEventBusNavLinkClick>({ type: '@@-navlink-click' });
  }, []);

  return type === 'link'
    ? (
      <NavigationLink
        {...linkProps}
        onClick={handleLinkClick}
      />
    )
    : (
      <NavigationDropdown
        {...linkProps}
        handleClick={handleLinkClick}
      />
    );
};
