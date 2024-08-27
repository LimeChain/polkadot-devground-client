import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { ModalShowJson } from '@components/modals/modalShowJson';
import { PageHeader } from '@components/pageHeader';
import { PDScrollArea } from '@components/pdScrollArea';
import { SearchBar } from '@components/searchBar';
import { useStoreChain } from '@stores';
import {
  cn,
  truncateAddress,
} from '@utils/helpers';

import type {
  IMappedBlockExtrinsic,
  IMappedTransferExtrinsic,
} from '@custom-types/block';

const SignedExtrinsics = () => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const chain = useStoreChain?.use?.chain?.();
  const latestBlock = useStoreChain?.use?.bestBlock?.();
  const [
    ShowJsonModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalShowJson);

  const refInitalExtrinsicsDisplayed = useRef(false);

  const [signedExtrinsics, setSignedExtrinsics] = useState<IMappedTransferExtrinsic[]>([]);
  const [selectedExtrinsic, setSelectedExtrinsic] = useState<IMappedTransferExtrinsic | null>(null);

  const filterTransferExtrinsics = useCallback((extrinsics: IMappedBlockExtrinsic[] = []) => {
    return extrinsics.filter(extrinsic => extrinsic.isSigned).reverse() as IMappedTransferExtrinsic[];
  }, []);

  // handle state resets on chain change
  useEffect(() => {
    refInitalExtrinsicsDisplayed.current = false;
    setSignedExtrinsics([]);

    return () => {
      refInitalExtrinsicsDisplayed.current = false;
      setSignedExtrinsics([]);
    };
  }, [chain]);

  const loadInitialData = useCallback(() => {
    blocksData.entries().forEach(entry => {
      const [, block] = entry;
      if (!block) {
        return;
      }
      const extrinsics = block.body.extrinsics;

      const signedExtrinsics = filterTransferExtrinsics(extrinsics);
      setSignedExtrinsics(extrinsics => ([
        ...signedExtrinsics,
        ...extrinsics,
      ]));

    });

  }, [
    blocksData,
    filterTransferExtrinsics,
  ]);

  const loadNewData = useCallback((blockNumber: number) => {
    const latestBlockData = blocksData.get(blockNumber);
    const signedExtrinsics = filterTransferExtrinsics(latestBlockData?.body.extrinsics);

    setSignedExtrinsics(extrinsics => ([
      ...signedExtrinsics,
      ...extrinsics,
    ]));

  }, [
    blocksData,
    filterTransferExtrinsics,
  ]);

  useEffect(() => {
    if (!latestBlock) {
      return;
    }

    if (!refInitalExtrinsicsDisplayed.current) {
      refInitalExtrinsicsDisplayed.current = true;
      loadInitialData();
    } else {
      loadNewData(latestBlock);
    }

  }, [
    latestBlock,
    blocksData,
    filterTransferExtrinsics,
    loadInitialData,
    loadNewData,
  ]);

  const handleOpenModal = (extrinsic: IMappedTransferExtrinsic) => {
    const rawExtrinsic = Object.fromEntries(
      Object.entries(extrinsic).filter(([key]) => {
        switch (key) {
          case 'isSigned':
          case 'isSuccess':
            return false;
          default:
            return true;
        }
      }),
    );

    setSelectedExtrinsic(rawExtrinsic as IMappedTransferExtrinsic);
    toggleVisibility();
  };

  const handleCloseModal = useCallback(() => {
    setSelectedExtrinsic(null);
    toggleVisibility();
  }, [toggleVisibility]);

  return (
    <div className="grid h-full grid-rows-[40px_46px_1fr] gap-6">
      <PageHeader title="Signed Extrinsics" />
      <SearchBar label="Search by Block"/>
      <PDScrollArea
        className="h-full"
        verticalScrollClassNames="pt-8"
      >
        <table className="explorer-pages-table">
          <colgroup>
            <col style={{ width: '10%', minWidth: '8rem' }} />
            <col style={{ width: '10%', minWidth: '8rem' }} />
            <col style={{ width: '10%', minWidth: '10rem' }} />
            <col style={{ width: '10%', minWidth: '10rem' }} />
            <col style={{ width: '5%', minWidth: '6rem' }} />
            <col style={{ width: '10%', minWidth: '10rem' }} />
            <col style={{ width: '1%', minWidth: '6rem' }} />
          </colgroup>
          <tr className="table-head">
            <th>Extrinsic ID</th>
            <th>Block</th>
            <th>Signer</th>
            <th>Time</th>
            <th>Result</th>
            <th>Action</th>
            <th />
          </tr>
          {
            signedExtrinsics.map((extrinsic, extrinsicIndex) => {
              const timeAgo = extrinsic.timestamp && formatDistanceToNowStrict(
                new Date(extrinsic.timestamp),
                { addSuffix: true },
              );

              return (
                <tr
                  key={extrinsic.id}
                  className={cn(
                    'table-row',
                    {
                      ['opacity-0 animate-fade-in animation-duration-500 animation-delay-500']: extrinsicIndex === 0,
                    },
                  )}
                >
                  <td>{extrinsic.id}</td>
                  <td>{extrinsic.blockNumber}</td>
                  <td>{truncateAddress(extrinsic.signer.Id, 6)}</td>
                  <td>{timeAgo}</td>
                  <td>{
                    extrinsic.isSuccess
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
                          name="icon-failed"
                          className="text-dev-red-800"
                        />
                      )}
                  </td>
                  <td>{extrinsic.method.method}</td>
                  <td>
                    <button
                      className={cn(
                        'px-3 py-1',
                        'bg-dev-purple-700 text-dev-purple-300',
                        'transition-all duration-300 hover:bg-dev-purple-900',
                        'dark:bg-dev-purple-50 dark:text-dev-black-1000 dark:hover:bg-dev-purple-200',
                      )}
                      // eslint-disable-next-line react/jsx-no-bind
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(extrinsic);
                      }}
                    >
                      <span className="font-geist font-body3-bold">
                          Details
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </table >
      </PDScrollArea >
      {selectedExtrinsic && (
        <ShowJsonModal onClose={handleCloseModal} data={selectedExtrinsic} />
      )}
    </div>

  );
};

export default SignedExtrinsics;
