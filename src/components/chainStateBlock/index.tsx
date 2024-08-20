import { Icon } from '@components/icon';
import { chainStateBlockData } from '@constants/chainState';
import { useStoreChain } from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import type { TChainSubscription } from '@custom-types/chain';

interface TChainStateBlockProps {
  type: TChainSubscription;
}

const typeLib: Record<TChainSubscription, string> = {
  'latest-block': 'bestBlock',
  'finalised-block': 'finalizedBlock',
  'circulating-supply': '',
  'signed-extrinsics': '',
  'total-accounts': '',
  transfers: '',
};

export const ChainStateBlock = ({ type }: TChainStateBlockProps) => {

  const chainData = useStoreChain?.use?.[typeLib[type]]?.();

  return (
    <div className={cn(
      'grid grid-cols-[16px_1fr] items-center gap-4',
    )}
    >
      <Icon name={chainStateBlockData[type].icon} size={[16]} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn(
          'truncate font-geist font-body2-regular',
          'text-dev-black-300 dark:text-dev-purple-300',
        )}
        >
          {chainStateBlockData[type].name}
        </span>
        <span className="truncate font-geist font-body1-bold">
          {
            !chainData
              ? 'Loading...'
              : formatNumber(chainData)
          }
        </span>
      </div>
    </div>
  );
};
