/* eslint-disable react-hooks/exhaustive-deps */

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import type { InvocationRpcArg } from '@components/invocationArgsMapper/types';

export const InvocationRpcSelect = ({ onChange, rpc }: InvocationRpcArg) => {
  const [
    selectValue,
    setSelectValue,
  ] = useState(rpc.options?.at(0));

  const handleOnChange = useCallback((value: string) => {
    onChange(value);
    setSelectValue(value);
  }, []);

  useEffect(() => {
    onChange(selectValue);
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
      value={selectValue}
    />
  );
};
