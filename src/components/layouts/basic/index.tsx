import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@components/header';
import { cn } from '@utils/helpers';

export const LayoutBasic = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-stretch justify-stretch">
      <Header />
      <Suspense>
        <div className={cn(
          'flex flex-1 flex-col',
          'lg:px-14 lg:pb-16 lg:pt-8',
          'px-6 pb-8 pt-4',
        )}
        >
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

LayoutBasic.displayName = 'LayoutBasic';
