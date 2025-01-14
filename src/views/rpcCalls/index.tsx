import { useEventBus } from '@pivanov/event-bus';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import {
  type IPDSelectItem,
  PDSelect,
} from '@components/pdSelect';
import { InvocationRpcArgs } from '@components/rpcCalls';
import { QUERY_CATEGORIES } from '@constants/recentQueries';
import {
  newRpcCalls,
  oldRpcCalls,
} from '@constants/rpcCalls';
import { useStoreChain } from '@stores';
import {
  blockHeaderCodec,
  decodeExtrinsic,
} from '@utils/codec';
import { cn } from '@utils/helpers';
import { unwrapApiResult } from '@utils/papi/helpers';
import { addRecentQuerieToStorage } from '@utils/recentQueries';
import {
  mapRpcCallsToSelectMethodItems,
  mapRpcCallsToSelectPalletItems,
} from '@utils/rpc/rpc-calls';
import { useDrawer } from 'src/hooks/useDrawer';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

import type { IEventBusRunRecentQuery } from '@custom-types/eventBus';
import type {
  IQueryParam,
  IRpcCallsQuery,
  TRpcCallsQueryProps,
} from '@custom-types/recentQueries';

const newRpcKeys = Object.keys(newRpcCalls);
const RpcCalls = () => {

  const chain = useStoreChain?.use?.chain?.();
  const rawClient = useStoreChain?.use?.rawClient?.();
  const rawClientSubscription = useStoreChain?.use?.rawClientSubscription?.();
  const { isOpen, open, close } = useDrawer();

  useEventBus<IEventBusRunRecentQuery>('@@-recent-query', ({ data }) => {

    setQueries((queries) => ([
      {
        name: `${data.pallet}/${data.method}`,
        pallet: data.pallet || 'defaultPallet',
        method: data.method || 'defaultMethod',
        id: crypto.randomUUID(),
        args: data.args as IQueryParam[],
        storage: data.storage || undefined,
        isCachedQuery: true,
      },
      ...queries,
    ]));
  });

  const allRpcCalls = useMemo(() => ({
    ...newRpcCalls,
    ...oldRpcCalls,
  }), []);

  const refUncleanedSubscriptions = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      refUncleanedSubscriptions?.current?.forEach((sub) => {
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

  const [
    methodSelectItems,
    setMethodSelectItems,
  ] = useState<IPDSelectItem[]>([]);
  const [
    methodSelected,
    setMethodSelected,
  ] = useState(methodSelectItems.at(0)?.value);

  const palletSelectItems = useMemo(() => {
    const newRpcItems = mapRpcCallsToSelectPalletItems(newRpcCalls);
    const oldRpcItems = mapRpcCallsToSelectPalletItems(oldRpcCalls);

    const palletItems = [
      newRpcItems,
      oldRpcItems,
    ];

    const methodItems = mapRpcCallsToSelectMethodItems({
      rpcCalls: newRpcCalls,
      ifPalletEquals: palletItems.at(0)?.at(0)?.value,
    });

    setMethodSelectItems(methodItems);
    setMethodSelected(methodItems.at(0)?.value);

    return palletItems;
  }, []);

  const [
    palletSelected,
    setPalletSelected,
  ] = useState(palletSelectItems.at(0)?.at(0)?.value);

  const [
    callParams,
    setCallParams,
  ] = useState<IQueryParam[]>([]);

  const [
    queries,
    setQueries,
  ] = useState<IRpcCallsQuery[]>([]);

  const rpcCall = useMemo(() => {
    const call = `${palletSelected}_${methodSelected}`;
    if (allRpcCalls[call]) {
      setCallParams(allRpcCalls[call].params?.map((param) => ({
        name: param.name,
        value: undefined,
        key: param.name,
      })));
      return allRpcCalls[call];
    }

    return undefined;
  }, [
    palletSelected,
    methodSelected,
    allRpcCalls,
  ]);

  const handlePalletSelect = useCallback((selectedPalletName: string) => {
    setPalletSelected(selectedPalletName);

    setMethodSelectItems(() => {
      let methods: IPDSelectItem[] = [];
      if (newRpcKeys.some((val) => val.split('_').at(0) === selectedPalletName)) {
        methods = mapRpcCallsToSelectMethodItems({
          rpcCalls: newRpcCalls,
          ifPalletEquals: selectedPalletName,
        });

      } else {
        methods = mapRpcCallsToSelectMethodItems({
          rpcCalls: oldRpcCalls,
          ifPalletEquals: selectedPalletName,
        });

      }

      setMethodSelected(methods.at(0)?.value);
      return methods;
    });
  }, []);

  const handleMathodSelect = useCallback((selectedMethodName: string) => {
    setMethodSelected(selectedMethodName);
  }, []);

  const handleOnChange = useCallback((index: number, args: unknown) => {
    setCallParams((params) => {
      if (!params || params.length === 0) {
        return [];
      } else {
        const newParams = [...params];
        newParams[index].value = args;
        return newParams;
      }
    });
  }, []);

  const handleUnsubscribe = useCallback((id: string) => {
    setQueries((queries) => queries.filter((query) => query.id !== id));
  }, []);

  const handleSubmit = useCallback(() => {
    if (palletSelected && methodSelected) {
      setQueries((queries) => {
        const newQueries = [...queries];
        newQueries.unshift({
          pallet: palletSelected,
          method: methodSelected,
          args: callParams,
          id: crypto.randomUUID(),
          name: `${palletSelected}_${methodSelected}`,
        });
        return newQueries;
      });
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
    <>
      <PageHeader
        className="mb-10"
        title="RPC Calls"
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
          category={QUERY_CATEGORIES.RPC_CALLS}
          handleClose={close}
          isOpen={isOpen}
        />
        <QueryFormContainer>
          <div className="grid w-full grid-cols-2 gap-4">
            <PDSelect
              key={`rpc-pallet-${palletSelected}`}
              emptyPlaceHolder="No pallets available"
              items={palletSelectItems}
              label="Pallet"
              onChange={handlePalletSelect}
              value={palletSelected}
              groups={[
                'New',
                'Old',
              ]}
            />
            <PDSelect
              key={`rpc-method-${methodSelected}`}
              emptyPlaceHolder="No methods available"
              items={[methodSelectItems]}
              label="Method"
              onChange={handleMathodSelect}
              value={methodSelected}
            />
          </div>

          {
            rpcCall
            && rpcCall?.params?.length > 0 && (
              <InvocationRpcArgs
                key={`invocation-rpc-${palletSelected}-${methodSelected}`}
                onChange={handleOnChange}
                rpcs={rpcCall.params}
              />
            )
          }

          <QueryButton onClick={handleSubmit}>
            Submit Rpc Call
          </QueryButton>

          <CallDocs docs={allRpcCalls?.[`${palletSelected}_${methodSelected}`]?.docs || []} />

        </QueryFormContainer>
        <QueryResultContainer>
          {
            queries.map((query) => (
              <Query
                key={`query-result-${query.pallet}-${query.method}-${query.id}`}
                onUnsubscribe={handleUnsubscribe}
                querie={query}
                unCleanedSubscriptions={refUncleanedSubscriptions}
              />
            ))
          }
        </QueryResultContainer>
      </QueryViewContainer>
    </>
  );

};

const Query = ({
  querie,
  onUnsubscribe,
  unCleanedSubscriptions,
}: TRpcCallsQueryProps) => {

  const rawClient = useStoreChain?.use?.rawClient?.();
  const rawClientSubscription = useStoreChain?.use?.rawClientSubscription?.();
  const dynamicBuilder = useDynamicBuilder();

  const chain = useStoreChain.use.chain?.();

  const [
    result,
    setResult,
  ] = useState<unknown>();
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const refFollowSubscription = useRef('');
  const call = `${querie.pallet}_${querie.method}`;

  useEffect(() => {

    const catchError = (err: Error) => {
      setIsLoading(false);
      setResult(err?.message || 'Unexpected Error');
    };

    if (!querie.isCachedQuery) {
      void addRecentQuerieToStorage({
        querie,
        chainId: chain.id,
        category: QUERY_CATEGORIES.RPC_CALLS,
      });
    }

    const runRawQuery = (onSucess?: (res: unknown) => void) => {
      const args = querie?.args ? querie.args.map((arg) => arg.value).filter((arg) => arg !== undefined) : [];

      rawClient?.request(call, args)
        .then((...res) => {
          setResult(res.at(0));
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
              unCleanedSubscriptions.current = unCleanedSubscriptions.current.filter((sub) => sub !== querie.args.at(0)?.value as string);
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
                  decoded: res.map((extrinsic) => decodeExtrinsic(extrinsic)),
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
              .then((res) => {
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
              .then((res) => {
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
            rawClientSubscription
              ?.unpin((querie?.args?.at(1)?.value as string[]))
              .then((res) => {
                setResult(res);
                setIsLoading(false);
              })
              .catch(catchError);
            break;
          // OLD RPCS
          case 'system_dryRun':
          case 'grandpa_proveFinality':
          case 'chain_getHeader':
          case 'chain_getBlock':
          case 'chain_getBlockHash':
          case 'state_getPairs':
          case 'state_getKeysPaged':
          case 'state_getStorage':
          case 'state_getStorageHash':
          case 'state_getStorageSize':
          case 'state_getMetadata':
          case 'state_getRuntimeVersion':
          case 'state_queryStorage':
          case 'state_getReadProof':
          case 'childstate_getStorage':
          case 'childstate_getStorageHash':
          case 'childstate_getStorageSize':
          case 'payment_queryInfo':
            rawClient?.request(call, querie.args.map((arg) => (arg.value || arg.value === 0) ? arg.value : null))
              .then((res) => {
                setResult(res);
                setIsLoading(false);
              })
              .catch(catchError);
            break;

          case 'childstate_getKeys':
            rawClient?.request(
              call,
              [
                querie.args.at(0)?.value,
                querie.args.at(1)?.value || '',
                querie.args.at(2)?.value || null,
              ],
            )
              .then((res) => {
                setResult(res);
                setIsLoading(false);
              })
              .catch(catchError);
            break;

          case 'author_removeExtrinsic':
            rawClient?.request(call, querie.args.at(0)?.value as string[])
              .then((res) => {
                setResult(res);
                setIsLoading(false);
              })
              .catch(catchError);
            break;

          default:
            runRawQuery();
            break;
        }
      } catch (error) {
        catchError(error as Error);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    querie,
    rawClient,
  ]);

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
      isLoading={isLoading}
      onRemove={handleUnsubscribe}
      path={`${querie.pallet}_${querie.method}`}
      result={result}
      title="Rpc Call"
    />
  );
};

export default RpcCalls;
