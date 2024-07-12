import { create } from 'zustand';

import { SUPPORTED_CHAIN_GROUPS } from '@constants/chains';

import { createSelectors } from '../createSelectors';

import type { IChain } from '@custom-types/chain';

interface StoreInterface {
  chain: IChain;
  actions: {
    resetStore: () => void;
    setChain : (chain:IChain) => void;
  };
}

const initialState = {
  chain: SUPPORTED_CHAIN_GROUPS['polkadot'].chains[0],
};

const chainStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    resetStore() {
      set(initialState);
    },
    setChain(chain:IChain) {
      set({ chain });
    },
  },
}));

export const useStoreChain = createSelectors(chainStore);
