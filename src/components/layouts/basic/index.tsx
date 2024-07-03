import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@components/header';

export const LayoutBasic = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-stretch justify-stretch">
      <Header />
      <Suspense>
        <div className="flex flex-1 flex-col px-14 pb-16 pt-8">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

LayoutBasic.displayName = 'LayoutBasic';
