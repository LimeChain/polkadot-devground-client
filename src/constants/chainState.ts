import type { TChainSubscription } from '@custom-types/chain';

export const chainStateBlockData: {
  [key in TChainSubscription]: {
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
    name: 'Circulating Supply',
    icon: 'icon-transfer',
  },
  'total-accounts': {
    name: 'Total Accounts',
    icon: 'icon-transfer',
  },
  'transfers': {
    name: 'Transfers',
    icon: 'icon-transfer',
  },
};
