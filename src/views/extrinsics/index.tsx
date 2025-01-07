import { useEventBus } from '@pivanov/event-bus';
import { type EnumVar } from '@polkadot-api/metadata-builders';
import { mergeUint8 } from '@polkadot-api/utils';
import { Binary } from 'polkadot-api';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { RecentQueriesDrawer } from '@components/drawers/recentQueries';
import { Icon } from '@components/icon';
import { InvocationArgsMapper } from '@components/invocationArgsMapper';
import { Loader } from '@components/loader';
import { WalletAccountSelector } from '@components/metadataBuilders/accountBuilder/walletAccountSelector';
import { PageHeader } from '@components/pageHeader';
import { QueryButton } from '@components/papiQuery/queryButton';
import { QueryFormContainer } from '@components/papiQuery/queryFormContainer';
import { QueryResult } from '@components/papiQuery/queryResult';
import { QueryResultContainer } from '@components/papiQuery/queryResultContainer';
import { QueryViewContainer } from '@components/papiQuery/queryViewContainer';
import { PDSelect } from '@components/pdSelect';
import { QUERY_CATEGORIES } from '@constants/recentQueries';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';
import { addRecentQuerieToStorage } from '@utils/recentQueries';
import { useDrawer } from 'src/hooks/useDrawer';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';
import { useViewBuilder } from 'src/hooks/useViewBuilder';
import { useStoreWallet } from 'src/stores/wallet';

import type { InvocationArgsMapper as InvocationArgsMapperProps } from '@components/invocationArgsMapper/types';
import type { TRelayApi } from '@custom-types/chain';
import type { IEventBusRunRecentQuery } from '@custom-types/eventBus';
import type {
  TExtrinsicsQueryProps,
  TRequiredQuery,
} from '@custom-types/recentQueries';
import type { InjectedPolkadotAccount } from 'polkadot-api/dist/reexports/pjs-signer';

const Extrinsics = () => {
  const dynamicBuilder = useDynamicBuilder();
  const viewBuilder = useViewBuilder();

  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();
  const chain = useStoreChain?.use?.chain?.();

  const accounts = useStoreWallet?.use?.accounts?.();

  const [
    signer,
    setSigner,
  ] = useState(accounts.at(0)?.polkadotSigner);

  // apply / reset signer on wallet connect / disconnect
  useEffect(() => {
    setSigner(accounts?.at(0)?.polkadotSigner);
  }, [accounts]);

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
  ] = useState<TRequiredQuery[]>([]);
  const [
    callArgs,
    setCallArgs,
  ] = useState<unknown>();

  const [
    calls,
    setCalls,
  ] = useState<Pick<InvocationArgsMapperProps, 'name' | 'invocationVar'>[]>([]);
  const [
    callSelected,
    setCallSelected,
  ] = useState(calls.at(0));

  const { isOpen, open, close } = useDrawer();

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
          invocationVar,
        ]) => ({
          name,
          invocationVar,
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
  ] = useState<Binary>(Binary.fromHex('0x'));

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
    if (dynamicBuilder && palletSelected?.name && callSelected?.name) {
      try {
        const callCodec = dynamicBuilder.buildCall(palletSelected.name, callSelected.name);
        const locationBytes = new Uint8Array(callCodec.location);
        const encodedCall = Binary.fromBytes(
          mergeUint8(
            locationBytes,
            callCodec.codec.enc(callArgs),
          ),
        );

        setEncodedCall(encodedCall);
      } catch (err) {
        setEncodedCall(Binary.fromHex('0x'));
        console.log(err);
      }
    }

  }, [
    palletSelected,
    callSelected,
    callArgs,
    dynamicBuilder,
  ]);

  const submitTx = useCallback(async () => {
    if (palletSelected?.name && callSelected?.name) {
      setQueries((queries) => {
        const newQueries = [...queries];
        newQueries.unshift({
          pallet: palletSelected.name,
          storage: callSelected.name,
          id: crypto.randomUUID(),
          args: callArgs,
          name: `${palletSelected.name}/${callSelected.name}`,
        });
        return newQueries;
      });
    }
  }, [
    callArgs,
    palletSelected,
    callSelected,
  ]);

  useEventBus<IEventBusRunRecentQuery>('@@-recent-query', ({ data }) => {
    console.log(data);
    setQueries((prevQueries) => ([
      {
        name: `${data.pallet}/${data.storage}`,
        id: crypto.randomUUID(),
        args: data?.args,
        pallet: data.pallet,
        storage: data.storage,
        isCachedQuery: true,
      },
      ...prevQueries,
    ]));
  });

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
            invocationVar,
          ]) => ({
            name,
            invocationVar,
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
    setCallArgs({});
  }, [calls]);

  const handleUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  const handleAccountSelect = useCallback((accountSelected: unknown) => {
    setSigner((accountSelected as InjectedPolkadotAccount).polkadotSigner);
  }, []);

  if (!palletSelected) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader
        className="mb-10"
        title="Extrinsics"
      >
        <div
          onClick={open}
          className={cn(
            'cursor-pointer duration-300 ease-out',
            'bg-dev-purple-700 p-2 dark:bg-dev-purple-50',
            'hover:bg-dev-purple-900 hover:dark:bg-dev-purple-200',
          )}
        >
          <Icon
            className="text-dev-white-200 dark:text-dev-purple-700"
            name="icon-history"
          />
        </div>
      </PageHeader >
      <QueryViewContainer>
        <RecentQueriesDrawer
          category={QUERY_CATEGORIES.EXTRINSICS}
          handleClose={close}
          isOpen={isOpen}
        />
        <QueryFormContainer>
          <div className="grid w-full grid-cols-2 gap-4">
            <PDSelect
              emptyPlaceHolder="No pallets available"
              items={[palletSelectItems]}
              label="Select Pallet"
              onChange={handlePalletSelect}
              value={palletSelected?.name}
            />
            {
              (callSelectItems.length > 0) && (
                <PDSelect
                  key={`call-select-${palletSelected?.name}`}
                  emptyPlaceHolder="No calls available"
                  items={[callSelectItems]}
                  label="Select Call"
                  onChange={handleCallSelect}
                  value={callSelected?.name}
                />
              )
            }
          </div>
          <div className="flex flex-col gap-2">
            <span className=" font-geist font-body1-regular">Signer</span>
            <WalletAccountSelector
              accounts={accounts}
              onChange={handleAccountSelect}
            />
          </div>
          {
            (palletSelected && callSelected) && (
              <div className="flex flex-col gap-6 empty:hidden">
                <InvocationArgsMapper
                  key={`call-param-${callSelected.name}`}
                  invocationVar={callSelected.invocationVar}
                  name={callSelected.name}
                  onChange={setCallArgs}
                  pallet={palletSelected}
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
                onUnsubscribe={handleUnsubscribe}
                querie={query}
                signer={signer}
              />
            ))
          }
        </QueryResultContainer>
      </QueryViewContainer>
    </>
  );
};

export default Extrinsics;

const Query = ({
  querie,
  onUnsubscribe,
  signer,
}: TExtrinsicsQueryProps) => {
  const api = useStoreChain?.use?.api?.() as TRelayApi;
  const chain = useStoreChain.use.chain?.();

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

    // save to recent queries
    if (!querie.isCachedQuery) {
      void addRecentQuerieToStorage({
        querie,
        chainId: chain.id,
        category: QUERY_CATEGORIES.EXTRINSICS,
      });
    }

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
      path={querie.name}
      result={result}
      title="Extrinsic"
    />
  );
};
