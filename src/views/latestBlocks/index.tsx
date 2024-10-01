import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
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

import type { IMappedBlock } from '@custom-types/block';

const LatestBlocks = () => {
  const navigate = useNavigate();
  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const latestFinalizedBlock = useStoreChain?.use?.finalizedBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const [
    blocks,
    setBlocks,
  ] = useState<IMappedBlock[]>([]);
  const isLoading = blocksData.size === 0;

  useEffect(() => {
    const blocksArray = Array.from(blocksData.values()).reverse();

    setBlocks(blocksArray);
  }, [
    blocksData,
    bestBlock,
    chain,
    latestFinalizedBlock,
  ]);

  const goRouteId = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    navigate(`/explorer/${e.currentTarget.dataset.blockNumber}`);
  }, [navigate]);

  return (
    <div className="grid h-full grid-rows-[40px_46px_1fr] gap-8">
      <PageHeader title="Latest Blocks" />
      <SearchBar
        label="Search by Block"
        type="block"
      />
      <PDScrollArea
        className="h-full"
        verticalScrollClassNames="pt-8"
      >
        <table className="w-full">
          <colgroup>
            <col style={{ width: '10%', minWidth: '9rem' }} />
            <col style={{ width: '10%', minWidth: '4rem' }} />
            <col style={{ width: '20%', minWidth: '8rem' }} />
            <col style={{ width: '10%', minWidth: '6rem' }} />
            <col style={{ width: '10%', minWidth: '6rem' }} />
            <col style={{ width: '20%', minWidth: '10rem' }} />
            <col style={{ width: '20%', minWidth: '10rem' }} />
          </colgroup>
          <tr className="pd-table-head">
            <th>Block</th>
            <th>Status</th>
            <th>Time</th>
            <th>Extrinsics</th>
            <th>Events</th>
            <th>Validator</th>
            <th>Block Hash</th>
          </tr>
          {
            isLoading
              ? 'Loading...'
              : (
                blocks.map((block, blockIndex) => {
                  const timeAgo = block.header.timestamp && formatDistanceToNowStrict(
                    new Date(block.header.timestamp),
                    { addSuffix: true },
                  );
                  const isFinalized = latestFinalizedBlock && latestFinalizedBlock >= block.header.number;

                  return (
                    <tr
                      key={block.header.number}
                      data-block-number={block.header.number}
                      onClick={goRouteId}
                      className={cn(
                        'pd-table-row',
                        {
                          ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: blockIndex === 0,
                        },
                      )}
                    >
                      <td>{block.header.number}</td>
                      <td>
                        {
                          isFinalized
                            ? (
                              <Icon
                                className="text-dev-green-600"
                                name="icon-checked"
                                size={[16]}
                              />
                            )
                            : (
                              <Icon
                                className="animate-rotate text-dev-yellow-700"
                                name="icon-clock"
                                size={[16]}
                              />
                            )
                        }
                      </td>
                      <td>{timeAgo}</td>
                      <td>{block.body.extrinsics.length}</td>
                      <td>{block.body.events.length}</td>
                      <td>{truncateAddress(block.header.identity.address.toString() || '', 6)}</td>
                      <td>{truncateAddress(block.header.hash, 6)}</td>
                    </tr>
                  );
                })
              )
          }
        </table>
      </PDScrollArea>
    </div>
  );
};

export default LatestBlocks;
