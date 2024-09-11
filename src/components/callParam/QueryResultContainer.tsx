import type React from 'react';

export interface IQueryResultContainer {
  children: React.ReactNode;
}

export const QueryResultContainer = ({ children }: IQueryResultContainer) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-h5-bold">Result</p>
      {children}
    </div>
  );
};
