import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { chainStateBlockData } from '@constants/chainState';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import type { TChainStateBlock } from '@custom-types/chainState';

interface IChainStateBlockProps {
  type: TChainStateBlock;
}

export const ChainStateBlock = ({ type }: IChainStateBlockProps) => {

  const [value, setValue] = useState(0);
  const refIsLoading = useRef(true);

  useEffect(() => {
    setTimeout(() => {
      setValue(1132312321);
    }, Math.random() * 1000 + 400);
    refIsLoading.current = false;
  }, []);

  return (
    <div className={cn(
      'grid grid-cols-[16px_1fr] items-center gap-4',
    )}
    >
      <Icon name={chainStateBlockData[type].icon} size={[16]} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn(
          'truncate font-geist text-body2-regular',
          'text-dev-black-300 dark:text-dev-purple-300',
        )}
        >
          {chainStateBlockData[type].name}
        </span>
        <span className="truncate font-geist text-body1-bold">
          {
            refIsLoading.current
              ? 'Loading...'
              : formatNumber(value)
          }
        </span>
      </div>
    </div>
  );
};
