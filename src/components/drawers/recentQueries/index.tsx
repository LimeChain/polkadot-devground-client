import { busDispatch } from '@pivanov/event-bus';
import { formatDistanceToNowStrict } from 'date-fns';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDDrawer } from '@components/pdDrawer';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';
import { getRecentQueries } from '@utils/recentQueries';

import styles from './styles.module.css';

import type {
  TCategory,
  TRecentQuery,
} from '@custom-types/recentQueries';

interface QueryItemProps {
  item: TRecentQuery;
}

interface RecentQueriesDrawerProps {
  category: TCategory;
  isOpen: boolean;
  handleClose: () => void;
}

export const RecentQueriesDrawer = (props: RecentQueriesDrawerProps) => {
  const {
    category,
    isOpen,
    handleClose,
  } = props;
  const chain = useStoreChain.use.chain?.();

  const [
    items,
    setItems,
  ] = useState<TRecentQuery[]>([]);

  // recent queries logic
  useEffect(() => {
    if (!isOpen) return;
    void (async () => {
      getRecentQueries({
        chainId: chain.id,
        category,
      })
        .then((res) => setItems(res))
        .catch(console.log);
    })();
  }, [
    isOpen,
    chain.id,
    category,
  ]);

  const handleRunRecentQuery = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const queryId = e.currentTarget.getAttribute('data-query-id');
    busDispatch({
      type: '@@-recent-query',
      data: items.find((item) => item.id === queryId),
    });
    handleClose();
  }, [
    handleClose,
    items,
  ]);

  const displayTimestamp = useCallback((time: number) => {
    if (time) {
      return formatDistanceToNowStrict(new Date(time), { addSuffix: true });
    } else {
      return 'undefined';
    }
  }, []);

  return (
    <Fragment>
      <PDDrawer
        isOpen={isOpen}
        onClose={handleClose}
        position="right"
      >
        <div className={cn(
          'flex flex-col break-all p-4 text-black md:min-w-96',
        )}
        >
          <div className={styles.drawerHeader}>
            <p className={styles.drawerTitle}>Latest Activity</p>
            <div
              onClick={handleClose}
              className={cn(
                'cursor-pointer duration-300 ease-out',
                'bg-dev-purple-700 p-2 dark:bg-dev-purple-50',
                'hover:bg-dev-purple-900 hover:dark:bg-dev-purple-200',
              )}
            >
              <Icon
                className="text-dev-white-200 dark:text-dev-purple-700"
                name="icon-close"
              />
            </div>
          </div>
          {
            !!items.length
              ? items.map((item) => (
                <button
                  key={`recent-query-button-${item.id}`}
                  data-query-id={item.id}
                  onClick={handleRunRecentQuery}
                  className={cn(
                    'items-left',
                    styles.recentQuery,
                  )}
                >
                  <QueryItem
                    item={item}
                  />
                  <p className={styles.timestamp}>
                    {displayTimestamp(item.timestamp)}
                  </p>
                </button>
              ))
              : (
                <p className="mt-20 text-center text-dev-purple-50">No recent queries</p>
              )
          }
        </div>
      </PDDrawer>
    </Fragment>
  );
};

const QueryItem = ({ item }: QueryItemProps) => {

  return (
    <div className="flex flex-col gap-1">
      <p className={styles.queryItemName}>
        {`${item.type ? `${item.type}/${item.pallet}` : item.pallet || item.name}`}
      </p>

      {item.storage || item.method
        ? (
          <p className={styles.queryItemMethod}>
            {item.storage || item.method}
          </p>
        )
        : null}
    </div>
  );
};
