import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { InvocationDecoderDynamic } from '@components/decoderDynamic';
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
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

import type { IEventBusRunRecentQuery } from '@custom-types/eventBus';
import type {
  IDecoderDynamicQuery,
  TDecoderDynamicQueryProps,
} from '@custom-types/recentQueries';
import type { EnumVar } from '@polkadot-api/metadata-builders';

const decoderTypes = [
  'Storage',
  'Runtime',
  'Extrinsic',
];

const decoderTypeSelectItems = decoderTypes.map((decoder) => ({
  key: `decoder-${decoder}`,
  label: decoder,
  value: decoder,
}));

const DecoderDynamic = () => {
  const chain = useStoreChain?.use?.chain?.();
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();
  const dynamicBuilder = useDynamicBuilder();

  const [
    queries,
    setQueries,
  ] = useState<IDecoderDynamicQuery[]>([]);

  const [
    callParams,
    setCallParams,
  ] = useState<string>('');
  const [
    decoderType,
    setDecoderType,
  ] = useState<string>(decoderTypes[0]);
  const [
    pallet,
    setPallet,
  ] = useState<string>('');
  const [
    method,
    setMethod,
  ] = useState<string>('');

  const { isOpen, open, close } = useDrawer();

  const palletSelectItems = useMemo(() => {
    if (!metadata) return [];

    switch (decoderType) {
      case 'Storage': {
        const storageItems = metadata?.pallets
          ?.filter((p) => p.storage)
          ?.sort((a, b) => a.name.localeCompare(b.name))
          ?.map((pallet) => ({
            label: pallet.name,
            value: pallet.name,
            key: `chainState-pallet-${pallet.name}`,
          })) || [];

        setPallet(storageItems?.[0]?.value);
        return storageItems;
      }
      case 'Runtime': {
        const runtimeItems = metadata?.apis
          ?.sort((a, b) => a.name.localeCompare(b.name))
          ?.map((api) => ({
            label: api.name,
            value: api.name,
            key: `api-select-${api.name}`,
          })) || [];

        setPallet(runtimeItems?.[0]?.value);
        return runtimeItems;
      }
      case 'Extrinsic': {
        const callItems = metadata?.pallets
          ?.filter((p) => p.calls)
          ?.sort((a, b) => a.name.localeCompare(b.name))
          ?.map((pallet) => ({
            label: pallet.name,
            value: pallet.name,
            key: `extrinsic-pallet-${pallet.name}`,
          })) || [];

        setPallet(callItems?.[0]?.value);
        return callItems;
      }
      default:
        return [];
    }

  }, [
    decoderType,
    metadata,
  ]);

  const methodSelectItems = useMemo(() => {
    if (!metadata || !lookup) return [];

    switch (decoderType) {
      case 'Storage': {
        const storageMethodItems = metadata?.pallets
          ?.find((_pallet) => _pallet.name === pallet)
          ?.storage
          ?.items
          ?.map((item) => ({
            label: item.name,
            value: item.name,
            key: `chainState-call-${item.name}`,
          })) || [];

        setMethod(storageMethodItems?.[0]?.value);
        return storageMethodItems;
      }
      case 'Runtime': {
        const runtimeMethodItems = metadata?.apis
          ?.find((api) => api.name === pallet)
          ?.methods
          ?.map((item) => ({
            label: item.name,
            value: item.name,
            key: `chainState-call-${item.name}`,
          })) || [];

        setMethod(runtimeMethodItems?.[0]?.value);
        return runtimeMethodItems;
      }
      case 'Extrinsic': {
        const extrinsicMethodCalls = metadata?.pallets
          ?.find((_pallet) => _pallet.name === pallet)
          ?.calls;

        if (typeof extrinsicMethodCalls === 'undefined') return [];
        const extrinsicMethodLookup = lookup(extrinsicMethodCalls) as EnumVar;

        const extrinsicMethodItems = Object.entries(extrinsicMethodLookup?.value || {})
          ?.sort((a, b) => a[0].localeCompare(b[0]))
          ?.map((item) => ({
            label: item?.[0],
            value: item?.[0],
            key: `chainState-call-${item?.[0]}`,
          })) || [];

        setMethod(extrinsicMethodItems[0].value);
        return extrinsicMethodItems;
      }
      default:
        return [];
    }

  }, [
    pallet,
    decoderType,
    metadata,
    lookup,
  ]);

  // RESET STATES ON CHAIN CHANGE
  useEffect(() => {
    setQueries([]);
  }, [chain.id]);

  const handleDecoderTypeSelect = useCallback((decoderSelected: string) => {
    setDecoderType(decoderSelected);
  }, []);
  const handlePalletSelect = useCallback((decoderSelected: string) => {
    setPallet(decoderSelected);
  }, []);
  const handleMethodSelect = useCallback((decoderSelected: string) => {
    setMethod(decoderSelected);
  }, []);

  const handleParamChange = useCallback((args: unknown) => {
    setCallParams(args as string);
  }, []);

  const handleDecode = useCallback(() => {
    setQueries((queries) => {
      const newQueries = [...queries];
      newQueries.unshift({
        type: decoderType,
        pallet,
        method,
        args: callParams,
        id: crypto.randomUUID(),
        name: `${decoderType}/${pallet}/${method}`,
      });
      return newQueries;
    });

  }, [
    callParams,
    decoderType,
    pallet,
    method,
  ]);

  useEventBus<IEventBusRunRecentQuery>('@@-recent-query', ({ data }) => {
    console.log(data);
    setQueries((queries) => ([
      {
        type: data.type || 'Unknown',
        pallet: data.pallet || 'Unknown',
        method: data.method || 'Unknown',
        name: `${data.pallet || 'Unknown'}/${data.method || 'Unknown'}`,
        id: crypto.randomUUID(),
        args: JSON.stringify(data.args || {}),
        isCachedQuery: true,
      },
      ...queries,
    ]));
  });

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  if (!dynamicBuilder) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader
        className="mb-10"
        title="Decoder Dynamic"
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
          category={QUERY_CATEGORIES.DECODER_DYNAMIC}
          handleClose={close}
          isOpen={isOpen}
        />
        <QueryFormContainer>
          <div className="grid w-full grid-cols-2 gap-4">
            <PDSelect
              className="col-span-2"
              emptyPlaceHolder="No decoders available"
              items={[decoderTypeSelectItems]}
              label="Select Decoder Type"
              onChange={handleDecoderTypeSelect}
              placeholder="Please select a decoder"
              value={decoderType}
            />
            <PDSelect
              emptyPlaceHolder="No decoders available"
              items={[palletSelectItems]}
              label="Select Pallet"
              onChange={handlePalletSelect}
              placeholder="Please select a pallet"
              value={pallet}
            />
            <PDSelect
              emptyPlaceHolder="No decoders available"
              items={[methodSelectItems]}
              label="Select Method"
              onChange={handleMethodSelect}
              placeholder="Please select a method"
              value={method}
            />
          </div>

          <InvocationDecoderDynamic
            onChange={handleParamChange}
          />

          <QueryButton onClick={handleDecode}>
            Decode
            {' '}
            {decoderType}
            /
            {pallet}
            /
            {method}
          </QueryButton>

        </QueryFormContainer>
        <QueryResultContainer>
          {
            queries.map((query) => (
              <Query
                key={`query-result-${query.id}`}
                onUnsubscribe={handleStorageUnsubscribe}
                querie={query}
              />
            ))
          }
        </QueryResultContainer>
      </QueryViewContainer>
    </>
  );
};

