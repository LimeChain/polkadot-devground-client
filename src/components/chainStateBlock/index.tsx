import {
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { chainStateBlockData } from '@constants/chainState';
import {
  subscribeToCirculatingSupply,
  subscribeToFinalizedBlocks,
  subscribeToLatestBlocks,
} from '@services/chain';
import { useStoreChain } from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import type { TChainStateBlock } from '@custom-types/chainState';

interface IChainStateBlockProps {
  type: TChainStateBlock;
}

export const ChainStateBlock = ({ type }: IChainStateBlockProps) => {
  const client = useStoreChain.use.client();

  const [value, setValue] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!client) {
      return;
    }

    let unsubscribe: () => void;

    (async () => {
      switch (type) {
        case 'finalised-block':
          unsubscribe = subscribeToFinalizedBlocks({
            setData: setValue,
            setIsLoading: setIsLoadingData,
          });
          break;

        case 'latest-block':
          unsubscribe = subscribeToLatestBlocks({
            setData: setValue,
            setIsLoading: setIsLoadingData,
          });
          break;

        case 'circulating-supply':
          unsubscribe = subscribeToCirculatingSupply({
            setData: setValue,
            setIsLoading: setIsLoadingData,
          });
          break;

        default:
          setIsLoadingData(false);
          break;
      }
    })()
      .catch((error) => {
        console.error(error);
        setIsLoadingData(false);
      });

    return () => {
      unsubscribe?.();
      setIsLoadingData(true);
    };
  }, [client, type]);

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
