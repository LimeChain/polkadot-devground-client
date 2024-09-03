import { PDLink } from '@components/pdLink';
import { cn } from '@utils/helpers';

import { ExtrinsicsList } from './extrinsicsList';
import { LatestBlocksList } from './latestBlocksList';

interface TChainDataList {
  title: string;
  link: string;
  linkText: string;
}

export const ChainDataList = ({ title, link, linkText }: TChainDataList) => {
  const isLatestBlocks = link === 'latest-blocks';
  return (
    <div className="flex flex-1 flex-col gap-y-3 overflow-hidden">
      <div className="flex items-center gap-3">
        <h5 className="font-h5-bold">{title}</h5>
        <PDLink
          to={link}
          className={cn(
            'font-geist font-body2-regular',
            'text-dev-pink-500 transition-colors hover:text-dev-pink-400',
          )}
        >
          {linkText}
        </PDLink>
      </div>
      {
        isLatestBlocks
        && <LatestBlocksList />
      }
      {
        !isLatestBlocks
        && <ExtrinsicsList/>
      }
    </div>
  );
};
