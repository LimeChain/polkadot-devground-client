import * as papiDescriptors from '@polkadot-api/descriptors';
import {
  useEffect,
  useRef,
} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { useStoreUI } from '@stores/';

import { useAuthStore } from '@stores/auth';

import { routes } from './routes';

import '../assets/styles/index.css';

export const App = () => {

  const refRoutes = useRef(createBrowserRouter(routes()));
  const initStoreUI = useStoreUI.use.init?.();
  const {
    resetStore: resetStoreUI,
  } = useStoreUI.use.actions();

  useEffect(() => {
    initStoreUI();
    window.papiDescriptors = papiDescriptors;

    return () => {
      resetStoreUI();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RouterProvider router={refRoutes.current} />
    </>
  );
};

App.displayName = 'App';
