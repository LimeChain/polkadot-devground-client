import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface UseVirtualScrollOptions {
  totalItems?: number;
  itemHeight: number;
  containerHeight?: number;
  buffer?: number;
}

export function useVirtualScroll({
  totalItems = 0,
  itemHeight,
  containerHeight = window.innerHeight,
  buffer = 5,
}: UseVirtualScrollOptions) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [containerScrollTop, setContainerScrollTop] = useState(0);

  const refTimer: { current: ReturnType<typeof setTimeout> | null } =
    useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerOffsetHeight = containerHeight;

  const bufferHeight = buffer * itemHeight;
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil(
      (containerScrollTop + containerOffsetHeight + bufferHeight) / itemHeight,
    ),
  );
  const startIndex = Math.max(
    0,
    endIndex - (Math.floor(containerHeight / itemHeight) + buffer * 2),
  );

  const handleScroll = useCallback((e: SyntheticEvent<HTMLElement>) => {
    setContainerScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerScrollTop(0);
      containerRef.current.scrollTo(0, 0);
    }
  }, [totalItems]);

  useEffect(() => {
    const itemsSet = new Set<number>();
    const newVisibleItems: number[] = [];
    refTimer.current = setTimeout(() => {
      for (let i = startIndex; i <= endIndex; i++) {
        newVisibleItems.push(i);
        itemsSet.add(i);
      }
      setVisibleItems(newVisibleItems);
    }, 40);

    return () => {
      clearTimeout(refTimer.current as ReturnType<typeof setTimeout>);
    };
  }, [totalItems, itemHeight, startIndex, endIndex]);

  let topPadding = 0;
  let bottomPadding = 0;
  if (visibleItems.length > 0) {
    topPadding = visibleItems[0] * itemHeight;
    bottomPadding =
      (totalItems - 1 - visibleItems[visibleItems.length - 1]) * itemHeight;
  }

  return {
    visibleItems,
    containerRef,
    topPadding,
    bottomPadding,
    handleScroll,
    setScrollTop: setContainerScrollTop,
  };
}
