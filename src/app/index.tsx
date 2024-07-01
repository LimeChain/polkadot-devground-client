import * as papiDescriptors from '@polkadot-api/descriptors';
import {
  useEffect,
  useRef,
} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { routes } from './routes';

import '../assets/styles/index.css';

export const App = () => {
  
  const refRoutes = useRef(createBrowserRouter(routes()));

  useEffect(() => {
    window.papiDescriptors = papiDescriptors;
  }, []);

  return (
    <>
      <RouterProvider router={refRoutes.current} />
    </>
  );
};

App.displayName = 'App';
