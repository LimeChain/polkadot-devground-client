import { formatDistanceToNowStrict } from 'date-fns';
import {
  useMemo,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { useStoreChain } from '@stores';

import Pagination from './pagination'; // Import the new Pagination component
import styles from './styles.module.css';

const LatestBlocks = () => {
  const blocksData = useStoreChain?.use?.blocksData?.();
  const [currentPage, setCurrentPage] = useState(1);
  const blocksPerPage = 10;

  const formatString = (hash: string) => {
    if (hash.length <= 8) {
      return hash;
    }
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  const sortedBlocks = useMemo(() => {
    return Array.from(blocksData.values()).sort((a, b) => {
      return new Date(b.header.timestamp).getTime() - new Date(a.header.timestamp).getTime();
    });
  }, [blocksData]);

  const indexOfLastBlock = currentPage * blocksPerPage;
  const indexOfFirstBlock = indexOfLastBlock - blocksPerPage;
  const currentBlocks = sortedBlocks.slice(indexOfFirstBlock, indexOfLastBlock);

  const totalPages = Math.ceil(sortedBlocks.length / blocksPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mb-12 items-center justify-between">
      <div className="flex items-center">
        <PDLink to="/explorer" className="mr-8 bg-dev-purple-700 p-2 dark:bg-white">
          <Icon
            name="icon-arrowLeft"
            className=" text-dev-white-200 dark:text-dev-purple-700"
          />
        </PDLink>
        <h4 className="mr-2 font-h4-light">Latest Blocks</h4>
      </div>
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
          {currentBlocks.map((block) => {
            const timeAgo = block.header.timestamp && formatDistanceToNowStrict(
              new Date(block.header.timestamp),
              { addSuffix: true },
            );

            return (
              <tr key={block.header.number}>
                <td>{block.header.number}</td>
                <td>
                  <Icon
                    size={[16]}
                    name="icon-checked"
                    className="text-dev-green-600"
                  />
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        classNames="mt-6 justify-end"
      />
    </div>
  );
};

export default LatestBlocks;
