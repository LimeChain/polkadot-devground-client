import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@components/header';

export const LayoutCodeEditor = () => {
  return (
    <Suspense>
      <div className="grid min-h-screen w-full grid-rows-code-layout">
        <Header />
        <Outlet />
      </div>
    </Suspense>
  );
};

LayoutCodeEditor.displayName = 'LayoutCodeEditor';
