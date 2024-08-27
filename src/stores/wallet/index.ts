import {
  connectInjectedExtension,
  getInjectedExtensions,
  type InjectedExtension,
  type InjectedPolkadotAccount,
} from 'polkadot-api/pjs-signer';
import { create } from 'zustand';

import { createSelectors } from '../createSelectors';

interface StoreInterface {
  extensions: string[];
  selectedExtensions: InjectedExtension[];
  accounts: InjectedPolkadotAccount[];
  actions: {
    connect: () => void;
    disconnect: () => void;
  };
}

const initialState: Omit<StoreInterface, 'actions'> = {
  extensions: [],
  selectedExtensions: [],
  accounts: [],
};

const baseStore = create<StoreInterface>()((set, get) => ({
  ...initialState,
  actions: {
    async connect() {
      const extensions: string[] = getInjectedExtensions();

      // Connect to an extension
      const selectedExtension: InjectedExtension = await connectInjectedExtension(
        extensions[0],
      );

      selectedExtension.subscribe((accounts) => {
        set({ accounts });
      });

      // Get accounts registered in the extension
      const accounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts();
      // The signer for each account is in the `polkadotSigner` property of `InjectedPolkadotAccount`

      set({ accounts, extensions, selectedExtensions: [selectedExtension] });

    },

    disconnect() {
      get().selectedExtensions.at(0)?.disconnect();
      set({ accounts: [] });
    },
  },
}));

export const baseStoreWallet = baseStore;
export const useStoreWallet = createSelectors(baseStore);
