import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MethodArgs } from '@components/callParam/ApiMethodArgs';
import { CallDocs } from '@components/callParam/CallDocs';
import { QueryButton } from '@components/callParam/QueryButton';
import { QueryFormContainer } from '@components/callParam/QueryFormContainer';
import { QueryResultContainer } from '@components/callParam/QueryResultContainer';
import { QueryViewContainer } from '@components/callParam/QueryViewContainer';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';

import type { TRelayApi } from '@custom-types/chain';

interface ISubscription {
  unsubscribe: () => void;
  id?: string;
}

const RuntimeCalls = () => {
  const metadata = useStoreChain?.use?.metadata?.();

  const apis = useMemo(() => metadata?.apis?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const apiItems = useMemo(() => apis?.map(api => ({
    label: api.name,
    value: api.name,
    key: `api-select-${api.name}`,
  })), [apis]);
  const [apiSelected, setApiSelected] = useState(apis?.at(0));

  const apiMethods = useMemo(() => apiSelected?.methods?.sort((a, b) => a.name.localeCompare(b.name)) || [], [apiSelected]);
  const methodItems = useMemo(() => apiMethods?.map(item => ({
    label: item.name,
    value: item.name,
    key: `method-select-${item.name}`,
  })), [apiMethods]);
  const [methodSelected, setMethodSelected] = useState(apiSelected?.methods.at(0));

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
    if (apis) {
      const defaultApiSelected = apis[0];
      setApiSelected(defaultApiSelected);
      setMethodSelected(defaultApiSelected?.methods.at?.(0));
    }
  }, [apis]);

  const handlePalletSelect = useCallback((palletSelectedName: string) => {
    if (apis) {
      const selectedMethod = apis.find(api => api.name === palletSelectedName);
      setApiSelected(selectedMethod);
      setMethodSelected(selectedMethod!.methods.at(0));
      setCallArgs(undefined);
    }
  }, [apis]);

  const handleCallSelect = useCallback((callSelectedName: string) => {
    if (apiSelected) {
      const selectedStorage = apiSelected.methods.find(item => item.name === callSelectedName);
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

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries(queries => queries.filter(query => query.id !== id));

    const subscriptionToCancel = subscriptions.find(sub => sub.id === id);
    if (subscriptionToCancel) {
      subscriptionToCancel.unsubscribe();
      setSubscriptions(subs => subs.filter(sub => sub.id !== id));
    }
  }, [subscriptions]);

  if (!apis) {
    return 'Loading...';
  }

  return (
    <QueryViewContainer>
      <QueryFormContainer>
        <div className="grid w-full grid-cols-2 gap-4">
          <PDSelect
            label="Select Api"
            emptyPlaceHolder="No apis available"
            items={apiItems}
            value={apiSelected?.name}
            onChange={handlePalletSelect}
          />

          {
            methodItems
            && (
              <PDSelect
                key={`method-select-${methodSelected?.name}`}
                label="Select Method"
                emptyPlaceHolder="No methods available"
                items={methodItems}
                value={methodSelected?.name}
                onChange={handleCallSelect}
              />
            )
          }
        </div>

        {
          methodSelected
          && (
            <MethodArgs
              key={`method-select-${methodSelected?.name}`}
              method={methodSelected}
              onChange={setCallArgs}
            />
          )
        }

        <CallDocs docs={methodSelected?.docs?.filter(d => d) || []} />

        <QueryButton onClick={handleStorageQuerySubmit}>
          Call {apiSelected?.name}/{methodSelected?.name}
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

export default RuntimeCalls;

const QueryResult = ({
  querie,
  onUnsubscribe,
}: {
  querie: { pallet: string; storage: string; id: string; args: unknown };
  onUnsubscribe: (id: string) => void;
}) => {
  const api = useStoreChain?.use?.api?.() as TRelayApi;
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (api) {
      // api.apis.MmrApi.verify_proof([],{})
      api.apis[querie.pallet][querie.storage](...Object.values(querie.args)).then(res => {
        console.log('response', res);
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
