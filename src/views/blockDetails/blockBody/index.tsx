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
  IMappedBlockBody,
  IMappedBlockEvent,
  IMappedBlockExtrinsic,
} from '@custom-types/block';

interface BlockBodyProps {
  bodyData: IMappedBlockBody;
  blockNumber: number;
}

export const BlockBody = (props: BlockBodyProps) => {
  const { bodyData, blockNumber } = props;
  const [JSONViewerModal, toggleVisibility] = useToggleVisibility(ModalJSONViewer);

  const refContainer = useRef<HTMLDivElement | null>(null);

  const [modalData, setModalData] = useState<IMappedBlockEvent | IMappedBlockExtrinsic | null>(null);
  const [initialTab, setInitialTab] = useState(0);
  const [showMoreExtrinsics, setShowMoreExtrinsics] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  const visibleExtrinsics = showMoreExtrinsics ? bodyData.extrinsics : bodyData.extrinsics.slice(0, 3);
  const visibleEvents = showMoreEvents ? bodyData.events : bodyData.events.slice(0, 3);

  const handleOpenModal = useCallback((event: React.MouseEvent<HTMLTableRowElement>) => {
    const type = event.currentTarget.getAttribute('data-type');
    const index = event.currentTarget.getAttribute('data-index');

    if (type === 'extrinsic' && index !== null) {
      setModalData(bodyData.extrinsics[Number(index)]);
    } else if (type === 'event' && index !== null) {
      setModalData(bodyData.events[Number(index)]);
    }

    toggleVisibility();
  }, [toggleVisibility, bodyData.extrinsics, bodyData.events]);

  return (
    <div className="grid gap-4">
      <Tabs
        refContainer={refContainer}
        initialTab={initialTab}
        onChange={setInitialTab}
        unmountOnHide={false}
        tabClassName="px-2 py-2 mb-5"
      >
        <div
          data-title="Extrinsics"
          className="overflow-x-auto"
        >
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
                  const timeAgo = extrinsic.timestamp && formatDistanceToNowStrict(
                    new Date(extrinsic.timestamp),
                    { addSuffix: true },
                  );
                  return (
                    <tr
                      key={extrinsic.id}
                      className={cn(
                        'pd-table-row',
                        ' text-dev-purple-600 dark:text-dev-purple-550',
                      )}
                      data-type="extrinsic"
                      data-index={extrinsicIndex}
                      onClick={handleOpenModal}
                    >
                      <td>{extrinsic.id}</td>
                      <td>{blockNumber}</td>
                      <td>{timeAgo}</td>
                      <td>
                        <Icon
                          size={[16]}
                          name={extrinsic.isSuccess ? 'icon-checked' : 'icon-clock'}
                          className={cn(
                            extrinsic.isSuccess ? 'text-dev-green-600' : 'animate-rotate text-dev-yellow-700',
                          )}
                        />
                      </td>
                      <td>{extrinsic.method.section} ({extrinsic.method.method})</td>
                      <td>
                        <Icon
                          size={[18]}
                          name="icon-dropdownArrow"
                          className="text-dev-black-1000 dark:text-dev-purple-50"
                        />
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          {
            bodyData.extrinsics.length > 3 && (
              <div className="flex justify-center">
                <button
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => setShowMoreExtrinsics(!showMoreExtrinsics)}
                  className="mt-4 font-geist font-body2-bold"
                >
                  {showMoreExtrinsics ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )
          }
        </div>
        <div
          data-title="Events"
          className="overflow-x-auto"
        >
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
                    data-type="event"
                    data-index={eventIndex}
                    onClick={handleOpenModal}
                    className={cn(
                      'pd-table-row',
                      ' text-dev-purple-600 dark:text-dev-purple-550',
                    )}
                  >
                    <td>{blockNumber}-{eventIndex}</td>
                    <td>{event.event.type} ({event.event.value.type})</td>
                    <td>{event.phase.type}</td>
                    <td>
                      <Icon
                        size={[18]}
                        name="icon-dropdownArrow"
                        className="text-dev-black-1000 dark:text-dev-purple-50"
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {bodyData.events.length > 3 && (
            <div className="flex justify-center">
              <button
                className="mt-4 font-geist font-body2-bold"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => setShowMoreEvents(!showMoreEvents)}
              >
                {showMoreEvents ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </div>
      </Tabs>
      <JSONViewerModal
        onClose={toggleVisibility}
        jsonData={modalData}
      />
    </div>
  );
};
