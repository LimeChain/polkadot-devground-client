import {
  Link,
  type LinkProps,
} from 'react-router-dom';

import { cn } from '@utils/helpers';

interface IPDLink extends LinkProps {}

const PDLink = ({ to, children, className, ...props } : IPDLink) => {
  return (
    <Link
      to={to}
      className={cn('text-current visited:text-current hover:text-current', className)}
      {...props}
    >{children}
    </Link>
  );
};

export default PDLink;