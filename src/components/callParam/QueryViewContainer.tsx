import { cn } from '@utils/helpers';

import type React from 'react';

export interface IQueryViewContainer {
  children: React.ReactNode;
}

export const QueryViewContainer = ({ children }: IQueryViewContainer) => {
  return (
    <div className={cn(
      'grid gap-4',
      'grid-cols-1 lg:grid-cols-[4fr_5fr]',
    )}
    >
      {children}
    </div>
  );
};
