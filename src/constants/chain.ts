import {
  dot,
  dot_asset_hub,
  dot_bridge_hub,
  dot_collectives,
  dotpeople,
  kusama,
  kusama_asset_hub,
  kusama_bridge_hub,
  kusama_people,
  paseo,
  paseo_asset_hub,
  westend,
  westend_asset_hub,
  westend_bridge_hub,
  westend_collectives,
  westend_people,
} from '@polkadot-api/descriptors';

import type {
  ISupportedChainGroups,
  TExternalExplorer,
  TParaChainDecsriptor,
  TRelayChainDecsriptor,
  TSupportedChain,
  TSupportedChains,
  TSupportedParaChain,
  TSupportedRelayChain,
} from '@custom-types/chain';

export const MAX_CHAIN_SET_RETRIES = 5;

export const SUPPORTED_CHAINS: TSupportedChains = {
  polkadot: {
    name: 'Polkadot',
    id: 'polkadot',
    icon: 'chain-polkadot',
    isRelayChain: true,
    peopleChainId: 'polkadot-people',
  },
  'polkadot-people': {
    name: 'Polkadot People',
    id: 'polkadot-people',
    icon: 'chain-polkadot-people',
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
  },
  'polkadot-asset-hub': {
    name: 'Polkadot Asset Hub',
    id: 'polkadot-asset-hub',
    icon: 'chain-polkadot-asset-hub',
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
  },
  'polkadot-bridge-hub': {
    name: 'Polkadot Bridge Hub',
    id: 'polkadot-bridge-hub',
    icon: 'chain-polkadot-bridge-hub',
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
  },
  'polkadot-collectives': {
    name: 'Polkadot Collectives',
    id: 'polkadot-collectives',
    icon: 'chain-polkadot-collectives',
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
  },
  kusama: {
    name: 'Kusama',
    id: 'kusama',
    icon: 'chain-kusama',
    isRelayChain: true,
    peopleChainId: 'kusama-people',
  },
  'kusama-people': {
    name: 'Kusama People',
    id: 'kusama-people',
    icon: 'chain-kusama-people',
    relayChainId: 'kusama',
    peopleChainId: 'kusama-people',
  },
  'kusama-asset-hub': {
    name: 'Kusama Asset Hub',
    id: 'kusama-asset-hub',
    icon: 'chain-kusama-asset-hub',
    relayChainId: 'kusama',
    peopleChainId: 'kusama-people',
  },
  'kusama-bridge-hub': {
    name: 'Kusama Bridge Hub',
    id: 'kusama-bridge-hub',
    icon: 'chain-kusama-bridge-hub',
    relayChainId: 'kusama',
    peopleChainId: 'kusama-people',
  },
  westend: {
    name: 'Westend',
    id: 'westend',
    icon: 'chain-westend',
    isRelayChain: true,
    peopleChainId: 'westend-people',
  },
  'westend-people': {
    name: 'Westend People',
    id: 'westend-people',
    icon: 'chain-westend-people',
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
  },
  'westend-asset-hub': {
    name: 'Westend Asset Hub',
    id: 'westend-asset-hub',
    icon: 'chain-westend-asset-hub',
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
  },
  'westend-bridge-hub': {
    name: 'Westend Bridge Hub',
    id: 'westend-bridge-hub',
    icon: 'chain-westend-bridge-hub',
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
  },
  'westend-collectives': {
    name: 'Westend Collectives',
    id: 'westend-collectives',
    icon: 'chain-polkadot-collectives',
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
  },
  paseo: {
    name: 'Paseo',
    id: 'paseo',
    icon: 'chain-paseo',
    isRelayChain: true,
    // suport for paseo people?
    peopleChainId: 'polkadot-people',
  },
  'paseo-asset-hub': {
    name: 'Paseo Asset Hub',
    id: 'paseo-asset-hub',
    icon: 'chain-paseo-asset-hub',
    relayChainId: 'paseo',
    // suport for paseo people?
    peopleChainId: 'polkadot-people',
  },
};

