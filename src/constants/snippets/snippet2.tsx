import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { chainSpec } from 'polkadot-api/chains/rococo_v2_2';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { start } from 'polkadot-api/smoldot';
import { createClient, type PolkadotClient } from "polkadot-api";
import { MultiAddress, rococo } from '@polkadot-api/descriptors';

import { connectInjectedExtension, getInjectedExtensions, type PolkadotSigner } from "polkadot-api/pjs-signer"

interface AppProps {
  api: any;
  client: PolkadotClient;
  signer: PolkadotSigner;
}

const App = (props: AppProps) => {
  const { api, client, signer } = props;
  const inputRef = useRef('5EFnjjDGnWfxVdFPFtbycHP9vew6JbpqGamDqcUg8qfP7tu7');
  const [txStatus, setTxStatus] = useState({
    text: '',
    link: '',
  });
  const [txSent, setTxSent] = useState(false);

  const handleOnClick = useCallback(() => {
    console.log('click');
    setTxSent(true);
    try {
      api.tx.Balances.transfer_allow_death({
        dest: MultiAddress.Id(inputRef.current),
        value: 100n,
      })
        .signSubmitAndWatch(signer)
        .subscribe(({ txHash, type }) => {
          console.log(`Tx Stasus: ${type} / Tx Hash: ${txHash}`);

          setTxStatus({
            text: `Tx Stasus: ${type} / Tx Hash: ${txHash.slice(0, 4)}...${txHash.slice(-4)}`,
            link: `https://rococo.subscan.io/extrinsic/${txHash}`,
          });
        })
        .add(() => {
          console.log('END');
          setTxSent(false)
          client.destroy();
        });
    } catch (err) {
      console.log('click error');
      setTxSent(false)

      console.log(err);
    }
  }, []);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 bg-blue-100 p-4">
      <label htmlFor="address" className="flex w-full flex-col gap-2">
        Receiver of 100n ROC
        <input
          id="address"
          placeholder={inputRef.current}
          onChange={(event) => {
            inputRef.current = event.currentTarget.value;
          }}
        />
      </label>
      <button
        disabled={txSent}
        onClick={handleOnClick}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send Transaction
      </button>
      {
        txStatus.text && txStatus.link
        && (
          <a
            target="_blank"
            href={txStatus.link}
          >
            {txStatus.text}
          </a>
        )
      }
    </div>
  );
};

(async () => {
  const smoldot = start();
  const chain = await smoldot.addChain({ chainSpec });
  const provider = getSmProvider(chain);
  const client = createClient(provider);

  const api = client.getTypedApi(rococo);

  const extensions = getInjectedExtensions() || [];
  const selectedExtension = await connectInjectedExtension(
    extensions[0]
  );

  const accounts = selectedExtension.getAccounts();
  const signer = accounts[0].polkadotSigner;

  createRoot(document.getElementById('root')!).render(
    <App
      api={api}
      client={client}
      signer={signer}
    />
  );
})();
