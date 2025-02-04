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
import {
  cn,
  truncateAddress,
} from '@utils/helpers';

import type { IBlockStoreData } from '@custom-types/chain';
import type { ColumnDef } from '@tanstack/react-table';

const LatestBlocks = () => {
  const navigate = useNavigate();

  const blocksData = useStoreChain?.use?.blocksData?.();
  const bestBlock = useStoreChain?.use?.bestBlock?.();
  const latestFinalizedBlock = useStoreChain?.use?.finalizedBlock?.();
  const chain = useStoreChain?.use?.chain?.();

  const columns = useMemo(() => {
    const result: ColumnDef<IBlockStoreData>[] = [
      {
        accessorKey: 'number',
        header: 'Block',
      },
      {
        header: 'Status',
        cell: ({ row }) => {
          const isFinalized = latestFinalizedBlock && latestFinalizedBlock >= row.original.number!;

          return (
            <Icon
              name={isFinalized ? 'icon-checked' : 'icon-clock'}
              size={[16]}
              className={cn(
                {
                  ['text-dev-green-600']: isFinalized,
                  ['animate-rotate text-dev-yellow-700']: !isFinalized,
                },
              )}
            />
          );
        },
      },
      {
        accessorKey: 'header.timestamp',
        header: 'Time',
        cell: ({ row }) => {
          return row.original.timestamp
            && formatDistanceToNowStrict(new Date(row.original.timestamp), { addSuffix: true });
        },
      },
      {
        header: 'Extrinsics',
        cell: ({ row }) => {
          return row.original.extrinsics.length;
        },
      },
      {
        header: 'Events',
        cell: ({ row }) => {
          return row.original.eventsLength;
        },
      },
      {
        header: 'Validator',
        cell: ({ row }) => {
          // IF THE BLOCK IS NOT PINNED (ITS A WRONG FORK) THE IDENTITY WOULD BE "UNDEFINED"
          return truncateAddress(row.original.identity?.address?.toString?.() || '', 6);
        },
      },
      {
        header: 'Block Hash',
        cell: ({ row }) => {
          return truncateAddress(row.original.hash.toString() || '', 6);
        },
      },
    ];

    return result;
  }, [latestFinalizedBlock]);

  const [
    blocks,
    setBlocks,
  ] = useState<IBlockStoreData[]>([]);

  const isLoading = blocks.length === 0;

  const goRouteId = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    const dataIndex = Number(e.currentTarget.dataset.index);
    const blockNumber = blocks[dataIndex].number;
    navigate(`/explorer/${blockNumber}`);
  }, [
    blocks,
    navigate,
  ]);

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
        isLoading
          ? <Loader />
          : (
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
      }
    </div>
  );
};

export default LatestBlocks;
