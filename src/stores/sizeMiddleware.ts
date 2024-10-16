import { busDispatch } from '@pivanov/event-bus';

import { calculateObjectSize } from '@utils/internal';

import type { IEventBusStoreSize } from '@custom-types/eventBus';

export type ZustandSet<T> = (state: Partial<T> | ((state: T) => Partial<T>)) => void;
type ZustandGet<T> = () => T;
type ZustandApi<T> = {
  setState: ZustandSet<T>;
  getState: ZustandGet<T>;
  destroy: () => void;
};

/**
 * Dispatches an event to notify that the store size has changed.
 */
const dispatchSizeEvent = () => {
  busDispatch<IEventBusStoreSize>({
    type: '@@-store-size',
  });
};

/**
 * Updates the size information stored in the window object.
 *
 * @param storeName - The name of the store.
 * @param size - The new size of the store.
 */
const updateSizeInfo = (storeName: string, size: number) => {
  if (!window.storesSizes) {
    window.storesSizes = {};
  }
  window.storesSizes[storeName] = size;
};

/**
 * Middleware to add size monitoring to a Zustand store.
 *
 * @param storeName - The name of the store.
 * @param store - The Zustand store implementation.
 * @returns A wrapped version of the Zustand store with size monitoring enabled.
 */
export const sizeMiddleware = <T extends object>(
  storeName: string,
  store: (set: ZustandSet<T>, get: ZustandGet<T>, api: ZustandApi<T>) => T,
) => {
  return (set: ZustandSet<T>, get: ZustandGet<T>, api: ZustandApi<T>) => {
    const size = calculateObjectSize(get());
    updateSizeInfo(storeName, size);

    const setSize: ZustandSet<T> = (partialState) => {
      // Update store size information and dispatch event
      const size = calculateObjectSize(get());
      updateSizeInfo(storeName, size);
      dispatchSizeEvent();

      // Update the state
      set(partialState);
    };

    return store(setSize, get, api);
  };
};
