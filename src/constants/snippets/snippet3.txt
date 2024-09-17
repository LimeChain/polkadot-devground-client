import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { chainSpec } from 'polkadot-api/chains/rococo_v2_2';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { start } from 'polkadot-api/smoldot';

import { connectInjectedExtension, getInjectedExtensions } from "polkadot-api/pjs-signer"

interface AppProps {
  client: any;
}

const App = (props: AppProps) => {
  const { client } = props;
  const refSubscription = useRef(null)

  const handleOnClick = useCallback(() => {
    refSubscription.current = client.finalizedBlock$.subscribe((finalizedBlock) =>
      console.log(finalizedBlock),
    );
  }, []);

  const handleStop = useCallback(() => {
    refSubscription?.current?.unsubscribe?.()
    console.log('Unsubscribed');
  }, []);

  return (
    <div className="bg-blue-100 size-full flex flex-col items-center justify-center gap-2">
      <button onClick={handleOnClick}>Subscribe to finalizedBlocks</button>
      <button onClick={handleStop}>Unsubscribe</button>
    </div>
  );
};

(async () => {
  const smoldot = start();
  const chain = await smoldot.addChain({ chainSpec });
  const provider = getSmProvider(chain);
  const client = createClient(provider);

  createRoot(document.getElementById('root')!).render(
    <App
      client={client}
    />
  );
})();
