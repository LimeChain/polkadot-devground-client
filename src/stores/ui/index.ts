import { create } from 'zustand';

import { createSelectors } from '../createSelectors';

interface StoreInterface {
  count?: number;
  actions: {
    resetStore: () => void;
    countSet: (count?: number) => void;
    countIncrement: () => void;
    countDecrement: () => void;
  };
  init: (count?: number) => void;
}

const initialState = {
  count: undefined,
};

const baseStore = create<StoreInterface>()((set, get) => ({
  ...initialState,
  actions: {
    resetStore: () => {
      set(initialState);
    },
    countSet: (count) => {
      set({ count });
    },
    countIncrement: () => {
      set((state) => ({ count: (state.count || 0) + 1 }));
    },
    countDecrement: () => {
      set((state) => ({ count: (state.count || 0) - 1 }));
    },
  },
  init: (count) => {
    get().actions.countSet(count || 0);
  },
}));

export const baseStoreUI = baseStore;
export const useStoreUI = createSelectors(baseStore);
