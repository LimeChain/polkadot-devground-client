import { Twox128 } from '@polkadot-api/substrate-bindings';
import {
  mergeUint8,
  toHex,
} from '@polkadot-api/utils';
import { u32 } from 'scale-ts';

import {
  baseStoreChain,
  type StoreInterface,
} from '@stores';
import {
  auraDigestCodec,
  babeDigestCodec,
  decodeExtrinsic,
} from '@utils/codec';
import { formatPrettyNumberString } from '@utils/helpers';
import {
  getInvulnerables,
  getSystemDigestData,
  getSystemEvents,
  getValidators,
} from '@utils/papi';
import { assert } from '@utils/papi/helpers';

import type {
  IBlock,
  IBlockExtrinsic,
  IMappedBlockExtrinsic,
} from '@custom-types/block';

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

export const getBlockValidator = async ({
  blockHash,
}: {
  blockHash: string;
}) => {

  const peopleApi = baseStoreChain.getState().peopleApi as StoreInterface['peopleApi'];
  const api = baseStoreChain.getState().api as StoreInterface['api'];
  const chain = baseStoreChain.getState().chain as StoreInterface['chain'];

  const isParaChain = chain.isParaChain;

  assert(api, 'Api is not defined');
  assert(peopleApi, 'peopleApi is not defined');
  assert(chain, 'Chain is not defined');
  assert(blockHash, 'BlockHash is not defined');

  const digestData = await getSystemDigestData(api, blockHash);

  let authorIndex = 0;

  if (isParaChain) {
    authorIndex = Number(auraDigestCodec.dec(digestData).slotNumber);
  } else {
    authorIndex = babeDigestCodec.dec(digestData).value;
  }

  let authors = [];

  if (isParaChain) {
    authors = await getInvulnerables(peopleApi, blockHash);
  } else {
    authors = await getValidators(api, blockHash);
  }

  const address = !isParaChain ? authors[authorIndex] : authors[authorIndex % authors.length];

  let identity;

  // Identity for relay chains
  identity = await peopleApi?.query.Identity.IdentityOf.getValue(address);
  if (identity) {
    identity = identity[0].info.display.value?.asText();
  }

  const superIdentity = await peopleApi?.query.Identity.SuperOf.getValue(address);

  // Identity for para chains
  if (superIdentity?.[0] && !identity) {
    identity = await peopleApi?.query.Identity.IdentityOf.getValue(superIdentity[0]);
    if (identity) {
      identity = identity[0].info.display.value?.asText();
    }
  }

  if (!identity) {
    identity = address.toString();
  }

  return identity;
};

export const getBlockDetailsWithPAPI = async ({
  blockNumber,
  blockHash,
}: {
  blockNumber: StoreInterface['bestBlock'];
  blockHash: string;
}) => {

  assert(blockNumber, 'Block Number prop is not defined');
  assert(blockHash, 'Block Hash prop is not defined');

  const api = baseStoreChain.getState().api as StoreInterface['api'];
  const client = baseStoreChain.getState().client as StoreInterface['client'];
  const runtime = baseStoreChain.getState().runtime as StoreInterface['runtime'];

  assert(api, 'Api is not defined');
  assert(client, 'Client is not defined');

  const [
    blockHeader,
    extrinsicsRaw,
    events,
    identity,
  ] = await Promise.all([
    client.getBlockHeader(blockHash),
    client.getBlockBody(blockHash),
    getSystemEvents(api, blockHash),
    getBlockValidator({ blockHash }),
  ]);

  // Initialize timestamp variable
  let timestamp: number = 0;

  const extrinsics: IMappedBlockExtrinsic[] = [];
  extrinsicsRaw?.forEach((e, i) => {
    const extrinsic = decodeExtrinsic(e);
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
      timestamp = formatPrettyNumberString(args?.now);
      // only the timestamp is needed so we break the loop
      // break;
    }

    extrinsics.push({
      ...extrinsic,
      id: `${blockNumber}-${i}`,
      blockNumber: blockNumber || 0,
      // assume a success by defaul (updated later)
      isSuccess: true,
      // the timestamp is always the first extrinsic
      // so we can assume the timestamp will be populated
      // after the if statement above
      timestamp,
    });
  });

  events?.forEach(ev => {
    if (ev.event.type === 'System') {
      const extrinsicIsSuccess = ev.event.value.type === 'ExtrinsicSuccess';
      const extrinsicIndex = ev.phase.value || 0;
      extrinsics[extrinsicIndex].isSuccess = extrinsicIsSuccess;
    }
  });

  return {
    header: {
      hash: blockHash,
      timestamp,
      runtime,
      identity,
      ...blockHeader,
    },
    body: {
      extrinsics,
      // eventsCount: events.length,
      events,
    },
  };
};
