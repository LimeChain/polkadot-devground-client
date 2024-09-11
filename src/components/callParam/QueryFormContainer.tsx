import { useRef } from 'react';

import { PDScrollArea } from '@components/pdScrollArea';

import type React from 'react';

export interface IQueryFormContainer {
  children: React.ReactNode;
}

export const QueryFormContainer = ({ children }: IQueryFormContainer) => {
  const refScrollArea = useRef<HTMLDivElement | null>(null);

  return (
    <PDScrollArea
      ref={refScrollArea}
      verticalScrollClassNames="!bottom-0" // remove default bottom space because we need only a vertical scroll
    >
      <div
        className="flex w-full max-w-full flex-col gap-6 pr-4"
        style={{
          width: refScrollArea.current?.clientWidth,
        }}
      >
        {children}
      </div>
    </PDScrollArea>
  );
};
