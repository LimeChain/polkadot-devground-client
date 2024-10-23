import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import { PrimitiveBuilder } from './primitiveBuilder';
import { SequenceBuilder } from './sequenceBuilder';

import type { ICallArgs } from '.';
import type { IRpcCallParam } from '@constants/rpcCalls/types';

export interface IRpcArgBuilder extends ICallArgs {
  param: IRpcCallParam;
  placeholder?: string;
  readOnly?: boolean;
}

export const RpcArgBuilder = (props: IRpcArgBuilder) => {
  switch (props.param.type) {
    case 'boolean':
      return (
        <PrimitiveBuilder
          {...props}
          primitive={{ value: 'bool', type: 'primitive' }}
        />
      );

    case 'number':
      return (
        <PrimitiveBuilder
          {...props}
          primitive={{ value: props.param.primitiveType || 'u64', type: 'primitive' }}
        />
      );

    case 'string':
    case 'hex':
      return (
        <PrimitiveBuilder
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
        <SequenceBuilder
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

const RpcSelect = ({ onChange, param }: IRpcArgBuilder) => {

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
      items={[selectItems || []]}
      onChange={handleOnChange}
      value={value}
    />
  );
};
