import {
  connectInjectedExtension,
  getInjectedExtensions,
  type InjectedExtension,
  type InjectedPolkadotAccount,
} from 'polkadot-api/pjs-signer';
import { create } from 'zustand';

import walletService from '@services/walletService';

import { createSelectors } from '../createSelectors';

interface StoreInterface {
  extensions: string[];
  selectedExtensions: InjectedExtension[];
  accounts: InjectedPolkadotAccount[];
  actions: {
    connect: (extension: string) => void;
    disconnect: () => void;
    resetStore: () => void;
  };
  init: () => void;
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  extensions: [],
  selectedExtensions: [],
  accounts: [],
};

const baseStore = create<StoreInterface>()((set, get) => ({
  ...initialState,
  actions: {
    resetStore: () => {
      set(initialState);
    },
    async connect(extension: string) {
      const extensions: string[] = getInjectedExtensions();
      if (extension && extensions.indexOf(extension) === -1) {
        return;
      }
      const selectedExtension: InjectedExtension = await connectInjectedExtension(
        extension,
      );
      await walletService.setLatestWallet(extension);
      selectedExtension.subscribe((accounts) => {
        set({ accounts });
      });

      const accounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts();
      set({ accounts, extensions, selectedExtensions: [selectedExtension] });

    },

    async disconnect() {
      console.log('selectedExtensions', get().selectedExtensions);
      get().selectedExtensions.at(0)?.disconnect();
      set({ accounts: [] });
      await walletService.setLatestWallet('');
    },
  },
  init: async () => {
    const extensions: string[] = getInjectedExtensions();
    const latestWalletUsed = await walletService.getLatestWallet();

    set({ extensions });

    if (extensions.length > 0 && latestWalletUsed && extensions.indexOf(latestWalletUsed) !== -1) {
      const selectedExtension: InjectedExtension = await connectInjectedExtension(
        latestWalletUsed,
      );

      selectedExtension.subscribe((accounts) => {
        set({ accounts });
      });

      const accounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts();
      set({ accounts, selectedExtensions: [selectedExtension] });
    }
  },
}));

export const baseStoreWallet = baseStore;
export const useStoreWallet = createSelectors(baseStore);
