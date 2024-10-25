/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import type { IAccountSelectBuilder } from '@components/invocationArgsMapper/types';

export const AccountSelectBuilder = ({ accounts, onChange }: IAccountSelectBuilder) => {
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

  }, [accounts]);

  const handleOnAccountSelect = useCallback((accountSelected: string) => {
    const selectedAccount = accounts.find((ac) => ac.address === accountSelected);

    setSelectedAccount(selectedAccount);
    onChange(selectedAccount);
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
      items={[selectItems]}
      onChange={handleOnAccountSelect}
      placeholder="Please select an account"
      value={selectedAccount?.address || ''}
    />
  );
};
