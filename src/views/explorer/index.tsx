import { ChainData } from '@components/chainData';
import { ChainState } from '@components/chainState';

const Explorer = () => {
  return (
    <div className="grid size-full grid-rows-[auto_auto_1fr] gap-12" >
      <div>
        search
      </div>
      <ChainState />
      <ChainData />
    </div>
  );
};

export default Explorer;
