import { useStoreChain } from '@stores';

import { CodecBuilder } from './codecBuilder';

import type {
  TMetaDataCallBuilder,
  TMetaDataPallet,
} from '@custom-types/papi';
export interface ICallArgs {
  onChange: (args: unknown) => void;
}

export interface ICallArgsBuilder extends ICallArgs {
  pallet: TMetaDataPallet;
  name: string;
  param: TMetaDataCallBuilder;
}

export const CallArgsBuilder = ({ param, onChange }: ICallArgsBuilder) => {
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

  switch (param.type) {
    case 'lookupEntry':
      return (
        <CodecBuilder
          onChange={onChange}
          variable={lookup(param.value.id)}
        />
      );
    default:
      return (
        <CodecBuilder
          onChange={onChange}
          variable={param}
        />
      );
  }
};
