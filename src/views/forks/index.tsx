import {
  useEffect,
  useState,
} from 'react';

import { useStoreChain } from '@stores';

import { type BlockItem } from './forks';
import { groupData } from './helpers';
import { VirtualizedList } from './virtualizedList';

const Forks = () => {
  // static data
  const [items, setItems] = useState<Record<string, BlockItem[]>>({});
  // dynamic data
  // const [items, setItems] = useState({});
  const rawClient = useStoreChain?.use?.rawClient?.();
  const rawObservableClient = useStoreChain?.use?.rawObservableClient?.();
  const chain = useStoreChain?.use?.chain?.();

  // Dynamic data fetching
  useEffect(() => {
    if (!rawObservableClient || !rawClient) {
      return;
    }

    const head = rawObservableClient.chainHead$();
    const subscription = head.follow$.subscribe(async event => {
      switch (event.type) {
        case 'newBlock': {
          const header: {
            number: string;
            parentHash: string;
          } = await rawClient.request('chain_getHeader', [event.blockHash]);

          if (!header) {
            return;
          }

          // @TODO: add types
          // es
          const blockNumber = parseInt(header.number, 16);
          const blockHash = event.blockHash;
          const parentBlockHash = header.parentHash;

          setItems(forks => {
            const isFirstFork = typeof forks?.[blockNumber] === 'undefined';
            const forkIndex = isFirstFork ? 0 : forks[blockNumber].length;

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
              return groupData({ ...forks, [blockNumber]: [...forks[blockNumber], newFork] });
            }
          });

          break;
        }
        case 'finalized': {
          event.finalizedBlockHashes.forEach(async hash => {
            const header: {
              number: string;
            } = await rawClient.request('chain_getHeader', [hash]);

            if (!header) {
              return;
            }
            const blockNumber = parseInt(header.number, 16);
            const blockHash = hash;

            setItems(forks => {
              return {
                ...forks, [blockNumber]: forks[blockNumber].map(block => {
                  if (block.blockHash === blockHash) {
                    block.isFinalized = true;
                    return block;
                  }
                  return block;
                }),
              };
            });
          });
          break;
        }
        default:
          break;
      }
    });

    return () => {
      subscription?.unsubscribe();
      head?.unfollow();
      setItems({});
    };

  }, [rawObservableClient, rawClient, chain]);

  return (
    <section className="relative flex h-full flex-col items-center justify-center">
      <VirtualizedList
        items={items}
      />
    </section>
  );
};

export default Forks;
