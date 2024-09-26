import { Link } from 'react-router-dom';

import { cn } from '@utils/helpers';

import type {
  CSSProperties,
  ReactNode,
} from 'react';

export interface IPDLink {
  to: number | string;
  children?: ReactNode;
  target?: string; // Add this line
  className?: string;
  rel?: string;
  style?: CSSProperties;
}

export const PDLink = (props: IPDLink) => {
  const {
    to,
    children,
    className,
    ...rest
  } = props;
  return (
    <Link
      className={cn('text-current hover:text-current', className)}
      to={to.toString()}
      {...rest}
    >
      {children}
    </Link>
  );
};
