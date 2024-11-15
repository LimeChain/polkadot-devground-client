import { createClient as createSubstrateClient } from '@polkadot-api/substrate-client';
import {
  type Binary,
  CompatibilityLevel,
  createClient,
  type FixedSizeBinary,
  type PolkadotClient,
  type SS58String,
  type TypedApi,
} from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { getWsProvider } from 'polkadot-api/ws-provider/web';

import {
  CHAIN_SPECS,
  CHAIN_WEBSOCKET_URLS,
} from '@constants/chain';
import { baseStoreChain } from '@stores';
import { getBlockDetailsWithPAPI } from '@utils/rpc/getBlockDetails';

import {
  assert,
  checkIfCompatable,
} from './helpers';

import type {
  IRuntime,
  TApi,
  TChain,
  TParaChainDecsriptor,
  TPeopleApi,
  TRelayChainDecsriptor,
  TSupportedChain,
} from '@custom-types/chain';
import type { SmoldotChainProps } from '@custom-types/papi';
import type { ZustandSet } from 'src/stores/sizeMiddleware';

export const initSmoldotChain = async ({
  smoldot,
  chain,
  potentialRelayChain,
}: SmoldotChainProps) => {
  const relayChain = potentialRelayChain
    ? await initSmoldotChain({
      smoldot,
      chain: potentialRelayChain,
    })
    : undefined;
  const smoldotChain = await smoldot.addChain({
    chainSpec: await CHAIN_SPECS[chain](),
    potentialRelayChains: relayChain ? [relayChain] : [],
  });

  return smoldotChain;
};

export const getSmoldotChainClient = async ({
  smoldot,
  chain,
  potentialRelayChain,
}: SmoldotChainProps) => {
  return createClient(
    getSmProvider(
      await initSmoldotChain({
        smoldot,
        chain,
        potentialRelayChain,
      }),
    ),
  );
};

export const getWsChainClient = async ({
  chain,
}: {
  chain: TSupportedChain;
}) => {
  return createClient(
    getWsProvider(
      CHAIN_WEBSOCKET_URLS[chain],
    ),
  );
};

export const subscribeToBestBlocks = ({
  client,
  set,
}: {
  client: PolkadotClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: ZustandSet<any>;
}) => {
  const blocksData = baseStoreChain.getState()?.blocksData;

  const subscription = client.bestBlocks$.subscribe({
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    next(bestBlocks) {
      const bestBlock = bestBlocks.at(0);
      const finalizedBlock = bestBlocks.at(-1);

      const promises = [];
      // get block data starting from finalized to best block
      for (let i = bestBlocks.length - 1; i >= 0; i--) {
        const block = bestBlocks[i];

        // skip allready fetched blocks
        const blockHashHasBeenFetched = blocksData.get(block.number)?.hash === block.hash;
        if (blockHashHasBeenFetched) {
          continue;
        }

        promises.push(getBlockDetailsWithPAPI({
          blockHash: block.hash,
          blockNumber: block.number,
        }));

      }

      Promise.allSettled(promises).then((results) => {
        results.forEach((blockData) => {
          if (blockData.status === 'fulfilled') {
            const blockExtrinsics = (blockData?.value.body?.extrinsics ?? [])
              .reverse()
              .map((extrinsic) => {
                const { id, blockNumber, extrinsicData, timestamp, isSuccess } = extrinsic;
                const { method, signer } = extrinsicData;
                return {
                  id,
                  blockNumber,
                  timestamp,
                  isSuccess: isSuccess || false,
                  signer: signer?.Id ?? '',
                  method: method.method,
                  section: method.section,
                };
              });

            const newBlockData = {
              number: blockData.value.header.number,
              hash: blockData.value.header.hash,
              timestamp: blockData.value.header.timestamp,
              eventsLength: blockData.value.body.events.length,
              validator: blockData.value.header.identity?.address?.toString?.(),
              extrinsics: blockExtrinsics,
              identity: blockData.value.header.identity,
            };

            if (typeof newBlockData.number == 'number') {
              blocksData.set(newBlockData.number, newBlockData);
            }
          } else {
            console.log(blockData);
          }
        });
        // UPDATE STORE AFTER GETTING THE DATA
        set({
          bestBlock: bestBlock?.number,
          finalizedBlock: finalizedBlock?.number,
        });
      })
        // prevent state crash on random smoldot error
        .catch((err) => {
          console.error(err);
        });
    },
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    error(err) {
      console.log('Unexpected best blocks subscription error!', err.message);
      subscription.unsubscribe();
      // RETRY SUBSCRIBING TO CHAIN HEAD
      subscribeToBestBlocks({ client, set });
    },
  });
};

