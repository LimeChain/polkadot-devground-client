import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { AccountBuilder } from '@components/metadataBuilders/accountBuilder';
import ArrayVarBuilder from '@components/metadataBuilders/arrayBuilder/arrayBuilder';
import { BitstreamBuilder } from '@components/metadataBuilders/bitstreamBuilder';
import CompactVarBuilder from '@components/metadataBuilders/compactBuilder/compactBuilder';
import { ConditionalParamBuilder } from '@components/metadataBuilders/conditionalBuilder';
import { EnumBuilder } from '@components/metadataBuilders/enumBuilder';
import { OrderBuilder } from '@components/metadataBuilders/orderBuilder';
import { PrimitiveBuilder } from '@components/metadataBuilders/primitiveBuilder';
import { StructBuilder } from '@components/metadataBuilders/structBuilder';
import { TupleBuilder } from '@components/metadataBuilders/tupleBuilder';
import { VoidBuilder } from '@components/metadataBuilders/voidBuilder';

import type { InvocationMapperProps } from '@components/invocationArgsMapper/types';
import type {
  AccountId20,
  AccountId32,
  ArrayVar,
  CompactVar,
  EnumVar,
  OptionVar,
  PrimitiveVar,
  SequenceVar,
  StructVar,
  TupleVar,
} from '@polkadot-api/metadata-builders';

const mapperCore: Record<string, (props: InvocationMapperProps) => JSX.Element> = {
  result: () => <NotImplemented />,
  bitSequence: ({ onChange, placeholder }) => (
    <BitstreamBuilder
      minLength={0}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
  compact: ({ onChange, invokationVar }) => (
    <CompactVarBuilder
      compact={invokationVar as CompactVar}
      onChange={onChange}
    />
  ),
  array: ({ onChange, invokationVar }) => (
    <ArrayVarBuilder
      data={invokationVar as ArrayVar}
      onChange={onChange}
    />
  ),
  enum: ({ invokationVar, onChange }) => (
    <EnumBuilder
      enum={invokationVar as EnumVar}
      onChange={onChange}
    />
  ),
  struct: ({ onChange, invokationVar }) => (
    <StructBuilder
      onChange={onChange}
      struct={invokationVar as StructVar}
    />
  ),
  AccountId20: ({ invokationVar, onChange }) => (
    <AccountBuilder
      accountId={invokationVar as AccountId20}
      onChange={onChange}
    />
  ),
  AccountId32: ({ invokationVar, onChange }) => (
    <AccountBuilder
      accountId={invokationVar as AccountId32}
      onChange={onChange}
    />
  ),
  tuple: ({ invokationVar, onChange }) => (
    <TupleBuilder
      onChange={onChange}
      tuple={invokationVar as TupleVar}
    />
  ),
  sequence: ({ onChange, invokationVar, placeholder }) => (
    <OrderBuilder
      onChange={onChange}
      placeholder={placeholder}
      sequence={invokationVar as SequenceVar}
    />
  ),
  void: ({ onChange }) => <VoidBuilder onChange={onChange} />,
  primitive: ({ onChange, invokationVar, placeholder }) => (
    <PrimitiveBuilder
      onChange={onChange}
      placeholder={placeholder}
      primitive={invokationVar as PrimitiveVar}
    />
  ),
  option: ({ onChange, invokationVar }) => {

    return (
      <ConditionalParamBuilder
        condition={invokationVar as OptionVar}
        onChange={onChange}
      />
    );
  },
};

export const InvocationMapper = (props: InvocationMapperProps) => {
  if (!props) {
    return null;
  } else {
    try {
      if (!props.invokationVar) {
        return <NotImplemented />;
      } else {
        const InvocationComponent = mapperCore[props?.invokationVar?.type] ?? NotImplemented;
        return <InvocationComponent {...props} />;
      }
    } catch (error) {
      console.error(error);
      return <NotImplemented />;
    }
  }
};
