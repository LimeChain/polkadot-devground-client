import type { ISubscription } from '@views/chainState';
import type { PolkadotSigner } from 'polkadot-api';

export interface IQueryParam {
  key: string;
  value: unknown;
}

export interface IDecoderQuery {
  decoder: string;
  id: string;
  args: IQueryParam[];
}

export interface IDecoderDynamicQuery {
  type: string;
  name: string;
  pallet: string;
  method: string;
  id: string;
  args: string;
}

export interface IRpcCallsQuery {
  name: string;
  pallet: string;
  method: string;
  id: string;
  args: IQueryParam[];
  storage?: string;
}

export type TQueryBase = {
  id: string;
  args: unknown;
  pallet?: string;
  storage?: string;
  decoder?: string;
};

export type TRequiredQuery = Required<Pick<TQueryBase, 'id' | 'args'>> & {
  name: string;
  pallet: string;
  storage: string;
  args: unknown;
};

export type TRecentQuery = TRequiredQuery & {
  timestamp: number;
  pallet?: string;
  storage?: string;
  type?: string;
  method?: string;
};

export type TCategory =
  | 'chain-state'
  | 'constants'
  | 'rpc-calls'
  | 'runtime-calls'
  | 'extrinsics'
  | 'decoder'
  | 'decoder-dynamic';

type TBaseQueryProps<Q = TQueryBase> = {
  querie: Q & { isCachedQuery?: boolean };
  onUnsubscribe: (id: string) => void;
};

type TSubscribeQueryProps<Q = TQueryBase> = TBaseQueryProps<Q> & {
  onSubscribe: (subscription: ISubscription) => void;
};

export type TChainStateQueryProps = TSubscribeQueryProps<TRequiredQuery>;
export type TConstantsQueryProps = TBaseQueryProps<TRequiredQuery>;
export type TRpcCallsQueryProps = TBaseQueryProps<IRpcCallsQuery> & {
  unCleanedSubscriptions: React.MutableRefObject<string[]>;
};
export type TExtrinsicsQueryProps = TBaseQueryProps<
  Omit<TRequiredQuery, 'args'> & { args: unknown }
> & {
  signer: PolkadotSigner;
};
export type TDecoderDynamicQueryProps = TBaseQueryProps<IDecoderDynamicQuery>;
export type TDecoderQueryProps = TBaseQueryProps<IDecoderQuery>;
export type TRuntimeCallsQueryProps = TBaseQueryProps<TRequiredQuery>;
