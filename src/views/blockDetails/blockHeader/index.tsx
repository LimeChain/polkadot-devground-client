import { Identicon } from '@polkadot/react-identicon';
import { format } from 'date-fns';
import {
  useCallback,
  useState,
} from 'react';

import { CopyToClipboard } from '@components/copyToClipboard';
import { Icon } from '@components/icon';
import { ToggleButton } from '@components/toggleButton';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import styles from '../styles.module.css';

import type { IMappedBlockHeader } from '@custom-types/block';

interface BlockHeaderProps {
  headerData: IMappedBlockHeader;
}

interface DetailRowProps {
  label: string;
  value: string | undefined;
  isCopyable?: boolean;
  iconComponent?: React.ReactNode;
}

const DetailRow = (props: DetailRowProps) => {
  const { label, value, iconComponent } = props;

  return (
    <div className={cn(styles['pd-block-details'], 'group')}>
      <p>{label}</p>
      <div className="flex items-center gap-x-1">
        {iconComponent && <span className="mr-2">{iconComponent}</span>}

        {value && (
          <CopyToClipboard
            className="relative flex items-center"
            text={value}
            textClassName="cursor-pointer peer"
            toastMessage={label}
          >
            {({ ClipboardIcon }) => (
              <div
                className={cn(
                  'transition-opacity duration-200 ease-in-out',
                  'opacity-100 md:opacity-0',
                  'group-hover:opacity-100 peer-hover:text-dev-pink-400 md:group-hover:opacity-100',
                )}
              >
                {ClipboardIcon}
              </div>
            )}
          </CopyToClipboard>
        )}
      </div>
    </div>
  );
};

export const BlockHeader = (props: BlockHeaderProps) => {
  const { headerData } = props;
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();
  const isFinalized = headerData.number <= (latestFinalizedBlock ?? 0);
  const [
    isUTC,
    setIsUTC,
  ] = useState(false);

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
          <button
            className="cursor-pointer"
            onClick={handleSetCheck}
          >
            {formattedTimestamp}
          </button>
          <ToggleButton
            handleSetCheck={handleSetCheck}
            isChecked={isUTC}
          />
          <button
            className="cursor-pointer"
            onClick={handleSetCheck}
          >
            UTC
          </button>
        </div>
      </div>
      <div className={styles['pd-block-details']}>
        <p>Status</p>
        <div className="flex items-center gap-x-2">
          <Icon
            className={isFinalized ? 'text-dev-green-600' : 'animate-rotate text-dev-yellow-700'}
            name={isFinalized ? 'icon-checked' : 'icon-clock'}
            size={[16]}
          />
          <p>{isFinalized ? 'Finalized' : 'Unfinalized'}</p>
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
        <DetailRow
          label="Validator"
          value={headerData.identity.address}
          iconComponent={(
            <Identicon
              size={32}
              theme="polkadot"
              value={headerData.identity.address}
            />
          )}
        />
      )}
      <DetailRow
        label="Spec Version"
        value={headerData.runtime?.spec_version?.toString()}
      />
    </div>
  );
};
