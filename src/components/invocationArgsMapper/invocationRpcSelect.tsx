import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import type { InvocationRpcArg } from '@components/invocationArgsMapper/types';

export const InvocationRpcSelect = ({ onChange, rpc }: InvocationRpcArg) => {

  const [
    value,
    setValue,
  ] = useState(rpc.options?.at(0));

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = useCallback((value: string) => {
    onChange(value);
    setValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectItems = rpc?.options?.map((opt) => ({
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
