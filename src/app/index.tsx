import { getAnalytics } from 'firebase/analytics';
import { createClient } from 'polkadot-api';
import {
  connectInjectedExtension,
  getInjectedExtensions,
} from 'polkadot-api/pjs-signer';
import { getPolkadotSigner } from 'polkadot-api/signer';
import {
  useEffect,
  useRef,
} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import * as papiDescriptors from '@polkadot-api/descriptors';
import {
  useStoreAuth,
  useStoreChain,
  useStoreUI,
  useStoreWallet,
} from '@stores';
import { analyticsApp } from 'firebaseConfig';
import { useStoreCustomExamples } from 'src/stores/examples';

import { routes } from './routes';

export const App = () => {
  // TODO: Change this when we have new domain
  if (window.location.origin === 'https://devground.xyz') {
    getAnalytics(analyticsApp);
  }
  const refTimeout = useRef<NodeJS.Timeout>();
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
    setWindowSize,
  } = useStoreUI.use.actions();

  const initStoreWallet = useStoreWallet.use.init?.();
  const {
    resetStore: resetStoreWallet,
  } = useStoreWallet.use.actions();

  const initStoreExamples = useStoreCustomExamples.use.init?.();
  const { resetStore: resetStoreExamples } = useStoreCustomExamples.use.actions();

  useEffect(() => {
    const initializeStores = async () => {
      await initStoreAuth();
      initStoreUI();
      initStoreChainClient();
      initStoreWallet();
      initStoreExamples();

      window.customPackages = {};
      Object.assign(window.customPackages, {
        createClient,
        ...createClient,
        papiDescriptors,
        ...papiDescriptors,
        getPolkadotSigner,
        connectInjectedExtension,
        getInjectedExtensions,
      });

      refTimeout.current = setTimeout(() => {
        document.body.removeAttribute('style');
      }, 400);
    };

    initializeStores().catch((error) => {
      console.error('Error initializing stores', error);
    });

    return () => {
      resetStoreAuth();
      resetStoreUI();
      void resetStoreChain();
      resetStoreWallet();
      resetStoreExamples();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setWindowSize);
    return () => {
      window.removeEventListener('resize', setWindowSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={refRoutes.current} />;
};

App.displayName = 'App';
