import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { useStoreChain } from '@stores';

import { InvocationMapper } from '../invocationArgsMapper/invocationMapper';

import type { InvocationStorageArgs as Type } from '@components/invocationArgsMapper/types';
import type { TMetaDataStorageItem } from '@custom-types/papi';
import type { MetadataLookup } from '@polkadot-api/metadata-builders';

const shouldSkipRendering = (storage: TMetaDataStorageItem, lookup: MetadataLookup | null): boolean => {
  return storage.type.tag === 'plain' || !lookup;
};

const InvocationStorageArgs = ({ args, onChange }: Type) => {
  const lookup = useStoreChain?.use?.lookup?.();
  if (!lookup) {
    return null;
  }

  try {
    if (!shouldSkipRendering(args, lookup)) {
      return (
        <InvocationMapper
          invokationVar={lookup!((args.type.value as { key: number }).key)}
          onChange={onChange}
        />
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return <NotImplemented />;
  }
};

export default InvocationStorageArgs;
