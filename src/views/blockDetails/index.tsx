import {
  useCallback,
  useState,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { Icon } from '@components/icon';
import { ToggleButton } from '@components/toggleButton';
import { PDLink } from '@components/ui/PDLink';

import styles from './styles.module.css';

const BlockDetails = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [timeStamp] = useState<string>('2024-06-26 14:21:42');

  const handleSetCheck = useCallback((): void => {
    setIsChecked(state => !state);
  }, []);

  return (
    <>
      <div className="mb-12  flex items-center  justify-between">
        <div className="flex items-center">
          <PDLink to="blank" className="mr-8 bg-dev-purple-700 p-2 dark:bg-white">
            <Icon
              name="icon-arrowLeft"
              className=" text-dev-white-200 dark:text-dev-purple-700"
            />
          </PDLink>
          <h4 className="mr-2 text-h4-light">Block</h4>
          <h4 className="text-h4-bold">21,382,130</h4>
        </div>

        <div className="flex gap-6">
          <PDLink
            to={`https://polkadot.subscan.io/block/${''}`}
            className="flex items-center gap-1"
          >
            <p className="font-geist text-body2-bold">Polkadot Statescan</p>
            <Icon name="icon-openLink" size={[16]} />
          </PDLink>
          <PDLink
            to={`https://polkadot.statescan.io/#/blocks/${''}`}
            className="flex items-center gap-1"
          >
            <p className="font-geist text-body2-bold">Polkadot Statescan</p>
            <Icon name="icon-openLink" size={[16]} />
          </PDLink>
        </div>
      </div>

      {/* Time stamp */}
      <div className={styles['pd-block-details']}>
        <p>Time stamp</p>

        <div>
          {isChecked ? new Date(timeStamp).toUTCString() : timeStamp}
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

        <div >
          <Icon
            name="icon-checked"
            className=" text-dev-white-200 dark:text-dev-purple-700"
            size={[16]}
          />
          <p>Finalized</p>
        </div>
      </div>

      {/* Block Hash */}
      <div className={styles['pd-block-details']}>
        <p>Block Hash</p>

        <div className="gap-x-1">
          <p>0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77</p>

          <CopyToClipboard
            text="0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77"
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
          0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77

          <CopyToClipboard
            text="0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77"
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
      </div >

      {/* State Root */}
      <div className={styles['pd-block-details']}>
        <p>State Root</p>

        <div>
          0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77

          <CopyToClipboard
            text="0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77"
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
          0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77

          <CopyToClipboard
            text="0x7d6af371a0c713ec38b8a95dca3ba8b5a7f3eda2b3c81697b585a0facddcff77"
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

      <div className={styles['pd-block-details']}>
        <p>Validator</p>

        <div>
          <Icon name="logo-polkadotBlockDetails" />
          14Y626iStBUWcNtnmH97163BBJJ2f7jc1piGMZwEQfK3t8zw

          <CopyToClipboard
            text="14Y626iStBUWcNtnmH97163BBJJ2f7jc1piGMZwEQfK3t8zw"
            toastMessage="Validator"
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

      <div className={styles['pd-block-details']}>
        <p>Spec Version</p>

        <div>1002004</div>
      </div>
    </>
  );
};

export default BlockDetails;
