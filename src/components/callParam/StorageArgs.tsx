import { useStoreChain } from '@stores';

import { CodecParam } from './CodecParam';

import type { TMetaDataStorageItem } from '@custom-types/papi';

export const StorageArgs = (
  {
    storage,
    onChange,
  }: {
    storage: TMetaDataStorageItem;
    onChange: (args: unknown) => void;
  },
) => {
  const lookup = useStoreChain?.use?.lookup?.();

  const storageType = storage.type;

  if (storageType.tag === 'plain' || !lookup) {
    return null;
  }

  const keyVariable = lookup!(storageType.value.key);

  return (
    <CodecParam variable={keyVariable} onChange={onChange} />
  );
};
