import type { MetadataPrimitives } from '@polkadot-api/metadata-builders';

export interface IRpcCalls {
  [key: string]: {
    params: IRpcCallParam[];
    docs?: string[];
    link?: string;
  };
}

export type TRpcCall = 'boolean' | 'string' | 'hex' | 'select' | 'array' | 'number';
export type TArrayItem = 'string';

export interface IRpcCallParam {
  name: string;
  type: TRpcCall;

  readOnly?: boolean;
  description?: string;
  options?: string[];
  arrayItemType?: TArrayItem;
  primitiveType?: MetadataPrimitives;
  optional?: boolean;
}
