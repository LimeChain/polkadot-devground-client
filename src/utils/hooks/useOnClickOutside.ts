import { useEventListener } from './useEventListener';

import type { RefObject } from 'react';

type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout';

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent | MediaQueryListEvent) => void,
  eventType: EventType = 'mousedown',
  eventListenerOptions: AddEventListenerOptions = {},
): void => {
  useEventListener(
    eventType,
    (event) => {
      const target = event.target as Node;

      if (!target || !target.isConnected) {
        return;
      }

      const isOutside = Array.isArray(ref)
        ? ref.filter((r) => Boolean(r.current)).every((r) => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target);

      if (isOutside) {
        handler(event as MouseEvent | TouchEvent | FocusEvent | MediaQueryListEvent);
      }
    },
    undefined,
    eventListenerOptions,
  );
};
