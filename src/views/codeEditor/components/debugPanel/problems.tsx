import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import * as monaco from 'monaco-editor';
import {
  useCallback,
  useState,
} from 'react';

import { PDScrollArea } from '@components/scrollArea';
import { cn } from '@utils/helpers';

import type { IEventBusErrorItem } from '@custom-types/eventBus';
import type { IErrorItem } from '@custom-types/global';

interface IProblemsProps {
  maxWidth?: number;
}

export const Problems = (props: IProblemsProps) => {
  const {
    maxWidth,
  } = props;

  const [messages, setMessages] = useState<IErrorItem[]>([]);

  useEventBus<IEventBusErrorItem>('@@-problems-message', ({ data }) => {
    setMessages(data);
  });

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));

    const cursorPosition = new monaco.Position(messages[index].startLineNumber, messages[index].startColumn);

    busDispatch({
      type: '@@-monaco-editor-update-cursor-position',
      data: cursorPosition,
    });
  }, [messages]);

  return (
    <PDScrollArea>
      <div
        className={cn(
          'flex flex-col gap-y-2 text-gray-300',
          'pr-3',
          'w-full overflow-hidden',
        )}
        style={{
          maxWidth,
        }}
      >
        {
          !!messages.length
            ? messages.map((message, index) => (
              <div
                key={index}
                data-index={index}
                className="flex items-center gap-x-3 whitespace-nowrap text-xs"
                onClick={handleClick}
              >
                <span className="truncate">{message.message}</span>
                <span className="dark:text-gray-500">{`Ln ${message.startLineNumber}, Col ${message.startColumn} - Ln ${message.endLineNumber}, Col ${message.endColumn}`}</span>
              </div>
            ))
            : (
              <div className="text-xs">No problems have been detected</div>
            )
        }
      </div>
    </PDScrollArea>
  );
};

Problems.displayName = 'Problems';
