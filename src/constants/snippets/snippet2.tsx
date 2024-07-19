import { connectInjectedExtension, getInjectedExtensions } from "polkadot-api/pjs-signer"
import { chainSpec } from 'polkadot-api/chains/rococo_v2_2';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { start } from 'polkadot-api/smoldot';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {

  const inputRef = useRef('5EFnjjDGnWfxVdFPFtbycHP9vew6JbpqGamDqcUg8qfP7tu7');
  const signerRef = useRef(null);
  const clientRef = useRef(null);
  const apiRef = useRef(null);
  const [txStatus, setTxStatus] = useState({
    text: '',
    link: '',
  });
  const [txSent, setTxSent] = useState(false)

  useEffect(() => {
    (async () => {

      const smoldot = start();
      const chain = await smoldot.addChain({ chainSpec });
      const provider = getSmProvider(chain);
      const client = window.parent.pdCreateClient(provider);

      const api = client.getTypedApi(window.parent.papiDescriptors.rococo);

      const extensions = getInjectedExtensions() || []
      const selectedExtension = await connectInjectedExtension(
        extensions[0]
      )
      const accounts = selectedExtension.getAccounts()
      const signer = accounts[0].polkadotSigner


      signerRef.current = signer;
      clientRef.current = client;
      apiRef.current = api;
    })()
      .catch(err => {
        console.log('useEffect error');
        console.log(err);
      });
  }, []);

  const handleOnClick = useCallback(() => {
    console.log('clicl');
    setTxSent(true)
    try {
      const tx = apiRef?.current?.tx.Balances.transfer_allow_death({
        dest: window.parent.papiDescriptors.MultiAddress.Id(inputRef.current),
        value: 100n,
      })
        .signSubmitAndWatch(signerRef?.current)
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
          // clientRef?.current?.destroy();
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

createRoot(document.getElementById('root')!).render(<App />);
