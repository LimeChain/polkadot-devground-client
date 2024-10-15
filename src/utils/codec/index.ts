import {
  blockHeader,
  ScaleEnum,
} from '@polkadot-api/substrate-bindings';
import {
  Struct,
  u32,
  u64,
} from 'scale-ts';

import {
  baseStoreChain,
  type StoreInterface,
} from '@stores';

import type { IBlockExtrinsic } from '@custom-types/block';

export const decodeExtrinsic = (extrinsic: string): IBlockExtrinsic | undefined => {
  const registry = baseStoreChain.getState().registry as StoreInterface['registry'];
  try {
    return registry.createType('Extrinsic', extrinsic).toHuman() as unknown as IBlockExtrinsic;
  } catch (err) {
    return undefined;
  }
};
export const babeDigestCodec = ScaleEnum({
  authority_index: u32,
  one: u32,
  two: u32,
  three: u32,
});

export const auraDigestCodec = Struct({ slotNumber: u64 });
export const blockHeaderCodec = blockHeader;
