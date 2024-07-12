import * as papiDescriptors from '@polkadot-api/descriptors';
import {
  useEffect,
  useRef,
} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import {
  useAuthStore,
  useStoreUI,
} from '@stores';

import { routes } from './routes';

import '../assets/styles/index.css';

export const App = () => {

  const refRoutes = useRef(createBrowserRouter(routes()));
  const initStoreUI = useStoreUI.use.init?.();
  const {
    resetStore: resetStoreUI,
  } = useStoreUI.use.actions();
  const {
    init: initAuthStore,
  } = useAuthStore.use.actions();

  useEffect(() => {
    initStoreUI();
    initAuthStore();
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
