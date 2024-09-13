import { getSs58AddressInfo } from 'polkadot-api';
import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';
import { PDSwitch } from '@components/pdSwitch';
import { cn } from '@utils/helpers';
import { useStoreWallet } from 'src/stores/wallet';

import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type {
  AccountId20,
  AccountId32,
} from '@polkadot-api/metadata-builders';
export interface IAccountParam extends ICallArgs {
  accountId: AccountId20 | AccountId32;
}

export const AccountParam = ({ accountId, onChange }: IAccountParam) => {
  const accounts = useStoreWallet?.use?.accounts?.();
  const [account, setAccount] = useState(accounts.at(0));

  const [useCustomAccount, setUseCustomAccount] = useState(false);

  useEffect(() => {
    setUseCustomAccount(false);
    setAccount(accounts[0]);
    onChange(accounts[0]?.address);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  useEffect(() => {
    if (!useCustomAccount && accounts.length) {
      onChange(accounts[0].address);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCustomAccount, accounts]);

  const handleUseCustomAccount = useCallback(() => {
    setUseCustomAccount(use => !use);
  }, []);

  const handleAccountSelect = useCallback((account: unknown) => {
    setAccount(account as InjectedPolkadotAccount);
  }, []);

  return (
    <div className={styles.codecGroup}>
      <PDSwitch
        title="Use Custom Account"
        checked={useCustomAccount}
        onChange={handleUseCustomAccount}
      />
      <div>
        {
          useCustomAccount
            ? (
              <CustomAccountParam
                accountId={accountId}
                onChange={onChange}
              />
            ) : (
              <AccountSelectParam
                account={account!}
                accounts={accounts}
                onChange={handleAccountSelect}
              />
            )
        }
      </div>
    </div>
  );
};

interface IAccountSelectParam extends ICallArgs {
  account: InjectedPolkadotAccount;
  accounts: InjectedPolkadotAccount[];
}

const AccountSelectParam = ({ accounts, onChange }: IAccountSelectParam) => {
  const [selectedAccount, setSelectedAccount] = useState(accounts.at(0));

  useEffect(() => {
    if (accounts.length === 0) {
      setSelectedAccount(undefined);
      return;
    }

    if (!selectedAccount) {
      setSelectedAccount(accounts.at(0));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const handleOnAccountSelect = useCallback((accountSelected: string) => {
    const selectedAccount = accounts.find(ac => ac.address === accountSelected);

    setSelectedAccount(selectedAccount);
    onChange(selectedAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const selectItems = useMemo(() => {
    return accounts?.map(account => ({
      label: account.address,
      value: account.address,
      key: `account-select-${account.address}`,
    })) || [];
  }, [accounts]);

  return (
    <PDSelect
      emptyPlaceHolder="No connected accounts"
      placeholder="Please select an account"
      onChange={handleOnAccountSelect}
      items={selectItems}
      value={selectedAccount?.address || ''}
    />
  );
};

interface ICustomAccount extends ICallArgs {
  accountId: AccountId20 | AccountId32;
}

const CustomAccountParam = ({
  accountId,
  onChange,
}: ICustomAccount) => {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const isValidAddress = getSs58AddressInfo(value).isValid;

    setIsError(!isValidAddress);
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <input
      type="text"
      placeholder={accountId.type}
      value={value}
      onChange={handleOnChange}
      className={cn(
        styles.codecInput,
        { [styles.codecInputError]: isError },
      )}
    />
  );
};
