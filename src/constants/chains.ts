type ISupportedChains = {
  [key:string] : {
    name: string;
    id:string;
    chains: {
      name:string;
      icon:string;
    }[];
  };
};
export const SUPPORTED_CHAINS:ISupportedChains = 
    {
      'polkadot': {
        name: 'Polkadot & Parachains',
        id: 'polkadot',
        chains: [
          {
            name: 'Polkadot',
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
        id: 'rococo',
        chains: [
          {
            name: 'Rococo',
            icon: 'icon-chain-rococo',
          },
        ],
      }, 
    };