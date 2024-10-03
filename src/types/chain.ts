import { type Chain } from 'polkadot-api/smoldot';

import type {
  dot,
  dotpeople,
  rococo,
  rococo_people,
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

type TSupportedStakingChain = 'polkadot';
export type TSupportedRelayChain = 'polkadot' | 'rococo';
export type TSupportedParaChain = 'polkadot-people' | 'rococo-people';
export type TSupportedChain = TSupportedRelayChain | TSupportedParaChain;

export type TRelayChainDecsriptor = typeof dot | typeof rococo;
export type TStakingChainDecsriptor = typeof dot;
export type TParaChainDecsriptor = typeof dotpeople | typeof rococo_people;

export type TApi = TypedApi<TRelayChainDecsriptor | TParaChainDecsriptor>;
export type TPeopleApi = TypedApi<TParaChainDecsriptor>;
export type TRelayApi = TypedApi<TRelayChainDecsriptor>;
export type TStakingApi = TypedApi<TStakingChainDecsriptor>;

export type TChain = TRelayChain | TParaChain;
type TRelayChain = TChainBase & TStakingChain & {
  isRelayChain: true;
  isParaChain?: false;
  peopleChainId: TSupportedParaChain;
};

type TParaChain = TChainBase & TStakingChain & {
  isParaChain: true;
  isRelayChain?: false;
  relayChainId: TSupportedRelayChain;
  peopleChainId: TSupportedParaChain;
};

type TStakingChain = {
  hasStaking: true;
  stakingChainId: TSupportedStakingChain;
} | {
  hasStaking: false;
};

type TChainBase = {
  name: string;
  id: TSupportedChain;
  icon: `icon-chain-${TSupportedChain}`;
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
  number: number;
  hash: string;
  timestamp: number;
  eventsLength: number;
  validator: string;
  extrinsics: IExtrinsicStoreData[];
  identity: Identity;
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
