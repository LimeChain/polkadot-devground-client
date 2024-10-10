export interface IDecoders {
  [key: string]: {
    params: IDecoderParam[];
  };
}

type TDecoderProp = 'string' | 'hex' | 'array';
type TArrayItem = 'string' | 'hex';

export interface IDecoderParam {
  name: string;
  type: TDecoderProp;

  description?: string;
  arrayItemType?: TArrayItem;
}
