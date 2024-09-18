import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ModalJSONViewer } from '@components/modals/modalJSONViewer';
import { PDScrollArea } from '@components/pdScrollArea';
import { useStoreChain } from '@stores';
import { polymorphicComponent } from '@utils/components';
import { cn } from '@utils/helpers';
import { useMergedRefs } from '@utils/hooks/useMergedRefs';

import styles from '../styles.module.css';

import { Row } from './row';

import type { IMappedBlockExtrinsic } from '@custom-types/block';

export const ExtrinsicsList = polymorphicComponent<'div'>((_props, ref) => {
  const refScrollArea = useRef<HTMLDivElement>(null);
  const refs = useMergedRefs(ref, refScrollArea);

  const refSelectedExtrinsic = useRef<IMappedBlockExtrinsic | undefined>();

  const blocksData = useStoreChain?.use?.blocksData?.();
  const latestBlock = useStoreChain?.use?.bestBlock?.();

  const [JSONViewerModal, toggleVisibility] = useToggleVisibility(ModalJSONViewer);

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

  const rowVirtualizer = useVirtualizer({
    count: signedExtrinsics.length,
    getScrollElement: () => refScrollArea?.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  return (
    <>
      <PDScrollArea
        ref={refs}
        className="h-80 lg:h-full"
        viewportClassNames="pr-3"
      >
        <div
          className="relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {
            (!!signedExtrinsics.length)
              ? (
                rowVirtualizer.getVirtualItems().map((virtualRow, virtualIndex) => {
                  const extrinsic = signedExtrinsics[virtualRow.index];
                  return (
                    <Row
                      key={virtualIndex}
                      handleOpenModal={handleOpenModal}
                      extrinsicId={extrinsic.id}
                      action={`${extrinsic.method.section}.${extrinsic.method.method}`}
                      isSuccess={extrinsic.isSuccess}
                      timestamp={extrinsic.timestamp}
                      className={cn(
                        styles['pd-explorer-list'],
                        {
                          ['opacity-0 animate-fade-in animation-duration-500']: virtualRow.index === 0,
                        },
                      )}
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    />
                  );
                })
              )
              : 'Loading...'
          }
        </div>
      </PDScrollArea>
      {
        refSelectedExtrinsic.current && (
          <JSONViewerModal
            onClose={toggleVisibility}
            jsonData={refSelectedExtrinsic.current}
            title="Extrinsic Details"
          />
        )
      }
    </>
  );
});

ExtrinsicsList.displayName = 'ExtrinsicsList';
