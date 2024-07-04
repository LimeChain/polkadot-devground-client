import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@components/header';

interface ILayoutBasic {
  hasFooter: boolean;
}

export const LayoutBasic = (props: ILayoutBasic) => {
  const { hasFooter } = props;
  return (
    <Suspense>
      <div className="grid min-h-screen w-full grid-rows-layout">
        <Header />
        <Outlet />
        {
          hasFooter && (
            <div className="flex items-center bg-dev-black-900">LimeChain</div>
          )
        }
      </div>
    </Suspense>
  );
};

LayoutBasic.displayName = 'LayoutBasic';
