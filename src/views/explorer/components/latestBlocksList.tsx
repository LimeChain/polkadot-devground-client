import { formatDistanceToNowStrict } from 'date-fns';
import {
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { useStoreChain } from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import styles from '../styles.module.css';

interface Block {
  header: {
    number: number;
    timestamp: number;
  };
  body: {
    extrinsics: any[];
    events: any[];
  };
}

export const LatestBlocksList = () => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const latestFinalizedBlock = useStoreChain?.use?.finalizedBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const isLoading = blocksData.size === 0;

  useEffect(() => {
    const blocksArray = Array.from(blocksData.values()).reverse();
    setBlocks(blocksArray);
  }, [blocksData, bestBlock, chain, latestFinalizedBlock]);

  return (
    <PDScrollArea
      className="h-80 lg:h-full"
      viewportClassNames="py-3"
      verticalScrollClassNames="py-3"
    >
      {
        blocks.map((block, blockIndex) => {
          const timeAgo = block.header.timestamp && formatDistanceToNowStrict(
            new Date(block.header.timestamp),
            { addSuffix: true },
          );
          const isFinalized = latestFinalizedBlock && latestFinalizedBlock >= block.header.number;
          return (
            <PDLink
              key={block.header.number}
              to={block.header.number}
              className={cn(
                'grid grid-cols-[1fr_theme(width.28)]',
                styles['pd-explorer-list'],
                {
                  ['opacity-0 animate-fade-in']: blockIndex === 0,
                },
              )}
            >
              <div>
                <p>
                  <span className="text-dev-black-300 dark:text-dev-purple-300">Block# </span>
                  <strong className="font-body1-bold">{formatNumber(block.header.number)}</strong>
                </p>
                <p>
                  <span className="text-dev-black-300 dark:text-dev-purple-300">Includes </span>
                  <span>{block.body.extrinsics.length} Extrinsics </span>
                  {block.body.events.length} Events
                </p>
              </div>
              <div>
                <span className="flex justify-end gap-1 font-body1-bold">
                  {
                    isFinalized
                      ? (
                        <Icon
                          size={[16]}
                          name="icon-checked"
                          className="text-dev-green-600"
                        />
                      )
                      : (
                        <Icon
                          size={[16]}
                          name="icon-clock"
                          className="animate-rotate text-dev-yellow-700"
                        />
                      )
                  }
                </span>
                <span>{timeAgo}</span>
              </div>
            </PDLink>
          );
        })
      }
      {isLoading && 'Loading...'}
    </PDScrollArea>
  );
};
