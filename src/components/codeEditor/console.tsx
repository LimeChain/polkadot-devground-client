import { useEventBus } from '@pivanov/event-bus';
import { format } from 'date-fns';
import {
  useRef,
  useState,
} from 'react';

import { ScrollArea } from '@components/scrollArea';
import { STORAGE_PREFIX_CONSOLE_OUTPUT } from '@utils/constants';
import { cn } from '@utils/helpers';
import { useVirtualScroll } from '@utils/hooks/useVirtualScroll';
import {
  storageRemoveItem,
  storageSetItem,
} from '@utils/storage';

import type {
  IEventBusConsoleMessage,
  IEventBusConsoleMessageReset,
} from '@custom-types/eventBus';
import type { IConsoleMessage } from '@custom-types/global';

export const Console = () => {
  const refTimeout = useRef<NodeJS.Timeout>();

  const refScrollArea = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<IConsoleMessage[]>([]);

  const refContainer = useRef<HTMLDivElement | null>(null);

  const { visibleItems, topPadding, bottomPadding, handleScroll } =
    useVirtualScroll({
      totalItems: messages.length,
      itemHeight: 20,
      containerHeight: refContainer.current?.clientHeight,
    });

  useEventBus<IEventBusConsoleMessage>('@@-console-message', ({ data }) => {
    clearTimeout(refTimeout.current);
    setMessages((state) => {
      const log = [...state];
      log.push(...data);

      void storageSetItem(STORAGE_PREFIX_CONSOLE_OUTPUT, log);
      return log;
    });

    refTimeout.current = setTimeout(() => {
      refScrollArea.current?.scrollTo({
        top: refContainer.current?.clientHeight,
        behavior: 'smooth',
      });
    }, 100);
  });

  useEventBus<IEventBusConsoleMessageReset>('@@-console-message-reset', () => {
    void storageRemoveItem(STORAGE_PREFIX_CONSOLE_OUTPUT);
    setMessages([]);
  });

  return (
    <ScrollArea
      ref={refScrollArea}
      type="auto"
      onScroll={handleScroll}
    >
      <div
        ref={refContainer}
        className={cn(
          'flex flex-1 flex-col overflow-scroll font-mono text-sm text-white text-opacity-60',
          'whitespace-nowrap',
        )}
        style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      >
        {!!messages.length
          && visibleItems.map((index) => {
            return (
              <div
                key={messages[index].ts + index}
                className="pointer-events-none relative pt-5"
              >
                <div className="absolute left-0 top-0 text-[9px] text-gray-500">
                  {format(new Date(messages[index].ts), 'yyyy-MM-dd HH:mm:ss')}
                </div>
                <div>{messages[index].message}</div>
              </div>
            );
          })}
      </div>
    </ScrollArea>
  );
};
