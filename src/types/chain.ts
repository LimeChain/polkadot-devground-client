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
