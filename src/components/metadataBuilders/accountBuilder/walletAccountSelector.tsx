import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

interface WalletAccountSelectorProps {
  accounts: InjectedPolkadotAccount[];
  onChange: (account: InjectedPolkadotAccount) => void;
}

export const WalletAccountSelector = ({ accounts, onChange }: WalletAccountSelectorProps) => {
  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState<InjectedPolkadotAccount | undefined>(
    accounts[0],
  );

  useEffect(() => {
    if (!!!accounts.length) {
      setSelectedAccount(undefined);
      return;
    }

    if (!selectedAccount) {
      setSelectedAccount(accounts[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const handleAccountSelect = useCallback((address: string) => {
    const account = accounts.find((acc) => acc.address === address);
    if (account) {
      setSelectedAccount(account);
      onChange(account);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const accountOptions = useMemo(() => {
    return accounts.map((account) => ({
      label: account.address,
      value: account.address,
      key: `wallet-account-${account.address}`,
    }));
  }, [accounts]);

  return (
    <PDSelect
      emptyPlaceHolder="No connected wallet accounts"
      items={[accountOptions]}
      onChange={handleAccountSelect}
      placeholder="Select wallet account"
      value={selectedAccount?.address || ''}
    />
  );
};
