import { useEventBus } from '@pivanov/event-bus';
import React, {
  type RefObject,
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import { smoothScroll } from '../helpers';

import type { IEventBusForksReceiveUpdate } from '@custom-types/eventBus';

interface IScrollButtons {
  refScrollArea: RefObject<HTMLDivElement>;
}

export const ScrollButtons = ({ refScrollArea }: IScrollButtons) => {
  const [buttonState, setButtonState] = useState({
    canGoToStart: false,
    canGoToEnd: false,
  });

  const scrollToLeft = useCallback(() => {
    if (refScrollArea.current) {
      void smoothScroll(refScrollArea.current, 'left', 0);
    }
  }, [refScrollArea]);

  const scrollToRight = useCallback(() => {
    if (refScrollArea.current) {
      void smoothScroll(refScrollArea.current, 'left', refScrollArea.current.scrollWidth);
    }
  }, [refScrollArea]);

  useEventBus<IEventBusForksReceiveUpdate>('@@-forks-receive-update', ({ data }) => {
    if (refScrollArea.current) {
      setButtonState(data);

      if (data.keepScrollToEnd) {
        void smoothScroll(refScrollArea.current, 'left', refScrollArea.current.scrollWidth);
      }
    }
  });

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={scrollToLeft}
        disabled={!buttonState.canGoToStart}
        className={cn(
          'cursor-pointer text-dev-pink-500',
          'transition-colors duration-300',
          {
            ['text-dev-black-200']: !buttonState.canGoToStart,
          },
        )}
      >
        <Icon name="icon-arrowCircle" className="-rotate-90" />
      </button>
      <button
        onClick={scrollToRight}
        disabled={!buttonState.canGoToEnd}
        className={cn(
          'cursor-pointer text-dev-pink-500',
          'transition-colors delay-300 duration-300',
          {
            ['text-dev-black-200 delay-0']: !buttonState.canGoToEnd,
          },
        )}
      >
        <Icon name="icon-arrowCircle" className="rotate-90" />
      </button>
    </div>
  );
};
