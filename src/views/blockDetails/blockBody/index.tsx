import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { ModalJSONViewer } from '@components/modals/modalJSONViewer';
import { Tabs } from '@components/tabs';
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
  showMore: boolean;
  selectedTab: 'extrinsics' | 'events';
  onTabChange: (tab: 'extrinsics' | 'events') => void;
}

export const BlockBody = (props: BlockBodyProps) => {
  const { bodyData, blockNumber, blockTimestamp, showMore, selectedTab, onTabChange } = props;
  const [
    JSONViewerModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalJSONViewer);

  const refContainer = useRef<HTMLDivElement | null>(null);

  const [
    modalData,
    setModalData,
  ] = useState<IMappedBlockEvent | IBlockExtrinsic | null>(null);

  const visibleExtrinsics = showMore ? bodyData.extrinsics : bodyData.extrinsics.slice(0, 3);
  const visibleEvents = showMore ? bodyData.events : bodyData.events.slice(0, 3);

  const tabIndex = selectedTab === 'extrinsics' ? 0 : 1;

  const handleOnTabChange = useCallback(
    (index: number) => onTabChange(index === 0 ? 'extrinsics' : 'events'),
    [onTabChange],
  );

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

  return (
    <div className="grid gap-4 overflow-auto">
      <Tabs
        initialTab={tabIndex}
        onChange={handleOnTabChange}
        refContainer={refContainer}
        tabClassName="px-2 py-2 mb-5 sticky left-0 last:left-24 sm:relative sm:last:left-0"
        unmountOnHide={false}
      >
        <div
          data-title="Extrinsics"
        >
          <table className="mb-4 w-full">
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
                        <Icon
                          className="text-dev-black-1000 dark:text-dev-purple-50"
                          name="icon-dropdownArrow"
                          size={[18]}
                        />
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        <div
          data-title="Events"
        >
          <table className="mb-4 w-full">
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
                      <Icon
                        className="text-dev-black-1000 dark:text-dev-purple-50"
                        name="icon-dropdownArrow"
                        size={[18]}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </Tabs>
      <JSONViewerModal
        jsonData={modalData}
        onClose={toggleVisibility}
      />
    </div>
  );
};
