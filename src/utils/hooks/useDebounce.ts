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
  const callbackRef = useRef<DebouncedCallback<T>>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debounced = useCallback((event: T) => {
    if (refTimeout.current) {
      clearTimeout(refTimeout.current);
    }
    refTimeout.current = setTimeout(() => {
      callbackRef.current(event);
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
