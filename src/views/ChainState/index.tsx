import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CodecParam } from '@components/callParam/CodecParam';
import { PalletSelect } from '@components/palletSelect';
import { useStoreChain } from '@stores';
import { useViewBuilder } from 'src/hooks/useViewBuilder';

import type { TRelayApi } from '@custom-types/chain';
import type { V14 } from '@polkadot-api/view-builder';

interface ISubscription {
  unsubscribe: () => void;
  id?: string;
}

const ChainState = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();

  const palletsWithStorage = useMemo(() => metadata?.pallets?.filter(p => p.storage), [metadata]);
  const [palletSelected, setPalletSelected] = useState(palletsWithStorage?.at(0));

  const calls = useMemo(() => {
    if (palletSelected) {
      return palletSelected.storage?.items.map(item => ({
        label: item.name,
        value: item.name,
      }));
    }
    return undefined;
  }, [palletSelected]);
  const [storageSelected, setStorageSelected] = useState(palletSelected?.storage?.items?.at?.(0));

  const [callArgs, setCallArgs] = useState<unknown>(undefined);
  console.log('args', callArgs);

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

  const handlePalletSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (palletsWithStorage) {
      const selectedPallet = palletsWithStorage[Number(e.target.value)];
      setPalletSelected(selectedPallet);
      setStorageSelected(selectedPallet.storage?.items.at(0));
      setCallArgs(undefined);
    }
  }, [palletsWithStorage]);

  const handleCallSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (palletSelected) {
      const selectedStoragelName = e.target.value;
      const selectedStorage = palletSelected.storage?.items.find(item => item.name === selectedStoragelName);
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

  if (!metadata || !lookup || !palletsWithStorage) {
    return 'Loading...';
  }

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-4">
        <PalletSelect pallets={palletsWithStorage} onPalletSelect={handlePalletSelect} />
        {
          calls
          && <StorageSelect calls={calls} onStorageSelect={handleCallSelect} />
        }
      </div>
      <br />
      {
        storageSelected
        && <StorageArgs storage={storageSelected} onChange={setCallArgs} />
      }

      <br />
      <button
        type="button"
        className="block w-fit cursor-pointer border p-2 disabled:cursor-not-allowed disabled:opacity-30"
        onClick={handleStorageQuerySubmit}
      >
        Query Storage
      </button>
      <br />
      <div className="rounded-xl border p-2 empty:hidden">
        {
          storageSelected?.docs?.map((doc, i) => <p key={`doc-${i}`} className="pb-2 last:pb-0">{doc}</p>)
        }
      </div>
      <br />
      <p>Results</p>
      <br />
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
    </>
  );
};

export default ChainState;

const StorageSelect = ({
  calls,
  onStorageSelect,
}: {
  calls: { label: string; value: string }[] | undefined;
  onStorageSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {

  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="pl-2">
          Storage
        </span>
        <select
          className="w-full p-2"
          onChange={onStorageSelect}
        >
          {
            calls?.map(call => {
              return (
                <option
                  key={`${call.label}-storage-select`}
                  value={call.label}
                >
                  {call.value}
                </option>
              );
            })
          }
        </select>
      </label>
    </div>
  );
};

const StorageArgs = (
  {
    storage,
    onChange,
  }: {
    storage: NonNullable<V14['pallets'][number]['storage']>['items'][number];
    onChange: (args: unknown) => void;
  },
) => {
  const lookup = useStoreChain?.use?.lookup?.();
  const viewBuilder = useViewBuilder();

  const storageType = storage.type;

  console.log(storageType);

  if (storageType.tag === 'plain') {
    // console.log('plain value', lookup?.(storageType.value));
    // const plainVarialbe = lookup!(storageType.value);
    // return <CodecParam variable={plainVarialbe} onChange={onChange} />;
    return null;
  }

  const keyVariable = lookup!(storageType.value.key);
  console.log('key', lookup?.(storageType.value.key));
  console.log('key builder', viewBuilder?.buildDefinition(storageType.value.key));
  // console.log('value', lookup?.(storageType.value.value));

  return (
    <div>
      <CodecParam variable={keyVariable} onChange={onChange} />
    </div>
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
        // api.query.Referenda.ReferendumInfoFor.watchValue()
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
