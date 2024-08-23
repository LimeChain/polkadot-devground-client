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
  TParaChainDecsriptor,
  TRelayChainDecsriptor,
  TSupportedChain,
  TSupportedChains,
  TSupportedParaChain,
  TSupportedRelayChain,
} from '@custom-types/chain';

export const SUPPORTED_CHAINS: TSupportedChains = {
  polkadot: {
    name: 'Polkadot',
    id: 'polkadot',
    icon: 'icon-chain-polkadot',
    isRelayChain: true,
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-people': {
    name: 'Polkadot People',
    id: 'polkadot-people',
    icon: 'icon-chain-polkadot',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  rococo: {
    name: 'Rococo',
    id: 'rococo',
    icon: 'icon-chain-rococo',
    isRelayChain: true,
    peopleChainId: 'rococo-people',
    hasStaking: false,
  },
  'rococo-people': {
    name: 'Rococo People',
    id: 'rococo-people',
    icon: 'icon-chain-rococo',
    isParaChain: true,
    relayChainId: 'rococo',
    peopleChainId: 'rococo-people',
    hasStaking: false,
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

export const RELAY_CHAIN_DESCRIPTORS: {
  [key in TSupportedRelayChain]: TRelayChainDecsriptor
} = {
  polkadot: dot,
  rococo,
};

export const PARA_CHAIN_DESCRIPTORS: {
  [key in TSupportedParaChain]: TParaChainDecsriptor
} = {
  'polkadot-people': dotpeople,
  'rococo-people': rococo_people,
};

export const CHAIN_DESCRIPTORS = {
  ...RELAY_CHAIN_DESCRIPTORS,
  ...PARA_CHAIN_DESCRIPTORS,
};

export const CHAIN_WEBSOCKET_URLS: { [key in TSupportedChain]: string } = {
  polkadot: 'wss://polkadot-rpc.publicnode.com',
  'polkadot-people': 'wss://polkadot-people-rpc.polkadot.io',
  rococo: 'wss://rococo-rpc.polkadot.io',
  'rococo-people': 'wss://rococo-people-rpc.polkadot.io',
};
