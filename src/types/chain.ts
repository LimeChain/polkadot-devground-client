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
export type TSupportedParaChain = 'polkadot-people' | 'rococo-people';
export type TSupportedChain = TSupportedRelayChain | TSupportedParaChain;

export type TRelayChainDecsriptor = typeof dot | typeof rococo;
export type TParaChainDecsriptor = typeof dotpeople | typeof rococo_people;
export type TChainDescriptor = TRelayChainDecsriptor | TParaChainDecsriptor;

export type TApi = TypedApi<TChainDescriptor>;
export type TPeopleApi = TypedApi<TParaChainDecsriptor>;

export type TChain = TRelayChain | TParaChain;
export type TRelayChain = TChainBase & {
  isRelayChain: true;
  isParaChain?: false;
  peopleChainId: TSupportedParaChain;
};
export type TParaChain = TChainBase & {
  isParaChain: true;
  relayChainId: TSupportedRelayChain;
  peopleChainId: TSupportedParaChain;
  isRelayChain?: false;
};

type TChainBase = {
  name: string;
  id: TSupportedChain;
  icon: `icon-chain-${TSupportedChain}`;
};

export type TChainSubscription =
  'latest-block' |
  'finalised-block' |
  'signed-extrinsics' |
  'transfers' |
  'total-accounts' |
  'circulating-supply';

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
