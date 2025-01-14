import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { ModalJSONViewer } from '@components/modals/modalJSONViewer';
import { PDScrollArea } from '@components/pdScrollArea';
import { Tabs } from '@components/tabs';
import { ToolTip } from '@components/tooltTip';
import { cn } from '@utils/helpers';

import type {
  IBlockExtrinsic,
  IMappedBlockBody,
  IMappedBlockEvent,
  IMappedBlockExtrinsic,
} from '@custom-types/block';

interface BlockBodyProps {
  bodyData: IMappedBlockBody;
  blockNumber: number;
  blockTimestamp: number;
}

export const BlockBody = (props: BlockBodyProps) => {
  const { bodyData, blockNumber, blockTimestamp } = props;
  const [
    JSONViewerModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalJSONViewer);

  const refContainer = useRef<HTMLDivElement | null>(null);

  const [
    modalData,
    setModalData,
  ] = useState<IMappedBlockEvent | IBlockExtrinsic | null>(null);
  const [
    initialTab,
    setInitialTab,
  ] = useState(0);
  const [
    showMoreExtrinsics,
    setShowMoreExtrinsics,
  ] = useState(false);
  const [
    showMoreEvents,
    setShowMoreEvents,
  ] = useState(false);

  const visibleExtrinsics = showMoreExtrinsics ? bodyData.extrinsics : bodyData.extrinsics.slice(0, 3);
  const visibleEvents = showMoreEvents ? bodyData.events : bodyData.events.slice(0, 3);

  const handleOpenModal = useCallback(async (e: React.MouseEvent<HTMLTableRowElement>) => {
    const type = e.currentTarget.getAttribute('data-type');
    const index = e.currentTarget.getAttribute('data-index');

    if (type === 'extrinsic' && index !== null) {
      setModalData(bodyData.extrinsics[Number(index)].extrinsicData);
    } else if (type === 'event' && index !== null) {
      setModalData(bodyData.events[Number(index)]);
    }

    toggleVisibility();
  }, [
    toggleVisibility,
    bodyData.extrinsics,
    bodyData.events,
  ]);

  const handleShowMore = useCallback((e: React.MouseEvent) => {
    const type = e.currentTarget.getAttribute('data-type');
    if (type === 'extrinsic') {
      setShowMoreExtrinsics(!showMoreExtrinsics);
    } else if (type === 'event') {
      setShowMoreEvents(!showMoreEvents);
    }

  }, [
    showMoreEvents,
    showMoreExtrinsics,
  ]);

  return (
    <div className="grid gap-4">
      <Tabs
        initialTab={initialTab}
        onChange={setInitialTab}
        refContainer={refContainer}
        tabClassName="px-2 py-2 mb-5"
        unmountOnHide={false}
      >
        <div
          data-title="Extrinsics"
        >
          <PDScrollArea className="w-80">
            <table className="w-full">
              <colgroup>
                <col className="min-w-28" />
                <col className="min-w-24" />
                <col className="min-w-24" />
                <col className="min-w-20" />
                <col className="min-w-24" />
                <col className="min-w-12" />
              </colgroup>
              <thead>
                <tr className={cn(
                  'bg-dev-purple-100 text-left',
                  'dark:bg-dev-black-900',
                )}
                >
                  <th className="py-4 pl-2 font-geist font-body2-bold">Extrinsic ID</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold">Height</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold">Time</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold">Result</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold">Action</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold" />
                </tr>
              </thead>
              <tbody>
                {
                  visibleExtrinsics.map((extrinsic: IMappedBlockExtrinsic, extrinsicIndex: number) => {
                    const extrinsicTimestamp = extrinsic.timestamp || blockTimestamp;
                    const timeAgo = extrinsicTimestamp && formatDistanceToNowStrict(
                      new Date(extrinsicTimestamp),
                      { addSuffix: true },
                    );
                    return (
                      <tr
                        key={extrinsic.id}
                        data-index={extrinsicIndex}
                        data-type="extrinsic"
                        onClick={handleOpenModal}
                        className={cn(
                          'pd-table-row',
                          ' text-dev-purple-600 dark:text-dev-purple-550',
                        )}
                      >
                        <td>{extrinsic.id}</td>
                        <td>{blockNumber}</td>
                        <td>{timeAgo}</td>
                        <td>
                          <Icon
                            name={extrinsic.isSuccess ? 'icon-checked' : 'icon-failed'}
                            size={[16]}
                            className={cn(
                              extrinsic.isSuccess ? 'text-dev-green-600' : 'text-dev-red-800',
                            )}
                          />
                        </td>
                        <td>
                          {extrinsic.extrinsicData.method.section}
                          {' '}
                          (
                          {extrinsic.extrinsicData.method.method}
                          )
                        </td>
                        <td>
                          <ToolTip text="Expand the view">
                            <span className="inline-flex">
                              <Icon
                                className="text-dev-black-1000 dark:text-dev-purple-50"
                                name="icon-expand"
                                size={[18]}
                              />
                            </span>
                          </ToolTip>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </PDScrollArea>
          {
            bodyData.extrinsics.length > 3 && (
              <div className="flex justify-center">
                <button
                  className="mt-4 font-geist font-body2-bold"
                  data-type="extrinsic"
                  onClick={handleShowMore}
                >
                  {showMoreExtrinsics ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )
          }
        </div>
        <div
          data-title="Events"
        >
          <PDScrollArea className="w-80">
            <table className="w-full">
              <colgroup>
                <col className="min-w-28" />
                <col className="min-w-36" />
                <col className="min-w-36" />
                <col className="min-w-10" />
              </colgroup>
              <thead>
                <tr className={cn(
                  'bg-dev-purple-100 text-left',
                  'dark:bg-dev-black-900',
                )}
                >
                  <th className="py-4 pl-2 font-geist font-body2-bold">Event ID</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold">Action</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold">Type</th>
                  <th className="py-4 pl-2 font-geist font-body2-bold" />
                </tr>
              </thead>
              <tbody>
                {
                  visibleEvents.map((event: IMappedBlockEvent, eventIndex: number) => (
                    <tr
                      key={eventIndex}
                      data-index={eventIndex}
                      data-type="event"
                      onClick={handleOpenModal}
                      className={cn(
                        'pd-table-row',
                        ' text-dev-purple-600 dark:text-dev-purple-550',
                      )}
                    >
                      <td>
                        {blockNumber}
                        -
                        {eventIndex}
                      </td>
                      <td>
                        {event.event.type}
                        {' '}
                        (
                        {event.event.value.type}
                        )
                      </td>
                      <td>{event.phase.type}</td>
                      <td>
                        <ToolTip text="Expand the view">
                          <span className="inline-flex">
                            <Icon
                              className="text-dev-black-1000 dark:text-dev-purple-50"
                              name="icon-expand"
                              size={[18]}
                            />
                          </span>
                        </ToolTip>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </PDScrollArea>
          {bodyData.events.length > 3 && (
            <div className="flex justify-center">
              <button
                className="mt-4 font-geist font-body2-bold"
                data-type="event"
                onClick={handleShowMore}
              >
                {showMoreEvents ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </div>
      </Tabs >
      <JSONViewerModal
        jsonData={modalData}
        onClose={toggleVisibility}
      />
    </div >
  );
};
