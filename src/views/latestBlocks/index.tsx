import { formatDistanceToNowStrict } from 'date-fns';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/icon';
import { PageHeader } from '@components/pageHeader';
import { PDScrollArea } from '@components/pdScrollArea';
import { SearchBar } from '@components/searchBar';
import { useStoreChain } from '@stores';
import {
  cn,
  truncateAddress,
} from '@utils/helpers';

import styles from './styles.module.css';

const LatestBlocks = () => {
  const navigate = useNavigate();
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();
  const blocksData = useStoreChain?.use?.blocksData?.();
  const isLoading = blocksData.size === 0;

  const goRouteId = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    navigate(`/explorer/${e.currentTarget.dataset.blockNumber}`);
  }, [navigate]);

  return (
    <>
      <PageHeader title="Latest Blocks" />
      <SearchBar
        label="Search by Block"
        classNames="mt-6"
      />
      <PDScrollArea
        className={styles['table-container']}
        verticalScrollClassNames="pt-8"
      >
        <table className={styles['latest-blocks-table']}>
          <thead>
            <tr>
              <th>Block</th>
              <th>Status</th>
              <th>Time</th>
              <th>Extrinsics</th>
              <th>Events</th>
              <th>Validator</th>
              <th>Block Hash</th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading
                ? 'Loading...'
                : (
                  Array.from(blocksData.values()).reverse().map((block, _idx) => {
                    const timeAgo = block.header.timestamp && formatDistanceToNowStrict(
                      new Date(block.header.timestamp),
                      { addSuffix: true },
                    );
                    const isFinalized = latestFinalizedBlock && latestFinalizedBlock >= block.header.number;

                    return (
                      <tr
                        key={block.header.number}
                        onClick={goRouteId}
                        data-block-number={block.header.number}
                        className={cn(
                          {
                            ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: _idx === 0,
                          },
                        )}
                      >
                        <td>{block.header.number}</td>
                        <td>
                          {
                            isFinalized
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
                                  name="icon-clock"
                                  className="text-dev-yellow-700"
                                />
                              )
                          }
                        </td >
                        <td>{timeAgo}</td>
                        <td>{block.body.extrinsics.length}</td>
                        <td>{block.body.events.length}</td>
                        <td>{truncateAddress(block.header.identity, 6)}</td>
                        <td>{truncateAddress(block.header.hash, 6)}</td>
                      </tr >
                    );
                  })
                )
            }
          </tbody >
        </table >
      </PDScrollArea >
    </>
  );
};

export default LatestBlocks;
