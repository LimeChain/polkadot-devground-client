import * as papiDescriptors from '@polkadot-api/descriptors';
import { createClient } from 'polkadot-api';
import {
  connectInjectedExtension,
  getInjectedExtensions,
} from 'polkadot-api/pjs-signer';
import * as getPolkadotSigner from 'polkadot-api/signer';
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
  useStoreChain,
  useStoreUI,
} from '@stores';

import { routes } from './routes';

export const App = () => {
  const refRoutes = useRef(createBrowserRouter(routes()));

  const initStoreAuth = useStoreAuth.use.init?.();
  const {
    resetStore: resetStoreAuth,
  } = useStoreAuth.use.actions();

  const initStoreChainClient = useStoreChain.use.init?.();
  const {
    resetStore: resetStoreChain,
  } = useStoreChain.use.actions();

  const initStoreUI = useStoreUI.use.init?.();
  const {
    resetStore: resetStoreUI,
  } = useStoreUI.use.actions();

  useEffect(() => {
    initStoreAuth();
    initStoreUI();
    initStoreChainClient();
    window.customPackages = {};
    Object.assign(window.customPackages, {
      ...createClient,
      ...papiDescriptors,
      ...getPolkadotSigner,
      connectInjectedExtension,
      getInjectedExtensions,
    });

    return () => {
      resetStoreAuth();
      resetStoreUI();
      resetStoreChain();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={refRoutes.current} />;
};

App.displayName = 'App';
