import type { ReactNode } from 'react';

interface IQueryResultContainer {
  children: ReactNode;
}

export const QueryResultContainer = ({ children }: IQueryResultContainer) => {
  return (
    <div className="flex h-full flex-col gap-4 overflow-x-hidden">
      <p className="font-h5-bold">Result</p>
      {children}
    </div>
  );
};
