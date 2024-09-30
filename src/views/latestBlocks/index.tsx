import { formatDistanceToNowStrict } from 'date-fns';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
import { PageHeader } from '@components/pageHeader';
import { SearchBar } from '@components/searchBar';
import Table from '@components/table';
import { useStoreChain } from '@stores';
import { truncateAddress } from '@utils/helpers';

import type { IMappedBlock } from '@custom-types/block';
import type { ColumnDef } from '@tanstack/react-table';

const LatestBlocks = () => {
  const navigate = useNavigate();
  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const latestFinalizedBlock = useStoreChain?.use?.finalizedBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const columns: ColumnDef<IMappedBlock>[] = useMemo(() => [
    {
      accessorKey: 'header.number',
      header: 'Block',
    },
    {
      header: 'Status',
      cell: ({ row }: { row: { original: IMappedBlock } }) => latestFinalizedBlock !== null && latestFinalizedBlock >= row.original.header.number
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
        ),
    },
    {
      accessorKey: 'header.timestamp',
      header: 'Time',
      cell: ({ row }: { row: { original: IMappedBlock } }) => row.original.header.timestamp && formatDistanceToNowStrict(new Date(row.original.header.timestamp), { addSuffix: true }),

    },
    {
      header: 'Extrinsics',
      cell: ({ row }) => row.original.body.extrinsics.length,
    },
    {
      header: 'Events',
      cell: ({ row }) => row.original.body.events.length,
    },
    {
      header: 'Validator',
      cell: ({ row }) => truncateAddress(row.original.header.identity.address.toString() || '', 6),
    },
    {
      header: 'Block Hash',
      cell: ({ row }) => truncateAddress(row.original.header.hash.toString() || '', 6),
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
