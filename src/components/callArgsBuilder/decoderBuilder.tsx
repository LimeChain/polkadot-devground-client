import { PrimitiveBuilder } from './primitiveBuilder';
import { SequenceBuilder } from './sequenceBuilder';

import type { ICallArgs } from '.';
import type { IDecoderBuilder } from '@constants/decoders/types';

export interface IDecoderBuilderProps extends ICallArgs {
  param: IDecoderBuilder;
  placeholder?: string;
  readOnly?: boolean;
}

export const DecoderBuilder = (props: IDecoderBuilderProps) => {
  switch (props.param.type) {
    case 'string':
    case 'hex':
      return (
        <PrimitiveBuilder
          {...props}
          primitive={{ value: 'str', type: 'primitive' }}
        />
      );

    case 'array':
      return (
        <SequenceBuilder
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
