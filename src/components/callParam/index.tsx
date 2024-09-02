import { useStoreChain } from '@stores';

import { CodecParam } from './CodecParam';

import type {
  LookupEntry,
  Var,
} from '@polkadot-api/metadata-builders';
import type { V14 } from '@polkadot-api/substrate-bindings';
export interface ICallArgs {
  onChange: (args: unknown) => void;
}

export interface ICallParam extends ICallArgs {
  pallet: V14['pallets'][number];
  name: string;
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

  // console.log('call param', variable);

  return <CodecParam variable={variable} onChange={onChange} />;
}
