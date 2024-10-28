import { getSs58AddressInfo } from 'polkadot-api';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { cn } from '@utils/helpers';

import styles from '../../invocationArgsMapper/styles.module.css';

import type {
  AccountId20,
  AccountId32,
} from '@polkadot-api/metadata-builders';

interface ManualAccountInputProps {
  accountId: AccountId20 | AccountId32;
  onChange: (address: string) => void;
}

export const ManualAccountInput = ({
  onChange,
}: ManualAccountInputProps) => {
  const [
    address,
    setAddress,
  ] = useState('');
  const [
    isInvalid,
    setIsInvalid,
  ] = useState(false);

  useEffect(() => {
    onChange('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    const { isValid } = getSs58AddressInfo(newAddress);
    setIsInvalid(!isValid);
    onChange(newAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <input
      onChange={handleAddressChange}
      placeholder="Enter account address"
      type="text"
      value={address}
      className={cn(
        styles.invocationInputField,
        { [styles.invocationInputErrorState]: isInvalid },
      )}
    />
  );
};
