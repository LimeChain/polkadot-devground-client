import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  type ReactMouseEvent,
  useState,
} from 'react';

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
  onClick: (e: ReactMouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: ButtonProps) => {
  const { children, isActive, type, onClick } = props;

  return (
    <button
      data-filter-type={type}
      onClick={onClick}
      className={cn(
        'px-2 py-2.5 font-body2-regular hover:border-dev-pink-500',
        'text-dev-white-200',
        'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
        'duration-300 ease-in',
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
  const [selectedExtrinsic, setSelectedExtrinsic] = useState<any>(null);
  const [filter, setFilter] = useState<'extrinsics' | 'events'>('extrinsics');
  const [showMore, setShowMore] = useState(false);

  console.log(bodyData);

  const handleOpenModal = (data: IMappedBlockEvent | IMappedBlockExtrinsic) => {
    setSelectedExtrinsic(data);
    toggleVisibility();
  };

  const handleFilter = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const filterType = e.currentTarget.getAttribute('data-filter-type') as 'extrinsics' | 'events';
    if (filterType) {
      setFilter(filterType);
    }
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const currentItems = filter === 'extrinsics' ? bodyData.extrinsics : bodyData.events;
  const displayedItems = showMore ? currentItems : currentItems.slice(0, 3);
  const showMoreButton = currentItems.length > 3;

  return (
    <div className="grid gap-4">
      <div className="flex gap-6 px-2 font-geist dark:text-dev-black-800">
        <Button
          isActive={filter === 'extrinsics'}
          type="extrinsics"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={handleFilter}
        >
          Extrinsics
        </Button>
        <Button
          isActive={filter === 'events'}
          type="events"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={handleFilter}
        >
          Events
        </Button>
      </div>
      {filter === 'extrinsics' && (
        <table className="w-full">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr className="pd-table-head">
              <th>Extrinsic ID</th>
              <th>Hash</th>
              <th>Time</th>
              <th>Result</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((extrinsic: any) => {
              const timeAgo = extrinsic.timestamp && formatDistanceToNowStrict(
                new Date(extrinsic.timestamp),
                { addSuffix: true },
              );
              return (
                <tr
                  key={extrinsic.id}
                  className={cn('pd-table-row')}
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => handleOpenModal(extrinsic)}
                >
                  <td>{extrinsic.id}</td>
                  <td>{extrinsic.hash}</td>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {filter === 'events' && (
        <table className="w-full">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '2%' }} />
          </colgroup>
          <thead>
            <tr className="pd-table-head">
              <th>Event ID</th>
              <th>Extrinsic ID</th>
              <th>Action</th>
              <th>Type</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((event: any, eventIndex: number) => (
              <tr
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => handleOpenModal(event)}
                key={event.id}
                className={cn('pd-table-row')}
              >
                <td>{blockNumber}-{eventIndex}</td>
                <td>{event.extrinsicId || 'N/A'}</td>
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
      )}
      {showMoreButton && (
        // eslint-disable-next-line react/jsx-no-bind
        <button onClick={toggleShowMore} className="mt-4 font-geist font-body2-bold">
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
      {selectedExtrinsic && (
        <JSONViewerModal
          onClose={toggleVisibility}
          extrinsic={selectedExtrinsic}
        />
      )}
    </div>
  );
};
