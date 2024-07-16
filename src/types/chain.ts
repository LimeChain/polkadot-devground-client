export interface ISupportedChains {
  [key: string]: {
    name: string;
    chains: IChain[];
  };
}
export interface IChain {
  name: string;
  id: string;
  icon: `icon-chain-${string}`;
}

export type TChainSubscription =
  'latest-block' |
  'finalised-block' |
  'signed-extrinsics' |
  'transfers' |
  'total-accounts' |
  'circulating-supply';
