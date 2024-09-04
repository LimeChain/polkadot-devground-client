import React, {
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

const RuntimeCalls = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();

  const apis = useMemo(() => metadata?.apis, [metadata]);
  const [apiSelected, setApiSelected] = useState(apis?.at(0));

  const calls = useMemo(() => {
    if (apiSelected) {
      return apiSelected.methods.map(item => ({
        label: item.name,
        value: item.name,
      }));
    }
    return undefined;
  }, [apiSelected]);
  const [methodSelected, setMethodSelected] = useState(apiSelected?.methods.at(0));

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
    if (apis) {
      const defaultApiSelected = apis[0];
      setApiSelected(defaultApiSelected);
      setMethodSelected(defaultApiSelected?.methods.at?.(0));
    }
  }, [apis]);

  const handlePalletSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (apis) {
      const selectedMethod = apis[Number(e.target.value)];
      setApiSelected(selectedMethod);
      setMethodSelected(selectedMethod.methods.at(0));
      setCallArgs(undefined);
    }
  }, [apis]);

  const handleCallSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (apiSelected) {
      const selectedStoragelName = e.target.value;
      const selectedStorage = apiSelected.methods.find(item => item.name === selectedStoragelName);
      setMethodSelected(selectedStorage);
      setCallArgs(undefined);
    }
  }, [apiSelected]);

  const handleStorageQuerySubmit = useCallback(() => {
    setQueries(queries => ([{
      pallet: apiSelected!.name,
      storage: methodSelected!.name,
      id: crypto.randomUUID(),
      args: callArgs,
    }, ...queries]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSelected, methodSelected, callArgs]);

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

  if (!metadata || !lookup || !apis) {
    return 'Loading...';
  }

  console.log(apiSelected, methodSelected);

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-4">
        <PalletSelect pallets={apis} onPalletSelect={handlePalletSelect} />
        {
          calls
          && <StorageSelect calls={calls} onStorageSelect={handleCallSelect} />
        }
      </div>
      <br />
      {
        methodSelected
        && <StorageArgs storage={methodSelected} onChange={setCallArgs} />
      }

      <br />
      <button
        type="button"
        className="block w-fit cursor-pointer border p-2 disabled:cursor-not-allowed disabled:opacity-30"
        onClick={handleStorageQuerySubmit}
      >
        Call Api
      </button>
      <br />
      <div className="rounded-xl border p-2 empty:hidden">
        {
          methodSelected?.docs?.map((doc, i) => <p key={`doc-${i}`} className="pb-2 last:pb-0">{doc}</p>)
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

export default RuntimeCalls;

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
    storage: NonNullable<V14['apis'][number]['methods'][number]>;
    onChange: (args: unknown) => void;
  },
) => {
  const lookup = useStoreChain?.use?.lookup?.();
  const viewBuilder = useViewBuilder();

  const storageType = storage.inputs;

  const result: React.ReactElement[] = [];

  storageType.forEach(type => {
    console.log(type);
    const apiType = lookup!(type.type);

    result.push(<CodecParam variable={apiType} onChange={onChange} />);
  });

  return result.map(item => item);

  // console.log(storageType);

  // if (storageType.tag === 'plain') {
  //   // console.log('plain value', lookup?.(storageType.value));
  //   // const plainVarialbe = lookup!(storageType.value);
  //   // return <CodecParam variable={plainVarialbe} onChange={onChange} />;
  //   return null;
  // }

  // const keyVariable = lookup!(storageType.value.key);
  // console.log('key', lookup?.(storageType.value.key));
  // console.log('key builder', viewBuilder?.buildDefinition(storageType.value.key));
  // // console.log('value', lookup?.(storageType.value.value));

  // return (
  //   <div>
  //     <CodecParam variable={keyVariable} onChange={onChange} />
  //   </div>
  // );
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
      // api.apis.BabeApi.configuration({})
      api.apis[querie.pallet][querie.storage](querie.args || {}).then(res => {
        console.log('subscription', querie);
        console.log('res', res);
        console.log('res', typeof res);
        setResult(res);
        setIsLoading(false);
      })
        .catch(error => {
          setIsLoading(false);
          console.log('ERROR', error);
        });
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
