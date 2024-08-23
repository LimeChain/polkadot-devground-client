import { formatDistanceToNowStrict } from 'date-fns';

import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import styles from './styles.module.css';

const LatestBlocks = () => {
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();
  const blocksData = useStoreChain?.use?.blocksData?.();

  const formatString = (hash: string) => {
    if (hash.length <= 8) {
      return hash;
    }
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  return (
    <>
      <div className="flex items-center">
        <PDLink
          to="/explorer"
          className={cn(
            'mr-8 duration-300 ease-out',
            'bg-dev-purple-700 p-2 dark:bg-dev-purple-50',
            'hover:bg-dev-purple-900 hover:dark:bg-dev-purple-200',
          )}
        >
          <Icon
            name="icon-arrowLeft"
            className=" text-dev-white-200 dark:text-dev-purple-700"
          />
        </PDLink>
        <h4 className="mr-2 font-h4-light">Latest Blocks</h4>
      </div>
      {/* <SearchBar
        label="Search by Block"
        classNames="mt-6"
      /> */}

      <table className={styles['latest-blocks-table']}>
        <thead>
          <tr>
            <th>Block</th>
            <th>Status</th>
            <th>Time</th>
            <th>Extrinsics</th>
            <th>Events</th>
            <th>Validator</th>
            <th>Block Hash</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(blocksData.values()).reverse().map((block) => {
            const timeAgo = block.header.timestamp && formatDistanceToNowStrict(
              new Date(block.header.timestamp),
              { addSuffix: true },
            );

            return (
              <tr key={block.header.number}>
                <td>{block.header.number}</td>
                <td>
                  {latestFinalizedBlock && latestFinalizedBlock >= block.header.number
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
                        className="text-dev-yellow-700"
                      />
                    )
                  }
                </td>
                <td>{timeAgo}</td>
                <td>{block.body.extrinsics.length}</td>
                <td>{block.body.events.length}</td>
                <td>{formatString(block.header.identity)}</td>
                <td>{formatString(block.header.hash)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default LatestBlocks;
