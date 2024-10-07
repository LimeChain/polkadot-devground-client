import { chainSpec as polkadotChainSpec } from 'polkadot-api/chains/polkadot';
import { chainSpec as polkadotAssetHubChainSpec } from 'polkadot-api/chains/polkadot_asset_hub';
import { chainSpec as polkadotBridgeHubChainSpec } from 'polkadot-api/chains/polkadot_bridge_hub';
import { chainSpec as polkadotCollectivesChainSpec } from 'polkadot-api/chains/polkadot_collectives';
import { chainSpec as polkadotPeopleChainSpec } from 'polkadot-api/chains/polkadot_people';
import { chainSpec as rococoChainSpec } from 'polkadot-api/chains/rococo_v2_2';
import { chainSpec as rococoPeopleChainSpec } from 'polkadot-api/chains/rococo_v2_2_people';

import {
  dot,
  dot_asset_hub,
  dot_bridge_hub,
  dot_collectives,
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
    icon: 'chain-polkadot',
    isRelayChain: true,
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-people': {
    name: 'Polkadot People',
    id: 'polkadot-people',
    icon: 'chain-polkadot',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-asset-hub': {
    name: 'Polkadot Asset Hub',
    id: 'polkadot-asset-hub',
    icon: 'icon-chain-polkadot',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-bridge-hub': {
    name: 'Polkadot Bridge Hub',
    id: 'polkadot-bridge-hub',
    icon: 'icon-chain-polkadot',
    isParaChain: true,
    relayChainId: 'polkadot',
    peopleChainId: 'polkadot-people',
    hasStaking: true,
    stakingChainId: 'polkadot',
  },
  'polkadot-collectives': {
    name: 'Polkadot Collectives',
    id: 'polkadot-collectives',
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
    icon: 'chain-rococo',
    isRelayChain: true,
    peopleChainId: 'rococo-people',
    hasStaking: false,
  },
  'rococo-people': {
    name: 'Rococo People',
    id: 'rococo-people',
    icon: 'chain-rococo',
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
    ],
  },
};

export const CHAIN_SPECS: {
  [key in TSupportedChain]: string
} = {
  polkadot: polkadotChainSpec,
  'polkadot-people': polkadotPeopleChainSpec,
  'polkadot-asset-hub': polkadotAssetHubChainSpec,
  'polkadot-bridge-hub': polkadotBridgeHubChainSpec,
  'polkadot-collectives': polkadotCollectivesChainSpec,
  rococo: rococoChainSpec,
  'rococo-people': rococoPeopleChainSpec,
};

const RELAY_CHAIN_DESCRIPTORS: {
  [key in TSupportedRelayChain]: TRelayChainDecsriptor
} = {
  polkadot: dot,
  rococo,
};

const PARA_CHAIN_DESCRIPTORS: {
  [key in TSupportedParaChain]: TParaChainDecsriptor
} = {
  'polkadot-people': dotpeople,
  'polkadot-asset-hub': dot_asset_hub,
  'polkadot-bridge-hub': dot_bridge_hub,
  'polkadot-collectives': dot_collectives,
  'rococo-people': rococo_people,
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
  rococo: 'wss://rococo-rpc.polkadot.io',
  'rococo-people': 'wss://rococo-people-rpc.polkadot.io',
};
