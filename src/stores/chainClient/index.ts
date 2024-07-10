import { create } from 'zustand';

import { createSelectors } from '@stores/createSelectors';

interface IChainClient {
  client: undefined;
  isLoadingClient: boolean;
  actions: {
    init: () => void;
  };
}

const initialState = {
  client: undefined,
  isLoadingClient: true,
};

const chainClientStore = create<IChainClient>()((set) => ({
  ...initialState,
  actions: {
    init() {
      set({ isLoadingClient: false });
    },
  },
}));

export const chainStoreUI = chainClientStore;
export const useStoreChain = createSelectors(chainClientStore);
