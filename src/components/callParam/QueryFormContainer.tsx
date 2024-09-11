import { PDScrollArea } from '@components/pdScrollArea';

import type React from 'react';

export interface IQueryFormContainer {
  children: React.ReactNode;
}

export const QueryFormContainer = ({ children }: IQueryFormContainer) => {
  return (
    <PDScrollArea className="pr-2" /* add space for the scrollbar */ >
      <div className="flex w-full flex-col gap-6">
        {children}
      </div>
    </PDScrollArea>
  );
};
