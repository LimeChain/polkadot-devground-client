import { create } from 'zustand';

import { getBlockDetails } from '@utils/rpc/getBlockDetails';

import { baseStoreChain } from '../chain';
import { createSelectors } from '../createSelectors';

import type { IBlock } from '@custom-types/block';

interface StoreInterface {
  latestBlocks?: IBlock[];
  actions: {
    resetStore: () => void;
  };
  init: () => void;
}

const initialState = {
  latestBlocks: undefined,
};

const LATEST_BLOCKS_COUNT = 5;

const baseStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    resetStore: () => {
      set(initialState);
    },
  },
  init: async () => {
    const latestFinalizedBlock = baseStoreChain.getState().latestFinalizedBlock;
    const rawClient = baseStoreChain.getState().rawClient;
    if (rawClient && latestFinalizedBlock) {
      // Fetch the latest 5 blocks
      const promises = Array.from({ length: LATEST_BLOCKS_COUNT }, (_, i) => {
        return getBlockDetails(rawClient, latestFinalizedBlock.number - i);
      });

      try {
        const latestBlocks = await Promise.all(promises);
        set({ latestBlocks });
      } catch (error) {
        console.error('Error fetching latest blocks:', error);

      }
    }
  },
}));

export const baseStoreExplorer = baseStore;
export const useStoreExplorer = createSelectors(baseStore);
