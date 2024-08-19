import {
  ScaleEnum,
  Twox128,
} from '@polkadot-api/substrate-bindings';
import {
  mergeUint8,
  toHex,
} from '@polkadot-api/utils';
import {
  Struct,
  u32,
  u64,
} from 'scale-ts';

import {
  baseStoreChain,
  type StoreInterface,
} from '@stores';
import { formatPrettyNumberString } from '@utils/helpers';

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

const babeDigestCodec = ScaleEnum({
  authority_index: u32,
  one: u32,
  two: u32,
  three: u32,
});

const auraDigestCodec = Struct({ slotNumber: u64 });

export const getBlockValidator = async ({
  blockHash,
}: {
  blockHash: string;
}) => {

  const peopleApi = baseStoreChain.getState().peopleApi as StoreInterface['peopleApi'];
  const api = baseStoreChain.getState().api as StoreInterface['api'];
  const chain = baseStoreChain.getState().chain as StoreInterface['chain'];

  const isPeopleChain = chain.id.includes('people');

  if (!api) {
    throw new Error('Api is not defined');
  }
  if (!blockHash) {
    throw new Error('Block Hash was not found');
  }
  if (!peopleApi) {
    throw new Error('People Api is not defined');
  }

  const digest = await api.query.System.Digest.getValue({ at: blockHash });
  const digestData = digest[0].value[1].asBytes();

  let authorIndex = 0;

  if (isPeopleChain) {
    authorIndex = Number(auraDigestCodec.dec(digestData).slotNumber);
  } else {
    authorIndex = babeDigestCodec.dec(digestData).value;
  }

  let authors = [];

  if (isPeopleChain) {
    authors = await peopleApi.query.CollatorSelection.Invulnerables.getValue({ at: blockHash });
  } else {
    authors = await api.query.Session.Validators.getValue({ at: blockHash });
  }
  // console.log(authorIndex);
  // console.log(collators);

  const address = !isPeopleChain ? authors[authorIndex] : authors[authorIndex % authors.length];

  let identity;
  identity = await peopleApi?.query.Identity.IdentityOf.getValue(address);
  if (identity) {
    identity = identity[0].info.display.value?.asText();
  }

  const superIdentity = await peopleApi?.query.Identity.SuperOf.getValue(address);
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

  const runtime = baseStoreChain.getState().runtime as StoreInterface['runtime'];
  // const blocksData = baseStoreChain.getState().blocksData as StoreInterface['blocksData'];
  // const blockData = blocksData.get(blockNumber);

  const blockHeader = await client.getBlockHeader(blockHash);

  // if (blockData && blockData.header.hash === blockHash) {
  //   return;
  // }

  // console.log(blockNumber, blockHash);

  // Initialize timestamp variable
  let timestamp: number = 0;

  // const eventsCount = await api.query.System.EventCount.getValue({ at: blockHash });

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
      isSuccess: true,
      // the timestamp is always the first extrinsic
      // so we can assume the timestamp will be populated
      // after the if statement above
      timestamp,
    });
  });

  const events = await api.query.System.Events.getValue({ at: blockHash });
  events.forEach(ev => {
    if (ev.event.type === 'System') {
      const extrinsicIsSuccess = ev.event.value.type === 'ExtrinsicSuccess';
      const extrinsicIndex = ev.phase.value || 0;
      extrinsics[extrinsicIndex].isSuccess = extrinsicIsSuccess;
    }
  });
  // console.log(blockNumber, blockHash, events);

  //Get the block validator
  const identity = await getBlockValidator({ blockHash });

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
