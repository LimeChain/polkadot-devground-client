export interface IDecoders {
  [key: string]: {
    params: InvocationDecoderArgs[];
  };
}

type TDecoderProp = 'string' | 'hex' | 'array';
type TArrayItem = 'string' | 'hex';

export interface InvocationDecoderArgs {
  name: string;
  type: TDecoderProp;

  description?: string;
  arrayItemType?: TArrayItem;
}
