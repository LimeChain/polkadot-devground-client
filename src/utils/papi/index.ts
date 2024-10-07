import {
  type Binary,
  CompatibilityLevel,
  type FixedSizeBinary,
  type SS58String,
  type TypedApi,
} from 'polkadot-api';
import { type Client } from 'polkadot-api/smoldot';

import { CHAIN_SPECS } from '@constants/chain';

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
  TSmoldotChain,
  TStakingApi,
} from '@custom-types/chain';

export const initSmoldotChains = async ({
  smoldot,
  chain,
}: {
  smoldot: Client;
  chain: TChain;
}) => {
  const isParachain = chain.isParaChain;
  let newChain: TSmoldotChain, peopleChain: TSmoldotChain;
  // const stakingChain: TSmoldotChain = null as unknown as TSmoldotChain;

  if (isParachain) {
    const relayChain = await smoldot.addChain({
      chainSpec: CHAIN_SPECS[chain.relayChainId],
    })
      .catch(console.error);

    assert(relayChain, `RelayChain is not defined for ${chain.name}`);

    newChain = await smoldot.addChain({
      chainSpec: CHAIN_SPECS[chain.id],
      potentialRelayChains: [relayChain],
    })
      .catch(console.error);

    assert(newChain, `newChain is not defined for ${chain.name}`);

    peopleChain = await smoldot.addChain({
      chainSpec: CHAIN_SPECS[chain.peopleChainId],
      potentialRelayChains: [relayChain],
    })
      .catch(console.error);

    assert(peopleChain, `peopleChain is not defined for ${chain.name}`);

    // if (chain.hasStaking) {
    //   stakingChain = await smoldot.addChain({
    //     chainSpec: CHAIN_SPECS[chain.stakingChainId],
    //     potentialRelayChains: [relayChain],
    //   })
    //     .catch(console.error);

    //   assert(stakingChain, `stakingChain is not defined for ${chain.name}`);
    // }

  } else {
    newChain = await smoldot.addChain({
      chainSpec: CHAIN_SPECS[chain.id],
    })
      .catch(console.error);

    assert(newChain, `newChain is not defined for ${chain.name}`);

    peopleChain = await smoldot.addChain({
      chainSpec: CHAIN_SPECS[chain.peopleChainId],
      potentialRelayChains: [newChain],
    })
      .catch(console.error);

    assert(peopleChain, `peopleChain is not defined for ${chain.name}`);

    // if (chain.hasStaking) {
    //   stakingChain = await smoldot?.addChain({
    //     chainSpec: CHAIN_SPECS[chain.stakingChainId],
    //     potentialRelayChains: [newChain],
    //   })
    //     .catch(console.error);

    //   assert(stakingChain, `stakingChain is not defined for ${chain.name}`);
    // }

  }

  return {
    newChain,
    peopleChain,
    // stakingChain,
  };
};

export const getMetadata = async (api: TApi) => {
  assert(api, 'Api prop is not defined');

  const v14 = await api.apis.Metadata.metadata_at_version(14);
  const v15 = await api.apis.Metadata.metadata_at_version(15);

  return v15 || v14;
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

export const subscribeToStakedTokens = async (api: TStakingApi, callback: (totalStake: bigint) => void) => {
  assert(api, 'Api prop is not defined');
  checkIfCompatable(
    await api?.query?.Staking?.ActiveEra?.isCompatible(CompatibilityLevel.Partial),
    'api.query.Staking.ActiveEra is not compatable',
  );
  checkIfCompatable(
    await api?.query?.NominationPools?.TotalValueLocked?.isCompatible(CompatibilityLevel.Partial),
    'api.query.NominationPools.TotalValueLocked is not compatable',
  );
  checkIfCompatable(
    await api?.query?.Staking?.ErasTotalStake?.isCompatible(CompatibilityLevel.Partial),
    'api.query.Staking.ErasTotalStake is not compatable',
  );

  api.query.Staking.ActiveEra.watchValue('best').subscribe(async (era) => {
    const totalValueLocked = await api.query.NominationPools.TotalValueLocked.getValue();
    if (typeof era?.index === 'number') {
      api.query.Staking.ErasTotalStake.watchValue(era?.index).subscribe((totalStake) => {
        callback(totalValueLocked + totalStake);
      });
    }
  });
};

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
