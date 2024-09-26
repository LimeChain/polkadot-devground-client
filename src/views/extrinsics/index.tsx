import { type EnumVar } from '@polkadot-api/metadata-builders';
import { mergeUint8 } from '@polkadot-api/utils';
import { Binary } from 'polkadot-api';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CallParam,
  type ICallParam,
} from '@components/callParam';
import { AccountSelectParam } from '@components/callParam/accountSelectParam';
import { QueryButton } from '@components/callParam/queryButton';
import { QueryFormContainer } from '@components/callParam/queryFormContainer';
import { QueryResult } from '@components/callParam/queryResult';
import { QueryResultContainer } from '@components/callParam/queryResultContainer';
import { QueryViewContainer } from '@components/callParam/queryViewContainer';
import { Loader } from '@components/loader';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';
import { useViewBuilder } from 'src/hooks/useViewBuilder';
import { useStoreWallet } from 'src/stores/wallet';

import type { TRelayApi } from '@custom-types/chain';
import type {
  InjectedPolkadotAccount,
  PolkadotSigner,
} from 'polkadot-api/dist/reexports/pjs-signer';

const Extrinsics = () => {
  const dynamicBulder = useDynamicBuilder();
  const viewBuilder = useViewBuilder();

  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();
  const chain = useStoreChain?.use?.chain?.();

  const accounts = useStoreWallet?.use?.accounts?.();

  const [
    signer,
    setSigner,
  ] = useState(accounts.at(0)?.polkadotSigner);
  const palletsWithCalls = useMemo(() => metadata?.pallets?.filter((p) => p.calls)?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const palletSelectItems = useMemo(() => palletsWithCalls?.map((pallet) => ({
    label: pallet.name,
    value: pallet.name,
    key: `extrinsic-pallet-${pallet.name}`,
  })) || [], [palletsWithCalls]);

  const [
    palletSelected,
    setPalledSelected,
  ] = useState(palletsWithCalls?.[0]);

  const [
    queries,
    setQueries,
  ] = useState<{ pallet: string; storage: string; id: string; args: unknown }[]>([]);
  const [
    callArgs,
    setCallArgs,
  ] = useState<unknown>();

  const [
    calls,
    setCalls,
  ] = useState<Pick<ICallParam, 'name' | 'param'>[]>([]);
  const [
    callSelected,
    setCallSelected,
  ] = useState(calls.at(0));

  useEffect(() => {
    setQueries([]);
    setCallArgs({});
    setPalledSelected(undefined);
  }, [chain.id]);

  useEffect(() => {
    if (palletsWithCalls && lookup) {
      setPalledSelected(palletsWithCalls[0]);
      const palletCalls = lookup(palletsWithCalls[0].calls!) as EnumVar;
      const calls = Object.entries(palletCalls?.value || {})
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([
          name,
          param,
        ]) => ({
          name,
          param,
        }));

      setCalls(calls);
      setCallSelected(calls.at(0));
    }
  }, [
    palletsWithCalls,
    lookup,
  ]);

  const callSelectItems = useMemo(() => calls?.map((call) => ({
    label: call.name,
    value: call.name,
    key: `extrinsic-call-${call.name}`,
  })) || [], [calls]);

  const [
    encodedCall,
    setEncodedCall,
  ] = useState<Binary | undefined>(Binary.fromHex('0x'));
  const decodedCall = useMemo(() => {
    if (viewBuilder && encodedCall) {
      try {
        return viewBuilder.callDecoder(encodedCall.asHex());

      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [
    encodedCall,
    viewBuilder,
  ]);

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

  }, [
    palletSelected,
    callSelected,
    callArgs,
    dynamicBulder,
    viewBuilder,
  ]);

  const submitTx = useCallback(async () => {
    if (palletSelected?.name && callSelected?.name) {
      setQueries((queries) => ([
        {
          pallet: palletSelected.name,
          storage: callSelected.name,
          id: crypto.randomUUID(),
          args: callArgs,
        },
        ...queries,
      ]));
    }
  }, [
    callArgs,
    palletSelected,
    callSelected,
  ]);

  const handlePalletSelect = useCallback((palletSelectedName: string) => {
    if (palletsWithCalls && lookup) {
      const palletSelected = palletsWithCalls.find((pallet) => pallet.name === palletSelectedName);

      if (palletSelected) {
        setPalledSelected(palletSelected);

        const palletCalls = lookup(palletSelected.calls!) as EnumVar;
        const calls = Object.entries(palletCalls?.value || {})
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([
            name,
            param,
          ]) => ({
            name,
            param,
          }));

        setCalls(calls);
        setCallSelected(calls.at(0));

        setCallArgs({});
      }
    }
  }, [
    palletsWithCalls,
    lookup,
  ]);

  const handleCallSelect = useCallback((callSelectedName: string) => {
    const selectedCall = calls.find((call) => call.name === callSelectedName);

    setCallSelected(selectedCall);
    setEncodedCall(undefined);
    setCallArgs({});
  }, [calls]);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  const handleAccountSelect = useCallback((accountSelected: unknown) => {
    setSigner((accountSelected as InjectedPolkadotAccount).polkadotSigner);
  }
    , []);

  if (!palletSelected) {
    return <Loader />;
  }

  return (
    <QueryViewContainer>
      <QueryFormContainer>
        <div className="grid w-full grid-cols-2 gap-4">
          <PDSelect
            emptyPlaceHolder="No pallets available"
            items={palletSelectItems}
            label="Select Pallet"
            onChange={handlePalletSelect}
            value={palletSelected?.name}
          />
          {
            (callSelectItems.length > 0) && (
              <PDSelect
                key={`call-select-${palletSelected?.name}`}
                emptyPlaceHolder="No calls available"
                items={callSelectItems}
                label="Select Call"
                onChange={handleCallSelect}
                value={callSelected?.name}
              />
            )
          }
        </div>
        <div className="flex flex-col gap-2">
          <span className=" font-geist font-body1-regular">Signer</span>
          <AccountSelectParam
            accounts={accounts}
            onChange={handleAccountSelect}
          />
        </div>
        {
          (palletSelected && callSelected) && (
            <div className="flex flex-col gap-6 empty:hidden">
              <CallParam
                key={`call-param-${callSelected.name}`}
                name={callSelected.name}
                onChange={setCallArgs}
                pallet={palletSelected}
                param={callSelected.param}
              />
            </div>
          )
        }
        <QueryButton
          disabled={!signer}
          onClick={submitTx}
        >
          Sign and Submit
          {' '}
          {palletSelected?.name}
          /
          {callSelected?.name}
        </QueryButton>
        {
          (encodedCall && decodedCall) && (
            <p className="break-all">
              Encoded Call:
              {' '}
              <br />
              {' '}
              {encodedCall.asHex()}
            </p>
          )
        }
      </QueryFormContainer>
      <QueryResultContainer>
        {
          signer && queries.map((query) => (
            <Query
              key={`query-result-${query.pallet}-${query.storage}-${query.id}`}
              onUnsubscribe={handleStorageUnsubscribe}
              querie={query}
              signer={signer}
            />
          ))
        }
      </QueryResultContainer>
    </QueryViewContainer>
  );
};

