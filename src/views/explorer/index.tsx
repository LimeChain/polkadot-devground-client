import { SearchBar } from '@components/searchBar';
import { cn } from '@utils/helpers';

import { ChainDataList } from './components/chainDataList';
import { ChainStateBlock } from './components/chainStateBlock';
import { ExtrinsicsList } from './components/extrinsicsList';
import { LatestBlocksList } from './components/latestBlocksList';

const Explorer = () => {
  return (
    <div className="flex flex-col gap-12 overflow-hidden lg:h-full">
      <SearchBar label="Search block/extrinsic" type="all" />

      <div className={cn(
        'grid gap-4',
        'p-3 md:p-6',
        'bg-dev-purple-100 dark:bg-dev-black-900',
        'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
      )}
      >
        <ChainStateBlock type="blockTime" />
        <ChainStateBlock type="bestBlock" />
        <ChainStateBlock type="finalizedBlock" />
        <ChainStateBlock type="totalIssuance" />
        <ChainStateBlock type="totalStake" />
      </div>

      <div className="flex size-full flex-col gap-8 overflow-hidden lg:flex-row">
        <ChainDataList
          title="Latest Blocks"
          link="latest-blocks"
          linkText="View All"
        >
          <LatestBlocksList />
        </ChainDataList>

        <ChainDataList
          title="Extrinsics"
          link="extrinsics"
          linkText="View All"
        >
          <ExtrinsicsList />
        </ChainDataList>
      </div>
    </div>
  );
};

export default Explorer;
