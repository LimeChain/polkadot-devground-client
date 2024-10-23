import { cn } from '@utils/helpers';

import type { ReactNode } from 'react';

interface IQueryViewContainer {
  children: ReactNode;
}

export const QueryViewContainer = ({ children }: IQueryViewContainer) => {
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-1 lg:grid-cols-[4fr_5fr]',
      )}
    >
      {children}
    </div>
  );
};
