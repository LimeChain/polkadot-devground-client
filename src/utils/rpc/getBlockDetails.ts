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
  getIdentity,
  getInvulnerables,
  getSuperIdentity,
  getSystemDigestData,
  getSystemEvents,
  getValidators,
} from '@utils/papi';
import { assert } from '@utils/papi/helpers';

import type { IMappedBlockExtrinsic } from '@custom-types/block';
import type { TPeopleApi } from '@custom-types/chain';
import type { BlockDetails } from '@custom-types/rawClientReturnTypes';
import type { RuntimeVersion } from '@polkadot/types/interfaces';
import type {
  FixedSizeBinary,
  HexString,
} from 'polkadot-api';
import type { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

const getBlockValidator = async ({
  blockHash,
}: {
  blockHash: string;
}) => {

  const peopleApi = baseStoreChain.getState().peopleApi as StoreInterface['peopleApi'];
  const api = baseStoreChain.getState().api as StoreInterface['api'];
  const chain = baseStoreChain.getState().chain as StoreInterface['chain'];

  const isRelayChain = chain.isRelayChain;

  assert(api, 'Api is not defined');
  assert(peopleApi, 'peopleApi is not defined');
  assert(chain, 'Chain is not defined');
  assert(blockHash, 'BlockHash is not defined');

  const digestData = await getSystemDigestData(api, blockHash);

  let authorIndex = 0;

  if (isRelayChain) {
    authorIndex = babeDigestCodec.dec(digestData).value;
  } else {
    authorIndex = Number(auraDigestCodec.dec(digestData).slotNumber);
  }

  let authors = [];

  if (isRelayChain) {
    authors = await getValidators(api, blockHash)
      .catch();
  } else {
    authors = await getInvulnerables(api as TPeopleApi, blockHash)
      .catch();
  }

  // TODO parachain validator index is not correct
  const address = isRelayChain ? authors[authorIndex] : authors[authorIndex % authors.length];

  let identity;

  identity = await getIdentity(peopleApi, address)
    .catch();
  if (identity) {
    identity = (identity?.[0]?.info?.display?.value as FixedSizeBinary<2>)?.asText?.();
  }

  const superIdentity = await getSuperIdentity(peopleApi, address)
    .catch();

  if (superIdentity?.[0] && !identity) {
    identity = await getIdentity(peopleApi, superIdentity[0])
      .catch();

    if (identity) {
      const _identity = (identity?.[0]?.info?.display?.value as FixedSizeBinary<2>)?.asText?.();
      const _superIdentity = (superIdentity?.[1]?.value as FixedSizeBinary<2>)?.asText?.();

      if (_identity) {
        if (_superIdentity) {
          identity = `${_identity}/${_superIdentity}`;
        } else {
          identity = _identity;
        }
      }
    }
  }

  return {
    name: identity?.toString(),
    address,
  };
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
  ] = await Promise.allSettled([
    client?.getBlockHeader(blockHash),
    client?.getBlockBody(blockHash),
    api && getSystemEvents(api, blockHash),
    getBlockValidator({ blockHash }),
  ]);

  // Initialize timestamp variable
  let timestamp: number = 0;

  const extrinsics: IMappedBlockExtrinsic[] = [];
  extrinsicsRaw.status === 'fulfilled' && extrinsicsRaw?.value.forEach((e, i) => {
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
      const _args = args as { now: string };
      // turn the time string of type "1,451,313,413,21" into a number
      timestamp = formatPrettyNumberString(_args?.now);
    }

    extrinsics.push({

      id: `${blockNumber}-${i}`,
      blockNumber: blockNumber || 0,
      // assume a success by default (updated later)
      isSuccess: true,
      // the timestamp is always the first extrinsic
      // so we can assume the timestamp will be populated
      // after the if statement above
      timestamp,
      extrinsicData: extrinsic,
    });
  });

  events.status === 'fulfilled' && events.value?.forEach((ev) => {
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
      identity: identity.status === 'fulfilled' ? identity.value : undefined,
      ...(blockHeader.status === 'fulfilled' ? blockHeader.value : {}),
      // ...blockHeader,
    },
    body: {
      extrinsics,
      // eventsCount: events.length,
      events: events.status === 'fulfilled' ? events.value : [],
    },
  };
};

// Not reusing the function getBlockDetailsWithPAPI above as expecting these functions to diverge in future
export const getBlockDetailsWithRawClient = async ({
  blockNumber,
  dynamicBuilder,
}: {
  blockNumber: StoreInterface['bestBlock'];
  dynamicBuilder: ReturnType<typeof useDynamicBuilder>;
}) => {
  assert(dynamicBuilder, 'Dynamic Builder is not defined');
  assert(blockNumber, 'Block Number prop is not defined');

  const rawClient = baseStoreChain.getState().rawClient as StoreInterface['rawClient'];
  const blockHash = await rawClient?.request('chain_getBlockHash', [blockNumber]) as string;

  assert(blockHash, 'Block Hash prop is not defined');

  const storageCodec = dynamicBuilder.buildStorage('System', 'Events');
  const encodedKey = storageCodec.enc();

  const [
    block,
    runtime,
    storage,
  ] = await Promise.allSettled([
    rawClient?.request('chain_getBlock', [blockHash]) as Promise<BlockDetails>,
    rawClient?.request('state_getRuntimeVersion', [blockHash]) as Promise<RuntimeVersion>,
    rawClient?.request('state_getStorage', [
      encodedKey,
      blockHash,
    ]) as Promise<HexString>,
  ]);

  assert(block, 'Failed to fetch block details');
  assert(runtime, 'Failed to fetch runtime version');

  const blockValue = block.status === 'fulfilled' ? block.value : undefined;

  const blockHeader = blockValue?.block.header;
  const blockHeaderNumber = Number(blockValue?.block?.header?.number || 0);
  const extrinsicsRaw: HexString[] = blockValue?.block.extrinsics || [];
  const storageValue = storage.status === 'fulfilled' ? storage.value : '0x';

  let events: Awaited<ReturnType<typeof getSystemEvents>> = [];

  try {
    events = storageCodec.dec(storageValue) as Awaited<ReturnType<typeof getSystemEvents>>;
  } catch (error) {
    console.log('Could not decode storage value');
  }

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
      const _args = args as { now: string };
      // turn the time string of type "1,451,313,413,21" into a number
      timestamp = formatPrettyNumberString(_args?.now);
    }

    extrinsics.push({
      ...extrinsic,
      id: `${blockNumber}-${i}`,
      blockNumber: blockNumber || 0,
      // assume a success by default (updated later)
      isSuccess: true,
      // the timestamp is always the first extrinsic
      // so we can assume the timestamp will be populated
      // after the if statement above
      timestamp,
      extrinsicData: extrinsic,
    });
  });

  events?.forEach((ev) => {
    if (ev.event.type === 'System') {
      const extrinsicIsSuccess = ev.event.value.type === 'ExtrinsicSuccess';
      const extrinsicIndex = ev.phase.value || 0;
      extrinsics[extrinsicIndex].isSuccess = extrinsicIsSuccess;
    }
  });

  const runtimeValue = runtime.status === 'fulfilled' ? runtime.value : undefined;

  return {
    header: {
      ...blockHeader,
      number: blockHeaderNumber,
      hash: blockHash,
      timestamp,
      runtime: {
        spec_name: runtimeValue?.specName.toString(),
        spec_version: Number(runtimeValue?.specVersion || 0),
      },
      extrinsicRoot: blockValue?.block?.header?.extrinsicsRoot,
    },
    body: {
      extrinsics,
      eventsCount: events.length,
      events,
    },
  };
};
