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
import { QueryResult } from '@components/callParam/QueryResult';
import { QueryResultContainer } from '@components/callParam/QueryResultContainer';
import { QueryViewContainer } from '@components/callParam/QueryViewContainer';
import { Loader } from '@components/loader';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';

import type { TRelayApi } from '@custom-types/chain';

const RuntimeCalls = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const chain = useStoreChain?.use?.chain?.();

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

  useEffect(() => {
    setQueries([]);
    setApiSelected(undefined);
    setCallArgs(undefined);
  }, [chain.id]);

  useEffect(() => {
    if (apis) {
      const defaultApiSelected = apis[0];
      setApiSelected(defaultApiSelected);
      setMethodSelected(defaultApiSelected?.methods?.sort((a, b) => a.name.localeCompare(b.name)).at?.(0));
    }
  }, [apis]);

  const handlePalletSelect = useCallback((palletSelectedName: string) => {
    if (apis) {
      const selectedMethod = apis.find(api => api.name === palletSelectedName);

      if (selectedMethod) {
        setApiSelected(selectedMethod);
        setMethodSelected(selectedMethod.methods?.sort((a, b) => a.name.localeCompare(b.name)).at(0));
        setCallArgs(undefined);
      }
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
    if (apiSelected?.name && methodSelected?.name) {
      setQueries(queries => ([{
        pallet: apiSelected.name,
        storage: methodSelected.name,
        id: crypto.randomUUID(),
        args: callArgs,
      }, ...queries]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSelected, methodSelected, callArgs]);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries(queries => queries.filter(query => query.id !== id));
  }, []);

  if (!apiSelected) {
    return <Loader />;
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
            <Query
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

const Query = ({
  querie,
  onUnsubscribe,
}: {
  querie: { pallet: string; storage: string; id: string; args: unknown };
  onUnsubscribe: (id: string) => void;
}) => {
  const api = useStoreChain?.use?.api?.() as TRelayApi;
  const [result, setResult] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const catchError = (err: Error) => {
      setIsLoading(false);
      setResult(err?.message || 'Unexpected Error');
    };

    if (api) {
      try {
        api.apis[querie.pallet][querie.storage](...Object.values(querie.args as object)).then((res: unknown) => {
          setResult(res);
          setIsLoading(false);
        })
          .catch(catchError);

      } catch (error) {
        catchError(error as Error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querie, api]);

  const handleUnsubscribe = useCallback(() => {
    onUnsubscribe(querie.id);
  }, [querie, onUnsubscribe]);

  return (
    <QueryResult
      title="Runtime Call"
      path={`${querie.pallet}/${querie.storage}`}
      isLoading={isLoading}
      result={result}
      onRemove={handleUnsubscribe}
    />
  );
};
