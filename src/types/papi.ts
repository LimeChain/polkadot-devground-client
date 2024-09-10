import type {
  LookupEntry,
  Var,
} from '@polkadot-api/metadata-builders';
import type { V15 } from '@polkadot-api/substrate-bindings';

export type TMetaDataCallParam = {
  type: 'lookupEntry';
  value: LookupEntry;
} | Var;

export type TMetaDataPallet = V15['pallets'][number];
export type TMetaDataStorageItem = NonNullable<V15['pallets'][number]['storage']>['items'][number];
export type TMetaDataApiMethod = NonNullable<V15['apis'][number]['methods'][number]>;
