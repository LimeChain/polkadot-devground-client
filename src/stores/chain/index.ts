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
import { type PolkadotClient } from 'polkadot-api';
// import { withLogsRecorder } from 'polkadot-api/logs-provider';
import { type Client } from 'polkadot-api/smoldot';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import {
  CHAIN_DESCRIPTORS,
  MAX_CHAIN_SET_RETRIES,
  SUPPORTED_CHAINS,
} from '@constants/chain';
import {
  createSubstrateWsClient,
  getExpectedBlockTime,
  getMetadata,
  subscribeToBestBlocks,
  subscribeToRuntime,
  subscribeToTotalIssuance,
} from '@utils/papi';

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
      const rawClientSubscription = get()?.rawClientSubscription;
      const peopleClient = get()?.peopleClient;

      // clean up subscrptions / destroy old clients
      try {
        rawClientSubscription?.unfollow?.();
      } catch (err) {
        console.log('rawClientSubscription unfollow error');
      }
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

        const registry = get().registry;

        // init clients and typed apis
        const newClient = await chain.client(smoldot);
        const api = newClient.getTypedApi(CHAIN_DESCRIPTORS[chain.id]!);
        set({ client: newClient, api });

        // poeple client is needed for address identity
        const newPeopleClient = await chain.peopleClient(smoldot);
        const peopleApi = newPeopleClient.getTypedApi(CHAIN_DESCRIPTORS[chain.peopleChainId] as TPeopleChainDecsriptor);
        set({ peopleClient: newPeopleClient, peopleApi });

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

        // SUBSCRIBE TO CHAIN HEAD
        subscribeToBestBlocks({
          client: newClient,
          set,
        });

        // CREATE RAW CLIENT AND SUBSCRIPTION
        createSubstrateWsClient({
          chain: chain.id,
          set,
        });

        // RESET RETRIES AMOUNT ON SUCCESSFUL CHAIN SET
        retriesSoFar = 0;

      } catch (err) {
        retriesSoFar += 1;

        if (retriesSoFar <= MAX_CHAIN_SET_RETRIES) {
          console.log('Unpredicted Error, reseting chain store...', err);
          console.log(`Retries left: ${MAX_CHAIN_SET_RETRIES - retriesSoFar}`, err);
          get()?.actions?.setChain?.(get()?.chain);
        } else {
          // SITE IS UNRESPONSIVE AT THAT POINT because of smoldot's panik
          console.log('Maximum chain set retries has been reached!');
          toast.error(`Error connecting to ${chain.name}!\nPlease refresh the page.`, {
            duration: 5 * 1000,
          });
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
