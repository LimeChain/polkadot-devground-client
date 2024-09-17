export interface IBlockItem {
  blockNumber: number;
  blockHash: string;
  parentBlockHash: string;
  isFinalized: boolean;
  index: number;
}

export interface IMappedBlockExtrinsic extends IBlockExtrinsic {
  signer?: {
    Id: string;
  };
  id: string;
  blockNumber: number;
  timestamp: number;
  isSuccess: boolean;
}

interface IGenericExtrinsicMethod {
  method: string;
  section: string;
  args: unknown;
}

export interface IBlockExtrinsic {
  isSigned: boolean;
  method: IGenericExtrinsicMethod;
}

export interface ITransferExtrinsicMethod extends IGenericExtrinsicMethod {
  args: {
    dest: {
      Id: string;
    };
    value: string;
  };
}
