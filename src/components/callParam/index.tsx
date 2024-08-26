import { useStoreChain } from '@stores';

import { CompactParam } from './CompactParam';
import { SequenceParam } from './SequenceParam';
import { StructParam } from './StructParam';

import type {
  LookupEntry,
  Var,
} from '@polkadot-api/metadata-builders';

export interface ICallArgs {
  onChange: (args: unknown) => void;
}

export interface ICallParam extends ICallArgs {
  name?: string;
  param: Var | {
    type: 'lookupEntry';
    value: LookupEntry;
  };
}

export function CallParam({ param, onChange }: ICallParam) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const lookup = useStoreChain?.use?.lookup?.()!;

  if (!param?.type) {
    return (
      <div>
        Not Implemented
      </div>
    );
  }

  const variable =
    param.type === 'lookupEntry' ? lookup(param.value.id) : param;

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
}
