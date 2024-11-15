import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import {
  useCallback,
  useState,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { Icon } from '@components/icon';
import { ToolTip } from '@components/tooltTip';
import { cn } from '@utils/helpers';

import type {
  IEventBusConsoleMessage,
  IEventBusConsoleMessageReset,
} from '@custom-types/eventBus';
import type { IConsoleMessage } from '@custom-types/global';

export const ConsoleActions = () => {
  const [
    messages,
    setMessages,
  ] = useState<IConsoleMessage[]>([]);

  useEventBus<IEventBusConsoleMessage>('@@-console-message', ({ data }) => {
    setMessages((state) => {
      const log = [
        ...state,
        ...data,
      ];
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
        'absolute right-6 top-3 flex gap-x-2',
        'opacity-0',
        'pointer-events-none',
        'transition-opacity duration-300',
        {
          ['opacity-100 pointer-events-auto']: !!messages.length,
        },
      )}
    >
      <ToolTip text="Clear console">
        <button
          onClick={handleClear}
          type="button"
          className={cn(
            'text-dev-black-1000 hover:text-dev-pink-400',
            'dark:text-white dark:hover:text-dev-pink-400',
          )}
        >
          <Icon
            name="icon-circle-slash"
            size={[16]}
          />
        </button>
      </ToolTip>
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
