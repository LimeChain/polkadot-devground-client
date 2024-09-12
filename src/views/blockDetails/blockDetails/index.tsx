import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { formatDistanceToNowStrict } from 'date-fns';
import { useState } from 'react';

import { Icon } from '@components/icon';
import { ModalShowJson } from '@components/modals/modalShowJson';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

const Button = (props: IButtonProps) => {
  const { children, isActive, type, onClick } = props;
  return (
    <button
      data-filter-type={type}
      onClick={onClick}
      className={cn(
        'px-2 py-2.5 font-body2-regular hover:border-dev-pink-500',
        'text-dev-white-400 ',
        'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
        'duration-300 ease-in',
        isActive && 'border-b-dev-pink-500',
      )}
    >
      {children}
    </button>
  );
};

export const Test = (props) => {
  const { blockDetails, isFinalized, blockNumber } = props;
  const [ShowJsonModal, toggleVisibility] = useToggleVisibility(ModalShowJson);
  const [selectedExtrinsic, setSelectedExtrinsic] = useState(null);
  const [filter, setFilter] = useState('extrinsics');

  const handleExtrinsicClick = (extrinsic) => {
    const data = JSON.stringify(extrinsic, null, 2);
    console.log(data);
    // setSelectedExtrinsic(extrinsic);
    // toggleVisibility();
  };

  const handleFilter = (type) => {
    setFilter(type);
  };

  console.log(blockDetails);
  return (
    <>
      <div className="flex gap-2 border-b border-dev-purple-700 px-2 font-geist dark:border-dev-purple-300 dark:text-dev-black-800">
        <Button
          isActive={filter === 'extrinsics'}
          type="extrinsics"
          onClick={() => handleFilter('extrinsics')}
        >
          Extrinsics
        </Button>
        <Button
          isActive={filter === 'events'}
          type="events"
          onClick={() => handleFilter('events')}
        >
          Events
        </Button>
      </div>
      <PDScrollArea
        className="table-container"
        verticalScrollClassNames="pt-8"
      >
        {filter === 'extrinsics' && (
          <table className="w-full">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <tr className="pd-table-head">
              <th>Extrinsic ID</th>
              <th>Hash</th>
              <th>Time</th>
              <th>Result</th>
              <th>Action</th>
            </tr>
            {
              blockDetails.extrinsics.map((extrinsic, extrinsicIndex) => {
                const timeAgo = extrinsic.timestamp && formatDistanceToNowStrict(
                  new Date(extrinsic.timestamp),
                  { addSuffix: true },
                );
                return (
                  <tr
                    key={extrinsic.id}
                    className={cn('pd-table-row')}
                    onClick={() => handleExtrinsicClick(extrinsic)}
                  >
                    <td>{extrinsic.id}</td>
                    <td>{extrinsic.hash}</td>
                    <td>{timeAgo}</td>
                    <td>
                      {
                        isFinalized
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
              })
            }
          </table>
        )}
        {filter === 'events' && (
          <table className="w-full">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <tr className="pd-table-head">
              <th>Event ID</th>
              <th>Extrinsic ID</th>
              <th>Action</th>
              <th>Type</th>
            </tr>
            {
              blockDetails.events.map((event, eventIndex) => {
                const timeAgo = event.timestamp && formatDistanceToNowStrict(
                  new Date(event.timestamp),
                  { addSuffix: true },
                );
                return (
                  <tr
                    onClick={() => handleExtrinsicClick(event)}
                    key={event.id}
                    className={cn('pd-table-row')}
                  >
                    <td>{blockNumber}-{eventIndex}</td>
                    <td>12312 </td>
                    <td>{event.event.type} ({event.event.value.type})</td>
                    <td>{event.phase.type}</td>
                  </tr>
                );
              })
            }
          </table>
        )}
      </PDScrollArea>
      {selectedExtrinsic && (
        <ShowJsonModal
          onClose={toggleVisibility}
          extrinsic={selectedExtrinsic}
        />
      )}
    </>
  );
};
