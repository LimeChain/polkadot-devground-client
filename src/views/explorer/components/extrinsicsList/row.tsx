import { formatDistanceToNowStrict } from 'date-fns';

import { Icon } from '@components/icon';

import type { CSSProperties } from 'styled-components';

interface IRowProps {
  handleOpenModal: (e: React.MouseEvent<HTMLTableRowElement>) => void;
  className?: string;
  style?: CSSProperties;
  extrinsicId: string;
  action: string;
  isSuccess: boolean;
  timestamp: number;
}

export const Row = (props: IRowProps) => {
  const {
    handleOpenModal,
    className,
    style,
    extrinsicId,
    action,
    isSuccess,
    timestamp,
  } = props;

  return (
    <div
      data-extrinsic-id={extrinsicId}
      onClick={handleOpenModal}
      className={className}
      style={style}
    >
      <div>
        <span>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Extrinsic# </span>
          <strong className="font-body1-bold">{extrinsicId}</strong>
        </span>
        {
          isSuccess
            ? (
              <Icon
                size={[16]}
                name="icon-checked"
                className="text-dev-green-600"
              />
            )
            : (
              <Icon
                size={[16]}
                name="icon-failed"
                className="text-dev-red-800"
              />
            )
        }
      </div>
      <div className="overflow-hidden">
        <div className="truncate">
          <span className="text-dev-black-300 dark:text-dev-purple-300">Action: </span>
          {action}
        </div>
        <span className="min-w-fit">
          {formatDistanceToNowStrict(timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};
