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
  initSmoldotChains,
  subscribeToRuntime,
  subscribeToTotalIssuance,
} from '@utils/papi';
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
  TPeopleChainDecsriptor,
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

  rawClient: SubstrateClient | null;
  rawClientSubscription: FollowResponse | null;

  api: TApi | null;
  peopleApi: TPeopleApi | null;
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
    resetStore: () => Promise<void>;
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
  api: null,
  peopleApi: null,
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

const MAX_RETRIES = 5;
let retriesSoFar = 0;

const startSmoldot = () => {
  return startFromWorker(
    new Worker(new URL('polkadot-api/smoldot/worker', import.meta.url), {
      type: 'module',
    }),
    {
      forbitWs: true,
    },
  );
};

const baseStore = create<StoreInterface>()(sizeMiddleware<StoreInterface>('chain', (set, get) => ({
  ...initialState,
  actions: {
    resetStore: async () => {
      const client = get()?.client;
      const rawClient = get()?.rawClient;
      const peopleClient = get()?.peopleClient;

      // clean up subscrptions / destroy old clients
      try {
        client?.destroy?.();
      } catch (err) {
        console.log('client destroy error');
      }
      try {
        rawClient?.destroy?.();
      } catch (err) {
        console.log('rawClient destroy error');
      }
      try {
        peopleClient?.destroy?.();
      } catch (err) {
        console.log('peopleClient destroy error');
      }

      const smoldot = get()?.smoldot;

      await smoldot?.terminate?.().catch();

      const blocksData = get()?.blocksData;
      const registry = get().registry;

      // reset data
      blocksData?.clear?.();
      registry?.clearCache?.();

      set({
        ...initialState,
        smoldot,
      });

    },
    setChain: async (chain: TChain) => {
      try {
        await get()?.actions?.resetStore?.();
        set({ chain });

        const smoldot = startSmoldot();
        set({ smoldot });

        const blocksData = get()?.blocksData;
        const registry = get().registry;

        const {
          newChain,
          // peopleChain,
        } = await initSmoldotChains({
          smoldot,
          chain,
        });

        // init clients and typed apis
        const newClient = createClient(getSmProvider(newChain));
        // CLIENT WITH LOGS
        // const newClient = createClient(withLogsRecorder((line) => console.log(line), getSmProvider(newChain)));
        set({ client: newClient });
        const api = newClient.getTypedApi(CHAIN_DESCRIPTORS[chain.id]);
        set({ api });

        const isPeopleParaChain = chain.id === chain.peopleChainId;
        const newPeopleClient = isPeopleParaChain ? newClient : createClient(getWsProvider(CHAIN_WEBSOCKET_URLS[chain.peopleChainId]));
        // const newPeopleClient = isPeopleParaChain ? newClient : createClient(getSmProvider(peopleChain));
        set({ peopleClient: newPeopleClient });
        const peopleApi = newPeopleClient.getTypedApi(CHAIN_DESCRIPTORS[chain.peopleChainId] as TPeopleChainDecsriptor);
        set({ peopleApi });

        // update spec_version on runtime update
        await subscribeToRuntime(api, (runtime) => set({ runtime }))
          .catch(console.error);

        subscribeToTotalIssuance(api, (totalIssuance) => set({ totalIssuance }))
          .catch(console.error);

        getExpectedBlockTime(api, chain, (blockTime) => set({ blockTime }))
          .catch(console.error);

        await Promise.allSettled([
          { type: 'chainSpecs', data: await newClient.getChainSpecData() },
          { type: 'metadata', data: await getMetadata(api) },
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
                    const metadataRaw = result.value.data as unknown as Binary;
                    const metadata = new Metadata(registry, metadataRaw!.asBytes());
                    const decodededMetadata = metadataCodec.dec(metadataRaw!.asBytes());
                    const metadataVersion = decodededMetadata.metadata.tag;

                    if (metadataVersion === 'v14' || metadataVersion === 'v15') {
                      set({
                        metadata: decodededMetadata.metadata.value,
                        lookup: getLookupFn(decodededMetadata.metadata.value),
                      });
                    }
                    registry.setMetadata(metadata);
                    break;
                  }

                  default:
                    break;
                }
              }
            });
          })
          .catch(console.error);

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

          Promise.allSettled(promises).then((results) => {
            results.forEach((blockData) => {
              if (blockData.status === 'fulfilled') {
                const blockExtrinsics = (blockData?.value.body?.extrinsics?.slice(2) ?? [])
                  .reverse()
                  .map((extrinsic) => {
                    const { id, blockNumber, extrinsicData, timestamp, isSuccess } = extrinsic;
                    const { method, signer } = extrinsicData;
                    return {
                      id,
                      blockNumber,
                      timestamp,
                      isSuccess: isSuccess || false,
                      signer: signer?.Id ?? '',
                      method: method.method,
                      section: method.section,
                    };
                  },
                  );

                const newBlockData = {
                  number: blockData.value.header.number,
                  hash: blockData.value.header.hash,
                  timestamp: blockData.value.header.timestamp,
                  eventsLength: blockData.value.body.events.length,
                  validator: blockData.value.header.identity?.address?.toString?.(),
                  extrinsics: blockExtrinsics,
                  identity: blockData.value.header.identity,
                };

                if (typeof newBlockData.number == 'number') {
                  blocksData.set(newBlockData.number, newBlockData);
                }
              } else {
                console.log(blockData);

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
              () => {},
              (error) => {
                console.log(error);
                rawClientSubscription?.unfollow?.();
                createSubscription();
              },
            );

            set({ rawClientSubscription });

          };

          createSubscription();

        }

        // RESET RETRIES AMOUNT ON SUCCESSFUL CHAIN SET
        retriesSoFar = 0;

      } catch (err) {
        // TODO: Show error to the user
        // PREVENT INFINITY LOOP ON CHAIN SWITCH
        retriesSoFar += 1;

        if (retriesSoFar <= MAX_RETRIES) {
          console.log('Unpredicted Error, reseting chain store...', err);
          console.log(`Retries left: ${MAX_RETRIES - retriesSoFar}`, err);
          get()?.actions?.setChain?.(get()?.chain);
        } else {
          console.log('Maximum chain set retries has been reached!');
          // SITE IS UNRESPONSIVE AT THAT POINT because of smoldot's panik
        }
      }
    },
  },
  init: async () => {
    try {
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
