import { getViewBuilder } from '@polkadot-api/view-builder';
import { useMemo } from 'react';

import { useStoreChain } from '@stores';

export const useViewBuilder = () => {
  const lookup = useStoreChain?.use?.lookup?.();
  return useMemo(() => {
    if (lookup) {
      return getViewBuilder(lookup);
    }

    return undefined;
  }, [lookup]);
};
