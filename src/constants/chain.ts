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
import {
  getSmoldotChainClient,
  getWsChainClient,
} from '@utils/papi';

import type {
  ISupportedChainGroups,
  TExternalExplorer,
  TParaChainDecsriptor,
  TPeopleChainDecsriptor,
  TRelayChainDecsriptor,
  TSupportedChain,
  TSupportedChains,
  TSupportedParaChain,
  TSupportedPeopleChain,
  TSupportedRelayChain,
} from '@custom-types/chain';
import type { Client } from 'polkadot-api/dist/reexports/smoldot';

export const MAX_CHAIN_SET_RETRIES = 5;

export const SUPPORTED_CHAINS: Omit<TSupportedChains, 'paseo-people'> = {
  polkadot: {
    name: 'Polkadot',
    id: 'polkadot',
    icon: 'chain-polkadot',
    isRelayChain: true,
    peopleChainId: 'polkadot-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-people',
      potentialRelayChain: 'polkadot',
    }),
  },
  'polkadot-people': {
    name: 'Polkadot People',
    id: 'polkadot-people',
    icon: 'chain-polkadot-people',
    peopleChainId: 'polkadot-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-people',
      potentialRelayChain: 'polkadot',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-people',
      potentialRelayChain: 'polkadot',
    }),
  },
  'polkadot-asset-hub': {
    name: 'Polkadot Asset Hub',
    id: 'polkadot-asset-hub',
    icon: 'chain-polkadot-asset-hub',
    peopleChainId: 'polkadot-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-asset-hub',
      potentialRelayChain: 'polkadot',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-people',
      potentialRelayChain: 'polkadot',
    }),
  },
  'polkadot-bridge-hub': {
    name: 'Polkadot Bridge Hub',
    id: 'polkadot-bridge-hub',
    icon: 'chain-polkadot-bridge-hub',
    peopleChainId: 'polkadot-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-bridge-hub',
      potentialRelayChain: 'polkadot',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-bridge-hub',
      potentialRelayChain: 'polkadot',
    }),
  },
  'polkadot-collectives': {
    name: 'Polkadot Collectives',
    id: 'polkadot-collectives',
    icon: 'chain-polkadot-collectives',
    peopleChainId: 'polkadot-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-collectives',
      potentialRelayChain: 'polkadot',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'polkadot-people',
      potentialRelayChain: 'polkadot',
    }),
  },
  kusama: {
    name: 'Kusama',
    id: 'kusama',
    icon: 'chain-kusama',
    isRelayChain: true,
    peopleChainId: 'kusama-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama-people',
      potentialRelayChain: 'kusama',
    }),
  },
  'kusama-people': {
    name: 'Kusama People',
    id: 'kusama-people',
    icon: 'chain-kusama-people',
    peopleChainId: 'kusama-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama-people',
      potentialRelayChain: 'kusama',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama-people',
      potentialRelayChain: 'kusama',
    }),
  },
  'kusama-asset-hub': {
    name: 'Kusama Asset Hub',
    id: 'kusama-asset-hub',
    icon: 'chain-kusama-asset-hub',
    peopleChainId: 'kusama-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama-asset-hub',
      potentialRelayChain: 'kusama',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama-people',
      potentialRelayChain: 'kusama',
    }),
  },
  'kusama-bridge-hub': {
    name: 'Kusama Bridge Hub',
    id: 'kusama-bridge-hub',
    icon: 'chain-kusama-bridge-hub',
    peopleChainId: 'kusama-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama-bridge-hub',
      potentialRelayChain: 'kusama',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'kusama-people',
      potentialRelayChain: 'kusama',
    }),
  },
  westend: {
    name: 'Westend',
    id: 'westend',
    icon: 'chain-westend',
    isRelayChain: true,
    peopleChainId: 'westend-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-people',
      potentialRelayChain: 'westend',
    }),
  },
  'westend-people': {
    name: 'Westend People',
    id: 'westend-people',
    icon: 'chain-westend-people',
    peopleChainId: 'westend-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-people',
      potentialRelayChain: 'westend',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-people',
      potentialRelayChain: 'westend',
    }),
  },
  'westend-asset-hub': {
    name: 'Westend Asset Hub',
    id: 'westend-asset-hub',
    icon: 'chain-westend-asset-hub',
    peopleChainId: 'westend-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-asset-hub',
      potentialRelayChain: 'westend',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-people',
      potentialRelayChain: 'westend',
    }),
  },
  'westend-bridge-hub': {
    name: 'Westend Bridge Hub',
    id: 'westend-bridge-hub',
    icon: 'chain-westend-bridge-hub',
    peopleChainId: 'westend-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-bridge-hub',
      potentialRelayChain: 'westend',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-people',
      potentialRelayChain: 'westend',
    }),
  },
  'westend-collectives': {
    name: 'Westend Collectives',
    id: 'westend-collectives',
    icon: 'chain-polkadot-collectives',
    peopleChainId: 'westend-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-collectives',
      potentialRelayChain: 'westend',
    }),
    peopleClient: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'westend-people',
      potentialRelayChain: 'westend',
    }),
  },
  paseo: {
    name: 'Paseo',
    id: 'paseo',
    icon: 'chain-paseo',
    isRelayChain: true,
    peopleChainId: 'polkadot-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'paseo',
    }),
    peopleClient: async () => getWsChainClient({
      chain: 'paseo-people',
    }),
  },
  'paseo-asset-hub': {
    name: 'Paseo Asset Hub',
    id: 'paseo-asset-hub',
    icon: 'chain-paseo-asset-hub',
    peopleChainId: 'polkadot-people',
    client: async (smoldot: Client) => getSmoldotChainClient({
      smoldot,
      chain: 'paseo-asset-hub',
      potentialRelayChain: 'paseo',
    }),
    peopleClient: async () => getWsChainClient({
      chain: 'paseo-people',
    }),
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
  'paseo-people': async () => '',
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
  [key in TSupportedParaChain | TSupportedPeopleChain]: TParaChainDecsriptor | TPeopleChainDecsriptor | null
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
  'paseo-people': null,
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
  'paseo-people': 'wss://people-paseo.rpc.amforc.com',
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
  'paseo-people': {},
  'paseo-asset-hub': {
    subscan: 'https://assethub-paseo.subscan.io',
  },
};
