import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

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

type TChainSubscription = keyof Pick<StoreInterface, 'bestBlock' | 'finalizedBlock' | 'totalIssuance' | 'totalStake' | 'blockTime'>;
interface TChainStateBlockProps {
  type: TChainSubscription;
}

export const ChainStateBlock = ({ type }: TChainStateBlockProps) => {
  const chainData = useStoreChain?.use?.[type]?.();
  const chainSpecs = useStoreChain?.use?.chainSpecs?.();

  const showData = chainData && chainSpecs;

  const isBlockTimeBlock = type === 'blockTime';

  let data;

  const formatData = useCallback((value: number | bigint) => {
    const amount = formatNumber(
      Number(formatTokenValue({
        value: Number(value),
        precision: 2,
        tokenDecimals: chainSpecs?.properties.tokenDecimals,
      })),
    );

    return `${amount} ${chainSpecs?.properties?.tokenSymbol}`;
  }, [chainSpecs]);

  switch (type) {
    case 'totalIssuance':
      if (showData) {
        data = formatData(chainData);
      }
      break;

    case 'blockTime':
      if (showData) {
        const blockTimeSec = Number(chainData) / 1000;
        data = blockTimeSec;
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
      'grid grid-cols-[16px_1fr] items-center gap-3',
    )}
    >
      <Icon
        name={chainStateBlockData?.[type]?.icon}
        size={[18]}
      />
      <div className="flex flex-col overflow-hidden">
        <span className={cn(
          'truncate font-geist font-body2-regular',
          'text-dev-black-300 dark:text-dev-purple-300',
        )}
        >
          {chainStateBlockData?.[type]?.name}

          {isBlockTimeBlock && data && ` ${data} sec`}
          {isBlockTimeBlock && !data && ` Loading...`}
        </span>
        <span className="truncate font-geist font-body1-bold">
          {
            isBlockTimeBlock
              ? <BlockTarget target={data as number} />
              : data || 'Loading...'
          }
        </span>
      </div>
    </div>
  );
};

const BlockTarget = ({ target }: { target: number }) => {
  const latestBlock = useStoreChain?.use?.bestBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const refBlockDuration = useRef<HTMLSpanElement>(null);
  const refLastChain = useRef<StoreInterface['chain']['id']>(chain?.id);

  useEffect(() => {
    let timePassed = 0;
    let interval: NodeJS.Timeout;

    if (!refBlockDuration?.current?.textContent) {
      return;
    }

    const element = refBlockDuration.current as NonNullable<HTMLSpanElement>;
    const chainHasBeenChanged = refLastChain.current !== chain.id;

    if (chainHasBeenChanged) {
      element.textContent = `Loading...`;
      refLastChain.current = chain.id;
    }

    if (target) {
      interval = setInterval(() => {
        element.textContent = `${(timePassed / 1000).toFixed(1)} sec`;
        timePassed += 100;
      }, 100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    target,
    latestBlock,
    chain,
  ]);

  return (
    <span ref={refBlockDuration}>
      Loading...
    </span>
  );

};
