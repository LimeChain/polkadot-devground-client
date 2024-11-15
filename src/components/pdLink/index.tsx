import { NavLink } from 'react-router-dom';

import { cn } from '@utils/helpers';

import type {
  CSSProperties,
  ReactNode,
} from 'react';

type NavLinkRenderProps = {
  isActive: boolean;
  isPending: boolean;
  isTransitioning: boolean;
};

export interface IPDLink {
  to: number | string;
  children?: ReactNode;
  target?: string; // Add this line
  className?: string | ((props: NavLinkRenderProps) => string);
  rel?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const PDLink = (props: IPDLink) => {
  const {
    to,
    children,
    className,
    ...rest
  } = props;
  return (
    <NavLink
      to={to.toString()}
      // eslint-disable-next-line react/jsx-no-bind
      className={(props) => {
        const baseClasses = 'text-current hover:text-current';
        if (typeof className === 'function') {
          return cn(baseClasses, className(props));
        } else if (typeof className === 'string') {
          return cn(baseClasses, className);
        }
        return baseClasses;
      }}
      {...rest}
    >
      {children}
    </NavLink>
  );
};
