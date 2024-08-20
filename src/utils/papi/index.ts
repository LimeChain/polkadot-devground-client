import {
  type PolkadotClient,
  type TypedApi,
} from 'polkadot-api';

import { CHAIN_DESCRIPTORS } from '@constants/chain';

import {
  checkForProp,
  checkIfCompatable,
} from './helpers';

import type {
  IRuntime,
  TChainDescriptor,
  TSupportedParaChain,
  TSupportedRelayChain,
} from '@custom-types/chain';

export const getChainSpecData = (client: PolkadotClient, chainId: TSupportedParaChain | TSupportedRelayChain) => {
  return client.getTypedApi(CHAIN_DESCRIPTORS[chainId]);
};

export const getMetadata = async (api: TypedApi<TChainDescriptor>) => {
  checkForProp(api, 'Api');

  return await api.apis.Metadata.metadata();
};

export const getRuntime = async (api: TypedApi<TChainDescriptor>) => {
  checkForProp(api, 'Api');
  checkIfCompatable(
    api?.query?.System?.LastRuntimeUpgrade,
    'api.query.System.LastRuntimeUpgrade',
  );

  // at finalized because the first block we show is finalized
  return await api.query.System.LastRuntimeUpgrade.getValue({ at: 'finalized' });
};

export const subscribeToRuntime = async (api: TypedApi<TChainDescriptor>, callback: (runtime: IRuntime) => void) => {
  checkForProp(api, 'Api');
  checkIfCompatable(
    api?.query?.System?.LastRuntimeUpgrade,
    'api.query.System.LastRuntimeUpgrade',
  );

  // at finalized because the first block we show is finalized
  return api.query.System.LastRuntimeUpgrade.watchValue('finalized').subscribe(runtime => {
    if (runtime) {
      callback(runtime);
    }
  });
};

export const getSystemDigestData = async (api: TypedApi<TChainDescriptor>, at: 'best' | 'finalized' | string) => {
  checkForProp(api, 'Api');
  checkForProp(at, 'At');
  checkIfCompatable(
    api?.query?.System?.Digest,
    'api.query.System.Digest',
  );

  const digest = await api.query.System.Digest.getValue({ at });
  const digestData = digest[0].value[1].asBytes();
};
