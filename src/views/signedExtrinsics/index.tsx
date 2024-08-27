import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PageHeader } from '@components/pageHeader';
import { PDScrollArea } from '@components/pdScrollArea';
import { SearchBar } from '@components/searchBar';
import { useStoreChain } from '@stores';
import { truncateAddress } from '@utils/helpers';

import type {
  IMappedBlockExtrinsic,
  IMappedTransferExtrinsic,
} from '@custom-types/block';

const SignedExtrinsics = () => {
  const blocksData = useStoreChain?.use?.blocksData?.();

  const chain = useStoreChain?.use?.chain?.();
  const latestBlock = useStoreChain?.use?.bestBlock?.();

  const refInitalExtrinsicsDisplayed = useRef(false);

  const [signedExtrinsics, setSignedExtrinsics] = useState<IMappedTransferExtrinsic[]>([]);

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

  console.log(signedExtrinsics);
  return (
    <>
      <PageHeader title="Signed Extrinsics" />
      <SearchBar
        label="Search by Block"
        classNames="mt-6"
      />
      <PDScrollArea
        className="table-container"
        verticalScrollClassNames="pt-8"
      >
        <table className="explorer-pages-table">
          <thead>
            <tr>
              <th>Extrinsic ID</th>
              <th>Block</th>
              <th>Signer</th>
              <th>Time</th>
              <th>Result</th>
              <th>Action</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              signedExtrinsics.map((extrinsic, idx) => {
                const timeAgo = extrinsic.timestamp && formatDistanceToNowStrict(
                  new Date(extrinsic.timestamp),
                  { addSuffix: true },
                );
                return (
                  <tr key={idx}>
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
                    <td />
                  </tr>
                );
              })
            }
          </tbody>
        </table >
      </PDScrollArea >
    </>
  );
};

export default SignedExtrinsics;
