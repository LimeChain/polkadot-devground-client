import { cn } from '@utils/helpers';

import type React from 'react';

export interface IQueryViewContainer {
  children: React.ReactNode;
}

export const QueryViewContainer = ({ children }: IQueryViewContainer) => {
  return (
    <div className={cn(
      'grid h-full grid-cols-1 gap-4',
      'lg:grid-cols-[4fr_5fr]',
    )}
    >
      {children}
    </div>
  );
};
