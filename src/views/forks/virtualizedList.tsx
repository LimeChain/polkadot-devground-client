import { useEventBus } from '@pivanov/event-bus';
import { useVirtualizer } from '@tanstack/react-virtual';
import { nanoid } from 'nanoid';
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

import { CurvedLineWithArrow } from './curvedLineWithArrow';
import { smoothScroll } from './helpers';

import type { BlockItem } from './forks';
import type { IEventBusForksScrollToBlock } from '@custom-types/eventBus';

interface IVirtualizedListProps {
  items: Record<string, BlockItem[]>;
}

// 64 is the height of each block item
// 96 is the gap between each block item
// 64 + 96 = 160
const arrowOffset = 160;

export const VirtualizedList = (props: IVirtualizedListProps) => {
  const { items } = props;
  const blockNumbers = Object.keys(items);

  const refTimeout = useRef<NodeJS.Timeout>();
  const refKey = useRef(nanoid());

  const refScrollArea = useRef<HTMLDivElement>(null);
  const refScrollAreaScrollLeft = useRef(0);
  const refContent = useRef<HTMLDivElement>(null);
  const refScrollable = useRef<HTMLDivElement>(null);

  const refLatestBlockHash = useRef<string>();

  const rowVirtualizer = useVirtualizer({
    horizontal: true,
    count: blockNumbers.length,
    getScrollElement: () => refScrollArea.current,
    estimateSize: (index) => {
      const item = items[blockNumbers[index]];

      // 40 is the fixed width of the item
      // 96 is the left padding of the item when there are more than 1 item
      const paddingLeft = item.length > 1 ? 96 : 40;

      // Fixed width + dynamic padding
      return 240 + paddingLeft;
    },
  });

  // Expose the scrollToIndex function to be used outside of this component
  useEventBus<IEventBusForksScrollToBlock>('@@-forks-scroll-to-block', ({ data }) => {
    clearTimeout(refTimeout.current);

    const { scrollToIndex, scrollToBlockHash } = data;
    refLatestBlockHash.current = scrollToBlockHash;

    refTimeout.current = setTimeout(async () => {
      refKey.current = nanoid();

      const offset = rowVirtualizer.getOffsetForIndex(scrollToIndex);
      if (offset?.[0]) {
        await smoothScroll(refScrollArea.current as HTMLElement, offset[0]);
      }

      document.getElementById(`block-hash-${scrollToBlockHash}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }, 400);
  });

  const handleOnScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    refScrollAreaScrollLeft.current = e.currentTarget.scrollLeft;
    if ((refScrollable.current?.scrollHeight || 0) > (refScrollArea.current?.clientHeight || 0)) {
      refContent.current?.style.setProperty('--min-height', `${refContent.current?.scrollHeight}px`);
    } else {
      refContent.current?.style.setProperty('--min-height', `${(refScrollArea.current?.clientHeight || 0) - 80}px`);
    }
  }, []);

  useEffect(() => {
    const htmlTag = document.documentElement;
    htmlTag.classList.add('block-scroll-back');

    refContent.current?.style.setProperty('--min-height', `${(refScrollArea.current?.clientHeight || 0) - 80}px`);

    return () => {
      htmlTag.classList.remove('block-scroll-back');
    };
  }, []);

  return (
    <PDScrollArea
      type="always"
      ref={refScrollArea}
      className="w-full"
      onScroll={handleOnScroll}
      viewportClassNames={cn(
        'mask-horizontal-and-vertical',
        'px-8 py-20',
        'font-geist text-dev-purple-50 font-body2-regular',
        'transition-none',
      )}
    >
      <div
        ref={refContent}
        className="pivanov relative h-full"
        style={{
          height: 'var(--min-height, auto)',
          width: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        <div
          // key={refKey.current}
          ref={refScrollable}
          className="relative"
        >
          {
            rowVirtualizer.getVirtualItems().map((virtualCol, virtualIndex) => {
              const blockNumber = blockNumbers[virtualCol.index];
              const blockItems = items[blockNumber];

              return (
                <div
                  key={virtualIndex}
                  id={`group-${virtualCol.index}`}
                  ref={virtualCol.measureElement}
                  data-index={virtualCol.index}
                  className={cn(
                    'absolute left-0 top-0',
                    'h-16',
                    'flex flex-col gap-y-24',
                    {
                      ['pl-10']: virtualIndex > 0,
                      ['pl-24']: blockItems.length > 1,
                    },
                  )}
                  style={{
                    transform: `translateX(${virtualCol.start}px)`,
                  }}
                >
                  {
                    blockItems.map((item, blockItemIndex) => (
                      <Fragment key={item.blockHash}>
                        {
                          virtualIndex > 0 && (
                            <CurvedLineWithArrow
                              className={cn(
                                'transition-opacity duration-200',
                                'absolute top-1/2',
                                '-transform-y-1/2',
                                {
                                  ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: refLatestBlockHash.current === item.blockHash,
                                },
                              )}
                              startPoint={{
                                // related to the padding above
                                x: (blockItems.length > 1 ? -96 : -40),
                                y: 0,
                              }}
                              endPoint={{
                                x: 0,
                                y: blockItemIndex * arrowOffset,
                              }}
                            />
                          )
                        }
                        <div
                          id={`block-hash-${item.blockHash}`}
                          className={cn(
                            'relative',
                            'flex items-center gap-x-2',
                            'px-6',
                            'min-h-full w-60',
                            'border-2 border-dev-green-700',
                            'bg-green-600/10',
                            {
                              ['bg-dev-black-900 border-transparent']: !item.isFinalized,
                              ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: refLatestBlockHash.current === item.blockHash,
                            },
                          )}
                        >
                          <div
                            className={cn(
                              'absolute -top-10 left-0 flex h-10 items-center gap-x-2 font-h5-bold',
                              'transition-colors duration-200',
                              {
                                ['text-dev-green-600']: refLatestBlockHash.current === item.blockHash,
                              },
                            )}
                          >
                            <Icon
                              name="icon-newBlock"
                            />
                            {blockNumber}
                          </div>

                          {
                            item.isFinalized && (
                              <Icon
                                size={[16]}
                                name="icon-checked"
                                className="w-full max-w-4 text-dev-green-600"
                              />
                            )
                          }
                          <div className="truncate">
                            {item.blockHash}
                          </div>

                          <CopyToClipboard
                            text={item.blockHash}
                            toastMessage="Block Hash"
                            className="hover:text-dev-dev-purple-50"
                          >
                            {
                              ({ ClipboardIcon }) => (
                                <div
                                  className={cn(
                                    'ml-auto flex items-center justify-center rounded-full bg-dev-green-600/30',
                                    'size-full max-h-8 max-w-8',
                                    {
                                      ['bg-dev-black-800']: !item.isFinalized,
                                    },
                                  )}
                                >
                                  {ClipboardIcon}
                                </div>
                              )
                            }
                          </CopyToClipboard>
                          {/* <div className="truncate">Hash: {item.blockHash}</div> */}
                        </div>
                      </Fragment>
                    ))
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    </PDScrollArea>
  );
};
