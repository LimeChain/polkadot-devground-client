import { ChainDataList } from '@components/chainDataList';

export const ChainData = () => {
  return (
    <div className="flex size-full flex-col gap-8 overflow-hidden lg:flex-row">
      <ChainDataList
        title="Latest Blocks"
        link="latest-blocks"
        linkText="View All"
      />
      <ChainDataList
        title="Extrinsics"
        link="extrinsics"
        linkText="View All"
      />
    </div>
  );
};
