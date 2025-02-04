import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CallDocs } from '@components/callDocs';
import { InvocationStorageArgs } from '@components/chainState';
import { RecentQueriesDrawer } from '@components/drawers/recentQueries';
import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
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

import type { TRelayApi } from '@custom-types/chain';
import type { IEventBusRunRecentQuery } from '@custom-types/eventBus';
import type {
  TChainStateQueryProps,
  TRequiredQuery,
} from '@custom-types/recentQueries';

export interface ISubscription {
  unsubscribe: () => void;
  id?: string;
}

const ChainState = () => {
  const dynamicBuilder = useDynamicBuilder();

  const metadata = useStoreChain?.use?.metadata?.();
  const chain = useStoreChain?.use?.chain?.();

  const palletsWithStorage = useMemo(() => metadata?.pallets?.filter((p) => p.storage)?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const palletSelectItems = useMemo(() => palletsWithStorage?.map((pallet) => ({
    label: pallet.name,
    value: pallet.name,
    key: `chainState-pallet-${pallet.name}`,
  })), [palletsWithStorage]);

  const [
    palletSelected,
    setPalletSelected,
  ] = useState(palletsWithStorage?.at(0));

  const storageCalls = useMemo(() => palletSelected?.storage?.items?.sort((a, b) => a.name.localeCompare(b.name)), [palletSelected]);
  const storageCallItems = useMemo(() => {
    if (palletSelected) {
      return storageCalls?.map((item) => ({
        label: item.name,
        value: item.name,
        key: `chainState-call-${item.name}`,
      }));
    }
    return undefined;
  }, [
    palletSelected,
    storageCalls,
  ]);

  const [
    storageSelected,
    setStorageSelected,
  ] = useState(palletSelected?.storage?.items?.at?.(0));

  const [
    callArgs,
    setCallArgs,
  ] = useState<unknown>(undefined);

  const [
    encodedStorageKey,
    setEncodedStorageKey,
  ] = useState<string>('');

  const [
    queries,
    setQueries,
  ] = useState<TRequiredQuery[]>([]);

  const [
    subscriptions,
    setSubscriptions,
  ] = useState<ISubscription[]>([]);

  const { isOpen, open, close } = useDrawer();

  useEffect(() => {
    setQueries([]);
    setCallArgs(undefined);
    setPalletSelected(undefined);
    subscriptions.forEach((sub) => {
      sub?.unsubscribe?.();
    });

    return () => {
      setQueries([]);
      subscriptions.forEach((sub) => {
        sub?.unsubscribe?.();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain.id]);

  useEffect(() => {
    if (palletsWithStorage) {
      const defaultPalletSelected = palletsWithStorage[0];
      setPalletSelected(defaultPalletSelected);
      setStorageSelected(defaultPalletSelected?.storage?.items?.sort((a, b) => a.name.localeCompare(b.name)).at?.(0));
    }
  }, [palletsWithStorage]);

  useEffect(() => {
    if (palletSelected?.name && storageSelected?.name && dynamicBuilder) {
      try {
        const storageCodec = dynamicBuilder.buildStorage(palletSelected.name, storageSelected.name);
        const filteredCallArgs = [callArgs].filter((arg) => Boolean(arg));
        const encodedKey = storageCodec.enc(...filteredCallArgs);

        setEncodedStorageKey(encodedKey);
      } catch (error) {
        setEncodedStorageKey('');
        console.log(error);

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    palletSelected,
    storageSelected,
    callArgs,
  ]);

  const handlePalletSelect = useCallback((selectedPalletName: string) => {
    if (palletsWithStorage) {
      const selectedPallet = palletsWithStorage.find((pallet) => pallet.name === selectedPalletName);

      if (selectedPallet) {
        setPalletSelected(selectedPallet);
        setStorageSelected(selectedPallet.storage?.items?.sort((a, b) => a.name.localeCompare(b.name)).at(0));
        setCallArgs(undefined);
      }
    }
  }, [palletsWithStorage]);

  const handleStorageSelect = useCallback((selectedCallName: string) => {
    if (palletSelected) {
      const selectedStorage = palletSelected.storage?.items.find((item) => item.name === selectedCallName);
      setStorageSelected(selectedStorage);
      setCallArgs(undefined);
    }
  }, [palletSelected]);

  const handleQuerySubmit = useCallback(() => {
    if (palletSelected?.name && storageSelected?.name && dynamicBuilder) {
      setQueries((queries) => {
        const newQueries = [...queries];
        newQueries.unshift({
          pallet: palletSelected.name,
          storage: storageSelected.name,
          id: crypto.randomUUID(),
          args: callArgs,
          name: `${palletSelected.name}/${storageSelected.name}`,
        });
        return newQueries;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    palletSelected,
    storageSelected,
    callArgs,
  ]);

  useEventBus<IEventBusRunRecentQuery>('@@-recent-query', ({ data }) => {
    setQueries((queries) => ([
      {
        name: `${data.pallet}/${data.storage}`,
        pallet: data.pallet,
        storage: data.storage,
        id: crypto.randomUUID(),
        args: data?.args,
        isCachedQuery: true,
      },
      ...queries,
    ]));
  });

  const handleSubscribe = useCallback((subscription: ISubscription) => {
    setSubscriptions((subs) => ([
      ...subs,
      subscription,
    ]));
  }, []);

  const handleUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));

    const subscriptionToCancel = subscriptions.find((sub) => sub.id === id);
    if (subscriptionToCancel) {
      subscriptionToCancel.unsubscribe();
      setSubscriptions((subs) => subs.filter((sub) => sub.id !== id));
    }
  }, [subscriptions]);

  if (!palletSelected) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader
        className="mb-10"
        title="Chain State"
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
      </PageHeader>
      <QueryViewContainer>

        <RecentQueriesDrawer
          category={QUERY_CATEGORIES.CHAIN_STATE}
          handleClose={close}
          isOpen={isOpen}
        />
        <QueryFormContainer>
          <div className="grid w-full grid-cols-2 gap-4">
            <PDSelect
              emptyPlaceHolder="No pallets available"
              items={[palletSelectItems || []]}
              label="Select Pallet"
              onChange={handlePalletSelect}
              placeholder="Please select a pallet"
              value={palletSelected?.name}
            />

            {
              storageCallItems && (
                <PDSelect
                  key={`storage-select-${palletSelected?.name}`}
                  emptyPlaceHolder="No storages available"
                  items={[storageCallItems]}
                  label="Select Storage"
                  onChange={handleStorageSelect}
                  placeholder="Please select a storage"
                  value={storageSelected?.name}
                />
              )
            }
          </div>

          {
            storageSelected && (
              <InvocationStorageArgs
                key={`incovation-storage-${storageSelected.name}`}
                args={storageSelected}
                onChange={setCallArgs}
              />
            )
          }

          <QueryButton onClick={handleQuerySubmit}>
            Subscribe to
            {' '}
            {palletSelected?.name}
            /
            {storageSelected?.name}
          </QueryButton>

          {
            (encodedStorageKey) && (
              <p className="break-all">
                Encoded Storage Key:
                <br />
                {' '}
                {encodedStorageKey}
              </p>
            )
          }

          <CallDocs docs={storageSelected?.docs?.filter((d) => d) || []} />

        </QueryFormContainer>
        <QueryResultContainer>
          {
            queries.map((query) => (
              <Query
                key={`query-result-${query.pallet}-${query.storage}-${query.id}`}
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
                querie={query}
              />
            ))
          }
        </QueryResultContainer>
      </QueryViewContainer>
    </>

  );
};

export default ChainState;

const Query = (
  {
    querie,
    onSubscribe,
    onUnsubscribe,
  }: TChainStateQueryProps) => {
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
    (async () => {
      const catchError = (err: Error) => {
        setIsLoading(false);
        setResult(err?.message || 'Unexpected Error');
      };

      // save to recent queries
      if (!querie.isCachedQuery) {
        void addRecentQuerieToStorage({
          querie,
          chainId: chain.id,
          category: QUERY_CATEGORIES.CHAIN_STATE,
        });
      }
      if (api) {
        try {
          if (querie.pallet && querie.storage) {
            // @TODO: fix types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subscription = (api.query as any)[querie.pallet][querie.storage]
              .watchValue(querie.args || 'finalized')
              .subscribe((res: unknown) => {
                setResult(res);
                setIsLoading(false);
              });

            subscription.id = querie.id;
            onSubscribe(subscription);
          }
        } catch (error) {
          catchError(error as Error);
        }
      }
    })()
      .catch(console.log);
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
      title="Storage Subscription"
    />
  );
};
