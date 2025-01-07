import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CallDocs } from '@components/callDocs';
import { RecentQueriesDrawer } from '@components/drawers/recentQueries';
import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
import { PageHeader } from '@components/pageHeader';
import { QueryButton } from '@components/papiQuery/queryButton';
import { QueryFormContainer } from '@components/papiQuery/queryFormContainer';
import { QueryResult } from '@components/papiQuery/queryResult';
import { QueryResultContainer } from '@components/papiQuery/queryResultContainer';
import { QueryViewContainer } from '@components/papiQuery/queryViewContainer';
import { PDSelect } from '@components/pdSelect';
import { QUERY_CATEGORIES } from '@constants/recentQueries';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';
import { addRecentQuerieToStorage } from '@utils/recentQueries';
import { useDrawer } from 'src/hooks/useDrawer';

import type { TRelayApi } from '@custom-types/chain';
import type { IEventBusRunRecentQuery } from '@custom-types/eventBus';
import type {
  TConstantsQueryProps,
  TRequiredQuery,
} from '@custom-types/recentQueries';

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
  ] = useState<TRequiredQuery[]>([]);

  const { isOpen, open, close } = useDrawer();

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

  const handleQuerySubmit = useCallback(() => {
    if (palletSelected?.name && constantSelected?.name) {
      setQueries((queries) => {
        const newQueries = [...queries];
        newQueries.unshift({
          pallet: palletSelected.name,
          storage: constantSelected.name,
          id: crypto.randomUUID(),
          args: {},
          name: `${palletSelected.name}/${constantSelected.name}`,
        });
        return newQueries;
      });
    }
  }, [
    palletSelected,
    constantSelected,
  ]);

  useEventBus<IEventBusRunRecentQuery>('@@-recent-query', ({ data }) => {
    setQueries((prevQueries) => ([
      {
        name: `${data.pallet}/${data.storage}`,
        pallet: data.pallet,
        storage: data.storage,
        id: crypto.randomUUID(),
        args: data?.args || {},
        isCachedQuery: true,
      },
      ...prevQueries,
    ]));
  });

  const handleUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  if (!palletSelected) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader
        className="mb-10"
        title="Constants"
      >
        <div
          onClick={open}
          className={cn(
            'cursor-pointer duration-300 ease-out',
            'bg-dev-purple-700 p-2 dark:bg-dev-purple-50',
            'hover:bg-dev-purple-900 hover:dark:bg-dev-purple-200',
          )}
        >
          <Icon
            className="text-dev-white-200 dark:text-dev-purple-700"
            name="icon-history"
          />
        </div>
      </PageHeader>
      <QueryViewContainer>
        <RecentQueriesDrawer
          category={QUERY_CATEGORIES.CONSTANTS}
          handleClose={close}
          isOpen={isOpen}
        />
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

          <QueryButton onClick={handleQuerySubmit}>
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
                onUnsubscribe={handleUnsubscribe}
                querie={query}
              />
            ))
          }
        </QueryResultContainer>
      </QueryViewContainer>
    </>
  );
};

export default Constants;

const Query = (
  {
    querie,
    onUnsubscribe,
  }: TConstantsQueryProps) => {
  const api = useStoreChain?.use?.api?.() as TRelayApi;

  const chain = useStoreChain?.use?.chain?.();

  const [
    result,
    setResult,
  ] = useState<unknown>();
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  useEffect(() => {
    void (async () => {
      const catchError = (err: Error) => {
        setIsLoading(false);
        setResult(err?.message || 'Unexpected Error');
      };

      // save to recent queries
      if (!querie.isCachedQuery) {
        void addRecentQuerieToStorage({
          querie,
          chainId: chain.id,
          category: QUERY_CATEGORIES.CONSTANTS,
        });
      }

      if (api) {
        try {
          if (querie.pallet && querie.storage) {
            // @TODO: fix types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (api.constants as any)[querie.pallet][querie.storage]?.()
              .then((res: unknown) => {
                setResult(res);
                setIsLoading(false);
              })
              .catch(catchError);
          }
        } catch (error) {
          catchError(error as Error);
        }
      }
    })()
      .catch(console.log);

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
      path={querie.name}
      result={result}
      title="Constant"
    />
  );
};
