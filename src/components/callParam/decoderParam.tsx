import { PrimitiveParam } from './primitiveParam';
import { SequenceParam } from './sequenceParam';

import type { ICallArgs } from '.';
import type { IDecoderParam } from '@constants/decoders/types';

export interface IDecoderParamProps extends ICallArgs {
  param: IDecoderParam;
  placeholder?: string;
  readOnly?: boolean;
}

export const DecoderParam = (props: IDecoderParamProps) => {
  switch (props.param.type) {
    case 'string':
    case 'hex':
      return (
        <PrimitiveParam
          {...props}
          primitive={{ value: 'str', type: 'primitive' }}
        />
      );

    case 'array':
      return (
        <SequenceParam
          {...props}
          sequence={{
            type: 'sequence',
            value: {
              type: 'primitive',
              value: 'str',
              id: 1, /* hardcoding it does not cause a problem */
            },
          }}
        />
      );

    default:
      return (
        <div>
          Not Implemented
        </div>
      );
  }
};
