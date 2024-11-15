import type { ReactNode } from 'react';

interface IQueryFormContainer {
  children: ReactNode;
}

export const QueryFormContainer = ({ children }: IQueryFormContainer) => {
  return (
    <div className="flex w-full max-w-full flex-col gap-6 overflow-x-hidden pr-4">
      {children}
    </div>
  );
};
