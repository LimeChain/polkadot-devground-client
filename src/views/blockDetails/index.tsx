import {
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { Icon } from '@components/icon';
import { PageHeader } from '@components/pageHeader';
import { PDLink } from '@components/pdLink';
import { useStoreChain } from '@stores';
import { formatNumber } from '@utils/helpers';
import { getBlockDetailsWithRawClient } from '@utils/rpc/getBlockDetails';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

import { BlockBody } from './blockBody';
import { BlockHeader } from './blockHeader';
import styles from './styles.module.css';

import type { IMappedBlock } from '@custom-types/block';

const BlockDetails = () => {
  const { blockNumber } = useParams();
  const data = useStoreChain?.use?.blocksData?.();
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();
  const dynamicBuilder = useDynamicBuilder();

  const [
    blockData,
    setBlockData,
  ] = useState<IMappedBlock>();

  useEffect(() => {
    void (async () => {
      const blockStore = data.get(Number(blockNumber));
      if (!blockStore) {
        return;
      }
      const block = await getBlockDetailsWithRawClient({
        blockNumber: blockStore.number,
        dynamicBuilder,
      });

      setBlockData({ ...block, header: { ...block.header, identity: blockStore.identity } });
    })();
    // Removed data from dependencies as we expect this should be already in place when hitting this page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blockNumber,
    dynamicBuilder,
    latestFinalizedBlock,
  ]);

  if (!blockData) {
    return 'Loading...';
  }

  return (
    <div className="disable-horizontal-scroll grid gap-8">
      <div className="flex items-center justify-between">
        <PageHeader
          blockNumber={formatNumber(blockData.header.number)}
          title="Block"
        />
        <div className="hidden gap-6 md:flex">
          <PDLink
            className={styles['pd-link-btn']}
            rel="noopener noreferrer"
            target="_blank"
            to={`https://polkadot.subscan.io/block/${blockData.header.number}`}
          >
            Polkadot Subscan
            <Icon
              name="icon-openLink"
              size={[16]}
            />
          </PDLink>
          <PDLink
            className={styles['pd-link-btn']}
            rel="noopener noreferrer"
            target="_blank"
            to={`https://polkadot.statescan.io/#/blocks/${blockData.header.number}`}
          >
            Polkadot Statescan
            <Icon
              name="icon-openLink"
              size={[16]}
            />
          </PDLink>
        </div>
      </div>
      <BlockHeader headerData={blockData.header} />
      <BlockBody
        blockNumber={blockData.header.number}
        blockTimestamp={blockData.header.timestamp}
        bodyData={blockData.body}
      />
    </div>
  );
};

export default BlockDetails;
