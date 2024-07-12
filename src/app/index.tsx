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
  useStoreAuth,
  useStoreUI,
} from '@stores';

import { routes } from './routes';

export const App = () => {

  const refRoutes = useRef(createBrowserRouter(routes()));
  const initStoreAuth = useStoreAuth.use.init?.();
  const { resetStore: resetStoreAuth } = useStoreAuth.use.actions();

  const initStoreUI = useStoreUI.use.init?.();
  const { resetStore: resetStoreUI } = useStoreUI.use.actions();

  useEffect(() => {
    initStoreAuth();
    initStoreUI();
    window.papiDescriptors = papiDescriptors;

    return () => {
      resetStoreAuth();
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
