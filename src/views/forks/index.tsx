import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useStoreChain } from '@stores';

import { groupData } from './helpers';
import { VirtualizedList } from './virtualizedList';

import type { IBlockItem } from '@custom-types/block';
import type { Subscription } from 'rxjs';

const Forks = () => {
  const chain = useStoreChain?.use?.chain?.();
  const client = useStoreChain?.use?.client?.();

  const refSubscription = useRef<Subscription | null>(null);

  const [
    items,
    setItems,
  ] = useState<Record<string, IBlockItem[]>>({});

  const resetState = useCallback(() => {
    refSubscription.current?.unsubscribe?.();
    setItems({});
  }, []);

  useEffect(() => {
    if (!client) {
      return;
    }
    console.log('test log');
    resetState();

    refSubscription.current = client.bestBlocks$.subscribe((bestBlocks) => {
      const bestBlock = bestBlocks.at(0);
      const finalizedBlock = bestBlocks.at(-1);

      if (bestBlock) {
        const blockNumber = bestBlock.number;
        const blockHash = bestBlock.hash;
        const parentBlockHash = bestBlock.parent;

        setItems((forks) => {
          const isFirstFork = typeof forks?.[blockNumber] === 'undefined';
          const forkIndex = isFirstFork ? 0 : forks[blockNumber].length;

          const isRepeatFork = forks?.[blockNumber]?.[forkIndex - 1]?.blockHash === blockHash;
          if (isRepeatFork) {
            return forks;
          }

          const newFork = {
            blockHash,
            parentBlockHash,
            isFinalized: false,
            index: forkIndex,
            blockNumber,
          };

          if (isFirstFork) {
            return groupData({ ...forks, [blockNumber]: [newFork] });
          } else {
            return groupData({ ...forks, [blockNumber]: [
              ...forks[blockNumber],
              newFork,
            ] });
          }
        });
      }

      if (finalizedBlock) {
        const blockNumber = finalizedBlock.number;
        const blockHash = finalizedBlock.hash;

        setItems((forks) => {
          const blockForks = forks[blockNumber];
          if (!blockForks) {
            return forks;
          }

          const forkIndex = blockForks.find((fork) => fork.blockHash === blockHash)?.index || 0;
          if (blockForks[forkIndex].isFinalized) {
            return forks;
          }

          return {
            ...forks,
            [blockNumber]: forks[blockNumber].map((block) => {
              if (block.blockHash === blockHash) {
                block.isFinalized = true;
                return block;
              }
              return block;
            }),
          };
        });
      }

    });

    return () => {
      resetState();
    };

  }, [
    client,
    chain,
    resetState,
  ]);

  return <VirtualizedList items={items} />;
};

export default Forks;
