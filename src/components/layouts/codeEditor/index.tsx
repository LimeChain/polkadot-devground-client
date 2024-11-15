import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@components/header';

export const LayoutCodeEditor = () => {
  return (
    <Suspense>
      <div className="grid max-h-screen min-h-screen w-full grid-rows-code-layout overflow-hidden">
        <Header />
        <Outlet />
      </div>
    </Suspense>
  );
};

LayoutCodeEditor.displayName = 'LayoutCodeEditor';
