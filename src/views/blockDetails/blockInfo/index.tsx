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
export const BlockInfo = (props) => {
  const { blockInfo, isFinalized } = props;

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSetCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.parentNode as HTMLDivElement;
    const format = target.getAttribute('data-format');
    target.setAttribute('data-format', format === 'utc' ? 'local' : 'utc');

    setIsChecked(state => !state);
  }, []);

  return (
    <div>
      {/* Time stamp */}

      <div className={styles['pd-block-details']}>
        <p>Time stamp</p>

        <div>
          {isChecked ? new Date(blockInfo.timestamp).toUTCString() : format(new Date(blockInfo.timestamp), 'yyyy-MM-dd HH:mm:ss')}
          <ToggleButton
            isChecked={isChecked}
            handleSetCheck={handleSetCheck}
            classNames="ml-2"
          />
        UTC
        </div>
      </div>

      {/* Status */}
      <div className={styles['pd-block-details']}>
        <p>Status</p>

        {
          isFinalized
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

      {/* Block Hash */}
      <div className={styles['pd-block-details']}>
        <p>Block Hash</p>

        <div className="gap-x-1">
          <p>{blockInfo.hash}</p>

          <CopyToClipboard
            text={blockInfo.hash}
            toastMessage="block hash"
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
      </div>

      {/* Parent Hash */}
      <div className={styles['pd-block-details']}>
        <p>Parent Hash</p>

        <div>
          {blockInfo.parentHash}

          <CopyToClipboard
            text={blockInfo.parentHash}
            toastMessage="Parent Hash"
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
      </div>

      {/* State Root */}
      <div className={styles['pd-block-details']}>
        <p>State Root</p>

        <div>
          {blockInfo.stateRoot}

          <CopyToClipboard
            text={blockInfo.stateRoot}
            toastMessage="State Root"
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
      </div>

      {/* Extrinsic Root */}
      <div className={styles['pd-block-details']}>
        <p>Extrinsic Root</p>

        <div>
          {blockInfo.extrinsicRoot}

          <CopyToClipboard
            text={blockInfo.extrinsicRoot}
            toastMessage="Extrinsic Root"
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
      </div>

      {
        blockInfo.identity && (
          <div className={styles['pd-block-details']}>
            <p>Validator</p>

            <div className={styles['validator']}>
              <Identicon
                value={blockInfo.identity.address}
                size={32}
                theme="polkadot"
              />
              <span>
                {blockInfo.identity.name}
                <div className="flex gap-2">
                  {blockInfo.identity.address}

                  <CopyToClipboard
                    text={blockInfo.identity.address}
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

      <div className={styles['pd-block-details']}>
        <p>Spec Version</p>

        <div>
          {blockInfo.runtime.spec_version}
        </div>
      </div>
    </div>
  );
};
