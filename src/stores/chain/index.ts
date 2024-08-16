import {
  Metadata,
  TypeRegistry,
} from '@polkadot/types';
import { createClient as createSubstrateClient } from '@polkadot-api/substrate-client';
import {
  type PolkadotClient,
  type TypedApi,
} from 'polkadot-api';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { type Client } from 'polkadot-api/smoldot';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { create } from 'zustand';

import {
  CHAIN_DESCRIPTORS,
  CHAIN_SPECS,
  CHAIN_WEBSOCKET_URLS,
  SUPPORTED_CHAIN_GROUPS,
} from '@constants/chain';
import {
  type dot,
  type dotpeople,
  type rococo,
} from '@polkadot-api/descriptors';
import { getBlockDetailsWithPAPI } from '@utils/rpc/getBlockDetails';

import { createSelectors } from '../createSelectors';

import type { IChain } from '@custom-types/chain';
import type { SubstrateClient } from '@polkadot-api/substrate-client';

interface ISubscription {
  unsubscribe: () => void;
}

interface IChainSpecs extends Awaited<ReturnType<PolkadotClient['getChainSpecData']>> {
  properties: {
    ss58Format: number;
    tokenDecimals: number;
    tokenSymbol: string;
  };
}

interface IRuntime {
  spec_version: number;
  spec_name: string;
}

export interface StoreInterface {
  chain: IChain;

  smoldot: Client;
  client: PolkadotClient | null;
  rawClient: SubstrateClient | null;
  api: TypedApi<typeof dot | typeof rococo | typeof dotpeople> | null;
  peopleApi: TypedApi<typeof dotpeople> | null;
  _subscription?: ISubscription;

  blocksData: Map<number, Awaited<ReturnType<typeof getBlockDetailsWithPAPI>>>;
  bestBlock: number | undefined;
  finalizedBlock: number | undefined;

  chainSpecs: IChainSpecs | null;
  runtime: IRuntime | undefined;

  registry: TypeRegistry;

  actions: {
    resetStore: () => void;
    setChain: (chain: IChain) => void;
  };

  init: () => void;
}

const initialState = {
  chain: SUPPORTED_CHAIN_GROUPS['polkadot'].chains[0],
  client: null,
  rawClient: null,
  api: null,
  peopleApi: null,
  smoldot: null as unknown as Client,
  _subscription: undefined,
  blocksData: new Map(),
  bestBlock: undefined,
  finalizedBlock: undefined,
  registry: new TypeRegistry(),
  chainSpecs: null,
  runtime: undefined,
};

const baseStore = create<StoreInterface>()((set, get) => ({
  ...initialState,
  actions: {
    resetStore: async () => {
      try {
        const client = get()?.client;
        const _subscription = get()?._subscription;

        client?.destroy?.();
        _subscription?.unsubscribe();

      } catch (error) {
        console.error(error);

      } finally {
        set(initialState);

      }
    },
    setChain: async (chain: IChain) => {
      try {
        set({ chain });

        const smoldot = get()?.smoldot;
        const client = get()?.client;
        const rawClient = get()?.rawClient;
        const _subscription = get()?._subscription;
        const blocksData = get()?.blocksData;
        const registry = get().registry;

        // clean up subscrptions / destroy old clients
        client?.destroy?.();
        rawClient?.destroy?.();
        _subscription?.unsubscribe?.();

        // reset data
        blocksData?.clear();
        registry.clearCache();
        set({ finalizedBlock: undefined, bestBlock: undefined });

        // init chain
        const relayChain = await smoldot?.addChain({
          chainSpec: CHAIN_SPECS['polkadot'],
        });
        const newChain = await smoldot?.addChain({
          chainSpec: CHAIN_SPECS[chain.id],
          potentialRelayChains: [relayChain],
        });

        const peopleChain = await smoldot?.addChain({
          chainSpec: CHAIN_SPECS['polkadot-people'],
          potentialRelayChains: [relayChain],
        });

        const newClient = createClient(getSmProvider(newChain));
        set({ client: newClient });

        const peopleClient = createClient(getSmProvider(peopleChain));
        // set({ peopleClient });

        const chainSpecs = await newClient.getChainSpecData();
        set({ chainSpecs });

        const api = newClient.getTypedApi(CHAIN_DESCRIPTORS[chain.id]);
        set({ api });

        const peopleApi = peopleClient.getTypedApi(CHAIN_DESCRIPTORS['polkadot-people']);
        set({ peopleApi });

        // build metadata registry for decoding
        const metadataBytes = (await api.apis.Metadata.metadata()).asBytes();
        const metadata = new Metadata(registry, metadataBytes);
        registry.setMetadata(metadata);

        // get spec_version from runtime
        const runtime = await api.query.System.LastRuntimeUpgrade.getValue({ at: 'finalized' }); // finalized because we show data from finalized onwards
        set({ runtime });

        // update spec_version on runtime update
        api.query.System.LastRuntimeUpgrade.watchValue('finalized').subscribe(runtime => {
          set({ runtime });
        });

        // check for failed extrinsics
        api.event.System.ExtrinsicSuccess.watch().subscribe(events => {
          console.log(events);
        });

        const subscription = newClient.bestBlocks$.subscribe(async (bestBlocks) => {
          const bestBlock = bestBlocks.at(0);
          const finalizedBlock = bestBlocks.at(-1);

          // get block data starting from latest known finalized block
          for (let i = bestBlocks.length - 1; i >= 0; i--) {
            const block = bestBlocks[i];

            const blockData = await getBlockDetailsWithPAPI({
              api,
              blockHash: block.hash,
              blockNumber: block.number,
              client: newClient,
              registry,
            });

            blocksData.set(block?.number, blockData);
          }

          set({
            finalizedBlock: finalizedBlock?.number,
            bestBlock: bestBlock?.number,
          });
        });

        set({ _subscription: subscription });

        const wsUrl = CHAIN_WEBSOCKET_URLS[chain.id];
        if (wsUrl) {
          const rawClient = createSubstrateClient(getWsProvider(wsUrl));
          set({ rawClient });
        }

      } catch (err) {
        console.error(err);
      } finally {
        set({ chain });
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
