import { chainSpec as polkadotChainSpec } from 'polkadot-api/chains/polkadot';
import { chainSpec as polkadotPeopleChainSpec } from 'polkadot-api/chains/polkadot_people';
import { chainSpec as rococoChainSpec } from 'polkadot-api/chains/rococo_v2_2';
import { chainSpec as rococoPeopleChainSpec } from 'polkadot-api/chains/rococo_v2_2_people';

import {
  dot,
  dotpeople,
  rococo,
  rococo_people,
} from '@polkadot-api/descriptors';

import type {
  ISupportedChainGroups,
  TSupportedChain,
  TSupportedChains,
} from '@custom-types/chain';

export const SUPPORTED_CHAINS: TSupportedChains = {
  polkadot: {
    name: 'Polkadot',
    id: 'polkadot',
    icon: 'icon-chain-polkadot',
    isRelayChain: true,
    peopleChainId: 'polkadot-people',
  },
  'polkadot-people': {
    name: 'Polkadot People',
    id: 'polkadot-people',
    icon: 'icon-chain-polkadot',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
  },
  rococo: {
    name: 'Rococo',
    id: 'rococo',
    icon: 'icon-chain-rococo',
    isRelayChain: true,
    peopleChainId: 'rococo-people',
  },
  'rococo-people': {
    name: 'Rococo People',
    id: 'rococo-people',
    icon: 'icon-chain-rococo',
    isParaChain: true,
    relayChainId: 'rococo',
    peopleChainId: 'rococo-people',
  },
};

export const SUPPORTED_CHAIN_GROUPS: ISupportedChainGroups = {
  'polkadot': {
    name: 'Polkadot & Parachains',
    chains: [
      SUPPORTED_CHAINS['polkadot'],
      SUPPORTED_CHAINS['polkadot-people'],
    ],
  },
  'rococo': {
    name: 'Rococo & Parachains',
    chains: [
      SUPPORTED_CHAINS['rococo'],
      SUPPORTED_CHAINS['rococo-people'],
    ],
  },
};

export const CHAIN_SPECS: {
  [key in TSupportedChain]: string
} = {
  polkadot: polkadotChainSpec,
  'polkadot-people': polkadotPeopleChainSpec,
  rococo: rococoChainSpec,
  'rococo-people': rococoPeopleChainSpec,
};

export const CHAIN_DESCRIPTORS: {
  [key in TSupportedChain]:
  typeof dotpeople |
  typeof dot |
  typeof rococo |
  typeof rococo_people
} = {
  polkadot: dot,
  'polkadot-people': dotpeople,
  rococo,
  'rococo-people': rococo_people,
};

export const CHAIN_WEBSOCKET_URLS: { [key in TSupportedChain]: string } = {
  polkadot: 'wss://polkadot-rpc.publicnode.com',
  'polkadot-people': 'wss://polkadot-people-rpc.polkadot.io',
  rococo: 'wss://rococo-rpc.polkadot.io',
  'rococo-people': 'wss://rococo-people-rpc.polkadot.io',
};
