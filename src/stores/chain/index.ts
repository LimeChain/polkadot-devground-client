// eslint-disable-next-line import/no-unresolved
import {
  type dot,
  type rococo,
} from '@polkadot-api/descriptors';
import { getSmProvider } from 'polkadot-api/sm-provider';
import {
  type Client,
  start,
} from 'polkadot-api/smoldot';
import { create } from 'zustand';

import {
  CHAIN_DESCRIPTORS,
  CHAIN_SPECS,
  createClient,
  SUPPORTED_CHAIN_GROUPS,
} from '@constants/chain';
import {
  type PolkadotClient,
  type TypedApi,
} from 'polkadot-api';

import { createSelectors } from '../createSelectors';

import type { IChain } from '@custom-types/chain';

interface IStore {
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

const baseStore = create<IStore>()((set, get) => ({
  ...initialState,
  actions: {
    async setChain(chain: IChain) {
      try {
        const smoldot = get()?.smoldot;

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
    resetStore() {
      set(initialState);
    },
  },
  async init() {
    try {
      const smoldot = start();
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
