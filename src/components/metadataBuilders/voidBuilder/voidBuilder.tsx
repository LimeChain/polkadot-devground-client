/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react';

import type { InvocationOnChangeProps } from '@components/invocationArgsMapper/types';

interface IVoidBuilder extends InvocationOnChangeProps { }

const VoidBuilder = ({ onChange }: IVoidBuilder) => {
  const hasCalledOnChange = useRef(false);

  if (!hasCalledOnChange.current) {
    onChange(undefined);
    hasCalledOnChange.current = true;
  }

  return null;
};

export default VoidBuilder;
