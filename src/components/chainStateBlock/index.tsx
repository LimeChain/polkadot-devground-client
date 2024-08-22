import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { chainStateBlockData } from '@constants/chainState';
import {
  type StoreInterface,
  useStoreChain,
} from '@stores';
import {
  cn,
  formatNumber,
  formatTokenValue,
} from '@utils/helpers';

export type TChainSubscription = keyof Pick<StoreInterface, 'bestBlock' | 'finalizedBlock' | 'totalIssuance' | 'totalStake'>;
interface TChainStateBlockProps {
  type: TChainSubscription;
}

export const ChainStateBlock = ({ type }: TChainStateBlockProps) => {

  const chainData = useStoreChain?.use?.[type]?.();
  const chainSpecs = useStoreChain?.use?.chainSpecs?.();
  const chain = useStoreChain?.use?.chain?.();
  const showData = chainData && chainSpecs;
  const isParaChain = chain.isParaChain;
  const chainHasStaking = chain.hasStaking;
  const isStakingBlock = type === 'totalStake';

  let data;

  const formatData = useCallback((value: number | bigint) => {
    return formatNumber(
      Number(formatTokenValue({
        value: Number(value),
        precision: 2,
        tokenDecimals: chainSpecs?.properties.tokenDecimals,
      })),
    );
  }, [chainSpecs]);

  switch (type) {
    case 'totalIssuance':
      if (showData) {
        data = formatData(chainData);
      }
      break;

    case 'totalStake':
      if (!chainHasStaking) {
        data = 'No Staking';
        break;
      }

      if (showData) {
        data = formatData(chainData);
      }
      break;

    case 'bestBlock':
    case 'finalizedBlock':
      if (showData) {
        data = formatNumber(Number(chainData));
      }
      break;

    default:
      break;
  }

  return (
    <div className={cn(
      'grid grid-cols-[16px_1fr] items-center gap-2',
    )}
    >
      <Icon name={chainStateBlockData?.[type]?.icon} size={[16]} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn(
          'truncate font-geist font-body2-regular',
          'text-dev-black-300 dark:text-dev-purple-300',
        )}
        >
          {chainStateBlockData?.[type]?.name} {isParaChain && isStakingBlock && `at ${chain.relayChainId}`}
        </span>
        <span className="truncate font-geist font-body1-bold">
          {
            data || 'Loading...'
          }
        </span>
      </div>
    </div>
  );
};
