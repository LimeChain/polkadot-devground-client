import { ChainStateBlock } from '@components/chainStateBlock';
import { cn } from '@utils/helpers';

export const ChainState = () => {
  return (
    <div className={cn(
      'grid gap-4',
      'p-3 md:p-6',
      'bg-dev-purple-100 dark:bg-dev-black-900',
      'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    )}
    >
      <ChainStateBlock type="blockTime" />
      <ChainStateBlock type="bestBlock" />
      <ChainStateBlock type="finalizedBlock" />
      <ChainStateBlock type="totalIssuance" />
      <ChainStateBlock type="totalStake" />
    </div>
  );
};
