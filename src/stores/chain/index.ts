import {
  type dot,
  type rococo,
} from '@polkadot-api/descriptors';
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
import { WebSocketProvider } from 'polkadot-api/ws-provider/web';
import { create } from 'zustand';

import {
  CHAIN_DESCRIPTORS,
  CHAIN_SPECS,
  CHAIN_WEBSOCKET_URLS,
  SUPPORTED_CHAIN_GROUPS,
} from '@constants/chain';

import { createSelectors } from '../createSelectors';

import type { IChain } from '@custom-types/chain';
import type { SubstrateClient } from '@polkadot-api/substrate-client';

interface ISubscription {
  unsubscribe: () => void;
}

interface StoreInterface {
  chain: IChain;

  smoldot: Client;
  client: PolkadotClient | null;
  rawClient: SubstrateClient | null;
  api: TypedApi<typeof dot | typeof rococo> | null;
  _subscription?: ISubscription;

  latestFinalizedBlock?: {
    hash: string;
    number: number;
    parent: string;
  };

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
  smoldot: null as unknown as Client,
  _subscription: undefined,
  latestFinalizedBlock: undefined,
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
    setChain: (chain: IChain) => {
      try {
        const smoldot = get()?.smoldot;
        const client = get()?.client;
        const _subscription = get()?._subscription;

        client?.destroy?.();
        _subscription?.unsubscribe();

        const newChain = smoldot?.addChain({
          chainSpec: CHAIN_SPECS[chain.id],
        });

        const newClient = createClient(
          getSmProvider(newChain),
        );

        const api = newClient.getTypedApi(CHAIN_DESCRIPTORS[chain.id]);

        const subscription = newClient.finalizedBlock$.subscribe((finalizedBlock) => {
          set({ latestFinalizedBlock: finalizedBlock });
        });

        const wsUrl = CHAIN_WEBSOCKET_URLS[chain.id];
        if (wsUrl) {
          const rawClient = createSubstrateClient(WebSocketProvider(wsUrl));
          set({ rawClient });
        }

        set({
          chain,
          client: newClient,
          api,
          _subscription: subscription,
        });
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
