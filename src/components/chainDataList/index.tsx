import { formatDistanceToNow } from 'date-fns';

import { PDScrollArea } from '@components/pdScrollArea';
import {
  type IPDLink,
  PDLink,
} from '@components/ui/PDLink';
import { useStoreExplorer } from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import styles from './styles.module.css';

import type { IBlock } from '@custom-types/block';

interface IChainDataList {
  title: string;
  link: IPDLink['to'];
  linkText: string;
}

interface IRow {
  block: IBlock;
}

const Row = (props: IRow) => {
  const { block } = props;

  const timeAgo = block.timestamp && formatDistanceToNow(block.timestamp, { addSuffix: true });

  const blockNumber = parseInt(block.header.number, 16);

  return (
    <PDLink to={`${blockNumber}`} className={styles['pd-explorer-list']}>
      <div>
        <p>Block# <strong>{formatNumber(blockNumber)}</strong></p>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Includes</span>
          {' '}
          <span>{block.extrinsics.length} Extrinsics</span>
          {/* @TODO: should be implemented */}
          {/* (46 Events - fake) */}
        </p>
      </div>
      <div>{timeAgo}</div>
    </PDLink>
  );
};

export const ChainDataList = ({ title, link, linkText }: IChainDataList) => {
  const latestBlocks = useStoreExplorer.use.latestBlocks?.();

  return (
    <div className="flex flex-1 flex-col gap-y-3 overflow-hidden">
      <div className="flex items-center gap-3">
        <h5 className="font-h5-bold">{title}</h5>
        <PDLink
          to={link}
          className={cn(
            'font-geist font-body2-regular',
            'text-dev-pink-500 transition-colors hover:text-dev-pink-400',
          )}
        >
          {linkText}
        </PDLink>
      </div>
      {
        link === '/latest-blocks' && (
          <PDScrollArea
            className="h-80 lg:h-full"
            viewportClassNames="py-3 mask-vertical"
            verticalScrollClassNames="py-3"
          >
            {
              latestBlocks?.map((block) => (
                <Row key={block.hash} block={block} />
              ))
            }
          </PDScrollArea>
        )
      }
      {
        link === '/signed-extrinsics' && (
          <PDScrollArea
            viewportClassNames="py-6"
            verticalScrollClassNames="py-6"
          >
            <>{/* TBD */}</>
          </PDScrollArea>
        )
      }
    </div>
  );
};
