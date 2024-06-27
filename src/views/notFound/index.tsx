import { Suspense } from 'react';

export const NotFound = () => {
  return (
    <Suspense fallback={<></>}>
      <div className="fixed inset-0 flex w-full items-center justify-center pb-16">
        404
      </div>
    </Suspense>
  );
};

NotFound.displayName = 'NotFound';
