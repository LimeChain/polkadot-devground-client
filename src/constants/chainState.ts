import type { TChainStateBlock } from '@custom-types/chainState';

export const chainStateBlockData: {
  [key in TChainStateBlock]: {
    name: string;
    icon: `icon-${string}`;
  } } = {
  'latest-block': {
    name: 'Latest Block',
    icon: 'icon-newBlock',
  },
  'finalised-block': {
    name: 'Finalised Block',
    icon: 'icon-blocks',
  },
  'signed-extrinsics': {
    name: 'Signed Extrinsics',
    icon: 'icon-transfer',
  },
  'circulating-supply': {
    name: 'Transfers',
    icon: 'icon-transfer',
  },
  'total-accounts': {
    name: 'Total Accounts',
    icon: 'icon-transfer',
  },
  'transfers': {
    name: 'Circulating Supply',
    icon: 'icon-transfer',
  },
};
