import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

interface ScrollLayout {
  classNames?: string;
  hasFooter: boolean;
}

export const ScrollLayout = (props: ScrollLayout) => {
  const {
    classNames,
    hasFooter,
  } = props;

  return (
    <Suspense>
      <div className="grid max-h-screen min-h-screen grid-rows-layout overflow-hidden">
        <Header />
        <PDScrollArea className={cn(
          'lg:px-14 lg:pb-16 lg:pt-8',
          'px-6 pb-8 pt-4',
          'overflow-auto',
          classNames,
        )}
        >
          <Outlet />
        </PDScrollArea>
        {
          hasFooter && (
            <Footer />
          )
        }
      </div>
    </Suspense>
  );
};

ScrollLayout.displayName = 'LayoutBasic';
