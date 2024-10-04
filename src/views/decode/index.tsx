import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { QueryButton } from '@components/callParam/queryButton';
import { QueryFormContainer } from '@components/callParam/queryFormContainer';
import { QueryResult } from '@components/callParam/queryResult';
import { QueryResultContainer } from '@components/callParam/queryResultContainer';
import { QueryViewContainer } from '@components/callParam/queryViewContainer';
import { Loader } from '@components/loader';
import { PDSelect } from '@components/pdSelect';
import { useStoreChain } from '@stores';
import { decoders } from '@constants/decoders';
import { DecoderParams } from '@components/callParam/decoderParams';
import { blockHeaderCodec, decodeExtrinsic, metadataCodec } from '@utils/codec';

const decoderSelectItems = Object.keys(decoders).map(decoder => ({
  key: `decoder-${decoder}`,
  label: decoder,
  value: decoder
}))

interface IDecoderParam {
  name: string;
  value: unknown;
}
interface IQuery {
  decoder: string;
  id: string;
  args: IDecoderParam[];
}

const Decoder = () => {
  const chain = useStoreChain?.use?.chain?.();
  const metadata = useStoreChain?.use?.metadata?.();

  const [
    decoder,
    setDecoder,
  ] = useState(decoderSelectItems.at(0)!.value)
  const [
    queries,
    setQueries,
  ] = useState<IQuery[]>([])
  const [
    callParams,
    setCallParams,
  ] = useState<IDecoderParam[]>([]);

  useEffect(() => {
    if (decoder) {
      setCallParams(decoders[decoder].params.map(param => ({ name: param.name, value: undefined })))
    }
  }, [decoder])

  // RESET STATES ON CHAIN CHANGE
  useEffect(() => {
    setQueries([]);
  }, [chain.id]);

  const handleDecoderSelect = useCallback((decoderSelected: string) => {
    setDecoder(decoderSelected)
  }, [])

  const handleRpcParamChange = useCallback((index: number, args: unknown) => {
    setCallParams((params) => {
      if (!params || params.length === 0) {
        return [];
      }
      return params.with(
        index,
        {
          name: params?.[index]?.name,
          value: args,
        },
      );
    });
  }, []);

  const handleDecode = useCallback(() => {
    setQueries((queries) => ([
      {
        decoder: decoder,
        args: callParams,
        id: crypto.randomUUID(),
      },
      ...queries,
    ]));

  }, [
    callParams,
    decoder
  ]);

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  if (!metadata) {
    return <Loader />;
  }

  return (
    <QueryViewContainer>
      <QueryFormContainer>
        <div className="grid w-full grid-cols-1 gap-4">
          <PDSelect
            emptyPlaceHolder="No decoders available"
            items={[decoderSelectItems]}
            label="Select Decoder"
            onChange={handleDecoderSelect}
            placeholder="Please select a decoder"
            value={decoder}
          />
        </div>

        {
          decoder
          && decoders?.[decoder]?.params?.length > 0 && (
            <DecoderParams
              key={`rpc-param-${decoder}`}
              params={decoders[decoder].params}
              onChange={handleRpcParamChange}
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
              onUnsubscribe={handleStorageUnsubscribe}
              querie={query}
            />
          ))
        }
      </QueryResultContainer>
    </QueryViewContainer>
  );
};

export default Decoder;

const Query = (
  {
    querie,
    onUnsubscribe,
  }: {
    querie: IQuery;
    onUnsubscribe: (id: string) => void;
  }) => {
  const [
    result,
    setResult,
  ] = useState<unknown>();

  useEffect(() => {
    const catchError = (err?: Error) => {
      setResult(err?.message || 'Unexpected Error');
    };

    try {
      switch (querie.decoder) {
        case 'blockHeader':
          setResult(blockHeaderCodec.dec(querie.args.at(0)?.value as string))
          break;

        case 'extrinsics':
          setResult((querie.args.at(0)?.value as string[])
            ?.map((extrinsic) => decodeExtrinsic(extrinsic)))
          break;

        case 'metadata':
          setResult(metadataCodec.dec(querie.args.at(0)?.value as string))
          break;

        default:
          catchError()
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
      path={`${querie.decoder}`}
      result={result}
      title="Decoded"
    />
  );
};
