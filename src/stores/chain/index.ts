import { create } from 'zustand';

import { createSelectors } from '../createSelectors';

interface StoreInterface {
  chain: string;
  actions: {
    resetStore: () => void;
  };
}

const initialState = {
  chain: 'polkadot',
};

const chainStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    resetStore() {
      set(initialState);
    },
    setChain(chain:string) {
      set({ chain });
    },
  },
 
}));

export const chainStoreUI = chainStore;
export const useStoreChain = createSelectors(chainStore);
