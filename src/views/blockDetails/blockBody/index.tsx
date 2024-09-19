/* eslint-disable react/jsx-no-bind */
import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import { useState } from 'react';

import { Icon } from '@components/icon';
import { ModalJSONViewer } from '@components/modals/modalJSONViewer';
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

interface ButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  type: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: ButtonProps) => {
  const { children, isActive, type, onClick } = props;

  return (
    <button
      data-filter-type={type}
      onClick={onClick}
      className={cn(
        'px-2 py-2.5',
        'font-geist font-body2-regular',
        'duration-300 ease-in',
        'border-b-2 border-b-transparent',
        'hover:border-dev-pink-500 ',
        'dark:text-dev-white-200',
        isActive && 'border-b-dev-pink-500',
      )}
    >
      {children}
    </button>
  );
};

export const BlockBody = (props: BlockBodyProps) => {
  const { bodyData, blockNumber } = props;
  const [JSONViewerModal, toggleVisibility] = useToggleVisibility(ModalJSONViewer);
  const [modalData, setModalData] = useState<IMappedBlockEvent | IMappedBlockExtrinsic | null>(null);
  const [filter, setFilter] = useState<'extrinsics' | 'events'>('extrinsics');
  const [showMore, setShowMore] = useState(false);

  const handleOpenModal = (data: IMappedBlockEvent | IMappedBlockExtrinsic) => {
    setModalData(data);
    toggleVisibility();
  };

  const handleFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const filterType = e.currentTarget.getAttribute('data-filter-type') as 'extrinsics' | 'events';
    if (filterType) {
      setFilter(filterType);
      setShowMore(false);
    }
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const visibleExtrinsics = showMore ? bodyData.extrinsics : bodyData.extrinsics.slice(0, 2);
  const visibleEvents = showMore ? bodyData.events : bodyData.events.slice(0, 3);

  const isMoreContentAvailable =
    (filter === 'extrinsics' && bodyData.extrinsics.length > 2)
    || (filter === 'events' && bodyData.events.length > 3);

  return (
    <div className="grid gap-4">
      <div className="flex gap-6 px-2">
        <Button
          isActive={filter === 'extrinsics'}
          type="extrinsics"
          onClick={handleFilter}
        >
          Extrinsics
        </Button>
        <Button
          isActive={filter === 'events'}
          type="events"
          onClick={handleFilter}
        >
          Events
        </Button>
      </div>
      {filter === 'extrinsics' && (
        <div className="overflow-x-auto">
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
              {visibleExtrinsics.map((extrinsic: IMappedBlockExtrinsic) => {
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
                    onClick={() => handleOpenModal(extrinsic)}
                  >
                    <td>{extrinsic.id}</td>
                    <td>{blockNumber}</td>
                    <td>{timeAgo}</td>
                    <td>
                      {extrinsic.isSuccess
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
                            name="icon-clock"
                            className="animate-rotate text-dev-yellow-700"
                          />
                        )
                      }
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
              })}
            </tbody>
          </table>
        </div>
      )}
      {filter === 'events' && (
        <div className="overflow-x-auto">
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
              {visibleEvents.map((event: IMappedBlockEvent, eventIndex: number) => (
                <tr
                  key={eventIndex}
                  className={cn(
                    'pd-table-row',
                    ' text-dev-purple-600 dark:text-dev-purple-550',
                  )}
                  onClick={() => handleOpenModal(event)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isMoreContentAvailable && (
        <button onClick={toggleShowMore} className="mt-4 font-geist font-body2-bold">
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
      {modalData && (
        <JSONViewerModal
          onClose={toggleVisibility}
          jsonData={modalData}
          title={filter === 'extrinsics' ? 'Extrinsic Details' : 'Event Details'}
        />
      )}
    </div>
  );
};
