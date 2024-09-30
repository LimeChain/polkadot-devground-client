import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { ModalJSONViewer } from '@components/modals/modalJSONViewer';
import { PageHeader } from '@components/pageHeader';
import { SearchBar } from '@components/searchBar';
import TableComponent from '@components/table';
import { useStoreChain } from '@stores';
import { truncateAddress } from '@utils/helpers';

import type {
  IMappedBlock,
  IMappedBlockExtrinsic,
} from '@custom-types/block';
import type { ColumnDef } from '@tanstack/react-table';

const SignedExtrinsics = () => {

  const refSelectedExtrinsic = useRef<IMappedBlockExtrinsic | undefined>();

  const blocksData = useStoreChain?.use?.blocksData?.();
  const latestBlock = useStoreChain?.use?.bestBlock?.();
  const [
    JSONViewerModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalJSONViewer);

  const [
    signedExtrinsics,
    setSignedExtrinsics,
  ] = useState<IMappedBlockExtrinsic[]>([]);
  const isLoading = blocksData.size === 0;

  const handleOpenModal = useCallback((row: IMappedBlockExtrinsic | IMappedBlock) => {
    if ('header' in row) {
      const blockNumber = row.header.number;
      refSelectedExtrinsic.current = signedExtrinsics.find((extrinsic) => extrinsic.blockNumber === blockNumber);
    } else {
      refSelectedExtrinsic.current = row;
    }
    toggleVisibility();
  }, [
    signedExtrinsics,
    toggleVisibility,
  ]);

  useEffect(() => {
    const extrinsics = Array.from(blocksData.values())
      .flatMap((block) => block?.body?.extrinsics?.slice(2) ?? [])
      .reverse();

    setSignedExtrinsics(extrinsics);
  }, [
    blocksData,
    latestBlock,
  ]);

  const columns: ColumnDef<IMappedBlockExtrinsic>[] = [
    {
      header: 'Extrinsic ID',
      accessorKey: 'id',
    },
    {
      header: 'Block',
      accessorKey: 'blockNumber',
    },
    {
      header: 'Signer',
      accessorKey: 'signer',
      cell: ({ row }) => truncateAddress(row.original.signer?.Id, 6),
    },
    {
      header: 'Time',
      accessorKey: 'timestamp',
      cell: ({ row }) => row.original.timestamp && formatDistanceToNowStrict(new Date(row.original.timestamp), { addSuffix: true }),
    },
    {
      header: 'Result',
      accessorKey: 'isSuccess',
      cell: ({ row }) => row.original.isSuccess
        ? (
          <Icon
            className="text-dev-green-600"
            name="icon-checked"
            size={[16]}
          />
        )
        : (
          <Icon
            className="text-dev-red-800"
            name="icon-failed"
            size={[16]}
          />
        ),
    },
    {
      header: 'Action',
      accessorKey: 'method.method',
    },
    {
      header: '',
      accessorKey: 'dropdown',
      cell: () => (
        <Icon
          className="text-dev-black-1000 dark:text-dev-purple-50"
          name="icon-dropdownArrow"
          size={[18]}
        />
      ),
    },
  ];

  return (
    <div className="disable-vertical-scroll grid h-full grid-rows-[40px_46px_1fr] gap-8">
      <PageHeader title="Extrinsics" />
      <SearchBar
        label="Search by Block"
        type="extrinsics"
      />

      {isLoading
        ? 'Loading...'
        : (
          <TableComponent
            columns={columns}
            data={signedExtrinsics}
            onRowClick={handleOpenModal}
          />
        )}

      {
        refSelectedExtrinsic.current && (
          <JSONViewerModal
            jsonData={refSelectedExtrinsic.current}
            onClose={toggleVisibility}
            title="Extrinsic Details"
          />
        )
      }
    </div>
  );
};

export default SignedExtrinsics;