export default Extrinsics;

const Query = ({
  querie,
  onUnsubscribe,
  signer,
}: {
  querie: { pallet: string; storage: string; id: string; args: unknown };
  onUnsubscribe: (id: string) => void;
  signer: PolkadotSigner;
}) => {
  const api = useStoreChain?.use?.api?.() as TRelayApi;
  const [
    result,
    setResult,
  ] = useState<unknown>();
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  useEffect(() => {
    const catchError = (err: Error) => {
      setIsLoading(false);
      setResult(err?.message || 'Unexpected Error');
    };

    if (api) {
      try {
        // @TODO: fix types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = (api.tx as any)[querie.pallet][querie.storage](querie.args);

        res.signAndSubmit(signer).then((res: unknown) => {
          setResult(res);
          setIsLoading(false);
        })
          .catch(catchError);

      } catch (error) {
        catchError(error as Error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    querie,
    api,
  ]);

  const handleUnsubscribe = useCallback(() => {
    onUnsubscribe(querie.id);
  }, [
    querie,
    onUnsubscribe,
  ]);

  return (
    <QueryResult
      isLoading={isLoading}
      onRemove={handleUnsubscribe}
      path={`${querie.pallet}/${querie.storage}`}
      result={result}
      title="Extrinsic"
    />
  );
};
