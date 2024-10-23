import { AccountBuilder } from '@components/callArgsBuilder/accountBuilder';
import { ArrayBuilder } from '@components/callArgsBuilder/arrayBuilder';
import { BinaryBuilder } from '@components/callArgsBuilder/binaryBuilder';
import { CompactBuilder } from '@components/callArgsBuilder/compactBuilder';
import { EnumBuilder } from '@components/callArgsBuilder/enumBuilder';
import { OptionBuilder } from '@components/callArgsBuilder/optionBuilder';
import { PrimitiveBuilder } from '@components/callArgsBuilder/primitiveBuilder';
import { SequenceBuilder } from '@components/callArgsBuilder/sequenceBuilder';
import { TupleBuilder } from '@components/callArgsBuilder/tupleBuilder';
import { VoidBuilder } from '@components/callArgsBuilder/voidBuilder';

import { StructBuilder } from './structBuilder';

import type { ICallArgs } from '.';
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
  Var,
} from '@polkadot-api/metadata-builders';

interface ICodecBuilder extends ICallArgs {
  variable: Var;
  placeholder?: string;
}

const NotImplemented = () => {
  return (
    <div>
      Not Implemented
    </div>
  );
};

export const CodecBuilder = ({
  variable,
  onChange,
  placeholder,
}: ICodecBuilder) => {

  const components = {
    struct: <StructBuilder
      onChange={onChange}
      struct={variable as StructVar}
    />,
    compact: <CompactBuilder
      compact={variable as CompactVar}
      onChange={onChange}
    />,
    sequence: <SequenceBuilder
      onChange={onChange}
      sequence={variable as SequenceVar}
    />,
    primitive: <PrimitiveBuilder
      onChange={onChange}
      placeholder={placeholder}
      primitive={variable as PrimitiveVar}
    />,
    array: <ArrayBuilder
      array={variable as ArrayVar}
      onChange={onChange}
    />,
    enum: <EnumBuilder
      enum={variable as EnumVar}
      onChange={onChange}
    />,
    AccountId20: <AccountBuilder
      accountId={variable as AccountId20}
      onChange={onChange}
    />,
    AccountId32: <AccountBuilder
      accountId={variable as AccountId32}
      onChange={onChange}
    />,
    tuple: <TupleBuilder
      onChange={onChange}
      tuple={variable as TupleVar}
    />,
    void: <VoidBuilder onChange={onChange} />,
    option: <OptionBuilder
      onChange={onChange}
      option={variable as OptionVar}
    />,
    bitSequence: <BinaryBuilder
      minLength={0}
      onChange={onChange}
    />,
    result: <NotImplemented />,
  };

  return components[variable.type] ?? <NotImplemented />;

};
