import { Binary } from 'polkadot-api';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MethodArgs } from '@components/callParam/apiMethodArgs';
import { CallDocs } from '@components/callParam/callDocs';
import { QueryButton } from '@components/callParam/queryButton';
import { QueryFormContainer } from '@components/callParam/queryFormContainer';
import { QueryResult } from '@components/callParam/queryResult';
import { QueryResultContainer } from '@components/callParam/queryResultContainer';
import { QueryViewContainer } from '@components/callParam/queryViewContainer';
import { Loader } from '@components/loader';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

import type { TRelayApi } from '@custom-types/chain';

const RuntimeCalls = () => {
  const dynamicBulder = useDynamicBuilder();

  const metadata = useStoreChain?.use?.metadata?.();
  const chain = useStoreChain?.use?.chain?.();

  const apis = useMemo(() => metadata?.apis?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const apiItems = useMemo(() => apis?.map((api) => ({
    label: api.name,
    value: api.name,
    key: `api-select-${api.name}`,
  })), [apis]);

  const [
    apiSelected,
    setApiSelected,
  ] = useState(apis?.at(0));

  const apiMethods = useMemo(() => apiSelected?.methods?.sort((a, b) => a.name.localeCompare(b.name)) || [], [apiSelected]);
  const methodItems = useMemo(() => apiMethods?.map((item) => ({
    label: item.name,
    value: item.name,
    key: `method-select-${item.name}`,
  })), [apiMethods]);

  const [
    methodSelected,
    setMethodSelected,
  ] = useState(apiSelected?.methods.at(0));
  const [
    encodedCall, 
    setEncodedCall,
  ] = useState<Binary>(Binary.fromHex('0x'));
  const [
    callArgs,
    setCallArgs,
  ] = useState<unknown>(undefined);
  const [
    queries,
    setQueries,
  ] = useState<{ pallet: string; storage: string; id: string; args: unknown }[]>([]);

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
      const selectedMethod = apis.find((api) => api.name === palletSelectedName);

      if (selectedMethod) {
        setApiSelected(selectedMethod);
        setMethodSelected(selectedMethod.methods?.sort((a, b) => a.name.localeCompare(b.name)).at(0));
        setCallArgs(undefined);
      }
    }
  }, [apis]);

  const handleCallSelect = useCallback((callSelectedName: string) => {
    if (apiSelected) {
      const selectedStorage = apiSelected.methods.find((item) => item.name === callSelectedName);
      setMethodSelected(selectedStorage);
      setCallArgs(undefined);
    }
  }, [apiSelected]);

  const handleStorageQuerySubmit = useCallback(() => {
    if (apiSelected?.name && methodSelected?.name) {
      setQueries((queries) => ([
        {
          pallet: apiSelected.name,
          storage: methodSelected.name,
          id: crypto.randomUUID(),
          args: callArgs,
        },
        ...queries,
      ]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    apiSelected,
    methodSelected,
    callArgs,
  ]);

  useEffect(() => {
    if (dynamicBulder && apiSelected?.name && methodSelected?.name) {
      try {
        const callCodec = dynamicBulder?.buildRuntimeCall(
          apiSelected.name,
          methodSelected.name,
        ).args.enc(Object.values(callArgs || {} as object));

        const _encodedCall = Binary.fromBytes(callCodec);
        setEncodedCall(_encodedCall);

      } catch (err) {
        setEncodedCall(Binary.fromHex('0x'));
        console.log(err);
      }
    }

  }, [apiSelected, methodSelected, callArgs, dynamicBulder]);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  if (!apiSelected) {
    return <Loader />;
  }

  return (
    <QueryViewContainer>
      <QueryFormContainer>
        <div className="grid w-full grid-cols-2 gap-4">
          <PDSelect
            emptyPlaceHolder="No apis available"
            label="Select Api"
            items={[apiItems || []]}
            value={apiSelected?.name}
            onChange={handlePalletSelect}
          />

          {
            methodItems && (
              <PDSelect
                key={`method-select-${methodSelected?.name}`}
                emptyPlaceHolder="No methods available"
                label="Select Method"
                items={[methodItems]}
                value={methodSelected?.name}
                onChange={handleCallSelect}
              />
            )
          }
        </div>

        {
          methodSelected && (
            <MethodArgs
              key={`method-select-${methodSelected?.name}`}
              method={methodSelected}
              onChange={setCallArgs}
            />
          )
        }

        <CallDocs docs={methodSelected?.docs?.filter((d) => d) || []} />

        <QueryButton onClick={handleStorageQuerySubmit}>
          Call 
          {' '}
          {apiSelected?.name}
          /
          {methodSelected?.name}
        </QueryButton>

        {
          encodedCall && (
            <p className="break-all">
              Encoded Call: <br /> {encodedCall.asHex()}
            </p>
          )
        }

      </QueryFormContainer>
      <QueryResultContainer>
        {
          queries.map((query) => (
            <Query
              key={`query-result-${query.pallet}-${query.storage}-${query.id}`}
              onUnsubscribe={handleStorageUnsubscribe}
              querie={query}
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
        (api.apis as any)[querie.pallet][querie.storage](...Object.values(querie.args as object))
          .then((res: unknown) => {
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
      path={`${querie.pallet}/${querie.storage}`}
      result={result}
      title="Runtime Call"
    />
  );
};
