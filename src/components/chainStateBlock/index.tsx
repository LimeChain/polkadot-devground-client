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

export type TChainSubscription = keyof Pick<StoreInterface, 'bestBlock' | 'finalizedBlock' | 'totalIssuance'>;
interface TChainStateBlockProps {
  type: TChainSubscription;
}

export const ChainStateBlock = ({ type }: TChainStateBlockProps) => {

  const chainData = useStoreChain?.use?.[type]?.();
  const chainSpecs = useStoreChain?.use?.chainSpecs?.();

  let data;

  switch (type) {
    case 'totalIssuance':
      data = formatTokenValue({
        value: Number(chainData),
        precision: 2,
        tokenDecimals: chainSpecs?.properties.tokenDecimals,
      });
      break;

    default:
      data = chainData;
      break;
  }

  return (
    <div className={cn(
      'grid grid-cols-[16px_1fr] items-center gap-4',
    )}
    >
      <Icon name={chainStateBlockData?.[type]?.icon} size={[16]} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn(
          'truncate font-geist font-body2-regular',
          'text-dev-black-300 dark:text-dev-purple-300',
        )}
        >
          {chainStateBlockData?.[type]?.name}
        </span>
        <span className="truncate font-geist font-body1-bold">
          {
            !chainData || !chainSpecs
              ? 'Loading...'
              : formatNumber(data as number)
          }
        </span>
      </div>
    </div>
  );
};
