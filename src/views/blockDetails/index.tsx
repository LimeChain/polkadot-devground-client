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
import { getBlockDetailsWithPAPIRaw } from '@utils/rpc/getBlockDetails';
import { useDynamicBuilder } from 'src/hooks/useDynamicBuilder';

import { BlockBody } from './blockBody';
import { BlockHeader } from './blockHeader';
import styles from './styles.module.css';

import type { IMappedBlock } from '@custom-types/block';

const BlockDetails = () => {
  const { blockNumber } = useParams();
  const data = useStoreChain?.use?.blockDataNew?.();
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();
  const dynamicBuilder = useDynamicBuilder();

  const [
    blockData,
    setBlockData,
  ] = useState<IMappedBlock>();

  useEffect(() => {
    const fetchData = async () => {
      const blockRaw = data.get(Number(blockNumber));
      if (!blockRaw) {
        return;
      }
      const block = await getBlockDetailsWithPAPIRaw({
        blockNumber: blockRaw.number,
        dynamicBuilder,
      });

      setBlockData({ ...block, header: { ...block.header, identity: blockRaw.identity } });
    };
    void fetchData();
  }, [
    blockNumber,
    data,
    dynamicBuilder,
    latestFinalizedBlock,
  ]);

  if (!blockData) {
    return 'Loading...';
  }

  return (
    <div className="grid gap-8">
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
        bodyData={blockData.body}
      />
    </div>
  );
};

export default BlockDetails;