export const SUPPORTED_CHAIN_GROUPS: ISupportedChainGroups = {
  'polkadot': {
    name: 'Polkadot & Parachains',
    chains: [
      SUPPORTED_CHAINS['polkadot'],
      SUPPORTED_CHAINS['polkadot-people'],
      SUPPORTED_CHAINS['polkadot-asset-hub'],
      SUPPORTED_CHAINS['polkadot-bridge-hub'],
      SUPPORTED_CHAINS['polkadot-collectives'],
    ],
  },
  'kusama': {
    name: 'Kusama & Parachains',
    chains: [
      SUPPORTED_CHAINS['kusama'],
      SUPPORTED_CHAINS['kusama-people'],
      SUPPORTED_CHAINS['kusama-asset-hub'],
      SUPPORTED_CHAINS['kusama-bridge-hub'],
    ],
  },
  'westend': {
    name: 'Westend & Parachains',
    chains: [
      SUPPORTED_CHAINS['westend'],
      SUPPORTED_CHAINS['westend-people'],
      SUPPORTED_CHAINS['westend-asset-hub'],
      SUPPORTED_CHAINS['westend-bridge-hub'],
      SUPPORTED_CHAINS['westend-collectives'],
    ],
  },
  'paseo': {
    name: 'Paseo & Parachains',
    chains: [
      SUPPORTED_CHAINS['paseo'],
      SUPPORTED_CHAINS['paseo-asset-hub'],
    ],
  },
};

export const CHAIN_SPECS: {
  [key in TSupportedChain]: () => Promise<string>
} = {
  polkadot: async () => await import('polkadot-api/chains/polkadot').then((res) => res.chainSpec),
  'polkadot-people': async () => await import('polkadot-api/chains/polkadot_people').then((res) => res.chainSpec),
  'polkadot-asset-hub': async () => await import('polkadot-api/chains/polkadot_asset_hub').then((res) => res.chainSpec),
  'polkadot-bridge-hub': async () => await import('polkadot-api/chains/polkadot_bridge_hub').then((res) => res.chainSpec),
  'polkadot-collectives': async () => await import('polkadot-api/chains/polkadot_collectives').then((res) => res.chainSpec),
  kusama: async () => await import('polkadot-api/chains/ksmcc3').then((res) => res.chainSpec),
  'kusama-people': async () => await import('polkadot-api/chains/ksmcc3_people').then((res) => res.chainSpec),
  'kusama-asset-hub': async () => await import('polkadot-api/chains/ksmcc3_people').then((res) => res.chainSpec),
  'kusama-bridge-hub': async () => await import('polkadot-api/chains/ksmcc3_bridge_hub').then((res) => res.chainSpec),
  westend: async () => await import('polkadot-api/chains/westend2').then((res) => res.chainSpec),
  'westend-people': async () => await import('polkadot-api/chains/westend2_people').then((res) => res.chainSpec),
  'westend-asset-hub': async () => await import('polkadot-api/chains/westend2_asset_hub').then((res) => res.chainSpec),
  'westend-bridge-hub': async () => await import('polkadot-api/chains/westend2_bridge_hub').then((res) => res.chainSpec),
  'westend-collectives': async () => await import('polkadot-api/chains/westend2_collectives').then((res) => res.chainSpec),
  paseo: async () => await import('polkadot-api/chains/paseo').then((res) => res.chainSpec),
  'paseo-asset-hub': async () => await import('polkadot-api/chains/paseo_asset_hub').then((res) => res.chainSpec),
};

const RELAY_CHAIN_DESCRIPTORS: {
  [key in TSupportedRelayChain]: TRelayChainDecsriptor
} = {
  polkadot: dot,
  kusama,
  westend,
  paseo,
};

