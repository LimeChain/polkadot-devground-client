import { ChainDataList } from '@components/chainDataList';

export const ChainData = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <ChainDataList
        title="Latest Blocks"
        link="/latest-blocks"
        linkText="View All"
      />
      <ChainDataList
        title="Signed Extrinsics"
        link="/signed-extrinsics"
        linkText="View All"
      />
    </div>
  );
};
