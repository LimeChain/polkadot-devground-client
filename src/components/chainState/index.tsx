import { ChainStateBlock } from '@components/chainStateBlock';
import { cn } from '@utils/helpers';

export const ChainState = () => {
  return (
    <div className={cn(
      'grid gap-4',
      'p-3 md:p-6',
      'bg-dev-purple-100 dark:bg-dev-black-900',
      'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
    )}
    >
      <ChainStateBlock type="latest-block" />
      <ChainStateBlock type="finalised-block" />
      <ChainStateBlock type="signed-extrinsics" />
      <ChainStateBlock type="transfers" />
      <ChainStateBlock type="total-accounts" />
      <ChainStateBlock type="circulating-supply" />
    </div>
  );
};
