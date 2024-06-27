import { Outlet } from 'react-router-dom';

import { Header } from '@components/header';

export const LayoutBasic = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-stretch justify-stretch">
      <Header />
      <Outlet />
    </div>
  );
};

LayoutBasic.displayName = 'LayoutBasic';
