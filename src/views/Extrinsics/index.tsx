import { type EnumVar } from '@polkadot-api/metadata-builders';
import { mergeUint8 } from '@polkadot-api/utils';
import { Binary } from 'polkadot-api';
import {
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
import { QueryButton } from '@components/callParam/QueryButton';
import { PDSelect } from '@components/pdSelect';
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

  const palletsWithCalls = useMemo(() => metadata?.pallets?.filter(p => p.calls)
    ?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const palletSelectItems = useMemo(() => palletsWithCalls?.map(pallet => ({
    label: pallet.name,
    value: pallet.name,
    key: `extrinsic-pallet-${pallet.name}`,
  })) || [], [palletsWithCalls]);
  const [palletSelected, setPalledSelected] = useState(palletsWithCalls?.[0]);

  useEffect(() => {
    if (palletsWithCalls && lookup) {
      setPalledSelected(palletsWithCalls[0]);
      const palletCalls = lookup(palletsWithCalls[0].calls!) as EnumVar;
      const calls = Object.entries(palletCalls?.value || {})
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, param]) => ({
          name,
          param,
        }));

      setCalls(calls);
      setCallSelected(calls.at(0));
    }
  }, [palletsWithCalls, lookup]);

  const [calls, setCalls] = useState<Pick<ICallParam, 'name' | 'param'>[]>([]);
  const callSelectItems = useMemo(() => calls?.map(call => ({
    label: call.name,
    value: call.name,
    key: `extrinsic-call-${call.name}`,
  })) || [], [calls]);
  const [callSelected, setCallSelected] = useState(calls.at(0));

  const [callArgs, setCallArgs] = useState<unknown>();

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

  const handlePalletSelect = useCallback((palletSelectedName: string) => {
    if (palletsWithCalls && lookup) {
      const palletSelected = palletsWithCalls.find(pallet => pallet.name === palletSelectedName);

      setPalledSelected(palletSelected);

      const palletCalls = lookup(palletSelected!.calls!) as EnumVar;
      const calls = Object.entries(palletCalls?.value || {})
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, param]) => ({
          name,
          param,
        }));

      setCalls(calls);
      setCallSelected(calls.at(0));

      setCallArgs({});
    }
  }, [palletsWithCalls, lookup]);

  const handleCallSelect = useCallback((callSelectedName: string) => {
    const selectedCall = calls.find(call => call.name === callSelectedName);

    setCallSelected(selectedCall);
    setEncodedCall(undefined);
    setCallArgs({});
  }, [calls]);

  if (!palletsWithCalls) {
    return 'Loading...';
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid w-full grid-cols-2 gap-4">
        <PDSelect
          label="Select Pallet"
          emptyPlaceHolder="No pallets available"
          items={palletSelectItems}
          value={palletSelected?.name}
          onChange={handlePalletSelect}
        />
        {
          callSelectItems.length > 0
          && (
            <PDSelect
              key={`call-select-${palletSelected?.name}`}
              label="Select Call"
              emptyPlaceHolder="No calls available"
              items={callSelectItems}
              value={callSelected?.name}
              onChange={handleCallSelect}
            />
          )
        }
      </div >
      {
        palletSelected
        && callSelected
        && (
          <div className="flex flex-col gap-6 empty:hidden">
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
      <QueryButton
        disabled={!signer}
        onClick={submitTx}
      >
        Sign and Submit
      </QueryButton>
      {
        encodedCall && decodedCall
        && (
          <>
            <p className="break-words">Encoded Call {encodedCall.asHex()}</p>
          </>
        )
      }
    </div>
  );
};

export default Extrinsics;
