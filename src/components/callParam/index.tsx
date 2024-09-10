import { useStoreChain } from '@stores';

import { CodecParam } from './CodecParam';

import type {
  TMetaDataCallParam,
  TMetaDataPallet,
} from '@custom-types/papi';
export interface ICallArgs {
  onChange: (args: unknown) => void;
}

export interface ICallParam extends ICallArgs {
  pallet: TMetaDataPallet;
  name: string;
  param: TMetaDataCallParam;
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

  return <CodecParam variable={variable} onChange={onChange} />;
}
