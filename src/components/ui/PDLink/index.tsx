import {
  Link,
  type LinkProps,
} from 'react-router-dom';

import { cn } from '@utils/helpers';

export interface IPDLink extends LinkProps {}

export const PDLink = ({ to, children, className, ...props }: IPDLink) => {
  return (
    <Link
      to={to}
      className={cn('text-current visited:text-current hover:text-current', className)}
      {...props}
    >{children}
    </Link>
  );
};
