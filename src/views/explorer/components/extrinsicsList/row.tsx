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
      className={className}
      data-extrinsic-id={extrinsicId}
      onClick={handleOpenModal}
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
                className="text-dev-green-600"
                name="icon-checked"
                size={[16]}
              />
            )
            : (
              <Icon
                className="text-dev-red-800"
                name="icon-failed"
                size={[16]}
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
