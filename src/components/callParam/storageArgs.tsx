import { useStoreChain } from '@stores';

import { CodecParam } from './codecParam';

import type { TMetaDataStorageItem } from '@custom-types/papi';

interface IStorageArgs {
  storage: TMetaDataStorageItem;
  onChange: (args: unknown) => void;
}

export const StorageArgs = ({ storage, onChange }: IStorageArgs) => {
  const lookup = useStoreChain?.use?.lookup?.();

  const storageType = storage.type;

  if (storageType.tag === 'plain' || !lookup) {
    return null;
  }

  const keyVariable = lookup!(storageType.value.key);

  return (
    <CodecParam
      onChange={onChange}
      variable={keyVariable}
    />
  );
};
