import { getDynamicBuilder } from '@polkadot-api/metadata-builders';

import {
  baseStoreChain,
  type StoreInterface,
} from '@stores';
import {
  babeDigestCodec,
  decodeExtrinsic,
  decodeExtrinsicImproved,
} from '@utils/codec';
import { formatPrettyNumberString } from '@utils/helpers';
import {
  getIdentity,
  getSuperIdentity,
  getSystemDigestData,
  getSystemEvents,
  getValidators,
} from '@utils/papi';
import { assert } from '@utils/papi/helpers';

import type { IMappedBlockExtrinsic } from '@custom-types/block';
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
  }

  let authors: string[] = [];

  if (isRelayChain) {
    authors = await getValidators(api, blockHash)
      .catch();
  }

  const address = isRelayChain ? authors[authorIndex] : '';

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
      const identityVal = (identity?.[0]?.info?.display?.value as FixedSizeBinary<2>)?.asText?.();
      const superIdentityVal = (superIdentity?.[1]?.value as FixedSizeBinary<2>)?.asText?.();

      if (identityVal) {
        if (superIdentityVal) {
          identity = `${identityVal}/${superIdentityVal}`;
        } else {
          identity = identityVal;
        }
      }
    }
  }

  return {
    name: identity?.toString?.(),
    address,
    identity: '',
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
  const lookup = baseStoreChain.getState().lookup as StoreInterface['lookup'];

  assert(api, 'Api is not defined');
  assert(client, 'Client is not defined');
  assert(lookup, 'Lookup is not defined');

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

  // Debug events failure
  if (events.status === 'rejected') {
    // Try alternative approach using raw client if available
    const rawClient = baseStoreChain.getState().rawClient;
    const lookup = baseStoreChain.getState().lookup;

    if (rawClient && lookup) {
      try {
        const dynamicBuilder = getDynamicBuilder(lookup);
        const storageCodec = dynamicBuilder.buildStorage('System', 'Events');
        const encodedKey = storageCodec.enc();

        const storageValue = await rawClient.request('state_getStorage', [
          encodedKey,
          blockHash,
        ]);

        if (storageValue && storageValue !== '0x') {
          const decodedEvents = storageCodec.dec(storageValue) as any[];

          // Override events with successful fallback
          (events as any).status = 'fulfilled';
          (events as any).value = decodedEvents;
        }
      } catch (fallbackError) {
        // Fallback failed, continue with rejected events
      }
    }
  }

  // Initialize timestamp variable
  let timestamp: number = 0;

  const extrinsics: IMappedBlockExtrinsic[] = [];
  extrinsicsRaw.status === 'fulfilled' && extrinsicsRaw?.value.forEach((e, i) => {
    // Try the improved decoder first, fall back to legacy if needed
    const lookup = baseStoreChain.getState().lookup as StoreInterface['lookup'];

    let extrinsic;
    if (lookup) {
      const dynamicBuilder = getDynamicBuilder(lookup);
      extrinsic = decodeExtrinsicImproved(e, dynamicBuilder, lookup);
    }

    // If improved decoder failed or isn't available, try legacy
    if (!extrinsic) {
      extrinsic = decodeExtrinsic(e);
    }

    // EXTRINSIC DECODING CAN FAIL
    if (extrinsic) {
      const {
        method: {
          method,
          section,
          args,
        },
      } = extrinsic;

      const isTimeStampExtrinsic = method === 'set' && section.toLowerCase() === 'timestamp';
      if (isTimeStampExtrinsic) {
        // Try different possible formats for timestamp args
        let timestampValue;

        if (args && typeof args === 'object') {
          // Check various possible structures
          if ((args as any).now) {
            timestampValue = (args as any).now;
          } else if ((args as any).value && (args as any).value.now) {
            timestampValue = (args as any).value.now;
          } else if ((args as any)[0]) {
            timestampValue = (args as any)[0];
          } else if (Array.isArray(args) && args.length > 0) {
            timestampValue = args[0];
          }
        }

        if (timestampValue) {
          // Convert to number and then to milliseconds if needed
          const numericTimestamp = typeof timestampValue === 'string'
            ? formatPrettyNumberString(timestampValue)
            : Number(timestampValue);

          // Substrate timestamps are usually in milliseconds, but let's check
          const finalTimestamp = numericTimestamp > 1000000000000 ? numericTimestamp : numericTimestamp * 1000;

          timestamp = finalTimestamp;
        }
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
    } else {
      // Fallback failed, continue with rejected extrinsic
    }

  });

  events.status === 'fulfilled' && events.value?.forEach((ev) => {
    if (ev.event.type === 'System') {
      const extrinsicIsSuccess = ev.event.value.type === 'ExtrinsicSuccess';
      const extrinsicIndex = ev.phase.value || 0;

      if (extrinsics[extrinsicIndex]) {
        extrinsics[extrinsicIndex].isSuccess = extrinsicIsSuccess;
      }
    }
  });

  const eventsArray = events.status === 'fulfilled' ? events.value : [];

  return {
    header: {
      hash: blockHash,
      timestamp,
      runtime,
      identity: identity.status === 'fulfilled' ? identity.value : undefined,
      ...(blockHeader.status === 'fulfilled' ? blockHeader.value : {}),
    },
    body: {
      extrinsics,
      events: eventsArray,
      eventsCount: eventsArray.length,
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
  const lookup = baseStoreChain.getState().lookup as StoreInterface['lookup'];
  const blockHash = await rawClient?.request('chain_getBlockHash', [blockNumber]) as string;

  assert(blockHash, 'Block Hash prop is not defined');
  assert(lookup, 'Lookup is not defined');

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
    // Could not decode storage value
  }

  // Initialize timestamp variable
  let timestamp: number = 0;

  const extrinsics: IMappedBlockExtrinsic[] = [];
  extrinsicsRaw?.forEach((e, i) => {
    const extrinsic = decodeExtrinsicImproved(e, dynamicBuilder, lookup);

    // EXTRINSIC DECODING CAN FAIL
    if (extrinsic) {
      const {
        method: {
          method,
          section,
          args,
        },
      } = extrinsic;

      const isTimeStampExtrinsic = method === 'set' && section.toLowerCase() === 'timestamp';
      if (isTimeStampExtrinsic) {
        // Timestamp.set always takes a single argument (timestamp in milliseconds)
        const timestampArg = Array.isArray(args) ? args[0] : args;

        if (timestampArg) {
          const numericTimestamp = typeof timestampArg === 'string'
            ? formatPrettyNumberString(timestampArg)
            : Number(timestampArg);

          timestamp = numericTimestamp; // Already in milliseconds in Substrate
        }
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
    }
  });

  events?.forEach((ev) => {
    if (ev.event.type === 'System') {
      const extrinsicIsSuccess = ev.event.value.type === 'ExtrinsicSuccess';
      const extrinsicIndex = ev.phase.value || 0;

      if (extrinsics[extrinsicIndex]) {
        extrinsics[extrinsicIndex].isSuccess = extrinsicIsSuccess;
      }
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
