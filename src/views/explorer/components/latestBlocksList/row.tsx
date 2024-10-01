import { formatDistanceToNowStrict } from 'date-fns';

import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { useStoreChain } from '@stores';
import { formatNumber } from '@utils/helpers';

import type { CSSProperties } from 'styled-components';

interface IRowProps {
  className?: string;
  style?: CSSProperties;
  blockNumber: number;
  timestamp: number;
  extrinsicsLength: number;
  eventsLength: number;
}

export const Row = (props: IRowProps) => {
  const {
    className,
    style,
    blockNumber,
    extrinsicsLength,
    eventsLength,
    timestamp,
  } = props;

  const latestFinalizedBlock = useStoreChain?.use?.finalizedBlock?.();

  const isFinalized = latestFinalizedBlock && latestFinalizedBlock >= blockNumber;
  const timeAgo = timestamp && formatDistanceToNowStrict(
    new Date(timestamp),
    { addSuffix: true },
  );

  return (
    <PDLink
      className={className}
      style={style}
      to={blockNumber}
    >
      <div>
        <span>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Block# </span>
          <strong className="font-body1-bold">{formatNumber(blockNumber)}</strong>
        </span>
        {
          isFinalized
            ? (
              <Icon
                className="text-dev-green-600"
                name="icon-checked"
                size={[16]}
              />
            )
            : (
              <Icon
                className="animate-rotate text-dev-yellow-700"
                name="icon-clock"
                size={[16]}
              />
            )
        }
      </div>
      <div>
        <span>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Includes </span>
          <span>
            {extrinsicsLength}
            {' '}
            Extrinsics
            {' '}
          </span>
          {eventsLength}
          {' '}
          Events
        </span>
        <span>{timeAgo}</span>
      </div>
    </PDLink>
  );
};
