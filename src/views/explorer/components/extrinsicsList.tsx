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
import { PDScrollArea } from '@components/pdScrollArea';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import styles from '../styles.module.css';

import type { IMappedBlockExtrinsic } from '@custom-types/block';

export const ExtrinsicsList = () => {
  const refSelectedExtrinsic = useRef<IMappedBlockExtrinsic | undefined>();

  const blocksData = useStoreChain?.use?.blocksData?.();
  const chain = useStoreChain?.use?.chain?.();
  const latestBlock = useStoreChain?.use?.bestBlock?.();
  const [ShowJsonModal, toggleVisibility] = useToggleVisibility(ModalShowJson);

  const [signedExtrinsics, setSignedExtrinsics] = useState<IMappedBlockExtrinsic[]>([]);

  const handleOpenModal = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    const extrinsicId = e.currentTarget.getAttribute('data-extrinsic-id');
    refSelectedExtrinsic.current = signedExtrinsics.find(extrinsic => extrinsic.id === extrinsicId);
    toggleVisibility();
  }, [signedExtrinsics, toggleVisibility]);

  useEffect(() => {
    const extrinsics = Array.from(blocksData.values())
      .flatMap(block => block?.body?.extrinsics?.slice(2) ?? [])
      .reverse();

    setSignedExtrinsics(extrinsics);
  }, [blocksData, latestBlock]);

  return (
    <>
      <PDScrollArea
        className="h-80 lg:h-full"
        viewportClassNames="py-3"
        verticalScrollClassNames="py-3"
      >
        {
          signedExtrinsics.map((extrinsic, extrinsicIndex) => (
            <div
              key={`latest-signed-extrinsic-${extrinsic.id}-${chain.id}`}
              data-extrinsic-id={extrinsic.id}
              className={cn(
                'grid grid-cols-[1fr_theme(width.32)]',
                styles['pd-explorer-list'],
                {
                  ['opacity-0 animate-fade-in']: extrinsicIndex === 0,
                },
              )}
              onClick={handleOpenModal}
            >
              <div>
                <p>
                  <span className="text-dev-black-300 dark:text-dev-purple-300">
                  Extrinsic#
                  </span>
                  <strong className="font-body1-bold">
                    {' '}{extrinsic.id}
                  </strong>
                </p>
                <p>
                  <span className="text-dev-black-300 dark:text-dev-purple-300">Action: </span>
                  {extrinsic.method.section}.{extrinsic.method.method}
                </p>
              </div>
              <div>
                <span className="flex justify-end gap-1 font-body1-bold">
                  {
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
                      )
                  }
                </span>
                <span>
                  {formatDistanceToNowStrict(extrinsic.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        }
        {
          !latestBlock
          && 'Loading...'
        }
      </PDScrollArea>
      {
        refSelectedExtrinsic.current && (
          <ShowJsonModal
            onClose={toggleVisibility}
            extrinsic={refSelectedExtrinsic.current}
          />
        )
      }
    </>
  );
};
