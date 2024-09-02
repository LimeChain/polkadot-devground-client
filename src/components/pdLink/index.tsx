import { Link } from 'react-router-dom';

import { cn } from '@utils/helpers';

export interface IPDLink {
  to: number | string;
  children: React.ReactNode;
  target?: string; // Add this line
  className?: string;
  rel?: string;
}

export const PDLink = ({ to, children, className, ...props }: IPDLink) => {
  return (
    <Link
      to={to.toString()}
      className={cn('text-current  hover:text-current', className)}
      {...props}
    >{children}
    </Link>
  );
};
