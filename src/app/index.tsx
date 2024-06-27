import { useRef } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { routes } from './routes';

import '../assets/styles/index.css';

export const App = () => {
  const refRoutes = useRef(createBrowserRouter(routes()));

  return (
    <>
      <RouterProvider router={refRoutes.current} />
      {/* <div className="flex h-screen w-screen flex-col items-stretch justify-stretch">
        <Header />
        <Monaco />
      </div> */}
    </>
  );
};

App.displayName = 'App';
