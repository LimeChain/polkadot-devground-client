import {
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { chainStateBlockData } from '@constants/chainState';
import { useStoreChainClient } from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import type { TChainStateBlock } from '@custom-types/chainState';
import type { VoidFn } from '@polkadot/api/types';

interface IChainStateBlockProps {
  type: TChainStateBlock;
}

export const ChainStateBlock = ({ type }: IChainStateBlockProps) => {
  const api = useStoreChainClient.use.client();

  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsubscribe: VoidFn;

    (async () => {
      if (type === 'finalised-block') {
        unsubscribe = await api.rpc.chain.subscribeFinalizedHeads((head) => {
          console.log('finalized head', head.number.toNumber());
          setValue(head.number.toNumber());
        });
      }
      if (type === 'latest-block') {
        unsubscribe = await api.rpc.chain.subscribeNewHeads((head) => {
          console.log('new head', head.number.toNumber());

          setValue(head.number.toNumber());
        });
      }
    })()
      .finally(() => {
        setIsLoading(false);
      })
      .catch(console.error);

    return () => {
      unsubscribe?.();
    };
  }, [api, type]);

  return (
    <div className={cn(
      'grid grid-cols-[16px_1fr] items-center gap-4',
    )}
    >
      <Icon name={chainStateBlockData[type].icon} size={[16]} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn(
          'truncate font-geist !text-body2-regular',
          'text-dev-black-300 dark:text-dev-purple-300',
        )}
        >
          {chainStateBlockData[type].name}
        </span>
        <span className="truncate font-geist text-body1-bold">
          {
            isLoading
              ? 'Loading...'
              : formatNumber(value)
          }
        </span>
      </div>
    </div>
  );
};
