import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Loader } from '@components/loader';
import { PDScrollArea } from '@components/pdScrollArea';
import { useStoreChain } from '@stores';
import { polymorphicComponent } from '@utils/components';
import { cn } from '@utils/helpers';
import { useMergedRefs } from '@utils/hooks/useMergedRefs';
import { getBlockDetailsWithRawClient } from '@utils/rpc/getBlockDetails';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

import styles from '../styles.module.css';

import { Row } from './row';

import type { IMappedBlockExtrinsic } from '@custom-types/block';
import type { IBlockStoreData } from '@custom-types/chain';

export const LatestBlocksList = polymorphicComponent<'div'>((_props, ref) => {
  const refScrollArea = useRef<HTMLDivElement>(null);
  const refs = useMergedRefs(ref, refScrollArea);

  const [
    blocks,
    setBlocks,
  ] = useState<IBlockStoreData[]>([]);

  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const dynamicBuilder = useDynamicBuilder();
  const chain = useStoreChain?.use?.chain?.();

  const isConnectingToChain = !!!bestBlock;

  const rowVirtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => refScrollArea?.current,
    estimateSize: () => 64,
    overscan: 5,
  });
  const rowItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const updateBlocks = async () => {
      const blocksArray = Array.from(blocksData.values()).reverse();

      const fetchBlockDetails = async (blockStore: IBlockStoreData) => {
        const blockNumber = blockStore?.number;

        if (!blockStore || typeof blockNumber !== 'number') {
          return blockStore;
        }

        try {
          const block = await getBlockDetailsWithRawClient({
            blockNumber,
            dynamicBuilder,
          });

          const mappedExtrinsics: IMappedBlockExtrinsic[] = await block.body.extrinsics.map((extrinsic: IMappedBlockExtrinsic) => {
            const { extrinsicData } = extrinsic;

            return {
              id: extrinsic.id,
              blockNumber: extrinsic.blockNumber,
              timestamp: extrinsic.timestamp,
              isSuccess: extrinsic.isSuccess,
              hash: extrinsic.hash,
              extrinsicData: {
                ...extrinsicData,
                signer: extrinsicData.signer ? { Id: extrinsicData.signer.Id } : undefined,
              },
            };
          });

          return {
            ...blockStore,
            extrinsics: mappedExtrinsics,
            header: {
              ...block.header,
              timestamp: blockStore.timestamp,
              identity: chain.isRelayChain ? blockStore.identity : undefined,
            },
          };
        } catch (error) {
          console.error(`Error fetching block details for block ${blockNumber}:`, error);
          return blockStore;
        }
      };

      const updatedBlocks = await Promise.all(blocksArray.map(fetchBlockDetails));

      setBlocks(updatedBlocks as IBlockStoreData[]);
    };

    void updateBlocks();
  }, [
    blocksData,
    bestBlock,
    dynamicBuilder,
    chain.isRelayChain,
  ]);

  return (
    <PDScrollArea
      ref={refs}
      className="h-80 lg:h-full"
      viewportClassNames="pr-3 [&>*:first-child]:h-full"
    >
      <div
        className={cn(
          'relative',
          {
            ['flex justify-center items-center']: !!!rowItems.length,
          },
        )}
        style={{
          height: isConnectingToChain || !!!rowItems.length ? '100%' : `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {
          isConnectingToChain
            ? <Loader classNames="!top-2/4" />
            : (
              <>
                {
                  !!rowItems.length
                    ? rowItems.map((virtualRow, virtualIndex) => {
                      const block = blocks[virtualRow.index];
                      return (
                        <Row
                          key={virtualIndex}
                          blockNumber={block.number!}
                          eventsLength={block.eventsLength}
                          extrinsicsLength={block.extrinsics.length}
                          timestamp={block.timestamp}
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
                    : 'No blocks to display'}
              </>
            )
        }
      </div>
    </PDScrollArea>
  );
});
