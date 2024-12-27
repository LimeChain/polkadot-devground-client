import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { InvocationDecoder } from '@components/decoder';
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
import { decoders } from '@constants/decoders';
import { QUERY_CATEGORIES } from '@constants/recentQueries';
import { useStoreChain } from '@stores';
import {
  blockHeaderCodec,
  decodeExtrinsic,
  metadataCodec,
} from '@utils/codec';
import { cn } from '@utils/helpers';
import { addRecentQuerieToStorage } from '@utils/recentQueries';
import { useDrawer } from 'src/hooks/useDrawer';

import type { IEventBusRunRecentQuery } from '@custom-types/eventBus';
import type {
  IDecoderQuery,
  IQueryParam,
  TDecoderQueryProps,
} from '@custom-types/recentQueries';

const decoderSelectItems = Object.keys(decoders).map((decoder) => ({
  key: `decoder-${decoder}`,
  label: decoder,
  value: decoder,
}));

const Decoder = () => {
  const chain = useStoreChain?.use?.chain?.();
  const metadata = useStoreChain?.use?.metadata?.();

  const [
    decoder,
    setDecoder,
  ] = useState(decoderSelectItems.at(0)!.value);
  const [
    queries,
    setQueries,
  ] = useState<IDecoderQuery[]>([]);

  const [
    decoderFields,
    setDecoderFields,
  ] = useState<IQueryParam[]>([]);

  const { isOpen, open, close } = useDrawer();

  useEffect(() => {
    if (decoder) {
      setDecoderFields(decoders[decoder]
        .params
        .map((param) => ({
          key: param.name,
          value: undefined,
        })),
      );
    }
  }, [decoder]);

  // RESET STATES ON CHAIN CHANGE
  useEffect(() => {
    setQueries([]);
  }, [chain.id]);

  const handleOnDecoderChange = useCallback((decoderSelected: string) => {
    setDecoder(decoderSelected);
  }, []);

  const handleOnChange = useCallback((index: number, args: unknown) => {
    setDecoderFields((params) => {
      if (!params || params.length === 0) {
        return [];
      } else {
        const newParams = [...params];
        newParams[index].value = args;
        return newParams;
      }
    });
  }, []);

  useEventBus<IEventBusRunRecentQuery>('@@-recent-query', ({ data }) => {
    setQueries((queries) => ([
      {
        decoder: data.decoder as string,
        id: crypto.randomUUID(),
        args: data.args as IQueryParam[] || [],
        isCachedQuery: true,
      },
      ...queries,
    ]));
  });

  const handleDecode = useCallback(() => {
    setQueries((queries) => {
      const newQueries = [...queries];
      newQueries.unshift({
        decoder,
        args: decoderFields,
        id: crypto.randomUUID(),
      });
      return newQueries;
    });

  }, [
    decoderFields,
    decoder,
  ]);

  const handleOnUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  if (!metadata) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader
        className="mb-10"
        title="Decoder"
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
          category={QUERY_CATEGORIES.DECODER}
          handleClose={close}
          isOpen={isOpen}
        />
        <QueryFormContainer>
          <div className="grid w-full grid-cols-1 gap-4">
            <PDSelect
              emptyPlaceHolder="No decoders available"
              items={[decoderSelectItems]}
              label="Select Decoder"
              onChange={handleOnDecoderChange}
              placeholder="Please select a decoder"
              value={decoder}
            />
          </div>

          {
            decoder
            && decoders?.[decoder]?.params?.length > 0 && (
              <InvocationDecoder
                key={`decoder-${decoder}`}
                fields={decoders[decoder].params}
                onChange={handleOnChange}
              />
            )
          }

          <QueryButton onClick={handleDecode}>
            Decode
            {' '}
            {decoder}
          </QueryButton>

        </QueryFormContainer>
        <QueryResultContainer>
          {
            queries.map((query) => (
              <Query
                key={`query-result-${query.decoder}-${query.id}`}
                onUnsubscribe={handleOnUnsubscribe}
                querie={query}
              />
            ))
          }
        </QueryResultContainer>
      </QueryViewContainer>
    </>
  );
};

export default Decoder;

const Query = (
  {
    querie,
    onUnsubscribe,
  }: TDecoderQueryProps) => {
  const [
    result,
    setResult,
  ] = useState<unknown>();

  const chain = useStoreChain.use.chain?.();

  useEffect(() => {
    const catchError = (err?: Error) => {
      setResult(err?.message || 'Unexpected Error');
    };

    if (!querie.isCachedQuery) {
      void addRecentQuerieToStorage({
        querie,
        chainId: chain.id,
        category: QUERY_CATEGORIES.DECODER,
      });
    }

    try {
      switch (querie.decoder) {
        case 'blockHeader':
          setResult(blockHeaderCodec.dec(querie.args.at(0)?.value as string));
          break;

        case 'extrinsics':
          setResult((querie.args.at(0)?.value as string[])
            ?.map((extrinsic) => decodeExtrinsic(extrinsic)));
          break;

        case 'metadata':
          setResult(metadataCodec.dec(querie.args.at(0)?.value as string));
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
      path={querie.decoder}
      result={result}
      title="Decoded"
    />
  );
};
