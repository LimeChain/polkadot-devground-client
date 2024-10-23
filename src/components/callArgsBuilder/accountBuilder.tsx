import { getSs58AddressInfo } from 'polkadot-api';
import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { AccountSelectBuilder } from '@components/callArgsBuilder/accountSelectBuilder';
import { PDSwitch } from '@components/pdSwitch';
import { cn } from '@utils/helpers';
import { useStoreWallet } from 'src/stores/wallet';

import styles from './styles.module.css';

import type { ICallArgs } from './index';
import type {
  AccountId20,
  AccountId32,
} from '@polkadot-api/metadata-builders';
interface IAccountBuilder extends ICallArgs {
  accountId: AccountId20 | AccountId32;
}

export const AccountBuilder = ({ accountId, onChange }: IAccountBuilder) => {
  const accounts = useStoreWallet?.use?.accounts?.();

  const [
    useCustomAccount,
    setUseCustomAccount,
  ] = useState(false);

  useEffect(() => {
    setUseCustomAccount(false);
    onChange(accounts[0]?.address);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  useEffect(() => {
    if (!useCustomAccount && accounts.length) {
      onChange(accounts[0].address);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    useCustomAccount,
    accounts,
  ]);

  const handleUseCustomAccount = useCallback(() => {
    setUseCustomAccount((use) => !use);
  }, []);

  const handleAccountSelect = useCallback((account: unknown) => {
    onChange((account as InjectedPolkadotAccount).address);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.codecGroup}>
      <PDSwitch
        checked={useCustomAccount}
        onChange={handleUseCustomAccount}
        title="Use Custom Account"
      />
      <div>
        {
          useCustomAccount
            ? (
              <CustomAccountBuilder
                accountId={accountId}
                onChange={onChange}
              />
            )
            : (
              <AccountSelectBuilder
                accounts={accounts}
                onChange={handleAccountSelect}
              />
            )
        }
      </div>
    </div>
  );
};

interface ICustomAccount extends ICallArgs {
  accountId: AccountId20 | AccountId32;
}

const CustomAccountBuilder = ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        styles.codecInput,
        { [styles.codecInputError]: isError },
      )}
    />
  );
};