export default DecoderDynamic;

const Query = (
  {
    querie,
    onUnsubscribe,
  }: TDecoderDynamicQueryProps) => {
  const dynamicBuilder = useDynamicBuilder();
  const chain = useStoreChain.use.chain?.();

  const [
    result,
    setResult,
  ] = useState<unknown>();

  useEffect(() => {
    const catchError = (err?: Error) => {
      setResult(err?.message || 'Unexpected Error');
    };

    // save to recent queries
    if (!querie.isCachedQuery) {
      void addRecentQuerieToStorage({
        querie,
        chainId: chain.id,
        category: QUERY_CATEGORIES.DECODER_DYNAMIC,
      });
    }

    try {
      switch (querie.type) {
        case 'Storage':
          setResult(dynamicBuilder?.buildStorage(querie.pallet, querie.method)
            .dec(querie.args));
          break;

        case 'Runtime':
          setResult(dynamicBuilder?.buildRuntimeCall(querie.pallet, querie.method)
            .value
            .dec(querie.args));
          break;

        case 'Extrinsic':
          setResult(dynamicBuilder?.buildCall(querie.pallet, querie.method)
            .codec
            .dec(`0x${querie.args.slice(6)}`)); /* Remove the pallet/method location hex value from the args */
          break;

        default:
          catchError();
          break;
      }

    } catch (error) {
      catchError(error as Error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querie]);

  const handleUnsubscribe = useCallback(() => {
    onUnsubscribe(querie.id);
  }, [
    querie,
    onUnsubscribe,
  ]);

  return (
    <QueryResult
      onRemove={handleUnsubscribe}
      path={querie.name}
      result={result}
      title="Decoded"
    />
  );
};
