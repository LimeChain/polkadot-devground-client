import { create } from 'zustand';

import { createSelectors } from '../createSelectors';

import type { ApiPromise } from '@polkadot/api';

interface IChainClient {
  client: ApiPromise | null;
  isLoadingChainClient: boolean;
  actions: {
    changeClientChain: () => void;
  };
  init: () => void;
}

const initialState = {
  client: null,
  isLoadingChainClient: true,
};

const chainClientStore = create<IChainClient>()((set) => ({
  ...initialState,
  actions: {
    changeClientChain() {
    },
  },
  async init() {
  // const client = createClient(
  //   WebSocketProvider('wss://dot-rpc.stakeworld.io'),
  // );

  // client.finalizedBlock$.subscribe((finalizedBlock) =>
  //   console.log(finalizedBlock.number, finalizedBlock.hash),
  // );

  // const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  // const api = await ApiPromise.create({ provider: wsProvider });

  // set({ client: api, isLoadingChainClient: false });

  },
}));

export const useStoreChainClient = createSelectors(chainClientStore);
