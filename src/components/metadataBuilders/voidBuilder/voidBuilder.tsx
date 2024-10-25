/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import type { InvocationOnChangeProps } from '@components/invocationArgsMapper/types';

interface IVoidBuilder extends InvocationOnChangeProps {}

const VoidBuilder = ({ onChange }: IVoidBuilder) => {
  useEffect(() => {
    onChange(undefined);
  }, []);

  return null;
};

export default VoidBuilder;
