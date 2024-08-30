import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import {
  type IPDLink,
  PDLink,
} from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import {
  type StoreInterface,
  useStoreChain,
} from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import styles from './styles.module.css';

import type {
  IMappedBlockExtrinsic,
  IMappedTransferExtrinsic,
} from '@custom-types/block';

interface TChainDataList {
  title: string;
  link: IPDLink['to'];
  linkText: string;
}

interface IRowLatestBlock {
  blockNumber: number;
  classNames: string;
}

interface IRowSignedExtrinsic {
  extrinsic: IMappedTransferExtrinsic;
  classNames: string;
}

const RowLatestBlock = (props: IRowLatestBlock) => {
  const { blockNumber, classNames } = props;
  const blockData = useStoreChain?.use?.blocksData?.()?.get(blockNumber);
  // default timestamp => 1 second ago
  const defaultTimestamp = new Date().getTime() - 1000;
  const blockTimestamp = blockData?.header?.timestamp;

  // the timestamp value will be "1 second ago" (sometimes showing as 0 second ago)
  const timestamp = blockTimestamp
    ? blockTimestamp > defaultTimestamp
      ? defaultTimestamp
      : blockTimestamp
    : defaultTimestamp;

  const extrinsics = blockData?.body?.extrinsics;
  const eventsCount = blockData?.body?.events.length;

  const timeAgo = timestamp
    && formatDistanceToNowStrict(
      timestamp,
      { addSuffix: true },
    );

  return (
    <PDLink
      to={`${blockNumber}`}
      className={cn(
        styles['pd-explorer-list'],
        classNames,
      )}
    >
      <div>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300" >
            Block#
          </span>
          {' '}
          <strong className="font-body1-bold">{formatNumber(blockNumber)}</strong>
        </p>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Includes</span>
          {' '}
          <span>{extrinsics?.length} Extrinsics</span>
          {' '}
          {eventsCount} Events
        </p>
      </div>
      <div>
        {timeAgo}
      </div>
    </PDLink>
  );
};

const RowSignedExtrinsic = (props: IRowSignedExtrinsic) => {
  const { extrinsic, classNames } = props;
  const {
    id,
    isSuccess,
    method,
    timestamp,
  } = extrinsic;

  const timeAgo = timestamp
    && formatDistanceToNowStrict(
      timestamp,
      { addSuffix: true },
    );

  return (
    <PDLink
      to={id}
      className={cn(
        styles['pd-explorer-list-extrinsic'],
        classNames,
      )}
    >
      <div>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300" >
            Extrinsic#
          </span>
          <strong className="font-body1-bold">
            {' '}{id}
          </strong>
        </p>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Action: </span>
          {method.section}.{method.method}
        </p>
      </div>
      <div>
        <span className="flex justify-end gap-1 font-body1-bold">
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
        </span>
        <span>{timeAgo}</span>
      </div>
    </PDLink>
  );
};

export const LatestBlocks = () => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const refInitalBlocksDisplayed = useRef(false);

  const [bestBlocks, setBestBlocks] = useState<number[]>([]);
  const isLoading = bestBlocks.length === 0;

  const loadInitialData = useCallback(() => {

    const keys: number[] = [];
    blocksData.keys().forEach(key => {
      keys.unshift(key);
    });

    setBestBlocks(keys);
  }, [blocksData]);

  const loadNewData = useCallback((bestBlock: StoreInterface['bestBlock']) => {
    if (typeof bestBlock === 'number') {
      setBestBlocks(blocks => ([bestBlock, ...blocks]));
    }
  }, []);

  // handle state reset on chain change
  useEffect(() => {
    refInitalBlocksDisplayed.current = false;
    setBestBlocks([]);

    return () => {
      refInitalBlocksDisplayed.current = false;
      setBestBlocks([]);
    };
  }, [chain]);

  // display all collected blocks so far
  useEffect(() => {
    if (!bestBlock) {
      return;
    }

    if (!refInitalBlocksDisplayed.current) {
      loadInitialData();
      refInitalBlocksDisplayed.current = true;
    } else {
      loadNewData(bestBlock);
    }

  }, [
    blocksData,
    chain,
    bestBlock,
    loadInitialData,
    loadNewData,
  ]);

  return (
    <PDScrollArea
      className="h-80 lg:h-full"
      viewportClassNames="py-3"
      verticalScrollClassNames="py-3"
    >
      {
        bestBlocks.map((blockNumber, blockIndex) => (
          <RowLatestBlock
            key={`latest-block-row-${blockNumber}-${chain.id}`}
            blockNumber={blockNumber}
            classNames={cn(
              {
                ['opacity-0 animate-fade-in']: blockIndex === 0,
              },
            )}
          />
        ))
      }
      {
        isLoading
        && 'Loading...'
      }
    </PDScrollArea>
  );
};

export const SignedExtrinsics = () => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const chain = useStoreChain?.use?.chain?.();
  const latestBlock = useStoreChain?.use?.bestBlock?.();

  const [signedExtrinsics, setSignedExtrinsics] = useState<IMappedTransferExtrinsic[]>([]);

  const filterExtrinsics = useCallback((extrinsics: IMappedBlockExtrinsic[] = []) => {
    // Filter out blocks with 0 or 1 extrinsics
    return extrinsics.slice(2).reverse() as IMappedTransferExtrinsic[];
  }, []);

  const loadExtrinsic = useCallback(() => {
    blocksData.entries().forEach(entry => {
      const [, block] = entry;
      if (!block) {
        return;
      }
      const extrinsics = block.body.extrinsics;

      const signedExtrinsics = filterExtrinsics(extrinsics);
      setSignedExtrinsics(extrinsics => ([
        ...signedExtrinsics,
        ...extrinsics,
      ]));

    });

  }, [
    blocksData,
    filterExtrinsics,
  ]);

  useEffect(() => {
    setSignedExtrinsics([]);

    if (!latestBlock) {
      return;
    }

    loadExtrinsic();
  }, [latestBlock, loadExtrinsic]);

  return (
    <PDScrollArea
      className="h-80 lg:h-full"
      viewportClassNames="py-3"
      verticalScrollClassNames="py-3"
    >
      {
        signedExtrinsics.map((extrinsic, extrinsicIndex) => (
          <RowSignedExtrinsic
            key={`latest-signed-extrinsic-${extrinsic.id}-${chain.id}`}
            extrinsic={extrinsic}
            classNames={cn(
              {
                ['opacity-0 animate-fade-in']: extrinsicIndex === 0,
              },
            )}
          />
        ))
      }
      {
        !latestBlock
        && 'Loading...'
      }
    </PDScrollArea>
  );
};

export const ChainDataList = ({ title, link, linkText }: TChainDataList) => {
  const isLatestBlocks = link === 'latest-blocks';
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
        isLatestBlocks
        && <LatestBlocks />
      }
      {
        !isLatestBlocks
        && <SignedExtrinsics />
      }
    </div>
  );
};
