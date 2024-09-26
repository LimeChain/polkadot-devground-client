import { useStoreChain } from '@stores';

import { CodecParam } from './codecParam';

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

export const CallParam = ({ param, onChange }: ICallParam) => {
  const lookup = useStoreChain?.use?.lookup?.();

  if (!lookup) {
    return null;
  }

  if (!param?.type) {
    return (
      <div>
        Not Implemented
      </div>
    );
  }

  const variable = param.type === 'lookupEntry' ? lookup(param.value.id) : param;

  return (
    <CodecParam
      onChange={onChange}
      variable={variable}
    />
  );
};
