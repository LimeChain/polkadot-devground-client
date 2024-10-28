/* eslint-disable react-hooks/exhaustive-deps */
import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSwitch } from '@components/pdSwitch';
import { useStoreWallet } from 'src/stores/wallet';

import styles from '../../invocationArgsMapper/styles.module.css';

import { ManualAccountInput } from './manualAccountInput';
import { WalletAccountSelector } from './walletAccountSelector';

import type { IAccountBuilder } from '@components/invocationArgsMapper/types';

export const AccountBuilder = ({ accountId, onChange }: IAccountBuilder) => {
  const walletAccounts = useStoreWallet?.use?.accounts?.() ?? [];
  const [
    isManualInput,
    setIsManualInput,
  ] = useState(false);

  // Reset to wallet selection mode when accounts change
  useEffect(() => {
    setIsManualInput(false);
    if (walletAccounts.length > 0) {
      onChange(walletAccounts[0].address);
    }
  }, [walletAccounts]);

  // Set default wallet account when switching back from manual mode
  useEffect(() => {
    if (!isManualInput && walletAccounts.length > 0) {
      onChange(walletAccounts[0].address);
    }
  }, [
    isManualInput,
    walletAccounts,
  ]);

  const handleAccountSelect = useCallback((account: unknown) => {
    const selectedAccount = account as InjectedPolkadotAccount;
    if (selectedAccount?.address) {
      onChange(selectedAccount.address);
    }
  }, []);

  const handleManualInputToggle = useCallback(() => {
    setIsManualInput((prev) => !prev);
  }, []);

  const renderAccountInput = () => {
    if (isManualInput) {
      return (
        <ManualAccountInput
          accountId={accountId}
          onChange={onChange}
        />
      );
    }

    return (
      <WalletAccountSelector
        accounts={walletAccounts}
        onChange={handleAccountSelect}
      />
    );
  };

  return (
    <div className={styles.invocationGroup}>
      <PDSwitch
        checked={isManualInput}
        onChange={handleManualInputToggle}
        title="Enter Account Manually"
      />
      <div>
        {renderAccountInput()}
      </div>
    </div>
  );
};
