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

export type TChain = TRelayChain | TParaChain;
export type TRelayChain = TChainBase & {
  isRelayChain: true;
  isParaChain?: false;
  peopleChainId: TSupportedParaChain;
};
export type TParaChain = TChainBase & {
  isRelayChain?: false;
  isParaChain: true;
  relayChainId: TSupportedRelayChain;
  peopleChainId: TSupportedParaChain;
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
