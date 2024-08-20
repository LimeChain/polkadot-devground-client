import {
  baseStoreChain,
  type StoreInterface,
} from '@stores';

import type { IBlockExtrinsic } from '@custom-types/block';

export const decodeExtrinsic = (extrinsic: string): IBlockExtrinsic => {
  const registry = baseStoreChain.getState().registry as StoreInterface['registry'];
  return registry.createType('Extrinsic', extrinsic).toHuman() as unknown as IBlockExtrinsic;
};
