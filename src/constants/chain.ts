import {
  dot,
  dot_asset_hub,
  dot_bridge_hub,
  dot_collectives,
  dotpeople,
  kusama,
  paseo,
  paseo_asset_hub,
  rococo,
  rococo_asset_hub,
  rococo_bridge_hub,
  rococo_people,
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

export const SUPPORTED_CHAINS: TSupportedChains = {
  polkadot: {
    name: 'Polkadot',
    id: 'polkadot',
    icon: 'chain-polkadot',
    isRelayChain: true,
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-people': {
    name: 'Polkadot People',
    id: 'polkadot-people',
    icon: 'chain-polkadot-people',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-asset-hub': {
    name: 'Polkadot Asset Hub',
    id: 'polkadot-asset-hub',
    icon: 'chain-polkadot-asset-hub',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-bridge-hub': {
    name: 'Polkadot Bridge Hub',
    id: 'polkadot-bridge-hub',
    icon: 'chain-polkadot-bridge-hub',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-collectives': {
    name: 'Polkadot Collectives',
    id: 'polkadot-collectives',
    icon: 'chain-polkadot-collectives',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  rococo: {
    name: 'Rococo',
    id: 'rococo',
    icon: 'chain-rococo',
    isRelayChain: true,
    peopleChainId: 'rococo-people',
    hasStaking: false,
  },
  'rococo-people': {
    name: 'Rococo People',
    id: 'rococo-people',
    icon: 'chain-rococo-people',
    isParaChain: true,
    relayChainId: 'rococo',
    peopleChainId: 'rococo-people',
    hasStaking: false,
  },
  'rococo-asset-hub': {
    name: 'Rococo Asset Hub',
    id: 'rococo-asset-hub',
    icon: 'chain-rococo-asset-hub',
    isParaChain: true,
    relayChainId: 'rococo',
    peopleChainId: 'rococo-people',
    hasStaking: false,
  },
  'rococo-bridge-hub': {
    name: 'Rococo Bridge Hub',
    id: 'rococo-bridge-hub',
    icon: 'chain-rococo-bridge-hub',
    isParaChain: true,
    relayChainId: 'rococo',
    peopleChainId: 'rococo-people',
    hasStaking: false,
  },
  kusama: {
    name: 'Kusama',
    id: 'kusama',
    icon: 'chain-kusama',
    isRelayChain: true,
    peopleChainId: 'kusama-people',
    hasStaking: true,
    stakingChainId: 'kusama',
  },
  'kusama-people': {
    name: 'Kusama People',
    id: 'kusama-people',
    icon: 'chain-kusama-people',
    isParaChain: true,
    relayChainId: 'kusama',
    peopleChainId: 'kusama-people',
    hasStaking: true,
    stakingChainId: 'kusama',
  },
  'kusama-asset-hub': {
    name: 'Kusama Asset Hub',
    id: 'kusama-asset-hub',
    icon: 'chain-kusama-asset-hub',
    isParaChain: true,
    relayChainId: 'kusama',
    peopleChainId: 'kusama-people',
    hasStaking: true,
    stakingChainId: 'kusama',
  },
  'kusama-bridge-hub': {
    name: 'Kusama Bridge Hub',
    id: 'kusama-bridge-hub',
    icon: 'chain-kusama-bridge-hub',
    isParaChain: true,
    relayChainId: 'kusama',
    peopleChainId: 'kusama-people',
    hasStaking: true,
    stakingChainId: 'kusama',
  },
  westend: {
    name: 'Westend',
    id: 'westend',
    icon: 'chain-westend',
    isRelayChain: true,
    peopleChainId: 'westend-people',
    hasStaking: true,
    stakingChainId: 'westend',
  },
  'westend-people': {
    name: 'Westend People',
    id: 'westend-people',
    icon: 'chain-westend-people',
    isParaChain: true,
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
    hasStaking: true,
    stakingChainId: 'westend',
  },
  'westend-asset-hub': {
    name: 'Westend Asset Hub',
    id: 'westend-asset-hub',
    icon: 'chain-westend-asset-hub',
    isParaChain: true,
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
    hasStaking: true,
    stakingChainId: 'westend',
  },
  'westend-bridge-hub': {
    name: 'Westend Bridge Hub',
    id: 'westend-bridge-hub',
    icon: 'chain-westend-bridge-hub',
    isParaChain: true,
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
    hasStaking: true,
    stakingChainId: 'westend',
  },
  'westend-collectives': {
    name: 'Westend Collectives',
    id: 'westend-collectives',
    icon: 'chain-westend-collectives',
    isParaChain: true,
    relayChainId: 'westend',
    peopleChainId: 'westend-people',
    hasStaking: true,
    stakingChainId: 'westend',
  },
  paseo: {
    name: 'Paseo',
    id: 'paseo',
    icon: 'chain-paseo',
    isRelayChain: true,
    // suport for paseo people?
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'paseo',
  },
  'paseo-asset-hub': {
    name: 'Paseo Asset Hub',
    id: 'paseo-asset-hub',
    icon: 'chain-paseo-asset-hub',
    isParaChain: true,
    relayChainId: 'paseo',
    // suport for paseo people?
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'paseo',
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
  'rococo': {
    name: 'Rococo & Parachains',
    chains: [
      SUPPORTED_CHAINS['rococo'],
      SUPPORTED_CHAINS['rococo-people'],
      SUPPORTED_CHAINS['rococo-asset-hub'],
      SUPPORTED_CHAINS['rococo-bridge-hub'],
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
  polkadot: () => import('polkadot-api/chains/polkadot').then((res) => res.chainSpec),
  'polkadot-people': () => import('polkadot-api/chains/polkadot_people').then((res) => res.chainSpec),
  'polkadot-asset-hub': () => import('polkadot-api/chains/polkadot_asset_hub').then((res) => res.chainSpec),
  'polkadot-bridge-hub': () => import('polkadot-api/chains/polkadot_bridge_hub').then((res) => res.chainSpec),
  'polkadot-collectives': () => import('polkadot-api/chains/polkadot_collectives').then((res) => res.chainSpec),
  kusama: () => import('polkadot-api/chains/ksmcc3').then((res) => res.chainSpec),
  'kusama-people': () => import('polkadot-api/chains/ksmcc3_people').then((res) => res.chainSpec),
  'kusama-asset-hub': () => import('polkadot-api/chains/ksmcc3_people').then((res) => res.chainSpec),
  'kusama-bridge-hub': () => import('polkadot-api/chains/ksmcc3_bridge_hub').then((res) => res.chainSpec),
  rococo: () => import('polkadot-api/chains/rococo_v2_2').then((res) => res.chainSpec),
  'rococo-people': () => import('polkadot-api/chains/rococo_v2_2_people').then((res) => res.chainSpec),
  'rococo-asset-hub': () => import('polkadot-api/chains/rococo_v2_2_asset_hub').then((res) => res.chainSpec),
  'rococo-bridge-hub': () => import('polkadot-api/chains/rococo_v2_2_bridge_hub').then((res) => res.chainSpec),
  westend: () => import('polkadot-api/chains/westend2').then((res) => res.chainSpec),
  'westend-people': () => import('polkadot-api/chains/westend2_people').then((res) => res.chainSpec),
  'westend-asset-hub': () => import('polkadot-api/chains/westend2_asset_hub').then((res) => res.chainSpec),
  'westend-bridge-hub': () => import('polkadot-api/chains/westend2_bridge_hub').then((res) => res.chainSpec),
  'westend-collectives': () => import('polkadot-api/chains/westend2_collectives').then((res) => res.chainSpec),
  paseo: () => import('polkadot-api/chains/paseo').then((res) => res.chainSpec),
  'paseo-asset-hub': () => import('polkadot-api/chains/paseo_asset_hub').then((res) => res.chainSpec),
};

const RELAY_CHAIN_DESCRIPTORS: {
  [key in TSupportedRelayChain]: TRelayChainDecsriptor
} = {
  polkadot: dot,
  rococo,
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
  'rococo-people': rococo_people,
  'rococo-asset-hub': rococo_asset_hub,
  'rococo-bridge-hub': rococo_bridge_hub,
  'kusama-people': rococo_people,
  'kusama-asset-hub': rococo_asset_hub,
  'kusama-bridge-hub': rococo_bridge_hub,
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
  rococo: 'wss://rococo-rpc.polkadot.io',
  'rococo-people': 'wss://rococo-people-rpc.polkadot.io',
  'rococo-asset-hub': 'wss://rococo-asset-hub-rpc.polkadot.io',
  'rococo-bridge-hub': 'wss://rococo-bridge-hub-rpc.polkadot.io',
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
  rococo: {
    subscan: 'https://rococo.subscan.io',
  },
  'rococo-people': {},
  'rococo-asset-hub': {
    subscan: 'https://assethub-rococo.subscan.io',
  },
  'rococo-bridge-hub': {
    subscan: 'https://bridgehub-rococo.subscan.io',
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
