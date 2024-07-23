import {
  type dot,
  type rococo,
} from '@polkadot-api/descriptors';
import {
  type PolkadotClient,
  type TypedApi,
} from 'polkadot-api';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { type Client } from 'polkadot-api/smoldot';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { create } from 'zustand';

import {
  CHAIN_DESCRIPTORS,
  CHAIN_SPECS,
  SUPPORTED_CHAIN_GROUPS,
} from '@constants/chain';

import { createSelectors } from '../createSelectors';

import type { IChain } from '@custom-types/chain';

interface StoreInterface {
  chain: IChain;

  smoldot: Client;
  client: PolkadotClient | null;
  api: TypedApi<typeof dot | typeof rococo> | null;

  actions: {
    setChain: (chain: IChain) => void;
    resetStore: () => void;
  };

  init: () => void;
}

const initialState = {
  chain: SUPPORTED_CHAIN_GROUPS['polkadot'].chains[0],
  client: null,
  api: null,
  smoldot: null as unknown as Client,
};

const baseStore = create<StoreInterface>()((set, get) => ({
  ...initialState,
  actions: {
    async resetStore() {
      try {
        const client = get()?.client;
        client?.destroy?.();

      } catch (error) {
        console.error(error);

      } finally {
        set(initialState);

      }
    },
    async setChain(chain: IChain) {
      try {
        const smoldot = get()?.smoldot;
        const client = get()?.client;

        client?.destroy?.();

        const newChain = smoldot?.addChain({
          chainSpec: CHAIN_SPECS[chain.id],
        });
        const newClient = createClient(
          getSmProvider(newChain),
        );

        const api = newClient.getTypedApi(CHAIN_DESCRIPTORS[chain.id]);

        set({ chain, client: newClient, api });

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

      const chain = await smoldot.addChain({
        chainSpec: CHAIN_SPECS[get().chain.id],
      });

      const client = createClient(
        getSmProvider(chain),
      );

      const api = client.getTypedApi(CHAIN_DESCRIPTORS[get().chain.id]);

      set({ client, api, smoldot });

    } catch (err) {
      console.error(err);

    }
  },
}));

export const baseStoreChain = baseStore;
export const useStoreChain = createSelectors(baseStore);
