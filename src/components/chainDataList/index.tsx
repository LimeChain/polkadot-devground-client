import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDScrollArea } from '@components/scrollArea';
import {
  type IPDLink,
  PDLink,
} from '@components/ui/PDLink';
import { useStoreChain } from '@stores';
import {
  cn,
  formatNumber,
} from '@utils/helpers';

import styles from './styles.module.css';

import type {
  IMappedBlockExtrinsic,
  IMappedTransferExtrinsic,
} from '@custom-types/block';

// import type { IBlock } from '@custom-types/block';

interface IChainDataList {
  title: string;
  link: IPDLink['to'];
  linkText: string;
}

interface IRow {
  blockNumber: number;
}

const RowLatestBlock = (props: IRow) => {
  const { blockNumber } = props;
  const blockData = useStoreChain?.use?.blocksData?.()?.get(blockNumber);

  const timeAgo = blockData?.timestamp
    && formatDistanceToNowStrict(
      blockData.timestamp,
      { addSuffix: true },
    );

  return (
    <PDLink to={`${blockNumber}`} className={styles['pd-explorer-list']}>
      <div>
        <p>Block# <strong>{formatNumber(blockNumber)}</strong></p>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Includes</span>
          {' '}
          <span>{blockData?.extrinsics?.length} Extrinsics</span>
          {' '}
          {blockData?.eventsCount} Events
        </p>
      </div>
      <div>
        {timeAgo}
      </div>
    </PDLink>
  );
};

const formatId = (id: string = '') => {
  return `${id.slice(0, 3)}...${id.slice(-3)}`;
};

const RowSignedExtrinsic = ({
  id,
  blockNumber,
  isSigned,
  method,
  signature,
  signer,
  timestamp,
}: IMappedTransferExtrinsic) => {
  const chainSpecs = useStoreChain?.use?.chainSpecs?.();

  const extrinsicValue = 0;

  const timeAgo = timestamp
    && formatDistanceToNowStrict(
      timestamp,
      { addSuffix: true },
    );

  // if (chainSpecs) {
  //   console.log(chainSpecs.properties.tokenDecimals);
  // }

  // console.log(formatPrettyNumberString(method.args.value));

  return (
    <PDLink to={id} className={styles['pd-explorer-list']}>
      <div>
        <p>Extrinsic# <strong>{id}</strong></p>
        <p>
          <span className="text-dev-black-300 dark:text-dev-purple-300">Includes</span>
          {' '}
          <span>from {formatId(signer.Id)}</span>
          {' '}
          <span>to {formatId(method.args.dest.Id)}</span>
        </p>
      </div>
      <div>
        {timeAgo}
      </div>
    </PDLink>
  );
};

export const LatestBlocks = () => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const [bestBlocks, setBestBlocks] = useState<number[]>([]);
  const isLoading = bestBlocks.length === 0;

  useEffect(() => {
    if (typeof bestBlock === 'number') {
      setBestBlocks(blocks => ([bestBlock, ...blocks]));
    }
  }, [bestBlock]);

  // display all collected blocks so far
  useEffect(() => {
    const keys: number[] = [];
    blocksData.keys().forEach(key => {
      keys.unshift(key);
    });

    setBestBlocks(keys);

    return () => {
      setBestBlocks([]);
    };

  }, [blocksData, chain]);

  return (
    <PDScrollArea
      className="h-80 lg:h-full"
      viewportClassNames="py-3"
      verticalScrollClassNames="py-3"
    >
      {
        bestBlocks.map((blockNumber) => (
          <RowLatestBlock
            key={`latest-block-row-${blockNumber}-${chain.id}`}
            blockNumber={blockNumber}
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
  console.log(latestBlock, signedExtrinsics);

  const filterTransferExtrinsics = useCallback((extrinsics: IMappedBlockExtrinsic[] = []) => {
    return extrinsics.filter(extrinsic => extrinsic.method.method.startsWith('transfer')).reverse() as IMappedTransferExtrinsic[];
  }, []);

  // handle state resets on chain change
  useEffect(() => {
    return () => {
      setSignedExtrinsics([]);
    };
  }, [
    chain,
  ]);

  // display all collected blocks since smoldot init
  useEffect(() => {
    blocksData.entries().forEach(entry => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [blockNumber, data] = entry;
      const extrinsics = data?.extrinsics;

      const signedExtrinsics = filterTransferExtrinsics(extrinsics);

      setSignedExtrinsics(extrinsics => ([
        ...signedExtrinsics,
        ...extrinsics,
      ]));

    });

  }, [
    blocksData,
    filterTransferExtrinsics,
  ]);

  useEffect(() => {
    if (!latestBlock) {
      return;
    }

    const latestBlockData = blocksData.get(latestBlock);
    const signedExtrinsics = filterTransferExtrinsics(latestBlockData?.extrinsics);

    setSignedExtrinsics(extrinsics => ([
      ...signedExtrinsics,
      ...extrinsics,
    ]));

    // return () => {
    //   setSignedExtrinsics([]);
    // };

  }, [
    latestBlock,
    blocksData,
    filterTransferExtrinsics,
  ]);

  return (
    <PDScrollArea
      className="h-80 lg:h-full"
      viewportClassNames="py-3"
      verticalScrollClassNames="py-3"
    >
      {
        signedExtrinsics.map(extrinsic => (
          <RowSignedExtrinsic
            key={`latest-signed-extrinsic-${extrinsic.id}-${chain.id}`}
            {...extrinsic}
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

export const ChainDataList = ({ title, link, linkText }: IChainDataList) => {
  const isLatestBlocks = link === '/latest-blocks';
  return (
    <div className="flex flex-1 flex-col gap-y-3 overflow-hidden">
      <div className="flex items-center gap-3">
        <h5 className="text-h5-bold">{title}</h5>
        <PDLink
          to={link}
          className={cn(
            'font-geist !text-body2-regular',
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
