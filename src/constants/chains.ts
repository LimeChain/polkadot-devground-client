import type { ISupportedChains } from '@custom-types/chain';

export const SUPPORTED_CHAINS: ISupportedChains = {
  'polkadot': {
    name: 'Polkadot & Parachains',
    chains: [
      {
        name: 'Polkadot',
        id: 'polkadot',
        icon: 'icon-chain-polkadot',
      },
      // {
      //   name: 'Astar',
      //   icon: 'icon-chain-astar',
      // },
    ],
  },
  'rococo': {
    name: 'Rococo & Parachains',
    chains: [
      {
        name: 'Rococo',
        id: 'rococo',
        icon: 'icon-chain-rococo',
      },
    ],
  },
};
