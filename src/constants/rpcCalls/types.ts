import type { MetadataPrimitives } from '@polkadot-api/metadata-builders';

export interface IRpcCalls {
  [key: string]: {
    params: IRpcArg[];
    docs?: string[];
    link?: string;
  };
}

export type TRpcCall = 'boolean' | 'string' | 'hex' | 'select' | 'array' | 'number';
export type TArrayItem = 'string';

export interface IRpcArg {
  name: string;
  type: TRpcCall;

  readOnly?: boolean;
  description?: string;
  options?: string[];
  arrayItemType?: TArrayItem;
  primitiveType?: MetadataPrimitives;
  optional?: boolean;
}
