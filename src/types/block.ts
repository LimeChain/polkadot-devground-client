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
  hash: string;
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

export interface IMappedBlockHeader {
  number: number;
  hash: string;
  timestamp: number;
  runtime?: {
    spec_name: string;
    spec_version: number;
  } | null;
  identity: {
    name: undefined | string | any;
    address?: string;
  };
  parentHash: string;
  stateRoot: string;
  extrinsicRoot: string;
  isFinalized?: boolean;
}

export interface IMappedBlockBody {
  events: Array<{
    // Define the structure of an event if known
    // For example:
    // type: string;
    // data: any;
  }>;
  extrinsics: Array<IMappedBlockExtrinsic>;
}

export interface IMappedBlock {
  header: IMappedBlockHeader;
  body: IMappedBlockBody;
}
