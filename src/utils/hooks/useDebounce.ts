import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

type DebouncedCallback<T> = (event: T) => void;

export const useDebounce = <T>(
  callback: DebouncedCallback<T>,
  wait: number,
): DebouncedCallback<T> => {
  const refTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refCallback = useRef<DebouncedCallback<T>>(callback);

  useEffect(() => {
    refCallback.current = callback;
  }, [callback]);

  const debounced = useCallback((event: T) => {
    if (refTimeout.current) {
      clearTimeout(refTimeout.current);
    }
    refTimeout.current = setTimeout(() => {
      refCallback.current(event);
    }, wait);
  }, [wait]);

  useEffect(() => {
    return () => {
      if (refTimeout.current) {
        clearTimeout(refTimeout.current);
      }
    };
  }, [wait]);

  return debounced;
};
