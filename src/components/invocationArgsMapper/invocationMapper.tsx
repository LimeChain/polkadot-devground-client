import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { AccountBuilder } from '@components/metadataBuilders/accountBuilder';
import ArrayVarBuilder from '@components/metadataBuilders/arrayBuilder/arrayBuilder';
import { BinaryBuilder } from '@components/metadataBuilders/binaryBuilder';
import CompactVarBuilder from '@components/metadataBuilders/compactBuilder/compactBuilder';
import { EnumBuilder } from '@components/metadataBuilders/enumBuilder';
import { OptionBuilder } from '@components/metadataBuilders/optionBuilder';
import { PrimitiveBuilder } from '@components/metadataBuilders/primitiveBuilder';
import { SequenceBuilder } from '@components/metadataBuilders/sequenceBuilder';
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
    <BinaryBuilder
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
      array={invokationVar as ArrayVar}
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
    <SequenceBuilder
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
  option: ({ onChange, invokationVar }) => (
    <OptionBuilder
      onChange={onChange}
      option={invokationVar as OptionVar}
    />
  ),
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
