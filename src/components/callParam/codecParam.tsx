import { AccountParam } from './accountParam';
import { ArrayParam } from './arrayParam';
import { BinaryParam } from './binaryParam';
import { CompactParam } from './compactParam';
import { EnumParam } from './enumParam';
import { OptionParam } from './optionParam';
import { PrimitiveParam } from './primitiveParam';
import { SequenceParam } from './sequenceParam';
import { StructParam } from './structParam';
import { TupleParam } from './tupleParam';
import { VoidParam } from './voidParam';

import type { ICallArgs } from '.';
import type { Var } from '@polkadot-api/metadata-builders';

interface ICodecParam extends ICallArgs {
  variable: Var;
}

export const CodecParam = ({ variable, onChange }: ICodecParam) => {
  switch (variable.type) {
    case 'struct':
      return <StructParam struct={variable} onChange={onChange} />;
    case 'compact':
      return <CompactParam compact={variable} onChange={onChange} />;
    case 'sequence':
      return <SequenceParam sequence={variable} onChange={onChange} />;
    case 'primitive':
      return <PrimitiveParam primitive={variable} onChange={onChange} />;
    case 'array':
      return <ArrayParam array={variable} onChange={onChange} />;
    case 'enum':
      return <EnumParam enum={variable} onChange={onChange} />;
    case 'AccountId20':
    case 'AccountId32':
      return <AccountParam accountId={variable} onChange={onChange} />;
    case 'tuple':
      return <TupleParam tuple={variable} onChange={onChange} />;
    case 'void':
      return <VoidParam onChange={onChange} />;
    case 'option':
      return <OptionParam option={variable} onChange={onChange} />;
    case 'bitSequence':
      return <BinaryParam onChange={onChange} minLength={0} />;
    default:
      return (
        <div>
          Not Implemented
        </div>
      );
  }
};