const PARA_CHAIN_DESCRIPTORS: {
  [key in TSupportedParaChain]: TParaChainDecsriptor
} = {
  'polkadot-people': dotpeople,
  'polkadot-asset-hub': dot_asset_hub,
  'polkadot-bridge-hub': dot_bridge_hub,
  'polkadot-collectives': dot_collectives,
  'westend-people': westend_people,
  'westend-asset-hub': westend_asset_hub,
  'westend-bridge-hub': westend_bridge_hub,
  'westend-collectives': westend_collectives,
  'kusama-people': kusama_people,
  'kusama-asset-hub': kusama_asset_hub,
  'kusama-bridge-hub': kusama_bridge_hub,
  'paseo-asset-hub': paseo_asset_hub,
};

export const CHAIN_DESCRIPTORS = {
  ...RELAY_CHAIN_DESCRIPTORS,
  ...PARA_CHAIN_DESCRIPTORS,
};

export const CHAIN_WEBSOCKET_URLS: { [key in TSupportedChain]: string } = {
  polkadot: 'wss://polkadot-rpc.publicnode.com',
  'polkadot-people': 'wss://polkadot-people-rpc.polkadot.io',
  'polkadot-asset-hub': 'wss://polkadot-asset-hub-rpc.polkadot.io',
  'polkadot-bridge-hub': 'wss://polkadot-bridge-hub-rpc.polkadot.io',
  'polkadot-collectives': 'wss://polkadot-collectives-rpc.polkadot.io',
  westend: 'wss://westend-rpc.polkadot.io',
  'westend-people': 'wss://westend-people-rpc.polkadot.io',
  'westend-asset-hub': 'wss://westend-asset-hub-rpc.polkadot.io',
  'westend-bridge-hub': 'wss://westend-bridge-hub-rpc.polkadot.io',
  'westend-collectives': 'wss://westend-collectives-rpc.polkadot.io',
  kusama: 'wss://kusama-rpc.publicnode.com',
  'kusama-people': 'wss://kusama-people-rpc.polkadot.io',
  'kusama-asset-hub': 'wss://kusama-asset-hub-rpc.polkadot.io',
  'kusama-bridge-hub': 'wss://kusama-bridge-hub-rpc.polkadot.io',
  'paseo': 'wss://pas-rpc.stakeworld.io',
  'paseo-asset-hub': 'wss://pas-rpc.stakeworld.io/assethub',
};

export const CHAIN_EXPLORERS: {
  [key in TSupportedChain]: {
    [key in TExternalExplorer]?: string;
  }
} = {
  polkadot: {
    subscan: 'https://polkadot.subscan.io',
    statescan: 'https://www.statescan.io',
  },
  'polkadot-people': {
    subscan: 'https://people-polkadot.subscan.io',
  },
  'polkadot-asset-hub': {
    subscan: 'https://assethub-polkadot.subscan.io',
  },
  'polkadot-bridge-hub': {
    subscan: 'https://bridgehub-polkadot.subscan.io',
    statescan: 'https://bridgehub-polkadot.statescan.io',
  },
  'polkadot-collectives': {
    subscan: 'https://collectives-polkadot.subscan.io',
    statescan: 'https://collectives.statescan.io',
  },
  'westend': {
    subscan: 'https://westend.subscan.io',
  },
  'westend-people': {},
  'westend-asset-hub': {
    subscan: 'https://assethub-westend.subscan.io',
  },
  'westend-bridge-hub': {
    subscan: 'https://bridgehub-westend.subscan.io',
  },
  'westend-collectives': {
    statescan: 'https://westend-collectives.statescan.io',
  },
  'kusama': {
    subscan: 'https://kusama.subscan.io',
    statescan: 'https://kusama.statescan.io',
  },
  'kusama-people': {
    subscan: 'https://people-kusama.subscan.io',
    statescan: 'https://people-kusama.statescan.io',
  },
  'kusama-asset-hub': {
    subscan: 'https://assethub-kusama.subscan.io',
  },
  'kusama-bridge-hub': {
    subscan: 'https://bridgehub-kusama.subscan.io',
    statescan: 'https://bridgehub-kusama.statescan.io',
  },
  paseo: {
    subscan: 'https://paseo.subscan.io',
  },
  'paseo-asset-hub': {
    subscan: 'https://assethub-paseo.subscan.io',
  },
};
