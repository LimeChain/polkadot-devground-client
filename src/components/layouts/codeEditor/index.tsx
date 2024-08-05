import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@components/footer';
import { Header } from '@components/header';

export const LayoutCodeEditor = () => {
  return (
    <Suspense>
      <div className="grid min-h-screen w-full grid-rows-code-layout">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </Suspense>
  );
};

LayoutCodeEditor.displayName = 'LayoutCodeEditor';
