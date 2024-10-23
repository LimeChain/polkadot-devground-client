export interface IDecoders {
  [key: string]: {
    params: IDecoderBuilder[];
  };
}

type TDecoderProp = 'string' | 'hex' | 'array';
type TArrayItem = 'string' | 'hex';

export interface IDecoderBuilder {
  name: string;
  type: TDecoderProp;

  description?: string;
  arrayItemType?: TArrayItem;
}