export const createSubstrateWsClient = ({
  chain,
  set,
}: {
  chain: TSupportedChain;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: ZustandSet<any>;
}) => {
  const wsUrl = CHAIN_WEBSOCKET_URLS[chain];
  if (!wsUrl) {
    return;
  }

  const rawClient = createSubstrateClient(getWsProvider(wsUrl));
  set({ rawClient });

  const rawClientSubscription = rawClient.chainHead(
    true,
    () => {},
    async (error) => {
      console.log('Unexpected Raw client subscription error', error);
      rawClientSubscription.unfollow();
      rawClient.destroy();

      // RETRY TO CONNECT
      createSubstrateWsClient({
        set,
        chain,
      });
    },
  );

  set({ rawClientSubscription });
};

export const getMetadata = async (api: TApi) => {
  assert(api, 'Api prop is not defined');

  const v15 = await api.apis.Metadata.metadata_at_version(15);

  return v15;
};

export const getRuntime = async (api: TApi) => {
  assert(api, 'Api prop is not defined');
  checkIfCompatable(
    await api?.query?.System?.LastRuntimeUpgrade.isCompatible(CompatibilityLevel.Partial),
    'api.query.System.LastRuntimeUpgrade is not compatable',
  );

  // at finalized because the first block we show is finalized
  return await api.query.System.LastRuntimeUpgrade.getValue({ at: 'finalized' });
};

export const subscribeToRuntime = async (api: TApi, callback: (runtime: IRuntime) => void) => {
  assert(api, 'Api prop is not defined');
  checkIfCompatable(
    await api?.query?.System?.LastRuntimeUpgrade.isCompatible(CompatibilityLevel.Partial),
    'api.query.System.LastRuntimeUpgrade is not compatable',
  );

  // at finalized because the first block we show is finalized
  return api.query.System.LastRuntimeUpgrade.watchValue('finalized').subscribe((runtime) => {
    if (runtime) {
      callback(runtime);
    }
  });
};

export const getSystemEvents = async (api: TApi, at: string) => {
  assert(api, 'Api prop is not defined');
  assert(at, 'At prop is not defined');
  checkIfCompatable(
    await api?.query?.System?.Events?.isCompatible(CompatibilityLevel.Partial),
    'api.query.System.Events is not compatable',
  );

  return await api.query.System.Events.getValue({ at });
};

export const getSystemDigestData = async (api: TApi, at: string) => {
  assert(api, 'Api prop is not defined');
  assert(at, 'At prop is not defined');
  checkIfCompatable(
    await api?.query?.System?.Digest?.isCompatible(CompatibilityLevel.Partial),
    'api.query.System.Digest is not compatable',
  );

  const digest = await api.query.System.Digest.getValue({ at });
  const digestValue = digest[0].value as [FixedSizeBinary<4>, Binary];
  const digestData = digestValue[1].asBytes();

  return digestData;
};

export const getInvulnerables = async (api: TPeopleApi, at: string) => {
  assert(api, 'Api prop is not defined');
  assert(at, 'At prop is not defined');
  checkIfCompatable(
    await api?.query?.CollatorSelection?.Invulnerables?.isCompatible(CompatibilityLevel.Partial),
    'api.query.CollatorSelection.Invulnerables is not compatable',
  );

  return await api.query.CollatorSelection.Invulnerables.getValue({ at });
};

