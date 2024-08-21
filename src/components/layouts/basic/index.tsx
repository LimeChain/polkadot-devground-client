import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { cn } from '@utils/helpers';

interface ILayoutBasic {
  classNames?: string;
  hasFooter: boolean;
}

export const LayoutBasic = (props: ILayoutBasic) => {
  const {
    classNames,
    hasFooter,
  } = props;

  return (
    <Suspense>
      <div className="grid min-h-screen grid-rows-layout ">
        <Header />
        <div className={cn(
          'lg:px-14 lg:pb-16 lg:pt-8',
          'px-6 pb-8 pt-4',
          'overflow-scroll',
          classNames,
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
