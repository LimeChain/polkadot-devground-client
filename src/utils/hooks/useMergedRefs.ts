import {
  type MutableRefObject,
  type Ref,
  type RefCallback,
  useCallback,
} from 'react';

type PossibleRef<T> = Ref<T> | undefined;

export const assignRef = <T>(ref: PossibleRef<T>, value: T) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null) {
    (ref as MutableRefObject<T>).current = value;
  }
};

export const mergeRefs = <T>(...refs: PossibleRef<T>[]) => {
  return (node: T) => {
    return refs.forEach((ref) => ref && assignRef(ref, node));
  };
};

export const useMergedRefs = <T>(...refs: PossibleRef<T>[]) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), [...refs]) as RefCallback<T>;
};