export const getValidators = async (api: TApi, at: string) => {
  assert(api, 'Api prop is not defined');
  assert(at, 'At prop is not defined');
  checkIfCompatable(
    await api?.query?.Session?.Validators?.isCompatible(CompatibilityLevel.Partial),
    'api.query.Session.Validators is not compatable',
  );

  return await api.query.Session.Validators.getValue({ at });
};

export const getIdentity = async (api: TPeopleApi, address: SS58String) => {
  assert(api, 'Api prop is not defined');
  assert(address, 'Address prop is not defined');
  checkIfCompatable(
    await api?.query?.Identity?.IdentityOf?.isCompatible(CompatibilityLevel.Partial),
    'api.query.Identity.IdentityOf is not compatable',
  );

  return await api?.query.Identity.IdentityOf.getValue(address);
};

export const getSuperIdentity = async (api: TPeopleApi, address: SS58String) => {
  assert(api, 'Api prop is not defined');
  assert(address, 'Address prop is not defined');
  checkIfCompatable(
    await api?.query?.Identity?.SuperOf?.isCompatible(CompatibilityLevel.Partial),
    'api.query.Identity.SuperOf is not compatable',
  );

  return await api?.query.Identity.SuperOf.getValue(address);
};

export const subscribeToTotalIssuance = async (api: TApi, callback: (issuance: bigint) => void) => {
  assert(api, 'Api prop is not defined');
  checkIfCompatable(
    await api?.query?.Balances?.TotalIssuance?.isCompatible(CompatibilityLevel.Partial),
    'api.query.Balances.TotalIssuance is not compatable',
  );

  api.query.Balances.TotalIssuance.watchValue('best').subscribe((issuance) => {
    callback(issuance);
  });
};

// export const subscribeToStakedTokens = async (api: TStakingApi, callback: (totalStake: bigint) => void) => {
//   assert(api, 'Api prop is not defined');
//   checkIfCompatable(
//     await api?.query?.Staking?.ActiveEra?.isCompatible(CompatibilityLevel.Partial),
//     'api.query.Staking.ActiveEra is not compatable',
//   );
//   checkIfCompatable(
//     await api?.query?.NominationPools?.TotalValueLocked?.isCompatible(CompatibilityLevel.Partial),
//     'api.query.NominationPools.TotalValueLocked is not compatable',
//   );
//   checkIfCompatable(
//     await api?.query?.Staking?.ErasTotalStake?.isCompatible(CompatibilityLevel.Partial),
//     'api.query.Staking.ErasTotalStake is not compatable',
//   );

//   api.query.Staking.ActiveEra.watchValue('best').subscribe(async (era) => {
//     const totalValueLocked = await api.query.NominationPools.TotalValueLocked.getValue();
//     if (typeof era?.index === 'number') {
//       api.query.Staking.ErasTotalStake.watchValue(era?.index).subscribe((totalStake) => {
//         callback(totalValueLocked + totalStake);
//       });
//     }
//   });
// };

export const getExpectedBlockTime = async (_api: TApi, chain: TChain, callback: (duration: bigint) => void) => {
  assert(_api, 'Api prop is not defined');
  assert(chain, 'Chain prop is not defined');

  if (chain.isRelayChain) {
    const api = _api as TypedApi<TRelayChainDecsriptor>;
    checkIfCompatable(
      await api?.apis?.BabeApi?.configuration?.isCompatible(CompatibilityLevel.Partial),
      'api.query.BabeApi.configuration is not compatable',
    );

    const target = await api.apis.BabeApi.configuration();
    callback(target.slot_duration);

  } else {
    const api = _api as TypedApi<TParaChainDecsriptor>;
    checkIfCompatable(
      await api?.apis?.AuraApi?.slot_duration?.isCompatible(CompatibilityLevel.Partial),
      'api.query.AuraApi.slot_duration is not compatable',
    );

    const target = await api.apis.AuraApi.slot_duration();
    callback(target);

  }
};
