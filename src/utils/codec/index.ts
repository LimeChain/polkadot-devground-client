import {
  blockHeader,
  metadata,
  ScaleEnum,
} from '@polkadot-api/substrate-bindings';
import { u32 } from 'scale-ts';

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
  a: u32,
  b: u32,
  c: u32,
});

export const blockHeaderCodec = blockHeader;
export const metadataCodec = metadata;
