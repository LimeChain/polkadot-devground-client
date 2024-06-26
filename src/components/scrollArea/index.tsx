import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useRef,
} from 'react';

import { useMergedRefs } from '@utils/hooks/useMergedRefs';
import { polymorphicComponent } from '@utils/components';
import { cn } from '@utils/helpers';

interface IScrollAreaProps {
  children: React.ReactNode;
  type?: 'auto' | 'always' | 'scroll' | 'hover';
  scrollHideDelay?: number;
  onScroll?: (event: React.MouseEvent<HTMLDivElement>) => void;
  refScrollVertical?: RefObject<HTMLDivElement> | ((node: HTMLDivElement) => void);
  verticalScrollClassNames?: string;
  verticalScrollThumbClassNames?: string;
  refScrollHorizontal?: RefObject<HTMLDivElement>;
  horizontalScrollClassNames?: string;
  horizontalScrollThumbClassNames?: string;
  refViewport?: RefObject<HTMLDivElement>;
  viewportClassNames?: string;
  viewportStyles?: CSSProperties;
  dataIndex?: string;
}

export const ScrollArea = polymorphicComponent<'div', IScrollAreaProps>((props, ref) => {
  const {
    id,
    children,
    className,
    type = 'hover',
    scrollHideDelay = 1000,
    onScroll,
    refScrollVertical,
    verticalScrollClassNames,
    verticalScrollThumbClassNames,
    refScrollHorizontal,
    horizontalScrollClassNames,
    horizontalScrollThumbClassNames,
    viewportClassNames,
    viewportStyles,
    dataIndex,
  } = props;

  const refScrollViewport = useRef<HTMLDivElement>(null);

  const refs = useMergedRefs(ref, refScrollViewport);

  const handleOnScroll = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    onScroll?.(event);
  }, [onScroll]);

  return (
    <RadixScrollArea.Root
      id={id}
      asChild
      type={type}
      scrollHideDelay={scrollHideDelay}
    >
      <div className={cn(
        'limechain-scrollarea',
        'h-full min-w-full overflow-hidden',
        className,
      )}
      >
        <RadixScrollArea.Scrollbar
          ref={refScrollHorizontal}
          orientation="horizontal"
          className={cn(
            'limechain-scroll-horizontal',
            'group/scroll',
            'peer z-50',
            'touch-none select-none rounded-full',
            'data-[state=hidden]:z-0 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100',
            'transition-all duration-300',
            'bg-gray-200',
            'dark:bg-gray-800',
            horizontalScrollClassNames,
          )}
        >
          <div
            className={cn(
              'h-1 group-hover/scroll:h-2',
              'relative w-full flex-1',
              'transition-all duration-300 before:transition-all before:duration-300',
              'before:content[""] before:absolute before:inset-0',
              'before:rounded-full before:bg-gray-300',
              'dark:before:bg-gray-700',
            )}
          >
            <RadixScrollArea.Thumb
              className={cn(
                'relative z-20 !h-full rounded-full bg-gray-400 transition-colors duration-300 active:bg-gray-500',
                'dark:bg-gray-600 dark:active:bg-gray-500',
                horizontalScrollThumbClassNames,
              )}
            />
          </div>
        </RadixScrollArea.Scrollbar>

        <RadixScrollArea.Scrollbar
          ref={refScrollVertical}
          orientation="vertical"
          className={cn(
            'limechain-scroll-vertical',
            'group/scroll',
            'peer z-[100]',
            'touch-none select-none rounded-full',
            'data-[state=hidden]:z-0 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100',
            'transition-all duration-300',
            'bg-gray-200',
            'dark:bg-gray-800',
            verticalScrollClassNames,
          )}
        >
          <div
            className={cn(
              'w-1 group-hover/scroll:w-2',
              'relative h-full flex-1',
              'transition-all duration-300 before:transition-all before:duration-300',
              'before:content[""] before:absolute before:inset-0',
              'before:rounded-full before:bg-gray-300',
              'dark:before:bg-gray-700',
            )}
          >
            <div className="absolute inset-0">
              <RadixScrollArea.Thumb
                className={cn(
                  'relative z-20 !w-full rounded-full bg-gray-400 transition-colors duration-300 active:bg-gray-500',
                  'dark:bg-gray-600 dark:active:bg-gray-500',
                  verticalScrollThumbClassNames,
                )}
              />
            </div>
          </div>
        </RadixScrollArea.Scrollbar>

        <RadixScrollArea.Viewport
          ref={refs}
          data-index={dataIndex}
          onScroll={handleOnScroll}
          className={cn(
            'limechain-scrollarea-viewport',
            'peer-defined[data-orientation=vertical][data-state=visible]:pr-[1rem]',
            'peer-defined[data-orientation=horizontal][data-state=visible]:pb-[1rem]',
            'h-full w-full',
            'transition-all duration-300',
            viewportClassNames,
          )}
          style={viewportStyles}
        >
          {children}
        </RadixScrollArea.Viewport>

        <RadixScrollArea.Corner className="bg-gray-200 dark:bg-gray-800" />
      </div>
    </RadixScrollArea.Root>
  );
});

ScrollArea.displayName = 'ScrollArea';
