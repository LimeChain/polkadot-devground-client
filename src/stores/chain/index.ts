import {
  Metadata,
  TypeRegistry,
} from '@polkadot/types';
import {
  getLookupFn,
  type MetadataLookup,
} from '@polkadot-api/metadata-builders';
import {
  type Binary,
  metadata as metadataCodec,
  type V14,
  type V15,
} from '@polkadot-api/substrate-bindings';
import { createClient as createSubstrateClient } from '@polkadot-api/substrate-client';
import { type PolkadotClient } from 'polkadot-api';
import { createClient } from 'polkadot-api';
// import { withLogsRecorder } from 'polkadot-api/logs-provider';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { type Client } from 'polkadot-api/smoldot';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { create } from 'zustand';

import {
  CHAIN_DESCRIPTORS,
  CHAIN_WEBSOCKET_URLS,
  SUPPORTED_CHAINS,
} from '@constants/chain';
import {
  getExpectedBlockTime,
  getMetadata,
  getRuntime,
  initSmoldotChains,
  subscribeToRuntime,
  subscribeToStakedTokens,
  subscribeToTotalIssuance,
} from '@utils/papi';
import { assert } from '@utils/papi/helpers';
import { getBlockDetailsWithPAPI } from '@utils/rpc/getBlockDetails';

import { createSelectors } from '../createSelectors';
import { sizeMiddleware } from '../sizeMiddleware';

import type {
  IBlockStoreData,
  IRuntime,
  TApi,
  TChain,
  TChainSpecs,
  TPeopleApi,
  TStakingApi,
  TStakingChainDecsriptor,
} from '@custom-types/chain';
import type {
  ChainSpecData,
  FollowResponse,
  SubstrateClient,
} from '@polkadot-api/substrate-client';

export interface StoreInterface {
  chain: TChain;
  smoldot: Client | null;

  client: PolkadotClient | null;
  peopleClient: PolkadotClient | null;
  stakingClient: PolkadotClient | null;

  rawClient: SubstrateClient | null;
  rawClientSubscription: FollowResponse | null;

  api: TApi | null;
  peopleApi: TPeopleApi | null;
  stakingApi: TStakingApi | null;
  blocksData: Map<number, IBlockStoreData>;
  bestBlock: number | null;
  finalizedBlock: number | null;
  totalIssuance: bigint | null;
  totalStake: bigint | null;
  blockTime: bigint | null;

  chainSpecs: TChainSpecs | null;
  runtime: IRuntime | null;
  metadata: V14 | V15 | null;
  lookup: MetadataLookup | null;

  registry: TypeRegistry;

  actions: {
    resetStore: () => void;
    setChain: (chain: TChain) => void;
  };

  init: () => void;
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  chain: SUPPORTED_CHAINS['polkadot'],
  client: null,
  peopleClient: null,
  rawClient: null,
  rawClientSubscription: null,
  stakingClient: null,
  api: null,
  peopleApi: null,
  stakingApi: null,
  smoldot: null,
  blocksData: new Map(),
  bestBlock: null,
  finalizedBlock: null,
  totalIssuance: null,
  totalStake: null,
  blockTime: null,
  registry: new TypeRegistry(),
  chainSpecs: null,
  runtime: null,
  metadata: null,
  lookup: null,
};

