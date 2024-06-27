import { format } from 'date-fns';
import { ScrollArea } from "@components/scrollArea";
import type { IConsoleMessage } from "@custom-types/global";
import { cn } from "@utils/helpers";
import { useVirtualScroll } from "@utils/hooks/useVirtualScroll";
import { useRef, useState } from "react";
import type { IEventBusConsoleMessage, IEventBusConsoleMessageReset } from '@custom-types/eventBus';
import { useEventBus } from '@pivanov/event-bus';
import { storageRemoveItem, storageSetItem } from '@utils/storage';
import { STORAGE_PREFIX_CONSOLE_OUTPUT } from '@utils/constants';

export const Console = () => {
  const refTimeout = useRef<NodeJS.Timeout>();

  const refScrollArea = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<IConsoleMessage[]>([]);

  const refContainer = useRef<HTMLDivElement | null>(null);

  const { visibleItems, topPadding, bottomPadding, handleScroll } = useVirtualScroll({
    totalItems: messages.length,
    itemHeight: 20,
    containerHeight: refContainer.current?.clientHeight,
  });

  useEventBus<IEventBusConsoleMessage>('@@-console-message', ({ data }) => {
    clearTimeout(refTimeout.current);
    setMessages((state) => {
      const log = [...state];
      log.push(...data);

      storageSetItem(STORAGE_PREFIX_CONSOLE_OUTPUT, log);
      return log;
    });

    refTimeout.current = setTimeout(() => {
      refScrollArea.current?.scrollTo({ top: refContainer.current?.clientHeight, behavior: 'smooth' });
    }, 100);
  });

  useEventBus<IEventBusConsoleMessageReset>('@@-console-message-reset', () => {
    storageRemoveItem(STORAGE_PREFIX_CONSOLE_OUTPUT);
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
          'flex-1 flex flex-col overflow-scroll text-sm font-mono text-white text-opacity-60',
          'whitespace-nowrap'
        )}
        style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      >
        {
          !!messages.length && visibleItems.map((index) => {
            return (
              <div
                key={messages[index].ts + index}
                className='relative pt-5 pointer-events-none'
              >
                <div className='absolute top-0 left-0 text-[9px] text-gray-500'>{format(new Date(messages[index].ts), 'yyyy-MM-dd HH:mm:ss')}</div>
                <div>{messages[index].message}</div>
              </div>
            )
          })
        }
      </div>
    </ScrollArea>
  )
};
