import { CompactParam } from './CompactParam';
import { SequenceParam } from './SequenceParam';
import { StructParam } from './StructParam';

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
    default:
      return (
        <div>
          Not Implemented
        </div>
      );
  }
};
