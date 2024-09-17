import Identicon from '@polkadot/react-identicon';
import { format } from 'date-fns/format';
import {
  useCallback,
  useState,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { Icon } from '@components/icon';
import { ToggleButton } from '@components/toggleButton';

import styles from '../styles.module.css';

import type { IBlockHeader } from '@custom-types/block';

interface BlockHeaderProps {
  headerData: IBlockHeader;
}

const BlockDetail = (props) => {
  const { label, value, isCopyable } = props;

  return (
    <div className={styles['pd-block-details']}>
      <p>{label}</p>

      <div className="gap-x-1">
        <p>{value}</p>

        {
          isCopyable && (
            <CopyToClipboard
              text={value}
              toastMessage={label}
            >
              {
                ({ ClipboardIcon }) => (
                  <>
                    {ClipboardIcon}
                  </>
                )
              }
            </CopyToClipboard>
          )
        }

      </div>
    </div>
  );
};

export const BlockHeader = (props: BlockHeaderProps) => {
  const { headerData } = props;

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSetCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.parentNode as HTMLDivElement;
    const format = target.getAttribute('data-format');
    target.setAttribute('data-format', format === 'utc' ? 'local' : 'utc');

    setIsChecked(state => !state);
  }, []);

  return (
    <div>
      <div className={styles['pd-block-details']}>
        <p>Time stamp</p>

        <div>
          {
            isChecked
              ? new Date(headerData.timestamp).toUTCString()
              : format(new Date(headerData.timestamp), 'yyyy-MM-dd HH:mm:ss')}
          <ToggleButton
            isChecked={isChecked}
            handleSetCheck={handleSetCheck}
            classNames="ml-2"
          />
        UTC
        </div>
      </div>
      <div className={styles['pd-block-details']}>
        <p>Status</p>

        {
          headerData.isFinalized
            ? (
              <div>
                <Icon
                  size={[16]}
                  name="icon-checked"
                  className="text-dev-green-600"
                />
                <p>Finalized</p>
              </div>
            )
            : (
              <div>
                <Icon
                  size={[16]}
                  name="icon-clock"
                  className="animate-rotate text-dev-yellow-700"
                />
                <p>Unfinalized</p>
              </div>
            )
        }
      </div>
      <BlockDetail
        label={'Block Hash'}
        value={headerData.hash}
        isCopyable
      />
      <BlockDetail
        label={'Parent Hash'}
        value={headerData.parentHash}
        isCopyable
      />
      <BlockDetail
        label={'State Root'}
        value={headerData.stateRoot}
        isCopyable
      />
      <BlockDetail
        label={'Extrinsic Root'}
        value={headerData.extrinsicRoot}
        isCopyable
      />
      {
        headerData.identity && (
          <div className={styles['pd-block-details']}>
            <p>Validator</p>

            <div className={styles['validator']}>
              <Identicon
                value={headerData.identity.address}
                size={32}
                theme="polkadot"
              />
              <span>
                {headerData.identity.name}
                <div className="flex gap-2">
                  {headerData.identity.address}

                  <CopyToClipboard
                    text={headerData.identity.address}
                    toastMessage="Validator Address"
                  >
                    {
                      ({ ClipboardIcon }) => (
                        <>
                          {ClipboardIcon}
                        </>
                      )
                    }
                  </CopyToClipboard>
                </div>
              </span>
            </div>
          </div>
        )
      }
      <BlockDetail
        label={'Spec Version'}
        value={headerData.runtime?.spec_version}
        isCopyable
      />
    </div>
  );
};
