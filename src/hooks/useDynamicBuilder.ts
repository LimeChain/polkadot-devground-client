import { getDynamicBuilder } from '@polkadot-api/metadata-builders';
import { useMemo } from 'react';

import { useStoreChain } from '@stores';

export const useDynamicBuilder = () => {
  const lookup = useStoreChain?.use?.lookup?.();
  return useMemo(() => {
    if (lookup) {
      return getDynamicBuilder(lookup);
    }

    return undefined;
  }, [lookup]);
};
