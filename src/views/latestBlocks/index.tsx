import { useVirtualizer } from '@tanstack/react-virtual';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
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
  const parentRef = useRef<HTMLDivElement>(null);

  const [blocks, setBlocks] = useState<IMappedBlock[]>([]);
  const isLoading = blocksData.size === 0;

  const goRouteId = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    navigate(`/explorer/${e.currentTarget.dataset.blockNumber}`);
  }, [navigate]);

  useEffect(() => {
    const blocksArray = Array.from(blocksData.values()).reverse();
    setBlocks(blocksArray);
  }, [blocksData, bestBlock, chain, latestFinalizedBlock]);

  const rowVirtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 2,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <div className="disable-vertical-scroll grid h-full grid-rows-[40px_46px_1fr] gap-8">
      <PageHeader title="Latest Blocks" />
      <SearchBar
        type="block"
        label="Search by Block"
      />
      {
        !isLoading
          ? (
            <PDScrollArea
              ref={parentRef}
              verticalScrollClassNames="pt-8"
              className="h-full overflow-auto"
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
                <thead>
                  <tr className="pd-table-head">
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
                  {paddingTop > 0 && (
                    <tr>
                      <td style={{ height: `${paddingTop}px` }} />
                    </tr>
                  )}
                  {
                    virtualRows.map((virtualRow) => {
                      const block = blocks[virtualRow.index];
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
                            'pd-table-row',
                            {
                              ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: virtualRow.index === 0,
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
                                    className="animate-rotate text-dev-yellow-700"
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
                  }
                  {paddingBottom > 0 && (
                    <tr>
                      <td style={{ height: `${paddingBottom}px` }} />
                    </tr>
                  )}
                </tbody>
              </table>
            </PDScrollArea>
          )
          : <Loader/>
      }
    </div>
  );
};

export default LatestBlocks;
