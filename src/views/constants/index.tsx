import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CallDocs } from '@components/callParam/callDocs';
import { QueryButton } from '@components/callParam/queryButton';
import { QueryFormContainer } from '@components/callParam/queryFormContainer';
import { QueryResult } from '@components/callParam/queryResult';
import { QueryResultContainer } from '@components/callParam/queryResultContainer';
import { QueryViewContainer } from '@components/callParam/queryViewContainer';
import { Loader } from '@components/loader';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';

import type { TRelayApi } from '@custom-types/chain';

const Constants = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const chain = useStoreChain?.use?.chain?.();

  const palletsWithConstants = useMemo(() => metadata?.pallets?.filter((p) => p.constants.length > 0)?.sort((a, b) => a.name.localeCompare(b.name)), [metadata]);
  const palletSelectItems = useMemo(() => palletsWithConstants?.map((pallet) => ({
    label: pallet.name,
    value: pallet.name,
    key: `pallet-select-${pallet.name}`,
  })), [palletsWithConstants]);

  const [
    palletSelected,
    setPalletSelected,
  ] = useState(palletsWithConstants?.at(0));

  const constants = useMemo(() => palletSelected?.constants?.sort((a, b) => a.name.localeCompare(b.name)), [palletSelected]);
  const constantItems = useMemo(() => {
    if (palletSelected) {
      return constants?.map((item) => ({
        label: item.name,
        value: item.name,
        key: `constant-select-${item.name}`,
      }));
    }
    return undefined;
  }, [
    constants,
    palletSelected,
  ]);

  const [
    constantSelected,
    setConstantSelected,
  ] = useState(palletSelected?.constants?.at?.(0));
  const [
    queries,
    setQueries,
  ] = useState<{ pallet: string; storage: string; id: string }[]>([]);

  useEffect(() => {
    setQueries([]);
    setPalletSelected(undefined);
  }, [chain.id]);

  useEffect(() => {
    if (palletsWithConstants) {
      const defaultPalletSelected = palletsWithConstants[0];
      setPalletSelected(defaultPalletSelected);
      setConstantSelected(defaultPalletSelected?.constants?.sort((a, b) => a.name.localeCompare(b.name)).at?.(0));
    }
  }, [palletsWithConstants]);

  const handlePalletSelect = useCallback((selectedPalletName: string) => {
    if (palletsWithConstants) {
      const selectedPallet = palletsWithConstants.find((pallet) => pallet.name === selectedPalletName);

      if (selectedPallet) {
        setPalletSelected(selectedPallet);
        setConstantSelected(selectedPallet.constants?.sort((a, b) => a.name.localeCompare(b.name)).at(0));
      }
    }
  }, [palletsWithConstants]);

  const handleConstantSelect = useCallback((constantSelectedName: string) => {
    if (palletSelected) {
      const selectedStorage = palletSelected.constants.find((constant) => constant.name === constantSelectedName);
      setConstantSelected(selectedStorage);
    }
  }, [palletSelected]);

  const handleStorageQuerySubmit = useCallback(() => {
    if (palletSelected?.name && constantSelected?.name) {
      setQueries((queries) => ([
        {
          pallet: palletSelected.name,
          storage: constantSelected.name,
          id: crypto.randomUUID(),
        },
        ...queries,
      ]));
    }
  }, [
    palletSelected,
    constantSelected,
  ]);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

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
            constantItems && (
              <PDSelect
                key={`storage-select-${palletSelected?.name}`}
                emptyPlaceHolder="No constants available"
                items={[constantItems]}
                label="Select Constant"
                onChange={handleConstantSelect}
                placeholder="Please select constant"
                value={constantSelected?.name}
              />
            )
          }
        </div>

        <CallDocs docs={constantSelected?.docs?.filter((d) => d) || []} />

        <QueryButton onClick={handleStorageQuerySubmit}>
          Query
          {' '}
          {palletSelected?.name}
          /
          {constantSelected?.name}
        </QueryButton>

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

export default Constants;

const Query = (
  {
    querie,
    onUnsubscribe,
  }: {
    querie: { pallet: string; storage: string; id: string };
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
        (api.constants as any)[querie.pallet][querie.storage]?.()
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
      title="Constant"
    />
  );
};
