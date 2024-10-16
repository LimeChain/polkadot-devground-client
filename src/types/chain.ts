import { type Chain } from 'polkadot-api/smoldot';

import type {
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
} from '.papi/descriptors/dist';
import type {
  PolkadotClient,
  SS58String,
  TypedApi,
} from 'polkadot-api';

export interface ISupportedChainGroups {
  [key: string]: {
    name: string;
    chains: TChain[];
  };
}

export type TSupportedChains = {
  [key in TSupportedChain]: TChain
};

export type TExternalExplorer = 'subscan' | 'statescan';

export type TSupportedRelayChain =
  | 'polkadot'
  | 'kusama'
  | 'paseo'
  | 'westend';
export type TSupportedParaChain =
  | 'polkadot-people'
  | 'polkadot-asset-hub'
  | 'polkadot-bridge-hub'
  | 'polkadot-collectives'
  | 'kusama-people'
  | 'kusama-asset-hub'
  | 'kusama-bridge-hub'
  | 'westend-people'
  | 'westend-asset-hub'
  | 'westend-bridge-hub'
  | 'westend-collectives'
  | 'paseo-asset-hub';
export type TSupportedChain = TSupportedRelayChain | TSupportedParaChain;
export type TRelayChainDecsriptor =
  | typeof dot
  | typeof kusama
  | typeof paseo
  | typeof westend;

export type TParaChainDecsriptor =
  | typeof dotpeople
  | typeof dot_asset_hub
  | typeof dot_bridge_hub
  | typeof dot_collectives
  | typeof kusama_people
  | typeof kusama_asset_hub
  | typeof kusama_bridge_hub
  | typeof westend_people
  | typeof westend_asset_hub
  | typeof westend_bridge_hub
  | typeof westend_collectives
  | typeof paseo_asset_hub;

export type TPeopleChainDecsriptor =
  | typeof dotpeople
  | typeof kusama_people
  | typeof westend_people;

export type TApi = TypedApi<TRelayChainDecsriptor | TParaChainDecsriptor>;
export type TPeopleApi = TypedApi<TPeopleChainDecsriptor>;
export type TRelayApi = TypedApi<TRelayChainDecsriptor>;

export type TChain = TRelayChain | TParaChain;
type TRelayChain = TChainBase & {
  isRelayChain: true;
  peopleChainId: TSupportedParaChain;
};

type TParaChain = TChainBase & {
  isRelayChain?: false;
  relayChainId: TSupportedRelayChain;
  peopleChainId: TSupportedParaChain;
};

type TChainBase = {
  name: string;
  id: TSupportedChain;
  icon: `chain-${TSupportedChain}`;
};

export interface TChainSpecs extends Awaited<ReturnType<PolkadotClient['getChainSpecData']>> {
  properties: {
    ss58Format: number;
    tokenDecimals: number;
    tokenSymbol: string;
  };
}

export interface IRuntime {
  spec_version: number;
  spec_name: string;
}

export type TSmoldotChain = Chain | void;

export interface IBlockStoreData {
  number?: number;
  hash: string;
  timestamp: number;
  eventsLength: number;
  validator?: string;
  extrinsics: IExtrinsicStoreData[];
  identity?: Identity;
}
export interface IExtrinsicStoreData {
  id: string;
  blockNumber: number;
  signer: string;
  timestamp: number;
  isSuccess: boolean;
  method: string;
  section: string;
}

interface Identity {
  name?: string;
  address: SS58String;
}
