import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CallDocs } from '@components/callParam/CallDocs';
import { QueryButton } from '@components/callParam/QueryButton';
import { QueryFormContainer } from '@components/callParam/QueryFormContainer';
import { QueryResultContainer } from '@components/callParam/QueryResultContainer';
import { QueryViewContainer } from '@components/callParam/QueryViewContainer';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';

import type { TRelayApi } from '@custom-types/chain';

const Constants = () => {
  const metadata = useStoreChain?.use?.metadata?.();

  const palletsWithConstants = useMemo(() => metadata?.pallets?.filter(p => p.constants.length > 0)
    ?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const palletSelectItems = useMemo(() => palletsWithConstants?.map(pallet => ({
    label: pallet.name,
    value: pallet.name,
    key: `pallet-select-${pallet.name}`,
  })), [palletsWithConstants]);

  const [palletSelected, setPalletSelected] = useState(palletsWithConstants?.at(0));

  const constants = useMemo(() => palletSelected?.constants
    ?.sort((a, b) => a.name.localeCompare(b.name)), [palletSelected]);
  const constantItems = useMemo(() => {
    if (palletSelected) {
      return constants?.map(item => ({
        label: item.name,
        value: item.name,
        key: `constant-select-${item.name}`,
      }));
    }
    return undefined;
  }, [constants, palletSelected]);
  const [constantSelected, setConstantSelected] = useState(palletSelected?.constants?.at?.(0));

  const [queries, setQueries] = useState<{ pallet: string; storage: string; id: string }[]>([]);

  useEffect(() => {
    if (palletsWithConstants) {
      const defaultPalletSelected = palletsWithConstants[0];
      setPalletSelected(defaultPalletSelected);
      setConstantSelected(defaultPalletSelected?.constants.at?.(0));
    }
  }, [palletsWithConstants]);

  const handlePalletSelect = useCallback((selectedPalletName: string) => {
    if (palletsWithConstants) {
      const selectedPallet = palletsWithConstants.find(pallet => pallet.name === selectedPalletName);
      setPalletSelected(selectedPallet);
      setConstantSelected(selectedPallet!.constants.at(0));
    }
  }, [palletsWithConstants]);

  const handleConstantSelect = useCallback((constantSelectedName: string) => {
    if (palletSelected) {
      const selectedStorage = palletSelected.constants.find(constant => constant.name === constantSelectedName);
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

  if (!palletsWithConstants) {
    return 'Loading...';
  }

  return (
    <QueryViewContainer>
      <QueryFormContainer>
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
            constantItems
          && (
            <PDSelect
              label="Select Constant"
              emptyPlaceHolder="No constants available"
              placeholder="Please select constant"
              items={constantItems}
              value={constantSelected?.name}
              onChange={handleConstantSelect}
            />
          )
          }
        </div>

        <CallDocs docs={constantSelected?.docs?.filter(d => d) || []} />

        <QueryButton onClick={handleStorageQuerySubmit}>
          Query {palletSelected?.name}/{constantSelected?.name}
        </QueryButton>

      </QueryFormContainer>
      <QueryResultContainer>
        {
          queries.map((query) => (
            <QueryResult
              key={`query-result-${query.pallet}-${query.storage}-${query.id}`}
              querie={query}
              onUnsubscribe={handleStorageUnsubscribe}
            />
          ))
        }
      </QueryResultContainer>
    </QueryViewContainer>
  );
};

export default Constants;

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
