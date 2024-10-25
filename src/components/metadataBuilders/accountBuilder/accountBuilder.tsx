/* eslint-disable react-hooks/exhaustive-deps */
import { type InjectedPolkadotAccount } from 'polkadot-api/pjs-signer';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { AccountSelectBuilder } from '@components/metadataBuilders/accountBuilder/accountSelectBuilder';
import { CustomAccountBuilder } from '@components/metadataBuilders/accountBuilder/customAccountBuilder';
import { PDSwitch } from '@components/pdSwitch';
import { useStoreWallet } from 'src/stores/wallet';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { IAccountBuilder } from '@components/invocationArgsMapper/types';

const AccountBuilder = ({ accountId, onChange }: IAccountBuilder) => {
  const accounts = useStoreWallet?.use?.accounts?.();

  const [
    useCustomAccount,
    setUseCustomAccount,
  ] = useState(false);

  useEffect(() => {
    setUseCustomAccount(false);
    onChange(accounts[0]?.address);
  }, [accounts]);

  useEffect(() => {
    if (!useCustomAccount && accounts.length) {
      onChange(accounts[0].address);
    }
  }, [
    useCustomAccount,
    accounts,
  ]);

  const handleSwitch = useCallback(() => {
    setUseCustomAccount((use) => !use);
  }, []);

  const handleAccountSelect = useCallback((account: unknown) => {
    if ((account as InjectedPolkadotAccount)?.address) {
      onChange((account as InjectedPolkadotAccount)?.address);
    }
  }, []);

  return (
    <div className={styles.invocationGroup}>
      <PDSwitch
        checked={useCustomAccount}
        onChange={handleSwitch}
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

export default AccountBuilder;
