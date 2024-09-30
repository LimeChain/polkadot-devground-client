import { formatDistanceToNowStrict } from 'date-fns';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from '@components/loader';
import { PageHeader } from '@components/pageHeader';
import { SearchBar } from '@components/searchBar';
import Table from '@components/table';
import { useStoreChain } from '@stores';
import { truncateAddress } from '@utils/helpers';

import type { IMappedBlock } from '@custom-types/block';

const LatestBlocks = () => {
  const navigate = useNavigate();
  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const latestFinalizedBlock = useStoreChain?.use?.finalizedBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const columns = useMemo(() => [
    {
      accessorKey: 'header.number',
      header: 'Block',
    },
    {
      header: 'Status',
      cell: ({ row }) => {
        const block = row.original;
        const isFinalized = latestFinalizedBlock && latestFinalizedBlock >= block.header.number;
        return isFinalized ? 'Finalized' : 'Unfinalized';
      },
    },
    {
      accessorKey: 'header.timestamp',
      header: 'Time',
      cell: ({ row }) => {
        const block = row.original;
        const timeAgo = block.header.timestamp && formatDistanceToNowStrict(
          new Date(block.header.timestamp),
          { addSuffix: true },
        );
        return timeAgo;
      },
    },
    {
      header: 'Extrinsics',
      cell: ({ row }) => {
        const block = row.original;
        return block.body.extrinsics.length;
      },
    },
    {
      header: 'Events',
      cell: ({ row }) => {
        const block = row.original;
        return <td>{block.body.events.length}</td>;
      },
    },
    {
      header: 'Validator',
      cell: ({ row }) => {
        const block = row.original;
        return truncateAddress(block.header.identity.address.toString() || '', 6);
      },
    },
    {
      header: 'Block Hash',
      cell: ({ row }) => {
        const block = row.original;
        return truncateAddress(block.header.hash.toString() || '', 6);
      },
    },
  ], [latestFinalizedBlock]);

  const [
    blocks,
    setBlocks,
  ] = useState<IMappedBlock[]>([]);
  const isLoading = blocksData.size === 0;

  const goRouteId = useCallback((blockData) => {
    navigate(`/explorer/${blockData.header.number}`);
  }, [navigate]);

  useEffect(() => {
    const blocksArray = Array.from(blocksData.values()).reverse();
    setBlocks(blocksArray);
  }, [
    blocksData,
    bestBlock,
    chain,
    latestFinalizedBlock,
  ]);

  return (
    <div className="disable-vertical-scroll grid h-full grid-rows-[40px_46px_1fr] gap-8">
      <PageHeader title="Latest Blocks" />
      {
        !isLoading
          ? (
            <>
              <SearchBar
                label="Search by Block"
                type="block"
              />
              <Table
                columns={columns}
                data={blocks}
                onRowClick={goRouteId}
              />
            </>
          )
          : <Loader />
      }
    </div>
  );
};

export default LatestBlocks;
