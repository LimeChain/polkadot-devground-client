import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CallParam,
  type ICallParam,
} from '@components/callParam';
import { useStoreChain } from '@stores';
import { useStoreWallet } from 'src/stores/wallet';

import type { EnumVar } from '@polkadot-api/metadata-builders';
import type { V14 } from '@polkadot-api/substrate-bindings';

const PalletSelect = ({
  pallets,
  onPalletSelect,
}: {
  pallets: V14['pallets'];
  onPalletSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
},
) => {
  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="pl-2">Pallet</span>
        <select
          name="pallet"
          onChange={onPalletSelect}
          className="w-full p-2"
        >
          {
            pallets?.map((ex, index) => {
              return (
                <option
                  key={`pallet-${ex.name}`}
                  id={ex.name}
                  value={index}
                >
                  {ex.name}
                </option>
              );
            })
          }
        </select>
      </label>
    </div>

  );
};

const CallSelect = ({
  calls,
  onCallSelect,
}: {
    calls: Omit<ICallParam, 'pallet' | 'onChange'>[];
  onCallSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  },
) => {
  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="pl-2">
          Call
        </span>
        <select
          name="call"
          onChange={onCallSelect}
          className="p-2"
        >
          {calls.map((call, index) => {
            return (
              <option
                key={`call-${call.name}`}
                value={index}
              >
                {call.name}
              </option>
            );
          })};
        </select>
      </label>
    </div>
  );

};

const RpcCalls = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();
  const api = useStoreChain?.use?.api?.();
  const accounts = useStoreWallet?.use?.accounts?.();
  const palletsWithCalls = useMemo(() => metadata?.pallets?.filter(p => p.calls), [metadata]);

  const [palletSelected, setPalledSelected] = useState(palletsWithCalls?.[0]);
  const [callArgs, setCallArgs] = useState<unknown>();

  console.log('call args', callArgs);

  useEffect(() => {
    if (palletsWithCalls) {
      setPalledSelected(palletsWithCalls[0]);
    }
  }, [palletsWithCalls]);

  const palletCalls = useMemo(() => lookup?.(palletSelected?.calls || 0) as EnumVar, [palletSelected, lookup]);
  const calls = useMemo(() => Object.entries(palletCalls?.value || {}).map(([name, param]) => ({
    name,
    param,
  })), [palletCalls]);

  const [callSelected, setCallSelected] = useState(calls.at(0));

  // console.log('pallet', palletSelected);
  // console.log('call', callSelected);

  const submitTx = useCallback(async () => {
    if (api) {
      try {
        console.log('args', callArgs);
        // console.log('palletselected', palletSelected);
        // console.log('calselected', callSelected);
        // api.tx.Balances.transfer_allow_death().sign()
        const res = api.tx[palletSelected.name][callSelected?.name](callArgs);
        console.log(res);
        const encoded = (await res.getEncodedData());
        // const signed = (await res.sign(accounts.at(0)?.polkadotSigner));
        // console.log('sig', signed);
        console.log('encoded', encoded.asHex());

        res.signSubmitAndWatch(accounts.at(0)?.polkadotSigner).subscribe(console.log);

      } catch (error) {
        console.log('error', error);

      }
    }
  }, [api, callArgs, palletSelected, callSelected, accounts]);

  useEffect(() => {
    if (calls) {
      setCallSelected(calls.at(0));
    }
  }, [calls]);

  const handlePalletSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (palletsWithCalls) {
      setPalledSelected(palletsWithCalls[Number(e.target.value)]);
      setCallArgs({});
    }
  }, [palletsWithCalls]);

  const handleCallSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (calls.length > 0) {
      setCallSelected(calls.at(Number(e.target.value)));
      setCallArgs({});
    }
  }, [calls]);

  if (!metadata || !lookup || !palletsWithCalls) {
    return 'Loading...';
  }

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-4">
        <PalletSelect
          pallets={palletsWithCalls}
          onPalletSelect={handlePalletSelect}
        />
        {
          palletSelected?.calls
          && (
            <CallSelect
              key={`call-select-${palletSelected.name}`}
              calls={calls}
              onCallSelect={handleCallSelect}
            />
          )
        }
      </div >
      {
        palletSelected && callSelected
        && (
          <>
            <br />
            <CallParam
              key={`call-param-${callSelected.name}`}
              pallet={palletSelected}
              name={callSelected.name}
              param={callSelected.param}
              onChange={setCallArgs}
            />
          </>
        )
      }

      {
        accounts.at(0)?.polkadotSigner
        && (
          <>
            <br />
            <button
              type="button"
              className="w-fit border p-2"
              onClick={submitTx}
            >
              Submit Transaction
            </button>
          </>
        )
      }
    </>
  );
};

export default RpcCalls;
