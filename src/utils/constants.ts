export const GITHUB_REPO_LINK = 'https://github.com/LimeChain/polkadot-devground-client';
export const X_LINK = 'https://x.com/LimeChainHQ';
export const LIMECHAIN_LINK = 'https://limechain.tech/';

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