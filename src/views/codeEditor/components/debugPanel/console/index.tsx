import { useEventBus } from '@pivanov/event-bus';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { highlightAllUnder } from 'prismjs';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { PDScrollArea } from '@components/scrollArea';
import { cn } from '@utils/helpers';
import {
  storageRemoveItem,
  storageSetItem,
} from '@utils/storage';
import {
  STORAGE_CACHE_NAME,
  STORAGE_PREFIX_CONSOLE_OUTPUT,
} from '@views/codeEditor/constants';

import type {
  IEventBusConsoleMessage,
  IEventBusConsoleMessageReset,
} from '@custom-types/eventBus';
import type { IConsoleMessage } from '@custom-types/global';

export const Console = () => {
  const refTimeout = useRef<NodeJS.Timeout | null>(null);
  const refScrollArea = useRef<HTMLDivElement | null>(null);
  const refIsUserScrolling = useRef(false);
  const refContainer = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<IConsoleMessage[]>([]);
  const refSizes = useRef<Map<number, number>>(new Map());

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => refScrollArea.current,
    estimateSize: (index) => refSizes.current.get(index) || 35,
    overscan: 5,
  });

  useEffect(() => {
    if (refScrollArea.current) {
      highlightAllUnder(refScrollArea.current);
    }
  }, [messages]);

  useEventBus<IEventBusConsoleMessage>('@@-console-message', ({ data }) => {
    clearTimeout(refTimeout.current!);
    setMessages((state) => {
      const log = [...state, ...data];
      void storageSetItem(STORAGE_CACHE_NAME, STORAGE_PREFIX_CONSOLE_OUTPUT, log);
      return log;
    });

    if (!refIsUserScrolling.current) {
      refTimeout.current = setTimeout(() => {
        refScrollArea.current?.scrollTo({
          top: refContainer.current?.clientHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  });

  useEventBus<IEventBusConsoleMessageReset>('@@-console-message-reset', () => {
    void storageRemoveItem(STORAGE_CACHE_NAME, STORAGE_PREFIX_CONSOLE_OUTPUT);
    setMessages([]);
  });

  const handleOnScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (event.currentTarget.scrollTop + event.currentTarget.clientHeight >= event.currentTarget.scrollHeight) {
      refIsUserScrolling.current = false;
    } else {
      refIsUserScrolling.current = true;
    }
  }, []);

  const renderMessage = (message: unknown) => {
    if (typeof message === 'string') {
      return message;
    }
    if (typeof message === 'object') {
      return JSON.stringify(message, null, 2);
    }
    return String(message);
  };

  const measureRow = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const index = Number(node.getAttribute('data-index'));
      const height = node.getBoundingClientRect().height;
      const currentHeight = refSizes.current.get(index);
      if (currentHeight !== height) {
        refSizes.current.set(index, height);
        rowVirtualizer.measure();
      }
    }
  }, [rowVirtualizer]);

  return (
    <PDScrollArea
      ref={refScrollArea}
      className="flex-1"
      onScroll={handleOnScroll}
    >
      <div
        ref={refContainer}
        className={cn(
          'relative flex flex-1 flex-col',
          'whitespace-nowrap font-mono text-sm text-white text-opacity-60',
          'language-js log info error warn',
        )}
        style={{
          width: refScrollArea.current?.clientWidth,
          height: `${rowVirtualizer.getTotalSize()}px`,
          overflowWrap: 'anywhere',
        }}
      >
        {
          !!messages.length && rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const messageItem = messages[virtualItem.index];
            if (!messageItem) {
              return null;
            }

            const { message, ts } = messageItem;
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={measureRow}
                className="absolute pb-2 pt-5"
                style={{
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="absolute left-0 top-0 text-[9px] text-gray-500">
                  {format(new Date(ts), 'yyyy-MM-dd HH:mm:ss')}
                </div>
                <pre className="!m-0 !p-0">
                  <code className="!whitespace-break-spaces">
                    {renderMessage(message)}
                  </code>
                </pre>
              </div>
            );
          })
        }
      </div>
    </PDScrollArea>
  );
};

Console.displayName = 'Console';
