import { busDispatch } from '@pivanov/event-bus';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { Icon } from '@components/icon';
import { PageHeader } from '@components/pageHeader';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

import { CurvedLineWithArrow } from './curvedLineWithArrow';
import { ScrollButtons } from './scrollButtons';

import type { IBlockItem } from '@custom-types/block';
import type { IEventBusForksReceiveUpdate } from '@custom-types/eventBus';

interface IVirtualizedListProps {
  items: Record<string, IBlockItem[]>;
}

// 64 is the height of each block item
// 96 is the gap between each block item
// 64 + 96 = 160
const arrowOffset = 160;

export const VirtualizedList = (props: IVirtualizedListProps) => {

  const { items } = props;
  const blockNumbers = Object.keys(items);

  const refTimeout = useRef<NodeJS.Timeout>();
  const refScrollArea = useRef<HTMLDivElement>(null);
  const refExtraElementWidth = useRef(0);

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
      refExtraElementWidth.current = 240 + paddingLeft;

      // Fixed width + dynamic padding
      return 240 + paddingLeft;
    },
  });

  useEffect(() => {
    const htmlTag = document.documentElement;
    htmlTag.classList.add('block-scroll-back');

    return () => {
      htmlTag.classList.remove('block-scroll-back');
    };
  }, []);

  const handleScroll = useCallback(() => {
    clearTimeout(refTimeout.current);

    refTimeout.current = setTimeout(() => {
      if (refScrollArea.current) {
        const {
          scrollLeft,
          scrollWidth,
          clientWidth,
        } = refScrollArea.current;

        const canGoToStart = scrollLeft > 0 && scrollWidth > clientWidth;
        const canGoToEnd = (scrollWidth > clientWidth) && (scrollWidth - clientWidth >= scrollLeft + refExtraElementWidth.current);
        const keepScrollToEnd = scrollWidth - clientWidth === scrollLeft + refExtraElementWidth.current;

        busDispatch<IEventBusForksReceiveUpdate>({
          type: '@@-forks-receive-update',
          data: {
            canGoToStart,
            canGoToEnd,
            keepScrollToEnd,
          },
        });
      }
    }, 40);
  }, []);

  useEffect(() => {
    handleScroll();

    return () => {
      clearTimeout(refTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div
      className={cn(
        'disable-vertical-scroll disable-horizontal-scroll',
        'flex flex-col',
        'h-[var(--initial-scroll-arrea-height)]',
      )}
    >
      <div className="flex justify-between">
        <PageHeader title="Forks" />
        <ScrollButtons refScrollArea={refScrollArea} />
      </div>
      <PDScrollArea
        ref={refScrollArea}
        onScroll={handleScroll}
        type="always"
        viewportClassNames={cn(
          'mask-horizontal-and-vertical',
          'px-8 py-20',
          'font-geist text-dev-purple-50 font-body2-regular',
        )}
      >
        <div style={{ width: rowVirtualizer.getTotalSize() }}>
          <div className="relative">
            {
              rowVirtualizer.getVirtualItems().map((virtualCol, virtualIndex) => {
                const blockNumber = blockNumbers[virtualCol.index];
                const blockItems = items[blockNumber];

                return (
                  <div
                    key={virtualIndex}
                    ref={virtualCol.measureElement}
                    data-index={virtualCol.index}
                    id={`group-${virtualCol.index}`}
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
                                endPoint={{
                                  x: 0,
                                  y: blockItemIndex * arrowOffset,
                                }}
                                startPoint={{
                                  // related to the padding above
                                  x: (blockItems.length > 1 ? -96 : -40),
                                  y: 0,
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
                              'border-2 border-dev-green-700 text-dev-black-1000 dark:text-white',
                              'bg-green-600/10',
                              {
                                ['dark:bg-dev-black-900 bg-dev-purple-100 border-transparent']: !item.isFinalized,
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
                                  className="w-full max-w-4 text-dev-green-600"
                                  name="icon-checked"
                                  size={[16]}
                                />
                              )
                            }
                            <CopyToClipboard
                              className="hover:text-dev-dev-purple-50"
                              text={item.blockHash}
                              toastMessage="Block Hash"
                            >
                              {({ ClipboardIcon, text, onClick }) => (
                                <div className="flex items-center gap-x-2 overflow-hidden">
                                  <p
                                    className="cursor-pointer truncate"
                                    onClick={onClick}
                                  >
                                    {text}
                                  </p>
                                  <div
                                    className={cn(
                                      'ml-auto flex items-center justify-center rounded-full dark:bg-dev-green-600/30',
                                    )}
                                  >
                                    {ClipboardIcon}
                                  </div>
                                </div>
                              )}
                            </CopyToClipboard>
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
    </div>
  );
};
