import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CallDocs } from '@components/callParam/CallDocs';
import { CodecParam } from '@components/callParam/CodecParam';
import { QueryButton } from '@components/callParam/QueryButton';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';

import type { TRelayApi } from '@custom-types/chain';
import type { TMetaDataStorageItem } from '@custom-types/papi';

interface ISubscription {
  unsubscribe: () => void;
  id?: string;
}

const ChainState = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();

  const palletsWithStorage = useMemo(() => metadata?.pallets?.filter(p => p.storage)
    ?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const palletSelectItems = useMemo(() => palletsWithStorage?.map(pallet => ({
    label: pallet.name,
    value: pallet.name,
    key: `chainState-pallet-${pallet.name}`,
  })), [palletsWithStorage]);
  const [palletSelected, setPalletSelected] = useState(palletsWithStorage?.at(0));

  const storageCalls = useMemo(() => palletSelected?.storage?.items
    ?.sort((a, b) => a.name.localeCompare(b.name)), [palletSelected]);
  const storageCallItems = useMemo(() => {
    if (palletSelected) {
      return storageCalls?.map(item => ({
        label: item.name,
        value: item.name,
        key: `chainState-call-${item.name}`,
      }));
    }
    return undefined;
  }, [palletSelected, storageCalls]);
  const [storageSelected, setStorageSelected] = useState(palletSelected?.storage?.items?.at?.(0));

  const [callArgs, setCallArgs] = useState<unknown>(undefined);

  const [queries, setQueries] = useState<{ pallet: string; storage: string; id: string; args: unknown }[]>([]);
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);

  useEffect(() => {
    subscriptions.forEach(sub => {
      sub?.unsubscribe?.();
    });

    return () => {
      subscriptions.forEach(sub => {
        sub?.unsubscribe?.();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (palletsWithStorage) {
      const defaultPalletSelected = palletsWithStorage[0];
      setPalletSelected(defaultPalletSelected);
      setStorageSelected(defaultPalletSelected?.storage?.items?.at?.(0));
    }
  }, [palletsWithStorage]);

  const handlePalletSelect = useCallback((selectedPalletName: string) => {
    if (palletsWithStorage) {
      const selectedPallet = palletsWithStorage.find(pallet => pallet.name === selectedPalletName);
      setPalletSelected(selectedPallet);
      setStorageSelected(selectedPallet!.storage?.items.at(0));
      setCallArgs(undefined);
    }
  }, [palletsWithStorage]);

  const handleStorageSelect = useCallback((selectedCallName: string) => {
    if (palletSelected) {
      const selectedStorage = palletSelected.storage?.items.find(item => item.name === selectedCallName);
      setStorageSelected(selectedStorage);
      setCallArgs(undefined);
    }
  }, [palletSelected]);

  const handleStorageQuerySubmit = useCallback(() => {
    setQueries(queries => ([{
      pallet: palletSelected!.name,
      storage: storageSelected!.name,
      id: crypto.randomUUID(),
      args: callArgs,
    }, ...queries]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palletSelected, storageSelected, callArgs]);

  const handleStorageSubscribe = useCallback((subscription: ISubscription) => {
    setSubscriptions(subs => ([...subs, subscription]));
  }, []);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries(queries => queries.filter(query => query.id !== id));

    const subscriptionToCancel = subscriptions.find(sub => sub.id === id);
    if (subscriptionToCancel) {
      subscriptionToCancel.unsubscribe();
      setSubscriptions(subs => subs.filter(sub => sub.id !== id));
    }
  }, [subscriptions]);

  if (!palletsWithStorage) {
    return 'Loading...';
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid w-full grid-cols-2 gap-4">
        <PDSelect
          label="Select Pallet"
          emptyPlaceHolder="No pallets available"
          placeholder="Please select a pallet"
          items={palletSelectItems}
          onChange={handlePalletSelect}
          value={palletSelected?.name}
        />

        {
          storageCallItems
          && (
            <PDSelect
              label="Select Storage"
              emptyPlaceHolder="No storages available"
              placeholder="Please select a storage"
              items={storageCallItems}
              onChange={handleStorageSelect}
              value={storageSelected?.name}
            />
          )
        }
      </div>

      {
        storageSelected
        && (
          <StorageArgs
            storage={storageSelected}
            onChange={setCallArgs}
          />
        )
      }

      <QueryButton onClick={handleStorageQuerySubmit}>
        Subscribe to {palletSelected?.name}/{storageSelected?.name}
      </QueryButton>

      <CallDocs docs={storageSelected?.docs?.filter(d => d) || []} />

      <p>Results</p>
      <div className="flex flex-col gap-4">
        {
          queries.map((query) => (
            <QueryResult
              key={`query-result-${query.pallet}-${query.storage}-${query.id}`}
              querie={query}
              onSubscribe={handleStorageSubscribe}
              onUnsubscribe={handleStorageUnsubscribe}
            />
          ))
        }
      </div>
    </div>
  );
};

export default ChainState;

const StorageArgs = (
  {
    storage,
    onChange,
  }: {
      storage: TMetaDataStorageItem;
    onChange: (args: unknown) => void;
  },
) => {
  const lookup = useStoreChain?.use?.lookup?.();

  const storageType = storage.type;

  if (storageType.tag === 'plain') {
    return null;
  }

  const keyVariable = lookup!(storageType.value.key);

  return (
    <CodecParam variable={keyVariable} onChange={onChange} />
  );
};

const QueryResult = (
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

  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);

  console.log('query', querie);

  useEffect(() => {
    if (api) {
      try {
        // api.query.Babe.GenesisSlot.watchValue()
        const subscription = api.query[querie.pallet][querie.storage].watchValue(querie.args || 'best').subscribe((res: undefined) => {
          console.log('subscription', querie);
          console.log('res', res);
          console.log('res', typeof res);
          setResult(res);
          setIsLoading(false);
        });

        subscription.id = querie.id;
        onSubscribe(subscription);
      } catch (error) {
        setIsLoading(false);
        console.log('ERROR', error);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querie, api]);

  const handleUnsubscribe = useCallback(() => {
    console.log('unsub', querie.id);

    onUnsubscribe(querie.id);
  }, [querie, onUnsubscribe]);

  return (
    <div className="relative rounded-2xl border p-6">
      <button
        type="button"
        className="absolute right-2 top-2 border p-2 font-h5-bold"
        onClick={handleUnsubscribe}
      >
        X
      </button>
      <p>Path: {querie.pallet}::{querie.storage}</p>
      <br />
      {
        isLoading ? 'Loading...'
          : (
            <div>
              {
                result
                  ? JSON.stringify(result, (key, value) => {
                    if (typeof value === 'bigint') {
                      return Number(value);
                    }
                    return value;
                  }, 2)
                  : String(result)
              }
            </div>
          )
      }
    </div>
  );
};
