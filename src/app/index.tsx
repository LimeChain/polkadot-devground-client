import * as papiDescriptors from '@polkadot-api/descriptors';

// import { createClient } from 'https://esm.sh/polkadot-api@0.10.0';
import { WebSocketProvider } from 'polkadot-api/ws-provider/web';
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
  useStoreChainClient,
  useStoreUI,
} from '@stores';
import { createClient } from 'polkadot-api';

import { routes } from './routes';

export const App = () => {
  const refRoutes = useRef(createBrowserRouter(routes()));
  const initStoreAuth = useStoreAuth.use.init?.();
  const { resetStore: resetStoreAuth } = useStoreAuth.use.actions();

  const initStoreUI = useStoreUI.use.init?.();
  const initStoreChainClient = useStoreChainClient.use.init();
  const {
    resetStore: resetStoreUI,
  } = useStoreUI.use.actions();

  useEffect(() => {
    initStoreAuth();
    initStoreUI();
    initStoreChainClient();

    window.papiDescriptors = papiDescriptors;

    const client = createClient(
      WebSocketProvider('wss://dot-rpc.stakeworld.io'),
    );

    client.finalizedBlock$.subscribe((finalizedBlock) =>
      console.log(finalizedBlock.number, finalizedBlock.hash),
    );

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
