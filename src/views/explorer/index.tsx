import { ChainState } from '@components/chainState';

const Explorer = () => {
  return (
    <div className="grid size-full grid-rows-[auto_auto_1fr] gap-12" >
      <div>
        search
      </div>
      <ChainState />
      <div>
        chain data
      </div>
    </div>
  );
};

export default Explorer;
