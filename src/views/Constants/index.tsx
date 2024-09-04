import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PalletSelect } from '@components/palletSelect';
import { useStoreChain } from '@stores';

import type { TRelayApi } from '@custom-types/chain';

const Constants = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();

  const palletsWithConstants = useMemo(() => metadata?.pallets?.filter(p => p.constants.length > 0), [metadata]);
  const [palletSelected, setPalletSelected] = useState(palletsWithConstants?.at(0));

  const calls = useMemo(() => {
    if (palletSelected) {
      return palletSelected.constants?.map(item => ({
        label: item.name,
        value: item.name,
      }));
    }
    return undefined;
  }, [palletSelected]);
  const [constantSelected, setConstantSelected] = useState(palletSelected?.constants?.at?.(0));

  const [queries, setQueries] = useState<{ pallet: string; storage: string; id: string }[]>([]);

  useEffect(() => {
    if (palletsWithConstants) {
      const defaultPalletSelected = palletsWithConstants[0];
      setPalletSelected(defaultPalletSelected);
      setConstantSelected(defaultPalletSelected?.constants.at?.(0));
    }
  }, [palletsWithConstants]);

  const handlePalletSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (palletsWithConstants) {
      const selectedPallet = palletsWithConstants[Number(e.target.value)];
      setPalletSelected(selectedPallet);
      setConstantSelected(selectedPallet.constants.at(0));
    }
  }, [palletsWithConstants]);

  const handleCallSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (palletSelected) {
      const selectedStoragelName = e.target.value;
      const selectedStorage = palletSelected.constants.find(item => item.name === selectedStoragelName);
      setConstantSelected(selectedStorage);
    }
  }, [palletSelected]);

  const handleStorageQuerySubmit = useCallback(() => {
    setQueries(queries => ([{
      pallet: palletSelected!.name,
      storage: constantSelected!.name,
      id: crypto.randomUUID(),
    }, ...queries]));
  }, [palletSelected, constantSelected]);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries(queries => queries.filter(query => query.id !== id));
  }, []);

  if (!metadata || !lookup || !palletsWithConstants) {
    return 'Loading...';
  }

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-4">
        <PalletSelect pallets={palletsWithConstants} onPalletSelect={handlePalletSelect} />
        {
          calls
          && <StorageSelect calls={calls} onStorageSelect={handleCallSelect} />
        }
      </div>
      <br />
      <button
        type="button"
        className="block w-fit cursor-pointer border p-2 disabled:cursor-not-allowed disabled:opacity-30"
        onClick={handleStorageQuerySubmit}
      >
        Query Constant
      </button>
      <br />
      <div className="rounded-xl border p-2 empty:hidden">
        {
          constantSelected?.docs?.map((doc, i) => <p key={`doc-${i}`} className="pb-2 last:pb-0">{doc}</p>)
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
              onUnsubscribe={handleStorageUnsubscribe}
            />
          ))
        }
      </div>
    </>
  );
};

export default Constants;

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

const QueryResult = (
  {
    querie,
    onUnsubscribe,
  }: {
    querie: { pallet: string; storage: string; id: string };
    onUnsubscribe: (id: string) => void;
  }) => {
  const api = useStoreChain?.use?.api?.() as TRelayApi;

  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);

  console.log('query', querie);

  useEffect(() => {
    if (api) {
      // api.constants.Babe.EpochDuration()
      api.constants[querie.pallet][querie.storage]?.().then(res => {
        console.log('res', res);
        console.log('res', typeof res);
        setResult(res);
        setIsLoading(false);
      })
        .catch(err => {
          setIsLoading(false);
          console.log('ERROR', err);
        });
      // subscription.id = querie.id;
      // onSubscribe(subscription);

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
