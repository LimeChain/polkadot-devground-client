import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { PDScrollArea } from '@components/pdScrollArea';
import { useStoreChain } from '@stores';
import { polymorphicComponent } from '@utils/components';
import { cn } from '@utils/helpers';
import { useMergedRefs } from '@utils/hooks/useMergedRefs';

import styles from '../styles.module.css';

import { Row } from './row';

interface Block {
  header: {
    identity: string | object;
    hash: string | undefined;
    number: number;
    timestamp: number;
  };
  body: {
    extrinsics: unknown[];
    events: unknown[];
  };
}

export const LatestBlocksList = polymorphicComponent<'div'>((_props, ref) => {
  const refScrollArea = useRef<HTMLDivElement>(null);
  const refs = useMergedRefs(ref, refScrollArea);

  const [
    blocks,
    setBlocks,
  ] = useState<Block[]>([]);

  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();

  const rowVirtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => refScrollArea?.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  useEffect(() => {
    const blocksArray = Array.from(blocksData.values()).reverse();

    setBlocks(blocksArray);
  }, [
    blocksData,
    bestBlock,
  ]);

  return (
    <PDScrollArea
      ref={refs}
      className="h-80 lg:h-full"
      viewportClassNames="pr-3"
    >
      <div
        className="relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {
          (!!blocks.length)
            ? (
              rowVirtualizer.getVirtualItems().map((virtualRow, virtualIndex) => {
                const block = blocks[virtualRow.index];
                return (
                  <Row
                    key={virtualIndex}
                    blockNumber={block.header.number}
                    eventsLength={block.body.events.length}
                    extrinsicsLength={block.body.extrinsics.length}
                    timestamp={block.header.timestamp}
                    className={cn(
                      styles['pd-explorer-list'],
                      {
                        ['opacity-0 animate-fade-in animation-duration-500']: virtualRow.index === 0,
                      },
                    )}
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                );
              })
            )
            : 'Loading...'
        }
      </div>
    </PDScrollArea>
  );
});

LatestBlocksList.displayName = 'LatestBlocksList';
