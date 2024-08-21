import type { TChainSubscription } from '@components/chainStateBlock';

export const chainStateBlockData: {
  [key in TChainSubscription]: {
    name: string;
    icon: `icon-${string}`;
  } } = {
  'bestBlock': {
    name: 'Latest Block',
    icon: 'icon-newBlock',
  },
  'finalizedBlock': {
    name: 'Finalised Block',
    icon: 'icon-blocks',
  },
  'totalIssuance': {
    name: 'Total Issuance',
    icon: 'icon-transfer',
  },
};
