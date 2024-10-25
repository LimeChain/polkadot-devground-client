/* eslint-disable react-hooks/exhaustive-deps */
import { getSs58AddressInfo } from 'polkadot-api';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { cn } from '@utils/helpers';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { ICustomAccount } from '@components/invocationArgsMapper/types';

export const CustomAccountBuilder = ({
  accountId,
  onChange,
}: ICustomAccount) => {
  const [
    value,
    setValue,
  ] = useState('');
  const [
    isError,
    setIsError,
  ] = useState(false);

  useEffect(() => {
    const addressIsValid = getSs58AddressInfo(value).isValid;
    setIsError(!addressIsValid);
    onChange(value);
  }, [value]);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <input
      onChange={handleOnChange}
      placeholder={accountId.type}
      type="text"
      value={value}
      className={cn(
        styles.invocationInputField,
        { [styles.invocationInputErrorState]: isError },
      )}
    />
  );
};
