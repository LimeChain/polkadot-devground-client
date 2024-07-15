import {
  dot,
  rococo,
} from '@polkadot-api/descriptors';
import { createClient } from 'https://esm.sh/polkadot-api@0.10.0';
import { chainSpec as polkadotChainSpec } from 'polkadot-api/chains/polkadot';
import { chainSpec as rococoChainSpec } from 'polkadot-api/chains/rococo_v2_2';

import type { ISupportedChains } from '@custom-types/chain';

export { createClient };

export const SUPPORTED_CHAIN_GROUPS: ISupportedChains = {
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

export const CHAIN_SPECS = {
  [SUPPORTED_CHAIN_GROUPS['polkadot'].chains[0].id]: polkadotChainSpec,
  [SUPPORTED_CHAIN_GROUPS['rococo'].chains[0].id]: rococoChainSpec,
};

export const CHAIN_DESCRIPTORS = {
  [SUPPORTED_CHAIN_GROUPS['polkadot'].chains[0].id]: dot,
  [SUPPORTED_CHAIN_GROUPS['rococo'].chains[0].id]: rococo,
};
