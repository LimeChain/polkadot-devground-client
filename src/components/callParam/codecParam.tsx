import { CompactParam } from '@components/callParam/compactParam';
import { SequenceParam } from '@components/callParam/sequenceParam';

import { StructParam } from './structParam';

import type { ICallArgs } from '.';
import type {
  CompactVar,
  SequenceVar,
  StructVar,
  Var,
} from '@polkadot-api/metadata-builders';

interface ICodecParam extends ICallArgs {
  variable: Var;
  placeholder?: string;
}

export const CodecParam = ({ variable, onChange, placeholder }: ICodecParam) => {

  const components = {
    struct: <StructParam
      onChange={onChange}
      struct={variable as StructVar}
    />,
    compact: <CompactParam
      compact={variable as CompactVar}
      onChange={onChange}
    />,
    sequence: <SequenceParam
      onChange={onChange}
      sequence={variable as SequenceVar}
    />,
  };

  return components[variable.type]
    || (
      <div>
        Not Implemented
      </div>
    );

  //   case 'sequence':
  //     return (
  //       <SequenceParam
  //         onChange={onChange}
  //         sequence={variable}
  //       />
  //     );
  //   case 'primitive':
  //     return (
  //       <PrimitiveParam
  //         onChange={onChange}
  //         placeholder={placeholder}
  //         primitive={variable}
  //       />
  //     );
  //   case 'array':
  //     return (
  //       <ArrayParam
  //         array={variable}
  //         onChange={onChange}
  //       />
  //     );
  //   case 'enum':
  //     return (
  //       <EnumParam
  //         enum={variable}
  //         onChange={onChange}
  //       />
  //     );
  //   case 'AccountId20':
  //   case 'AccountId32':
  //     return (
  //       <AccountParam
  //         accountId={variable}
  //         onChange={onChange}
  //       />
  //     );
  //   case 'tuple':
  //     return (
  //       <TupleParam
  //         onChange={onChange}
  //         tuple={variable}
  //       />
  //     );
  //   case 'void':
  //     return <VoidParam onChange={onChange} />;
  //   case 'option':
  //     return (
  //       <OptionParam
  //         onChange={onChange}
  //         option={variable}
  //       />
  //     );
  //   case 'bitSequence':
  //     return (
  //       <BinaryParam
  //         minLength={0}
  //         onChange={onChange}
  //       />
  //     );
  //   default:
  //     return (
  //       <div>
  //         Not Implemented
  //       </div>
  //     );
  // }
};
