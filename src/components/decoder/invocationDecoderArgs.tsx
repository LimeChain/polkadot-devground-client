import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { PrimitiveBuilder } from '@components/metadataBuilders/primitiveBuilder';
import { SequenceBuilder } from '@components/metadataBuilders/sequenceBuilder';

import type { IDecoderBuilderProps } from '@components/invocationArgsMapper/types';
import type { InvocationDecoderArgs as Type } from '@constants/decoders/types';

const mapperCore: Record<Type['type'], (props: IDecoderBuilderProps) => JSX.Element> = {
  array: (props) => (
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
  ),
  string: (props) => (
    <PrimitiveBuilder
      {...props}
      primitive={{ value: 'str', type: 'primitive' }}
    />
  ),
  hex: (props) => (
    <PrimitiveBuilder
      {...props}
      primitive={{ value: 'str', type: 'primitive' }}
    />
  ),
};
export const InvocationDecoderArgs = (props: IDecoderBuilderProps) => {
  if (!props) {
    return null;
  } else {
    try {
      const decoderType = props.decoder.type;
      const InvocationComponent = mapperCore[decoderType] ?? NotImplemented;

      return <InvocationComponent {...props} />;
    } catch (error) {
      console.error(error);
      return <NotImplemented />;
    }
  }
};
