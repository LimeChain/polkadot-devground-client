import { type EnumVar } from '@polkadot-api/metadata-builders';
import { mergeUint8 } from '@polkadot-api/utils';
import { Binary } from 'polkadot-api';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

import {
  CallParam,
  type ICallParam,
} from '@components/callParam';
import { CallSelect } from '@components/callSelect';
import { PalletSelect } from '@components/palletSelect';
import { useStoreChain } from '@stores';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';
import { useViewBuilder } from 'src/hooks/useViewBuilder';
import { useStoreWallet } from 'src/stores/wallet';

const Extrinsics = () => {
  const dynamicBulder = useDynamicBuilder();
  const viewBuilder = useViewBuilder();

  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();

  const api = useStoreChain?.use?.api?.();
  const accounts = useStoreWallet?.use?.accounts?.();
  const signer = accounts.at(0)?.polkadotSigner;

  const palletsWithCalls = useMemo(() => metadata?.pallets?.filter(p => p.calls), [metadata]);
  const [palletSelected, setPalledSelected] = useState(palletsWithCalls?.[0]);

  useEffect(() => {
    if (palletsWithCalls && lookup) {
      setPalledSelected(palletsWithCalls[0]);
      const palletCalls = lookup(palletsWithCalls[0].calls!) as EnumVar;
      const calls = Object.entries(palletCalls?.value || {}).map(([name, param]) => ({
        name,
        param,
      }));

      setCalls(calls);
      setCallSelected(calls.at(0));
    }
  }, [palletsWithCalls, lookup]);

  const [calls, setCalls] = useState<Omit<ICallParam, 'pallet' | 'onChange'>[]>([]);
  const [callSelected, setCallSelected] = useState(calls.at(0));

  const [callArgs, setCallArgs] = useState<unknown>();

  // console.log(callArgs.remark.asHex());

  const [encodedCall, setEncodedCall] = useState<Binary | undefined>(Binary.fromHex('0x'));
  const decodedCall = useMemo(() => {
    if (viewBuilder && encodedCall) {
      try {
        return viewBuilder.callDecoder(encodedCall.asHex());

      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [encodedCall, viewBuilder]);

  useEffect(() => {
    if (dynamicBulder && palletSelected?.name && callSelected?.name && viewBuilder) {
      try {
        const callCodec = dynamicBulder.buildCall(palletSelected.name, callSelected.name);

        const _encodedCall = Binary.fromBytes(
          mergeUint8(
            new Uint8Array(callCodec.location),
            callCodec.codec.enc(callArgs),
          ),
        );

        setEncodedCall(_encodedCall);

      } catch (err) {
        setEncodedCall(undefined);
        console.log(err);
      }
    }

  }, [palletSelected, callSelected, callArgs, dynamicBulder, viewBuilder]);

  const submitTx = useCallback(async () => {
    const toastId = 'toast-extrinsic-result';
    if (api) {
      try {
        toast.loading('Loading...', { position: 'top-right', id: toastId, duration: 99999 });
        const res = api.tx[palletSelected.name][callSelected?.name](callArgs);
        console.log(res);

        const submited = await res.signAndSubmit(signer);
        toast.success('Success', { position: 'top-right', id: toastId, duration: 4000 });
        console.log(submited);

      } catch (error) {
        console.log('error', error);
        toast.error(`Error, ${error?.message}`, { position: 'top-right', id: toastId, duration: 4000 });

      }
    }
  }, [api, callArgs, palletSelected, callSelected, signer]);

  const handlePalletSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (palletsWithCalls && lookup) {
      const palletSelected = palletsWithCalls[Number(e.target.value)];
      setPalledSelected(palletSelected);

      const palletCalls = lookup(palletSelected.calls!) as EnumVar;
      const calls = Object.entries(palletCalls?.value || {}).map(([name, param]) => ({
        name,
        param,
      }));

      setCalls(calls);
      setCallSelected(calls.at(0));

      setCallArgs({});
    }
  }, [palletsWithCalls, lookup]);

  const handleCallSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (calls.length > 0) {
      setCallSelected(calls.at(Number(e.target.value)));
      setEncodedCall(undefined);
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
          calls.length > 0
          && (
            <CallSelect
              key={`call-select-${palletSelected!.name}`}
              calls={calls}
              onCallSelect={handleCallSelect}
            />
          )
        }
      </div >
      {
        palletSelected
        && callSelected
        && (
          <div className="mt-4 flex flex-col gap-4">
            <CallParam
              key={`call-param-${callSelected.name}`}
              pallet={palletSelected}
              name={callSelected.name}
              param={callSelected.param}
              onChange={setCallArgs}
            />
          </div>
        )
      }
      <br />
      <button
        type="button"
        disabled={!signer}
        className="block w-fit cursor-pointer border p-2 disabled:cursor-not-allowed disabled:opacity-30"
        onClick={submitTx}
      >
        Sign and Submit
      </button>
      {
        encodedCall && decodedCall
        && (
          <>
            <br />
            <p className="break-words">Encoded Call {encodedCall.asHex()}</p>
          </>
        )
      }
    </>
  );
};

export default Extrinsics;
