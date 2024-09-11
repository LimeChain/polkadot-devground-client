import { PDScrollArea } from '@components/pdScrollArea';

import type React from 'react';

export interface IQueryFormContainer {
  children: React.ReactNode;
}

export const QueryFormContainer = ({ children }: IQueryFormContainer) => {
  return (
    <PDScrollArea
      className="pb-2 pr-2 first:only:border " /* add space for the scrollbar */
      viewportClassNames="max-w-full w-full"
    >
      <div className="flex w-full flex-col gap-6">
        {children}
      </div>
    </PDScrollArea>
  );
};
