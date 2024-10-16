export interface IBlockItem {
  blockNumber: number;
  blockHash: string;
  parentBlockHash: string;
  isFinalized: boolean;
  index: number;
}

interface IGenericExtrinsicMethod {
  method: string;
  section: string;
  args: unknown;
}

export interface IBlockExtrinsic {
  isSigned: boolean;
  method: IGenericExtrinsicMethod;
  signer?: {
    Id: string;
  };
}

export interface IMappedBlockExtrinsic {

  id: string;
  blockNumber: number;
  timestamp: number;
  isSuccess: boolean;
  hash?: string;
  extrinsicData: IBlockExtrinsic;
}

export interface IMappedBlockEvent {
  event: {
    type: string;
    value: {
      type: string;
      value: unknown;
    };
  };
  phase: {
    type: string;
    value: number | undefined;
  };
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
    spec_name?: string;
    spec_version: number;
  } | null;
  identity?: {
    name?: string;
    address: string;
  };
  parentHash?: string;
  stateRoot?: string;
  extrinsicRoot?: string;
  isFinalized?: boolean;
}

export interface IMappedBlockBody {
  events: Array<IMappedBlockEvent>;
  extrinsics: Array<IMappedBlockExtrinsic>;
}

export interface IMappedBlock {
  header: IMappedBlockHeader;
  body: IMappedBlockBody;
}
