import { AccountParam } from './AccountParam';
import { ArrayParam } from './ArrayParam';
import { CompactParam } from './CompactParam';
import { EnumParam } from './EnumParam';
import { OptionParam } from './OptionParam';
import { PrimitiveParam } from './PrimitiveParam';
import { SequenceParam } from './SequenceParam';
import { StructParam } from './StructParam';
import { TupleParam } from './TupleParam';
import { VoidParam } from './VoidParam';

import type { ICallArgs } from '.';
import type { Var } from '@polkadot-api/metadata-builders';

export interface ICodecParam extends ICallArgs {
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
    default:
      return (
        <div>
          Not Implemented
        </div>
      );
  }
};
