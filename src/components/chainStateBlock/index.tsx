import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { chainStateBlockData } from '@constants/chainState';
import {
  type ISubscriptionFn,
  subscribeToChainData,
} from '@services/chain';
import { useStoreChain } from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import type { TChainSubscription } from '@custom-types/chain';

interface IChainStateBlockProps {
  type: TChainSubscription;
}

export const ChainStateBlock = ({ type }: IChainStateBlockProps) => {
  const client = useStoreChain.use.client?.();
  const chain = useStoreChain.use.chain?.();

  const [value, setValue] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const refUnsubscribe = useRef(() => {});

  useEffect(() => {
    if (!client) {
      return;
    }

    (async () => {
      const handleOnSubcriptionData: ISubscriptionFn['handleOnSubcriptionData'] = ({
        data,
        isLoadingData,
      }) => {
        setValue(data);
        setIsLoadingData(isLoadingData);
      };

      refUnsubscribe.current = subscribeToChainData({
        type,
        handleOnSubcriptionData,
      });

    })()
      .catch((error) => {
        console.error(error);
        setIsLoadingData(false);

      });

    return () => {
      refUnsubscribe.current?.();
    };

  }, [
    client,
    chain,
    type,
  ]);

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
            isLoadingData
              ? 'Loading...'
              : formatNumber(value)
          }
        </span>
      </div>
    </div>
  );
};
