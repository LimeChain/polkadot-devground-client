import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import type { ICallArgs } from '.';
import type { InjectedPolkadotAccount } from 'polkadot-api/dist/reexports/pjs-signer';

interface IAccountSelectParam extends ICallArgs {
  accounts: InjectedPolkadotAccount[];
}

export const AccountSelectParam = ({ accounts, onChange }: IAccountSelectParam) => {
  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState(accounts.at(0));

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
    const selectedAccount = accounts.find((ac) => ac.address === accountSelected);

    setSelectedAccount(selectedAccount);
    onChange(selectedAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const selectItems = useMemo(() => {
    return accounts?.map((account) => ({
      label: account.address,
      value: account.address,
      key: `account-select-${account.address}`,
    })) || [];
  }, [accounts]);

  return (
    <PDSelect
      emptyPlaceHolder="No connected accounts"
      items={selectItems}
      onChange={handleOnAccountSelect}
      placeholder="Please select an account"
      value={selectedAccount?.address || ''}
    />
  );
};
