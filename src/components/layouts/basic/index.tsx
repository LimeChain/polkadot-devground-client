import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { cn } from '@utils/helpers';

interface ILayoutBasic {
  hasFooter: boolean;
}

export const LayoutBasic = (props: ILayoutBasic) => {
  const { hasFooter } = props;

  return (
    <Suspense>
      <div className="grid min-h-screen w-full grid-rows-layout">
        <Header />
        <div className={cn(
          'lg:px-14 lg:pb-16 lg:pt-8',
          'px-6 pb-8 pt-4',
        )}
        >
          <Outlet />
        </div>
        {
          hasFooter && (
            <Footer/>
          )
        }
      </div>
    </Suspense>
  );
};

LayoutBasic.displayName = 'LayoutBasic';
