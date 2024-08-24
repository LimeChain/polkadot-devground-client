import { ChainData } from '@components/chainData';
import { ChainState } from '@components/chainState';

const Explorer = () => {
  return (
    <div className="flex flex-col gap-12 overflow-hidden lg:h-full ">
      <div>
        search
      </div>
      <ChainState />
      <ChainData />
    </div>
  );
};

export default Explorer;
