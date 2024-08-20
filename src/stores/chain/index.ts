import {
  Metadata,
  TypeRegistry,
} from '@polkadot/types';
import { createClient as createSubstrateClient } from '@polkadot-api/substrate-client';
import { type PolkadotClient } from 'polkadot-api';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import {
  type Chain,
  type Client,
} from 'polkadot-api/smoldot';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { create } from 'zustand';

import {
  CHAIN_DESCRIPTORS,
  CHAIN_SPECS,
  CHAIN_WEBSOCKET_URLS,
  SUPPORTED_CHAINS,
} from '@constants/chain';
import {
  getMetadata,
  getRuntime,
  subscribeToRuntime,
} from '@utils/papi';
import { getBlockDetailsWithPAPI } from '@utils/rpc/getBlockDetails';

import { createSelectors } from '../createSelectors';

import type {
  IRuntime,
  TApi,
  TChain,
  TChainSpecs,
  TPeopleApi,
} from '@custom-types/chain';
import type { SubstrateClient } from '@polkadot-api/substrate-client';

interface ISubscription {
  unsubscribe: () => void;
}

export interface StoreInterface {
  chain: TChain;

  smoldot: Client | null;
  client: PolkadotClient | null;
  peopleClient: PolkadotClient | null;
  rawClient: SubstrateClient | null;
  api: TApi | null;
  peopleApi: TPeopleApi | null;
  _subscription: ISubscription | null;

  blocksData: Map<number, Awaited<ReturnType<typeof getBlockDetailsWithPAPI>>>;
  bestBlock: number | null;
  finalizedBlock: number | null;

  chainSpecs: TChainSpecs | null;
  runtime: IRuntime | null;

  registry: TypeRegistry;

  actions: {
    resetStore: () => void;
    setChain: (chain: TChain) => void;
  };

  init: () => void;
}

const initialState = {
  chain: SUPPORTED_CHAINS['polkadot'],
  client: null,
  peopleClient: null,
  rawClient: null,
  api: null,
  peopleApi: null,
  smoldot: null,
  _subscription: null,
  blocksData: new Map(),
  bestBlock: null,
  finalizedBlock: null,
  registry: new TypeRegistry(),
  chainSpecs: null,
  runtime: null,
};

const baseStore = create<StoreInterface>()((set, get) => ({
  ...initialState,
  actions: {
    resetStore: async () => {
      try {
        const client = get()?.client;
        const peopleClient = get()?.peopleClient;
        const rawClient = get()?.rawClient;
        // const smoldot = get()?.smoldot;

        // clean up subscrptions / destroy old clients
        client?.destroy?.();
        peopleClient?.destroy?.();
        rawClient?.destroy?.();
        // dont think there is a need to terminate smoldot
        // await smoldot?.terminate?.();

        const blocksData = get()?.blocksData;
        const registry = get().registry;

        // reset data
        blocksData?.clear();
        registry.clearCache();

      } catch (error) {
        console.error(error);

      } finally {
        set(initialState);

      }
    },
    setChain: async (chain: TChain) => {
      try {
        set({ chain });

        const smoldot = get()?.smoldot;
        if (!smoldot) {
          return;
        }

        const client = get()?.client;
        const peopleClient = get()?.peopleClient;
        const rawClient = get()?.rawClient;

        // clean up subscrptions / destroy old clients
        client?.destroy?.();
        peopleClient?.destroy?.();
        rawClient?.destroy?.();

        const blocksData = get()?.blocksData;
        const registry = get().registry;

        // reset data
        blocksData?.clear();
        registry.clearCache();
        set({ finalizedBlock: undefined, bestBlock: undefined });

        // init relay chain / people chain
        const isParachain = chain.isParaChain;
        let newChain: Chain, peopleChain: Chain;

        if (isParachain) {
          const relayChain = await smoldot?.addChain({
            chainSpec: CHAIN_SPECS[chain.relayChainId],
          });

          newChain = await smoldot?.addChain({
            chainSpec: CHAIN_SPECS[chain.id],
            potentialRelayChains: [relayChain],
          });

          peopleChain = await smoldot?.addChain({
            chainSpec: CHAIN_SPECS[chain.peopleChainId],
            potentialRelayChains: [relayChain],
          });

        } else {
          newChain = await smoldot?.addChain({
            chainSpec: CHAIN_SPECS[chain.id],
          });

          peopleChain = await smoldot?.addChain({
            chainSpec: CHAIN_SPECS[chain.peopleChainId],
            potentialRelayChains: [newChain],
          });

        }

        const newClient = createClient(getSmProvider(newChain));
        set({ client: newClient });

        const isPeopleParaChain = chain.id === chain.peopleChainId;
        let newPeopleClient: PolkadotClient;

        if (isPeopleParaChain) {
          // if its a people para chain then the two clients are identical
          newPeopleClient = newClient;

        } else {
          newPeopleClient = createClient(getSmProvider(peopleChain));

        }
        set({ peopleClient: newPeopleClient });

        newClient.getChainSpecData()
          .then(chainSpecs => {
            set({ chainSpecs });
          })
          .catch(console.error);

        const api = newClient.getTypedApi(CHAIN_DESCRIPTORS[chain.id]);
        set({ api });

        const peopleApi = newPeopleClient.getTypedApi(CHAIN_DESCRIPTORS[chain.peopleChainId]);
        set({ peopleApi });

        // build metadata registry for decoding
        await getMetadata(api)
          .then(metadataRaw => {
            const metadata = new Metadata(registry, metadataRaw.asBytes());
            registry.setMetadata(metadata);
          })
          .catch(console.error);

        // get spec_version from runtime
        await getRuntime(api)
          .then(runtime => {
            set({ runtime });
          })
          .catch(console.error);

        // update spec_version on runtime update
        subscribeToRuntime(api, (runtime) => set({ runtime }))
          .catch(console.error);

        // subscribe to chain head
        newClient.bestBlocks$.subscribe(async (bestBlocks) => {
          const bestBlock = bestBlocks.at(0);
          const finalizedBlock = bestBlocks.at(-1);

          const promises = [];
          // get block data starting from latest known finalized block
          for (let i = bestBlocks.length - 1; i >= 0; i--) {
            const block = bestBlocks[i];

            // skip allready fetched blocks
            if (blocksData.get(block.number)?.header?.hash === block.hash) {
              continue;
            }

            promises.push(getBlockDetailsWithPAPI({
              blockHash: block.hash,
              blockNumber: block.number,
            }));

          }

          await Promise.all(promises).then(results => {
            results.forEach(blockData => {
              blocksData.set(blockData.header.number, blockData);
            });
            set({ bestBlock: bestBlock?.number, finalizedBlock: finalizedBlock?.number });

          })
            // prevent state crash on random smoldot error
            .catch(err => {
              console.error(err);
            },
            );

        });

        const wsUrl = CHAIN_WEBSOCKET_URLS[chain.id];
        if (wsUrl) {
          const rawClient = createSubstrateClient(getWsProvider(wsUrl));
          set({ rawClient });
        }

      } catch (err) {
        console.error(err);
      }
    },
  },
  async init() {
    try {
      const smoldot = startFromWorker(new SmWorker());

      set({ smoldot });

      get().actions.setChain(get().chain);
    } catch (err) {
      console.error(err);
    }
  },
}));

export const baseStoreChain = baseStore;
export const useStoreChain = createSelectors(baseStore);
