import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@utils/helpers';
import { formatBytes } from '@utils/internal';

import type { IEventBusStoreSize } from '@custom-types/eventBus';

export const StoreSizeViewer = () => {
  const refTimeout = useRef<NodeJS.Timeout>();
  const [
    data,
    setData,
  ] = useState<Record<string, number>>({});

  const [
    visible,
    setVisible,
  ] = useState(false);
  const [
    dragging,
    setDragging,
  ] = useState(false);
  const [
    position,
    setPosition,
  ] = useState({ x: window.innerWidth / 2, y: 0 });
  const [
    offset,
    setOffset,
  ] = useState({ x: 0, y: 0 });

  const handleData = useCallback(() => {
    clearTimeout(refTimeout.current);

    refTimeout.current = setTimeout(() => {
      // make sure it's new object ;)
      const sortedEntries = Object.entries(window.PDStoreSizes).sort((a, b) => b[1] - a[1]);
      setData(Object.fromEntries(sortedEntries));
    }, 100);
  }, []);

  useEventBus<IEventBusStoreSize>('@@-store-size', () => {
    handleData();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.ctrlKey && e.key === 'p') {
        setVisible(!visible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) {
      return;
    }
    setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }, [
    dragging,
    offset,
  ]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    dragging,
    handleMouseMove,
    handleMouseUp,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        'fixed left-1/2 z-[9999] translate-x-[-50%]',
        'flex flex-col',
        'p-2',
        'rounded-md border border-gray-300',
        'text-xs text-gray-800',
        'bg-white shadow-md',
        'cursor-grab active:cursor-grabbing',
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {
        Object.entries(data).map(([
          store,
          size,
        ]) => {
          const sizeFormatted = formatBytes(size);
          return (
            <div key={store}>
              {store}
              :
              {sizeFormatted.value} 
              {' '}
              {sizeFormatted.unit}
            </div>
          );
        })
      }
    </div>
  );
};
