import { Identicon } from '@polkadot/react-identicon';
import { format } from 'date-fns';
import {
  useCallback,
  useState,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { Icon } from '@components/icon';
import { ToggleButton } from '@components/toggleButton';

import styles from '../styles.module.css';

import type { IMappedBlockHeader } from '@custom-types/block';

interface BlockHeaderProps {
  headerData: IMappedBlockHeader;
}

interface DetailRowProps {
  label: string;
  value: string | undefined;
  isCopyable?: boolean;
}

const DetailRow = (props: DetailRowProps) => {
  const { label, value } = props;

  return (
    <div className={styles['pd-block-details']}>
      <p>{label}</p>
      <div className="flex items-center gap-x-1">
        <p>{value}</p>
        {value && (
          <CopyToClipboard text={value} toastMessage={label}>
            {({ ClipboardIcon }) => <>{ClipboardIcon}</>}
          </CopyToClipboard>
        )}
      </div>
    </div>
  );
};

export const BlockHeader = (props: BlockHeaderProps) => {
  const { headerData } = props;
  const [isUTC, setIsUTC] = useState(false);

  const handleSetCheck = useCallback(() => {
    setIsUTC((prevState) => !prevState);
  }, []);

  const formattedTimestamp = isUTC
    ? new Date(headerData.timestamp).toUTCString()
    : format(new Date(headerData.timestamp), 'yyyy-MM-dd HH:mm:ss');

  return (
    <div>
      <div className={styles['pd-block-details']}>
        <p>Time stamp</p>
        <div className="flex items-center gap-x-2">
          <span>{formattedTimestamp}</span>
          <ToggleButton isChecked={isUTC} handleSetCheck={handleSetCheck} />
          <span>UTC</span>
        </div>
      </div>
      <div className={styles['pd-block-details']}>
        <p>Status</p>
        <div className="flex items-center gap-x-2">
          <Icon
            size={[16]}
            name={headerData.isFinalized ? 'icon-checked' : 'icon-clock'}
            className={headerData.isFinalized ? 'text-dev-green-600' : 'animate-rotate text-dev-yellow-700'}
          />
          <p>{headerData.isFinalized ? 'Finalized' : 'Unfinalized'}</p>
        </div>
      </div>
      <DetailRow
        label="Block Hash"
        value={headerData.hash}
      />
      <DetailRow
        label="Parent Hash"
        value={headerData.parentHash}
      />
      <DetailRow
        label="State Root"
        value={headerData.stateRoot}
      />
      <DetailRow
        label="Extrinsic Root"
        value={headerData.extrinsicRoot}
      />
      {headerData.identity && (
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
              <div className="flex items-center gap-x-2">
                <span>{headerData.identity.address}</span>
                <CopyToClipboard text={headerData.identity.address || ''} toastMessage="Validator Address">
                  {({ ClipboardIcon }) => <>{ClipboardIcon}</>}
                </CopyToClipboard>
              </div>
            </span>
          </div>
        </div>
      )}
      <DetailRow
        label="Spec Version"
        value={headerData.runtime?.spec_version?.toString()}
      />
    </div>
  );
};
