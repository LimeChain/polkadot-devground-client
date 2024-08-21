import { ChainData } from '@components/chainData';
import { ChainState } from '@components/chainState';

const Explorer = () => {
  return (
    <div className=" flex max-h-screen flex-col gap-12 overflow-hidden lg:h-full ">
      <div>
        search
      </div>
      <ChainState />
      <ChainData />
    </div>
  );
};

export default Explorer;
