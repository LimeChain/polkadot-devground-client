import { CHAIN_EXPLORERS } from '@constants/chain';

import type {
  TExternalExplorer,
  TSupportedChain,
} from '@custom-types/chain';

export const getBlockExplorerLink = (
  {
    blockNumber,
    chain,
    explorer,
  }: {
    blockNumber?: string | number;
    chain: TSupportedChain;
    explorer: TExternalExplorer;
  },
) => {
  const explorerHosting = CHAIN_EXPLORERS?.[chain]?.[explorer];

  if (explorerHosting && blockNumber) {
    switch (explorer) {
      case 'subscan':
        return `${explorerHosting}/block/${blockNumber}`;
      case 'statescan':
        return `${explorerHosting}/#/blocks/${blockNumber}`;
      default:
        break;
    }
  }

  return null;
};
