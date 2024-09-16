/* eslint-disable import/export */
export interface IBlock {
  hash: string;
  extrinsics: string[];
  header: {
    number: string;
    parentHash: string;
    stateRoot: string;
    extrinsicsRoot: string;
    digest: {
      logs: string[];
    };
  };
  timestamp: number | null;
}

export interface IGenericExtrinsicMethod {
  method: string;
  section: string;
  args: unknown;
}

export interface IBlockExtrinsic {
  isSigned: boolean;
  method: IGenericExtrinsicMethod;
}

export interface IMappedBlockExtrinsic extends IBlockExtrinsic {
  signer: {
    Id: string;
  };
  id: string;
  blockNumber: number;
  timestamp: number;
  isSuccess: boolean;
}

export interface ITransferExtrinsicMethod extends IGenericExtrinsicMethod {
  args: {
    dest: {
      Id: string;
    };
    value: string;
  };
}
