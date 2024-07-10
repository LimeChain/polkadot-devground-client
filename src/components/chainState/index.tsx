import { ChainStateBlock } from '@components/chainStateBlock';
import { cn } from '@utils/helpers';

export const ChainState = () => {
  return (
    <div className={cn(
      'grid grid-cols-6 gap-3 p-6',
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
