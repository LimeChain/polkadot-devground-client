import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import {
  useCallback,
  useState,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { cn } from '@utils/helpers';

import type {
  IEventBusConsoleMessage,
  IEventBusConsoleMessageReset,
} from '@custom-types/eventBus';
import type { IConsoleMessage } from '@custom-types/global';

export const ConsoleActions = () => {
  const [messages, setMessages] = useState<IConsoleMessage[]>([]);

  useEventBus<IEventBusConsoleMessage>('@@-console-message', ({ data }) => {
    setMessages((state) => {
      const log = [...state, ...data];
      return log;
    });
  });

  useEventBus<IEventBusConsoleMessageReset>('@@-console-message-reset', () => {
    setMessages([]);
  });

  const handleClear = useCallback(() => {
    busDispatch({
      type: '@@-console-message-reset',
    });
  }, []);

  return (
    <div
      className={cn(
        'absolute bottom-2 right-2 flex',
        'opacity-0',
        'pointer-events-none',
        'transition-opacity duration-300',
        {
          ['opacity-100 pointer-events-auto']: !!messages.length,
        },
      )}
    >
      <button
        type="button"
        className={cn(
          'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        )}
        onClick={handleClear}
      >
        Clear Console
      </button>
      <CopyToClipboard
        text={messages.map(({ message }) => message).join('\n')}
        toastMessage="console output"
      >
        {
          ({ ClipboardIcon }) => (
            <>
              {ClipboardIcon}
            </>
          )
        }
      </CopyToClipboard>
    </div>
  );
};

ConsoleActions.displayName = 'Console Actions';
