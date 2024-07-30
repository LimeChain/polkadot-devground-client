import {
  GenericExtrinsic,
  Metadata,
  TypeRegistry,
} from '@polkadot/types';
import { hexToU8a } from '@polkadot/util';

import type { IBlock } from '@custom-types/block';
import type { Compact } from '@polkadot/types/codec';
import type { SubstrateClient } from '@polkadot-api/substrate-client';

export const getBlockDetails = async (rawClient: SubstrateClient, blockNumber: number) => {
  // Fetch the block hash using the block number
  const blockHash: string = await rawClient.request('chain_getBlockHash', [blockNumber]);

  // Fetch the latest block details using the block hash
  const latestBlock: { block: IBlock } = await rawClient.request('chain_getBlock', [blockHash]);

  // Initialize a type registry and set metadata
  const registry = new TypeRegistry();
  const metadataHex: string = await rawClient.request('state_getMetadata', []);
  const metadata = new Metadata(registry, hexToU8a(metadataHex));
  registry.setMetadata(metadata);

  // Initialize timestamp variable
  let blockTimestamp: number | null = null;

  // Decode extrinsics to find the timestamp
  for (const extrinsicHex of latestBlock.block.extrinsics) {
    const extrinsic = new GenericExtrinsic(registry, hexToU8a(extrinsicHex));
    const { method } = extrinsic;

    console.log('@@@ extrinsic', extrinsic);

    // Check if the method is 'timestamp.set'
    if (method.section === 'timestamp' && method.method === 'set') {
      blockTimestamp = (method.args[0] as Compact<any>).toNumber(); // Cast to Compact for toNumber()
      break; // Exit loop after finding the timestamp
    }
  }

  if (blockTimestamp === null) {
    console.warn('Timestamp not found in the block extrinsics.');
  }

  return {
    ...latestBlock.block,
    hash: blockHash,
    timestamp: blockTimestamp ? new Date(blockTimestamp) : null,
  };
};
