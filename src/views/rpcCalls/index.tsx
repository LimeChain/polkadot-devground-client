import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CallDocs } from '@components/callParam/callDocs';
import { QueryButton } from '@components/callParam/queryButton';
import { QueryFormContainer } from '@components/callParam/queryFormContainer';
import { QueryResult } from '@components/callParam/queryResult';
import { QueryResultContainer } from '@components/callParam/queryResultContainer';
import { QueryViewContainer } from '@components/callParam/queryViewContainer';
import { RpcParams } from '@components/callParam/rpcParams';
import { Loader } from '@components/loader';
import {
  type IPDSelect,
  PDSelect,
} from '@components/pdSelect';
import { newRpcCalls } from '@constants/rpcCalls';
import { useStoreChain } from '@stores';
import {
  blockHeaderCodec,
  decodeExtrinsic,
} from '@utils/codec';
import { unwrapApiResult } from '@utils/papi/helpers';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

interface ICallParam {
  name: string;
  value: unknown;
}
interface IQuery {
  pallet: string;
  method: string;
  id: string;
  args: ICallParam[];
}

export const RpcCalls = () => {

  const chain = useStoreChain?.use?.chain?.();
  const rawClient = useStoreChain?.use?.rawClient?.();
  const rawClientSubscription = useStoreChain?.use?.rawClientSubscription?.();

  const refUncleanedSubscriptions = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      refUncleanedSubscriptions?.current?.forEach(sub => {
        rawClient?.request('chainHead_v1_unfollow', [sub])
          .then(() => {
            console.log('follow subscription cleaned', sub);
          })
          .catch(console.log);
      });
    };
  }, [rawClient]);

  useEffect(() => {
    setQueries([]);
  }, [chain.id]);

  const [methodSelectItems, setMethodSelectItems] = useState<NonNullable<IPDSelect['items']>>([]);
  const [methodSelected, setMethodSelected] = useState(methodSelectItems.at(0)?.value);

  const palletSelectItems = useMemo(() => {
    const palletItems = Object.keys(newRpcCalls).reduce((acc, curr) => {
      const pallet = curr.split('_').at(0);

      if (pallet && !acc.some(p => p.value === pallet)) {
        acc.push({
          label: pallet,
          value: pallet,
          key: `rpc-pallet-${pallet}`,
        });
      }

      return acc;
    }, [] as NonNullable<IPDSelect['items']>);

    const methodItems = Object.keys(newRpcCalls).reduce((acc, curr) => {
      const call = curr.split('_');
      const pallet = call.at(0);

      if (pallet && pallet === palletItems.at(0)?.value) {
        const val = call.slice(1).join('_');
        acc.push({
          label: val,
          value: val,
          key: `rpc-method-${val}`,
        });
      }

      return acc;
    }, [] as NonNullable<IPDSelect['items']>);

    setMethodSelectItems(methodItems);
    setMethodSelected(methodItems.at(0)?.value);

    return palletItems;
  }, []);

  const [palletSelected, setPalletSelected] = useState(palletSelectItems.at(0)?.value);

  const [callParams, setCallParams] = useState<ICallParam[]>([]);
  const [queries, setQueries] = useState<IQuery[]>([]);

  const rpcCall = useMemo(() => {
    const call = `${palletSelected}_${methodSelected}`;

    if (newRpcCalls[call]) {
      setCallParams(newRpcCalls[call].params?.map(param => ({ name: param.name, value: undefined })));
      return newRpcCalls[call];
    }

    return undefined;

  }, [palletSelected, methodSelected]);

  const handlePalletSelect = useCallback((selectedPalletName: string) => {
    setPalletSelected(selectedPalletName);

    setMethodSelectItems(() => {
      const methods = Object.keys(newRpcCalls).reduce((acc, curr) => {
        const call = curr.split('_');
        const pallet = call.at(0);

        if (pallet && pallet === selectedPalletName) {
          const val = call.slice(1).join('_');
          acc.push({
            label: val,
            value: val,
            key: `rpc-call-${val}`,
          });
        }

        return acc;
      }, [] as NonNullable<IPDSelect['items']>);

      setMethodSelected(methods.at(0)?.value);
      return methods;
    });
  }, []);

  const handleMathodSelect = useCallback((selectedMethodName: string) => {
    setMethodSelected(selectedMethodName);
  }, []);

  const handleRpcParamChange = useCallback((index: number, args: unknown) => {
    setCallParams(params => {
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

  const handleStorageUnsubscribe = useCallback((id: string) => {
    setQueries(queries => queries.filter(query => query.id !== id));
  }, []);

  const handleRpcSubmit = useCallback(() => {
    if (palletSelected && methodSelected) {
      setQueries(queries => ([
        {
          pallet: palletSelected,
          method: methodSelected,
          args: callParams,
          id: crypto.randomUUID(),
        },
        ...queries,
      ]));
    }

  }, [
    callParams,
    palletSelected,
    methodSelected,
  ]);

  if (!rawClient || !rawClientSubscription) {
    return <Loader />;
  }

  return (
    <QueryViewContainer>
      <QueryFormContainer>
        <div className="grid w-full grid-cols-2 gap-4">
          <PDSelect
            items={palletSelectItems}
            value={palletSelected}
            onChange={handlePalletSelect}
          />
          <PDSelect
            items={methodSelectItems}
            value={methodSelected}
            onChange={handleMathodSelect}
          />
        </div>

        {
          rpcCall
          && rpcCall?.params?.length > 0 && (
            <RpcParams
              key={`rpc-param-${palletSelected}-${methodSelected}`}
              params={rpcCall.params}
              onChange={handleRpcParamChange}
            />
          )
        }

        <QueryButton onClick={handleRpcSubmit}>
          Submit Rpc Call
        </QueryButton>

        <CallDocs docs={newRpcCalls?.[`${palletSelected}_${methodSelected}`]?.docs || []} />

      </QueryFormContainer>
      <QueryResultContainer>
        {
          queries.map((query) => (
            <Query
              key={`query-result-${query.pallet}-${query.method}-${query.id}`}
              querie={query}
              onUnsubscribe={handleStorageUnsubscribe}
              unCleanedSubscriptions={refUncleanedSubscriptions}
            />
          ))
        }
      </QueryResultContainer>
    </QueryViewContainer>
  );

};

const Query = ({
  querie,
  onUnsubscribe,
  unCleanedSubscriptions,
}: {
  querie: IQuery;
  onUnsubscribe: (id: string) => void;
  unCleanedSubscriptions: React.MutableRefObject<string[]>;
}) => {

  const rawClient = useStoreChain?.use?.rawClient?.();
  const rawClientSubscription = useStoreChain?.use?.rawClientSubscription?.();
  const dynamicBuilder = useDynamicBuilder();

  const [result, setResult] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const refFollowSubscription = useRef('');

  const call = `${querie.pallet}_${querie.method}`;

  useEffect(() => {

    const catchError = (err: Error) => {
      setIsLoading(false);
      setResult(err?.message || 'Unexpected Error');
    };

    const runRawQuery = (onSucess?: (res: unknown) => void) => {
      const args = querie?.args ? querie.args.map(arg => arg.value).filter(arg => arg !== undefined) : [];

      rawClient?.request(call, [...args]).then(res => {
        setResult(res);
        setIsLoading(false);

        onSucess?.(res);
      })
        .catch(catchError);
    };

    if (rawClient) {
      try {
        switch (call) {
          // CHAIN HEAD
          case 'chainHead_v1_follow':
            runRawQuery((res) => {
              unCleanedSubscriptions.current.push(res as string);
              refFollowSubscription.current = res as string;
            });
            break;
          case 'chainHead_v1_unfollow':
            runRawQuery(() => {
              unCleanedSubscriptions.current = unCleanedSubscriptions.current.filter(sub => sub !== querie.args.at(0)?.value as string);
            });
            break;
          case 'chainHead_v1_header':
            rawClientSubscription?.header(querie?.args?.at(1)?.value as string)
              .then((res) => {
                setResult({
                  raw: res,
                  decoded: blockHeaderCodec.dec(res),
                });
                setIsLoading(false);
              })
              .catch(catchError);
            break;
          case 'chainHead_v1_body':
            rawClientSubscription?.body(querie?.args?.at(1)?.value as string)
              .then((res) => {
                setResult({
                  raw: res,
                  decoded: res.map(extrinsic => decodeExtrinsic(extrinsic)),
                });
                setIsLoading(false);
              })
              .catch(catchError);
            break;
          case 'chainHead_v1_storage':
            rawClientSubscription?.storage(
              querie.args.at(1)?.value as string,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              querie.args.at(2)?.value as any,
              querie.args.at(3)?.value as string,
              null,
            )
              .then(res => {
                setResult(res);
                setIsLoading(false);
              })
              .catch(catchError);
            break;
          case 'chainHead_v1_call':
            rawClientSubscription?.call(
              querie.args.at(1)?.value as string,
              querie.args.at(2)?.value as string,
              querie.args.at(3)?.value as string,
            )
              .then(res => {
                if (dynamicBuilder) {
                  const args = (querie.args.at(2)?.value as string)?.split('_');

                  const decodedRes = dynamicBuilder.buildRuntimeCall(
                    args[0], args.slice(1).join('_'),
                  ).value
                    .dec(res);

                  setResult({
                    raw: res,
                    decoded: unwrapApiResult(decodedRes),
                  });
                } else {
                  setResult(res);
                }

                setIsLoading(false);
              })
              .catch(catchError);
            break;
          case 'chainHead_v1_unpin':
            rawClientSubscription?.unpin((querie?.args?.at(1)?.value as string[]))
              .then(res => {
                setResult(res);
                setIsLoading(false);
              })
              .catch(catchError);
            break;
          case 'chainHead_v1_continue':
          case 'chainHead_v1_stopOperation':
            runRawQuery();
            break;

          // CHAIN SPECS
          case 'chainSpec_v1_chainName':
          case 'chainSpec_v1_genesisHash':
          case 'chainSpec_v1_properties':
            runRawQuery();
            break;

          // RPC METHODS
          case 'rpc_methods':
            runRawQuery();
            break;

          // TRANSACTIONS
          case 'transaction_v1_broadcast':
          case 'transaction_v1_stop':
            runRawQuery();
            break;

          // TRANSACATION WATCH
          case 'transactionWatch_v1_submitAndWatch':
          case 'transactionWatch_v1_unwatch':
            runRawQuery();
            break;

          default:
            catchError({} as Error);
            break;
        }
      } catch (error) {
        catchError(error as Error);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querie, rawClient]);

  const handleUnsubscribe = useCallback(() => {
    onUnsubscribe(querie.id);

    if (call === 'chainHead_v1_follow' && refFollowSubscription.current) {
      rawClient?.request('chainHead_v1_unfollow', [refFollowSubscription.current])
        .then(() => {
          console.log('follow subscription cleaned', refFollowSubscription.current);
        })
        .catch(console.log);
    }
  }, [
    querie,
    onUnsubscribe,
    rawClient,
    call,
  ]);

  return (
    <QueryResult
      title="Rpc Call"
      path={`${querie.pallet}_${querie.method}`}
      isLoading={isLoading}
      result={result}
      onRemove={handleUnsubscribe}
    />
  );
};
