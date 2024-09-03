import { type Chain } from 'polkadot-api/smoldot';

import type {
  dot,
  dotpeople,
  rococo,
  rococo_people,
} from '.papi/descriptors/dist';
import type {
  PolkadotClient,
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

export type TSupportedRelayChain = 'polkadot' | 'rococo';
export type TSupportedStakingChain = 'polkadot';
export type TSupportedParaChain = 'polkadot-people' | 'rococo-people';
export type TSupportedChain = TSupportedRelayChain | TSupportedParaChain;

export type TRelayChainDecsriptor = typeof dot | typeof rococo;
export type TStakingChainDecsriptor = typeof dot;
export type TParaChainDecsriptor = typeof dotpeople | typeof rococo_people;
export type TChainDescriptor = TRelayChainDecsriptor | TParaChainDecsriptor;

export type TApi = TypedApi<TChainDescriptor>;
export type TPeopleApi = TypedApi<TParaChainDecsriptor>;
export type TRelayApi = TypedApi<TRelayChainDecsriptor>;
export type TStakingApi = TypedApi<TStakingChainDecsriptor>;

export type TChain = TRelayChain | TParaChain;
export type TRelayChain = TChainBase & TStakingChain & {
  isRelayChain: true;
  isParaChain?: false;
  peopleChainId: TSupportedParaChain;
};
export type TParaChain = TChainBase & TStakingChain & {
  isParaChain: true;
  isRelayChain?: false;
  relayChainId: TSupportedRelayChain;
  peopleChainId: TSupportedParaChain;
};

export type TStakingChain = {
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
