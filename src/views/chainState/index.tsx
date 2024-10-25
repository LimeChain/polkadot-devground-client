import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { InvocationStorageArgs } from '@components/chainState';
import { CallDocs } from '@components/callDocs';
import { QueryButton } from '@components/papiQuery/queryButton';
import { QueryFormContainer } from '@components/papiQuery/queryFormContainer';
import { QueryResult } from '@components/papiQuery/queryResult';
import { QueryResultContainer } from '@components/papiQuery/queryResultContainer';
import { QueryViewContainer } from '@components/papiQuery/queryViewContainer';
import { Loader } from '@components/loader';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

import type { TRelayApi } from '@custom-types/chain';

interface ISubscription {
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
  ] = useState<{ pallet: string; storage: string; id: string; args: unknown }[]>([]);

  const [
    subscriptions,
    setSubscriptions,
  ] = useState<ISubscription[]>([]);

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
    <QueryViewContainer>
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
  );
};

export default ChainState;

const Query = (
  {
    querie,
    onSubscribe,
    onUnsubscribe,
  }: {
    querie: { pallet: string; storage: string; id: string; args: unknown };
    onSubscribe: (subscription: ISubscription) => void;
    onUnsubscribe: (id: string) => void;
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
        const subscription = (api.query as any)[querie.pallet][querie.storage]
          .watchValue(querie.args || 'finalized')
          .subscribe((res: unknown) => {
            setResult(res);
            setIsLoading(false);
          });

        subscription.id = querie.id;
        onSubscribe(subscription);

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
      title="Storage Subscription"
    />
  );
};
