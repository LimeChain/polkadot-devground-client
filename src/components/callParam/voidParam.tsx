import { useEffect } from 'react';

import type { ICallArgs } from '.';

interface IVoidParam extends ICallArgs {

}

export const VoidParam = ({ onChange }: IVoidParam) => {

  useEffect(() => {
    onChange(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
