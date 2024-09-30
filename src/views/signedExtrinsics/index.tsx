import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
import { ModalJSONViewer } from '@components/modals/modalJSONViewer';
import { PageHeader } from '@components/pageHeader';
import { SearchBar } from '@components/searchBar';
import TableComponent from '@components/table';
import { useStoreChain } from '@stores';
import {
  cn,
  truncateAddress,
} from '@utils/helpers';

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

  const handleOpenModal = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    const dataIndex = Number(e.currentTarget.dataset.index);
    const typedRow = signedExtrinsics[dataIndex] as unknown as IMappedBlockExtrinsic | IMappedBlock;

    if ('header' in typedRow) {
      const blockNumber = typedRow.header.number;
      refSelectedExtrinsic.current = signedExtrinsics.find((extrinsic) => extrinsic.blockNumber === blockNumber);
    } else {
      refSelectedExtrinsic.current = typedRow;
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

  const columns = useMemo(() => {
    const result: ColumnDef<IMappedBlockExtrinsic>[] = [
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
        cell: ({ row }) => {
          return truncateAddress(row.original.signer?.Id, 6);
        },
      },
      {
        header: 'Time',
        accessorKey: 'timestamp',
        cell: ({ row }) => {
          return row.original.timestamp
            && formatDistanceToNowStrict(new Date(row.original.timestamp), { addSuffix: true });
        },
      },
      {
        header: 'Result',
        accessorKey: 'isSuccess',
        cell: ({ row }) => {
          const isSuccess = row.original.isSuccess;

          return (
            <Icon
              name={isSuccess ? 'icon-checked' : 'icon-failed'}
              size={[16]}
              className={cn(
                {
                  ['text-dev-green-600']: isSuccess,
                  ['text-dev-red-800']: !isSuccess,
                },
              )}
            />
          );
        },
      },
      {
        header: 'Action',
        accessorKey: 'method.method',
      },
      {
        header: '',
        accessorKey: 'dropdown',
        cell: () => {
          return (
            <Icon
              className="text-dev-black-1000 dark:text-dev-purple-50"
              name="icon-dropdownArrow"
              size={[18]}
            />
          );
        },
      },
    ];

    return result;
  }, []);

  return (
    <div className="disable-vertical-scroll grid h-full grid-rows-[40px_46px_1fr] gap-8">
      <PageHeader title="Extrinsics" />
      <SearchBar
        label="Search by Block"
        type="extrinsics"
      />

      {
        isLoading
          ? <Loader />
          : (
            <TableComponent
              columns={columns}
              data={signedExtrinsics}
              onRowClick={handleOpenModal}
            />
          )
      }

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
