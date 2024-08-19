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
export type TSupportedPeopleChain = 'polkadot-people' | 'rococo-people';
// Use after supporting at least one parachain
// export type TSupportedParaChain = '';
// export type TSupportedChain = TSupportedRelayChain | TSupportedPeopleChain | TSupportedParaChain;
export type TSupportedChain = TSupportedRelayChain | TSupportedPeopleChain;

export type TChain = TRelayChain | TParaChain | TPeopleChain;
export type TRelayChain = TChainBase & {
  isRelayChain: true;
  peopleChainId: TSupportedPeopleChain;
};
export type TParaChain = TChainBase & {
  isParaChain: true;
  relayChainId: TSupportedRelayChain;
  peopleChainId: TSupportedPeopleChain;
};
export type TPeopleChain = TChainBase & {
  isPeopleChain: true;
  relayChainId: TSupportedRelayChain;
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
