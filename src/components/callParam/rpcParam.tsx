import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import { PrimitiveParam } from './primitiveParam';
import { SequenceParam } from './sequenceParam';

import type { ICallArgs } from '.';
import type { IRpcCallParam } from '@constants/rpcCalls/types';

export interface IRpcParam extends ICallArgs {
  param: IRpcCallParam;
  placeholder?: string;
  readOnly?: boolean;
}

export const RpcParam = (props: IRpcParam) => {
  switch (props.param.type) {
    case 'boolean':
      return (
        <PrimitiveParam
          {...props}
          primitive={{ value: 'bool', type: 'primitive' }}
        />
      );

    case 'string':
    case 'hex':
      return (
        <PrimitiveParam
          {...props}
          primitive={{ value: 'str', type: 'primitive' }}
        />
      );

    case 'select':
      return (
        <RpcSelect {...props} />
      );

    case 'array':
      return (
        <SequenceParam
          {...props}
          sequence={{
            type: 'sequence',
            value: {
              type: 'primitive',
              value: 'str',
              id: 1, /* hardcoding it does not cause a problem */
            },
          }}
        />
      );

    default:
      return (
        <div>
          Not Implemented
        </div>
      );
  }
};

const RpcSelect = ({ onChange, param }: IRpcParam) => {

  const [
    value,
    setValue,
  ] = useState(param.options?.at(0));

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = useCallback((value: string) => {
    onChange(value);
    setValue(value);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectItems = param?.options?.map((opt) => ({
    label: opt,
    value: opt,
    key: `rpc-select-${opt}`,
  }));

  return (
    <PDSelect
      items={selectItems}
      onChange={handleOnChange}
      value={value}
    />
  );
};