const baseStore = create<StoreInterface>()(sizeMiddleware<StoreInterface>('chain', (set, get) => ({
  ...initialState,
  actions: {
    resetStore: async () => {
      try {
        const client = get()?.client;
        const rawClient = get()?.rawClient;
        const peopleClient = get()?.peopleClient;
        const stakingClient = get()?.stakingClient;

        // clean up subscrptions / destroy old clients
        client?.destroy?.();
        rawClient?.destroy?.();
        peopleClient?.destroy?.();
        stakingClient?.destroy?.();

      } catch (error) {
        console.log(error);

      } finally {
        const smoldot = get()?.smoldot;
        const blocksData = get()?.blocksData;
        const registry = get().registry;

        // reset data
        blocksData?.clear?.();
        registry?.clearCache?.();

        set({
          ...initialState,
          smoldot,
          finalizedBlock: undefined,
          bestBlock: undefined,
        });

      }
    },
    setChain: async (chain: TChain) => {
      try {
        get()?.actions?.resetStore?.();

        const blocksData = get()?.blocksData;
        const registry = get().registry;

        set({ chain });

        const smoldot = get()?.smoldot;
        assert(smoldot, 'Smoldot is not defined');

        // init relay chain / people chain
        const {
          newChain,
          peopleChain,
          stakingChain,
        } = await initSmoldotChains({
          smoldot,
          chain,
        });

        // init clients and typed apis
        const newClient = createClient(getSmProvider(newChain));
        // const newClient = createClient(withLogsRecorder(line => console.log(line), getSmProvider(newChain)));
        set({ client: newClient });
        const api = newClient.getTypedApi(CHAIN_DESCRIPTORS[chain.id]);
        set({ api });

        const isPeopleParaChain = chain.id === chain.peopleChainId;
        const newPeopleClient = isPeopleParaChain ? newClient : createClient(getSmProvider(peopleChain));
        set({ peopleClient: newPeopleClient });
        const peopleApi = newPeopleClient.getTypedApi(CHAIN_DESCRIPTORS[chain.peopleChainId]);
        set({ peopleApi });

        // check if the chain has staking pallet (rococo doesn't have)
        const hasStakingInformation = chain.hasStaking && stakingChain;
        if (hasStakingInformation) {
          const stakingClient = createClient(getSmProvider(stakingChain));
          set({ stakingClient });
          const stakingApi = stakingClient.getTypedApi(CHAIN_DESCRIPTORS[chain.stakingChainId] as TStakingChainDecsriptor);
          set({ stakingApi });
        }

        await Promise.allSettled([
          { type: 'chainSpecs', data: await newClient.getChainSpecData() },
          { type: 'metadata', data: await getMetadata(api) },
          { type: 'runtime', data: await getRuntime(api) },
        ])
          .then((results) => {
            results.forEach((result) => {
              if (result.status === 'fulfilled') {
                switch (result.value.type) {
                  case 'chainSpecs':
                    set({ chainSpecs: result.value.data as ChainSpecData });
                    break;

                  // build metadata registry for decoding
                  case 'metadata': {
                    const metadataRaw = result.value.data as Binary;
                    const metadata = new Metadata(registry, metadataRaw!.asBytes());
                    const decodededMetadata = metadataCodec.dec(metadataRaw!.asBytes());
                    const metadataVersion = decodededMetadata.metadata.tag;

                    if (metadataVersion === 'v14' || metadataVersion === 'v15') {
                      set({
                        metadata: decodededMetadata.metadata.value,
                        lookup: getLookupFn(decodededMetadata.metadata.value),
                      });
                    }
                    // TODO: this takes around 10mB of memory, we should find a way to free it
                    // const calculateObjectSizeInKB = (obj: any) => {
                    //   const jsonString = JSON.stringify(obj);
                    //   const encoder = new TextEncoder();
                    //   const sizeInBytes = encoder.encode(jsonString).length;
                    //   return sizeInBytes / 1024; // convert bytes to kilobytes
                    // };

                    // const metadataSize = calculateObjectSizeInKB(metadata);
                    // console.log('metadataSize', metadataSize);
                    registry.setMetadata(metadata);
                    break;
                  }

                  case 'runtime':
                    set({ runtime: result.value.data as Awaited<ReturnType<typeof getRuntime>> });
                    break;
                  default:
                    break;
                }
              }
            });
          })
          .catch(console.error);

        // update spec_version on runtime update
        subscribeToRuntime(api, (runtime) => set({ runtime }))
          .catch(console.error);

        subscribeToTotalIssuance(api, (totalIssuance) => set({ totalIssuance }))
          .catch(console.error);

        getExpectedBlockTime(api, chain, (blockTime) => set({ blockTime }))
          .catch(console.error);

        if (hasStakingInformation) {
          const stakingApi = get()?.stakingApi;
          assert(stakingApi, 'Staking Api is not defined');
          subscribeToStakedTokens(stakingApi, (totalStake) => set({ totalStake }))
            .catch(console.error);
        }

        // subscribe to chain head
        newClient.bestBlocks$.subscribe(async (bestBlocks) => {
          const bestBlock = bestBlocks.at(0);
          const finalizedBlock = bestBlocks.at(-1);

          const promises = [];
          // get block data starting from finalized to best block
          for (let i = bestBlocks.length - 1; i >= 0; i--) {
            const block = bestBlocks[i];

            // skip allready fetched blocks
            const blockHashHasBeenFetched = blocksData.get(block.number)?.hash === block.hash;
            if (blockHashHasBeenFetched) {
              continue;
            }

            promises.push(getBlockDetailsWithPAPI({
              blockHash: block.hash,
              blockNumber: block.number,
            }));

          }

          await Promise.allSettled(promises).then((results) => {
            results.forEach((blockData) => {
              if (blockData.status === 'fulfilled') {
                const blockExtrinsics = (blockData?.value.body?.extrinsics?.slice(2) ?? []).reverse().map((extrinsic) => {
                  return {
                    id: extrinsic.id,
                    blockNumber: extrinsic.blockNumber,
                    signer: extrinsic.extrinsicData.signer?.Id ?? '',
                    timestamp: extrinsic.timestamp,
                    isSuccess: extrinsic.isSuccess,
                    method: extrinsic.extrinsicData.method.method,
                    section: extrinsic.extrinsicData.method.section,
                  };
                },
                );
                const newBlockData = {
                  number: blockData.value.header.number,
                  hash: blockData.value.header.hash,
                  timestamp: blockData.value.header.timestamp,
                  eventsLength: blockData.value.body.events.length,
                  validator: blockData.value.header.identity.address.toString(),
                  extrinsics: blockExtrinsics,
                  identity: blockData.value.header.identity,
                };
                // blocksData.set(blockData.value.header.number, blockData.value);

                blocksData.set(blockData.value.header.number, newBlockData);
              }
            });
            set({ bestBlock: bestBlock?.number, finalizedBlock: finalizedBlock?.number });
          })
            // prevent state crash on random smoldot error
            .catch((err) => {
              console.error(err);
            });
        });

        const wsUrl = CHAIN_WEBSOCKET_URLS[chain.id];
        if (wsUrl) {
          const rawClient = createSubstrateClient(getWsProvider(wsUrl));
          set({ rawClient });

          const createSubscription = () => {
            const rawClientSubscription = rawClient.chainHead(
              true,
              () => { },
              (error) => {
                console.log(error);
                createSubscription();
              },
            );

            set({ rawClientSubscription });

          };

          createSubscription();

        }

      } catch (err) {
        // TODO: HANDLE INFINITE LOOP CASE
        console.log('Unpredicted Error, reseting chain store...', err);
        get()?.actions?.setChain?.(get()?.chain);
      }
    },
  },
  init: async () => {
    try {
      const smoldot = startFromWorker(new SmWorker(), {});
      set({ smoldot });

      get().actions.setChain(get().chain);

    } catch (err) {
      // TODO: HANDLE INFINITE LOOP CASE
      console.log('Smoldot Error, retrying to init...', err);

      get().smoldot?.terminate?.()
        .catch(console.log);

      get().init();
    }
  },
})));

export const baseStoreChain = baseStore;
export const useStoreChain = createSelectors(baseStore);
