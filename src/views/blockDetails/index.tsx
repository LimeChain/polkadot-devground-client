import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { Icon } from '@components/icon';
import { PageHeader } from '@components/pageHeader';
import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { useStoreChain } from '@stores';
import { formatNumber } from '@utils/helpers';

import { Test } from './blockDetails';
import { BlockInfo } from './blockInfo';
import styles from './styles.module.css';

interface IBlockData {
  number: number;
  blockHash: string;
  extrinsicsRoot: string;
  parentHash: string;
  stateRoot: string;
  specVersion: number;
  validatorId: string;
  timeStamp: string;
}

const BlockDetails = () => {
  const { blockNumber } = useParams();
  const data = useStoreChain?.use?.blocksData?.();
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();

  const [blockData, setBlockData] = useState<IBlockData | undefined>();
  const [isFinalized, setIsFinalized] = useState<boolean>(false);
  const blocksData = useStoreChain?.use?.blocksData?.();

  const handleSetCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget.parentNode as HTMLDivElement;
    const format = target.getAttribute('data-format');
    target.setAttribute('data-format', format === 'utc' ? 'local' : 'utc');

    setIsChecked(state => !state);
  }, []);

  useEffect(() => {
    if (blockNumber && data.size > 0) {
      const block = data.get(Number(blockNumber));
      if (!block) {
        return;
      }
      setBlockData({ ...block, isFinalized: false });
    }
  }, [blockNumber, data]);

  useEffect(() => {
    if (latestFinalizedBlock && blockData) {
      const blockNumber = blockData.header.number || 0;
      const isBlockFinalized = blockNumber <= latestFinalizedBlock;

      setIsFinalized(isBlockFinalized);
    }
  }, [latestFinalizedBlock, blockData]);

  if (!blockData) {
    return 'Loading...';
  }

  return (
    <PDScrollArea viewportClassNames="pr-8">
      <div className="grid gap-12">
        <div className="flex items-center justify-between">
          <PageHeader title="Block" blockNumber={formatNumber(blockData.header.number)} />
          <div className="flex gap-6">
            <PDLink
              to={`https://polkadot.subscan.io/block/${blockData.number}`}
              className={styles['pd-link-btn']}
              target="_blank"
              rel="noopener noreferrer"
            >
          Polkadot Subscan
              <Icon name="icon-openLink" size={[16]} />
            </PDLink>
            <PDLink
              to={`https://polkadot.statescan.io/#/blocks/${blockData.number}`}
              className={styles['pd-link-btn']}
              target="_blank"
              rel="noopener noreferrer"
            >
          Polkadot Statescan
              <Icon name="icon-openLink" size={[16]} />
            </PDLink>
          </div>
        </div>
        <BlockInfo
          blockInfo={blockData.header}
          isFinalized={isFinalized}
        />
        <Test
          blockDetails={blockData.body}
          isFinalized={isFinalized}
          blockNumber={blockNumber}
        />
      </div>
    </PDScrollArea>
  );
};

export default BlockDetails;
