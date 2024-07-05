export interface ISupportedChains {
  [key:string] : {
    name: string;
    chains: IChain[];
  };
}
export interface IChain {
  name:string;
  id:string;
  icon:`icon-chain-${string}`;
}

export const SUPPORTED_CHAINS:ISupportedChains = 
    {
      'polkadot': {
        name: 'Polkadot & Parachains',
        chains: [
          {
            name: 'Polkadot',
            id: 'polkadot',
            icon: 'icon-chain-polkadot',
          },
          // {
          //   name: 'Astar',
          //   icon: 'icon-chain-astar',
          // },
        ],
      }, 
      'rococo': {
        name: 'Rococo & Parachains',
        chains: [
          {
            name: 'Rococo',
            id: 'rococo',
            icon: 'icon-chain-rococo',
          },
        ],
      }, 
    };