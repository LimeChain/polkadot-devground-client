import {
  type Binary,
  CompatibilityLevel,
  type FixedSizeBinary,
  type PolkadotClient,
  type TypedApi,
} from 'polkadot-api';
import { type Client } from 'polkadot-api/smoldot';

import {
  CHAIN_DESCRIPTORS,
  CHAIN_SPECS,
} from '@constants/chain';

import {
  assert,
  checkIfCompatable,
} from './helpers';

import type {
  IRuntime,
  TChain,
  TChainDescriptor,
  TParaChainDecsriptor,
  TSmoldotChain,
  TSupportedParaChain,
  TSupportedRelayChain,
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
  let stakingChain: TSmoldotChain = null as unknown as TSmoldotChain;

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

    if (chain.hasStaking) {
      stakingChain = await smoldot.addChain({
        chainSpec: CHAIN_SPECS[chain.stakingChainId],
        potentialRelayChains: [relayChain],
      })
        .catch(console.error);

      assert(stakingChain, `stakingChain is not defined for ${chain.name}`);
    }

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

    if (chain.hasStaking) {
      stakingChain = await smoldot?.addChain({
        chainSpec: CHAIN_SPECS[chain.stakingChainId],
        potentialRelayChains: [newChain],
      })
        .catch(console.error);

      assert(stakingChain, `stakingChain is not defined for ${chain.name}`);
    }

  }

  return {
    newChain,
    peopleChain,
    stakingChain,
  };
};

export const getChainSpecData = (client: PolkadotClient, chainId: TSupportedParaChain | TSupportedRelayChain) => {
  return client.getTypedApi(CHAIN_DESCRIPTORS[chainId]);
};

export const getMetadata = async (api: TypedApi<TChainDescriptor>) => {
  assert(api, 'Api prop is not defined');

  return await api.apis.Metadata.metadata();
};

export const getRuntime = async (api: TypedApi<TChainDescriptor>) => {
  assert(api, 'Api prop is not defined');
  checkIfCompatable(
    await api?.query?.System?.LastRuntimeUpgrade.isCompatible(CompatibilityLevel.Partial),
    'api.query.System.LastRuntimeUpgrade is not compatable',
  );

  // at finalized because the first block we show is finalized
  return await api.query.System.LastRuntimeUpgrade.getValue({ at: 'finalized' });
};

export const subscribeToRuntime = async (api: TypedApi<TChainDescriptor>, callback: (runtime: IRuntime) => void) => {
  assert(api, 'Api prop is not defined');
  checkIfCompatable(
    await api?.query?.System?.LastRuntimeUpgrade.isCompatible(CompatibilityLevel.Partial),
    'api.query.System.LastRuntimeUpgrade is not compatable',
  );

  // at finalized because the first block we show is finalized
  return api.query.System.LastRuntimeUpgrade.watchValue('finalized').subscribe(runtime => {
    if (runtime) {
      callback(runtime);
    }
  });
};

export const getSystemEvents = async (api: TypedApi<TChainDescriptor>, at: string) => {
  assert(api, 'Api prop is not defined');
  assert(at, 'At prop is not defined');
  checkIfCompatable(
    await api?.query?.System?.Events?.isCompatible(CompatibilityLevel.Partial),
    'api.query.System.Events is not compatable',
  );

  return await api.query.System.Events.getValue({ at });
};

export const getSystemDigestData = async (api: TypedApi<TChainDescriptor>, at: string) => {
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

export const getInvulnerables = async (api: TypedApi<TParaChainDecsriptor>, at: string) => {
  assert(api, 'Api prop is not defined');
  assert(at, 'At prop is not defined');
  checkIfCompatable(
    await api?.query?.CollatorSelection?.Invulnerables?.isCompatible(CompatibilityLevel.Partial),
    'api.query.CollatorSelection.Invulnerables is not compatable',
  );

  return await api.query.CollatorSelection.Invulnerables.getValue({ at });
};

export const getValidators = async (api: TypedApi<TChainDescriptor>, at: string) => {
  assert(api, 'Api prop is not defined');
  assert(at, 'At prop is not defined');
  checkIfCompatable(
    await api?.query?.Session?.Validators?.isCompatible(CompatibilityLevel.Partial),
    'api.query.Session.Validators is not compatable',
  );

  return await api.query.Session.Validators.getValue({ at });
};
