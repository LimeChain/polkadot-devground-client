export interface IBlockHeader {
  number: string;
  parentHash: string;
  stateRoot: string;
  extrinsicsRoot: string;
  digest: {
    logs: string[];
  };
}

// Define the block type
export interface IBlock {
  header: IBlockHeader;
  extrinsics: string[];
}
