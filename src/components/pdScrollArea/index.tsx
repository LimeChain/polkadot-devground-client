import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useCallback,
  useRef,
} from 'react';

import { polymorphicComponent } from '@utils/components';
import { cn } from '@utils/helpers';
import { useMergedRefs } from '@utils/hooks/useMergedRefs';

interface IPDScrollAreaProps {
  children: ReactNode;
  type?: 'auto' | 'always' | 'scroll' | 'hover';
  scrollHideDelay?: number;
  onScroll?: (event: React.MouseEvent<HTMLDivElement>) => void;
  refScrollVertical?:
  | RefObject<HTMLDivElement>
  | ((node: HTMLDivElement) => void);
  verticalScrollClassNames?: string;
  verticalScrollThumbClassNames?: string;
  refScrollHorizontal?: RefObject<HTMLDivElement>;
  horizontalScrollClassNames?: string;
  horizontalScrollThumbClassNames?: string;
  viewportClassNames?: string;
  viewportStyles?: CSSProperties;
  dataIndex?: string;
}

export const PDScrollArea = polymorphicComponent<'div', IPDScrollAreaProps>((props, ref) => {
  const {
    id,
    children,
    className,
    type = 'auto',
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
    <ScrollAreaPrimitive.Root
      id={id}
      asChild
      type={type}
      scrollHideDelay={scrollHideDelay}
    >
      <div
        className={cn(
          'limechain-scrollarea',
          'h-full min-w-full overflow-hidden',
          className,
        )}
      >
        <ScrollAreaPrimitive.Scrollbar
          ref={refScrollHorizontal}
          orientation="horizontal"
          className={cn(
            'limechain-scroll-horizontal',
            'group/scroll',
            'peer z-20',
            'touch-none select-none rounded-full',
            'data-[state=hidden]:z-0 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100',
            'transition-all duration-300',
            horizontalScrollClassNames,
          )}
        >
          <div
            className={cn(
              'relative h-[3px] w-full flex-1',
              'group-hover/scroll:h-[5px]',
              'transition-all duration-300',
              'before:content[""] before:absolute before:inset-x-0 before:top-1/2',
              'before:-translate-y-1/2',
              'before:h-[1px]',
              'before:bg-dev-purple-300',
              'dark:before:bg-dev-purple-700',
              'before:transition-all before:duration-300',
            )}
          >
            <ScrollAreaPrimitive.Thumb
              className={cn(
                'relative z-20 !h-full',
                'transition-colors duration-300',
                'bg-dev-purple-400',
                'active:bg-dev-purple-500',
                'active:cursor-ew-resize',
                'transition-width duration-300',
                horizontalScrollThumbClassNames,
              )}
            />
          </div>
        </ScrollAreaPrimitive.Scrollbar>

        <ScrollAreaPrimitive.Scrollbar
          ref={refScrollVertical}
          orientation="vertical"
          className={cn(
            'limechain-scroll-vertical',
            'group/scroll',
            'peer z-20',
            'touch-none select-none rounded-full',
            'data-[state=hidden]:z-0 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100',
            'transition-all duration-300',
            verticalScrollClassNames,
          )}
        >
          <div
            className={cn(
              'relative h-full w-[3px] flex-1',
              'group-hover/scroll:w-[5px]',
              'transition-all duration-300',
              'before:content[""] before:absolute before:inset-y-0 before:left-1/2',
              'before:-translate-x-1/2',
              'before:w-[1px]',
              'before:bg-dev-purple-300',
              'dark:before:bg-dev-purple-700',
              'before:transition-all before:duration-300',
            )}
          >
            <div className="absolute inset-0">
              <ScrollAreaPrimitive.Thumb
                className={cn(
                  'relative z-20 !w-full',
                  'transition-colors duration-300',
                  'bg-dev-purple-400',
                  'active:bg-dev-purple-500',
                  'active:cursor-ns-resize',
                  'transition-height duration-300',
                  verticalScrollThumbClassNames,
                )}
              />
            </div>
          </div>
        </ScrollAreaPrimitive.Scrollbar>

        <ScrollAreaPrimitive.Viewport
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
        </ScrollAreaPrimitive.Viewport>

        <ScrollAreaPrimitive.Corner className="opacity-0" />
      </div>
    </ScrollAreaPrimitive.Root>
  );
});

PDScrollArea.displayName = 'PDScrollArea';
