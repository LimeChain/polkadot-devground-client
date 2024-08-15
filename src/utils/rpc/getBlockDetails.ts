import { Twox128 } from '@polkadot-api/substrate-bindings';
import {
  mergeUint8,
  toHex,
} from '@polkadot-api/utils';
import { u32 } from 'scale-ts';

import { formatPrettyNumberString } from '@utils/helpers';

import type {
  IBlock,
  IBlockExtrinsic,
  IMappedBlockExtrinsic,
} from '@custom-types/block';
import type { StoreInterface } from '@stores';

const textEncoder = new TextEncoder();
export const getBlockDetails = async ({
  rawClient,
  blockNumber,
  registry,
}: {
  rawClient: StoreInterface['rawClient'];
  blockNumber: StoreInterface['bestBlock'];
  registry: StoreInterface['registry'];
}) => {

  if (!rawClient) {
    throw new Error('Raw Client is not defined');
  }

  if (!blockNumber) {
    throw new Error('Block Number is not defined');
  }

// Fetch block hash via blockNumbe
  const blockHash: string = await rawClient.request('chain_getBlockHash', [blockNumber]);

  // Fetch the block details using the block hash
  const blockData: { block: IBlock } = await rawClient.request('chain_getBlock', [blockHash]);

  // Initialize timestamp variable
  let blockTimestamp: number | null = null;

  // Decode extrinsics to find the timestamp
  for (const extrinsicHex of blockData.block.extrinsics) {
    const extrinsic = registry.createType('Extrinsic', extrinsicHex).toHuman() as unknown as IBlockExtrinsic;

    const {
      method: {
        method,
        section,
        args,
      },
    } = extrinsic;

    const isTimeStampExtrinsic = method === 'set' && section === 'timestamp';
    if (isTimeStampExtrinsic) {
      // turn the time string of type "1,451,313,413,21" into a number
      blockTimestamp = formatPrettyNumberString(args?.now);
      // only the timestamp is needed so we break the loop
      break;
    }
  }

  // Get storage hash for pallet::System method::EventsCount
  const systemHash = Twox128(textEncoder.encode('System'));
  const eventCountHash = Twox128(textEncoder.encode('EventCount'));
  const merged = mergeUint8(systemHash, eventCountHash);
  const storageHash = toHex(merged);

  const eventsCountHash: string = await rawClient.request(
    'state_getStorage',
    [storageHash, blockHash],
  );

  if (blockTimestamp === null) {
    console.warn('Timestamp not found in the block extrinsics.');
  }

  return {
    ...blockData.block,
    hash: blockHash,
    timestamp: blockTimestamp ? new Date(blockTimestamp) : null,
    eventsCount: u32.dec(eventsCountHash),
  };
};

export const getBlockDetailsWithPAPI = async ({
  api,
  client,
  blockNumber,
  registry,
  blockHash,
}: {
  api: StoreInterface['api'];
  client: StoreInterface['client'];
  blockNumber: StoreInterface['bestBlock'];
  blockHash: string;
  registry: StoreInterface['registry'];
}) => {
  if (!api) {
    throw new Error('Api is not defined');
  }
  if (!client) {
    throw new Error('Client is not defined');
  }
  if (!blockNumber) {
    throw new Error('Block Number is not defined');
  }

  if (!blockHash) {
    throw new Error('Block Hash was not found');
  }

  const eventsCount = await api.query.System.EventCount.getValue({ at: blockHash });

  // Initialize timestamp variable
  let timestamp: number = 0;

  const extrinsicsRaw = await client.getBlockBody(blockHash);
  const extrinsics: IMappedBlockExtrinsic[] = [];

  extrinsicsRaw.forEach((e, i) => {
    const extrinsic = registry.createType('Extrinsic', e).toHuman() as unknown as IBlockExtrinsic;
    const {
      method: {
        method,
        section,
        args,
      },
    } = extrinsic;

    const isTimeStampExtrinsic = method === 'set' && section === 'timestamp';
    if (isTimeStampExtrinsic) {
      // turn the time string of type "1,451,313,413,21" into a number
      timestamp = Number(args?.now?.replaceAll(',', ''));
      // only the timestamp is needed so we break the loop
      // break;
    }

    extrinsics.push({
      ...extrinsic,
      id: `${blockNumber}-${i}`,
      blockNumber,
      // the timestamp is always the first extrinsic
      // so we can assume the timestamp will be populated
      // after the if statement above
      timestamp,
    });
  });

  return {
    extrinsics,
    hash: blockHash,
    timestamp,
    eventsCount,
  };
};
