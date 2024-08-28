import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useStoreWallet } from 'src/stores/wallet';

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
    setAccount(accounts[0]);
  }, [accounts]);

  useEffect(() => {
    onChange(account?.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const handleUseCustomAccount = useCallback(() => {
    setUseCustomAccount(use => !use);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex gap-2">
        use custom account
        <input
          type="checkbox"
          checked={useCustomAccount}
          onChange={handleUseCustomAccount}
        />
      </label>
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

    // if (selectedAccount) {
    onChange(selectedAccount);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <select
      onChange={handleOnAccountSelect}
      className="w-full p-2"
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

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      placeholder={accountId.type}
      value={value}
      className="w-full p-2"
      // eslint-disable-next-line react/jsx-no-bind
      onChange={(event) => setValue(event.target.value)}
    />
  );
};
