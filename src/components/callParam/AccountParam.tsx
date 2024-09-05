import { getSs58AddressInfo } from 'polkadot-api';
import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Switch } from '@components/Switch';
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
  }, [accounts]);

  useEffect(() => {
    if (!useCustomAccount && accounts.length) {
      onChange(accounts[0].address);
    }
  }, [useCustomAccount, onChange, accounts]);

  useEffect(() => {
    onChange(account?.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const handleUseCustomAccount = useCallback(() => {
    setUseCustomAccount(use => !use);
  }, []);

  return (
    <div className={styles.codecGroup}>
      <Switch
        title="Use Custom Accoun"
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
                // eslint-disable-next-line react/jsx-no-bind
                onChange={(account) => setAccount(account as InjectedPolkadotAccount)}
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

  const handleOnAccountSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const accAddress = e.target.value;
    const selectedAccount = accounts.find(ac => ac.address === accAddress);

    onChange(selectedAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  return (
    <select
      onChange={handleOnAccountSelect}
      className={styles.codecSelect}
    >
      {
        accounts.length > 0
          ? (
            <>
              {
                accounts.map(acc => {
                  return (
                    <option
                      key={`account-select-${acc.address}`}
                      value={acc.address}
                    >
                      {acc.address}
                    </option>
                  );
                },
                )
              }
            </>
          )
          : <option value="">No accounts connected</option>
      }
    </select>
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
