import { formatDistanceToNowStrict } from 'date-fns';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import Pagination from '@components/pagination';
import { PDLink } from '@components/pdLink';
import SearchBar from '@components/searchBar';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import styles from './styles.module.css';

const LatestBlocks = () => {
  const latestFinalizedBlock = useStoreChain.use.finalizedBlock?.();
  const blocksData = useStoreChain?.use?.blocksData?.();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const blocksPerPage = 11;

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

  const filteredBlocks = useMemo(() => {
    return sortedBlocks.filter(block =>
      block.header.number.toString().includes(searchQuery)
      || block.header.hash.includes(searchQuery)
      || block.header.identity.includes(searchQuery),
    );
  }, [sortedBlocks, searchQuery]);

  const indexOfLastBlock = currentPage * blocksPerPage;
  const indexOfFirstBlock = indexOfLastBlock - blocksPerPage;
  const currentBlocks = filteredBlocks.slice(indexOfFirstBlock, indexOfLastBlock);

  const totalPages = Math.ceil(filteredBlocks.length / blocksPerPage);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  console.log('latestFinalizedBlock', latestFinalizedBlock);
  return (
    <div className="mb-12 items-center justify-between">
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
      <SearchBar
        label="Search by Block"
        classNames="mt-6"
        onSearch={handleSearch}
      />
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
