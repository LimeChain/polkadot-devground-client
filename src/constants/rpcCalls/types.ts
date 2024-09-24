export interface IRpcCalls {
  [key: string]: {
    params: IRpcCallParam[];
    value: string;
    docs?: string[];
    link?: string;
  };
}

export type TRpcCall = 'boolean' | 'string' | 'hex' | 'select' | 'array';
export type TArrayItem = 'string';

export interface IRpcCallParam {
  name: string;
  type: TRpcCall;

  readOnly?: boolean;
  description?: string;
  options?: string[];
  arrayItemType?: TArrayItem;
}
