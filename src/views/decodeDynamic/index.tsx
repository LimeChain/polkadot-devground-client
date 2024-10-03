import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DecoderDynamicParams } from '@components/callParam/decoderDynamicParam';
import { QueryButton } from '@components/callParam/queryButton';
import { QueryFormContainer } from '@components/callParam/queryFormContainer';
import { QueryResult } from '@components/callParam/queryResult';
import { QueryResultContainer } from '@components/callParam/queryResultContainer';
import { QueryViewContainer } from '@components/callParam/queryViewContainer';
import { Loader } from '@components/loader';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

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

interface IQuery {
  type: string;
  pallet: string;
  method: string;
  id: string;
  args: string;
}

const DecoderDynamic = () => {
  const chain = useStoreChain?.use?.chain?.();
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();
  const dynamicBuilder = useDynamicBuilder();

  const [
    queries,
    setQueries,
  ] = useState<IQuery[]>([]);
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

  const palletSelectItems = useMemo(() => {
    if (!metadata) return [];

    switch (decoderType) {
      case 'Storage':
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

      case 'Runtime':
        const runtimeItems = metadata?.apis
          ?.sort((a, b) => a.name.localeCompare(b.name))
          ?.map((api) => ({
            label: api.name,
            value: api.name,
            key: `api-select-${api.name}`,
          })) || [];

        setPallet(runtimeItems?.[0]?.value);
        return runtimeItems;

      case 'Extrinsic':
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
      case 'Storage':
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

      case 'Runtime':
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

      case 'Extrinsic':
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
    setQueries((queries) => ([
      {
        type: decoderType,
        pallet,
        method,
        args: callParams,
        id: crypto.randomUUID(),
      },
      ...queries,
    ]));

  }, [
    callParams,
    decoderType,
    pallet,
    method,
  ]);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  if (!dynamicBuilder) {
    return <Loader />;
  }

  return (
    <QueryViewContainer>
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

        <DecoderDynamicParams
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
  );
};

export default DecoderDynamic;

const Query = (
  {
    querie,
    onUnsubscribe,
  }: {
    querie: IQuery;
    onUnsubscribe: (id: string) => void;
  }) => {
  const dynamicBuilder = useDynamicBuilder();

  const [
    result,
    setResult,
  ] = useState<unknown>();

  useEffect(() => {
    const catchError = (err?: Error) => {
      setResult(err?.message || 'Unexpected Error');
    };

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
      path={`${querie.type}/${querie.pallet}/${querie.method}`}
      result={result}
      title="Decoded"
    />
  );
};
