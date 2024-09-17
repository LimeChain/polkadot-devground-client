import {
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

import { BlockBody } from './blockBody';
import { BlockHeader } from './blockHeader';
import styles from './styles.module.css';

import type { IMappedBlock } from '@custom-types/block';

const BlockDetails = () => {
  const { blockNumber } = useParams();
  const data = useStoreChain?.use?.blocksData?.();
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();

  const [blockData, setBlockData] = useState<IMappedBlock | undefined>(undefined);

  useEffect(() => {
    if (blockNumber && data.size > 0) {
      const block = data.get(Number(blockNumber));
      if (!block) {
        return;
      }

      if (block.header.number <= latestFinalizedBlock) {
        setBlockData({
          ...block,
          header: {
            ...block.header,
            isFinalized: true,
          },
        });
        return;
      }

      setBlockData({
        ...block,
        header: {
          ...block.header,
          isFinalized: false,
        },
      });
    }
  }, [blockNumber, data]);

  if (!blockData) {
    return 'Loading...';
  }

  return (
    <PDScrollArea viewportClassNames="pr-12">
      <div className="grid gap-8">
        <div className="flex items-center justify-between">
          <PageHeader title="Block" blockNumber={formatNumber(blockData.header.number)} />
          <div className="flex gap-6">
            <PDLink
              to={`https://polkadot.subscan.io/block/${blockData.header.number}`}
              className={styles['pd-link-btn']}
              target="_blank"
              rel="noopener noreferrer"
            >
          Polkadot Subscan
              <Icon name="icon-openLink" size={[16]} />
            </PDLink>
            <PDLink
              to={`https://polkadot.statescan.io/#/blocks/${blockData.header.number}`}
              className={styles['pd-link-btn']}
              target="_blank"
              rel="noopener noreferrer"
            >
          Polkadot Statescan
              <Icon name="icon-openLink" size={[16]} />
            </PDLink>
          </div>
        </div>
        <BlockHeader headerData={blockData.header}/>
        <BlockBody bodyData={blockData.body}/>
      </div>
    </PDScrollArea>
  );
};

export default BlockDetails;
