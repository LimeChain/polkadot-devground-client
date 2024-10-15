import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { Icon } from '@components/icon';
import { PageHeader } from '@components/pageHeader';
import { PDLink } from '@components/pdLink';
import { useStoreChain } from '@stores';
import { getBlockExplorerLink } from '@utils/explorer';
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
  const chain = useStoreChain?.use?.chain?.();
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();
  const dynamicBuilder = useDynamicBuilder();

  const subscanLink = useMemo(() =>
    getBlockExplorerLink({
      blockNumber,
      chain: chain.id,
      explorer: 'subscan',
    }), [
    chain.id,
    blockNumber,
  ]);

  const statescanLink = useMemo(() =>
    getBlockExplorerLink({
      blockNumber,
      chain: chain.id,
      explorer: 'statescan',
    }), [
    chain.id,
    blockNumber,
  ]);

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

      if (typeof blockStore.number === 'number') {
        const block = await getBlockDetailsWithRawClient({
          blockNumber: blockStore.number,
          dynamicBuilder,
        });

        setBlockData({
          ...block, header: {
            ...block.header,
            // HIDE IDENTITY FOR PARACHAINS SINCE IT HAS INCORRECT LOGIC
            identity: chain.isRelayChain ? blockStore.identity : undefined,
          },
        });
      }
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
          {
            subscanLink
            && (
              <PDLink
                className={styles['pd-link-btn']}
                rel="noopener noreferrer"
                target="_blank"
                to={subscanLink}
              >
                Subscan
                <Icon
                  name="icon-openLink"
                  size={[16]}
                />
              </PDLink>
            )
          }
          {
            statescanLink
            && (
              <PDLink
                className={styles['pd-link-btn']}
                rel="noopener noreferrer"
                target="_blank"
                to={statescanLink}
              >
                Statescan
                <Icon
                  name="icon-openLink"
                  size={[16]}
                />
              </PDLink>
            )
          }
        </div>
      </div>
      <BlockHeader headerData={blockData.header} />
      <BlockBody
        blockNumber={blockData.header.number}
        blockTimestamp={blockData.header.timestamp}
        bodyData={blockData.body}
      />
      <div className="flex justify-center gap-6 md:hidden">
        {
          subscanLink
          && (
            <PDLink
              className={styles['pd-link-btn']}
              rel="noopener noreferrer"
              target="_blank"
              to={subscanLink}
            >
              Subscan
              <Icon
                name="icon-openLink"
                size={[16]}
              />
            </PDLink>
          )
        }
        {
          statescanLink && (

            <PDLink
              className={styles['pd-link-btn']}
              rel="noopener noreferrer"
              target="_blank"
              to={statescanLink}
            >
              Statescan
              <Icon
                name="icon-openLink"
                size={[16]}
              />
            </PDLink>
          )
        }
      </div>
    </div>
  );
};

export default BlockDetails;
