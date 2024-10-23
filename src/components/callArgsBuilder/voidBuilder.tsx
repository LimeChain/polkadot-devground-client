import { useEffect } from 'react';

import type { ICallArgs } from '.';

interface IVoidBuilder extends ICallArgs {}

export const VoidBuilder = ({ onChange }: IVoidBuilder) => {

  useEffect(() => {
    onChange(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
