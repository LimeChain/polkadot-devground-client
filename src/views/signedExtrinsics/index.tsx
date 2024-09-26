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
import { PDScrollArea } from '@components/pdScrollArea';
import { SearchBar } from '@components/searchBar';
import { useStoreChain } from '@stores';
import {
  cn,
  truncateAddress,
} from '@utils/helpers';

import type { IMappedBlockExtrinsic } from '@custom-types/block';

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
    const extrinsicId = e.currentTarget.getAttribute('data-extrinsic-id');
    refSelectedExtrinsic.current = signedExtrinsics.find((extrinsic) => extrinsic.id === extrinsicId);
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

  return (
    <div className="grid h-full grid-rows-[40px_46px_1fr] gap-8">
      <PageHeader title="Extrinsics" />
      <SearchBar
        label="Search by Block"
        type="extrinsics"
      />
      <PDScrollArea
        className="h-full"
        verticalScrollClassNames="pt-8"
      >
        <table>
          <colgroup>
            <col style={{ width: '10%', minWidth: '8rem' }} />
            <col style={{ width: '10%', minWidth: '8rem' }} />
            <col style={{ width: '10%', minWidth: '10rem' }} />
            <col style={{ width: '10%', minWidth: '10rem' }} />
            <col style={{ width: '5%', minWidth: '6rem' }} />
            <col style={{ width: '10%', minWidth: '10rem' }} />
            <col style={{ width: '1%', minWidth: '6rem' }} />
          </colgroup>
          <tr className="pd-table-head">
            <th>Extrinsic ID</th>
            <th>Block</th>
            <th>Signer</th>
            <th>Time</th>
            <th>Result</th>
            <th>Action</th>
            <th />
          </tr>
          {
            isLoading
              ? 'Loading...'
              : (
                signedExtrinsics.map((extrinsic, extrinsicIndex) => {
                  const timeAgo = extrinsic.timestamp && formatDistanceToNowStrict(
                    new Date(extrinsic.timestamp),
                    { addSuffix: true },
                  );

                  return (
                    <tr
                      key={extrinsic.id}
                      data-extrinsic-id={extrinsic.id}
                      onClick={handleOpenModal}
                      className={cn(
                        'pd-table-row',
                        {
                          ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: extrinsicIndex === 0,
                        },
                      )}
                    >
                      <td>{extrinsic.id}</td>
                      <td>{extrinsic.blockNumber}</td>
                      <td>{truncateAddress(extrinsic.signer?.Id, 6)}</td>
                      <td>{timeAgo}</td>
                      <td>
                        {
                          extrinsic.isSuccess
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
                            )}
                      </td>
                      <td>{extrinsic.method.method}</td>
                      <td>
                        <Icon
                          className="text-dev-black-1000 dark:text-dev-purple-50"
                          name="icon-dropdownArrow"
                          size={[18]}
                        />
                      </td>
                    </tr>
                  );
                })
              )
          }
        </table>
      </PDScrollArea>

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
