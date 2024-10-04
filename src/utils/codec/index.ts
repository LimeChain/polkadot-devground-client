import {
  blockHeader,
  ScaleEnum,
  metadata
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

export const decodeExtrinsic = (extrinsic: string): IBlockExtrinsic => {
  const registry = baseStoreChain.getState().registry as StoreInterface['registry'];
  return registry.createType('Extrinsic', extrinsic).toHuman() as unknown as IBlockExtrinsic;
};
export const babeDigestCodec = ScaleEnum({
  authority_index: u32,
  one: u32,
  two: u32,
  three: u32,
});

export const auraDigestCodec = Struct({ slotNumber: u64 });
export const blockHeaderCodec = blockHeader;
export const metadataCodec = metadata;
