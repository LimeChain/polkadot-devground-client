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
  args: any;
}

export interface IBlockExtrinsic {
  isSigned: boolean;
  method: IGenericExtrinsicMethod;
}

export interface IMappedBlockExtrinsic extends IBlockExtrinsic {
  id: string;
  blockNumber: number;
  timestamp: number;
  isSuccess: boolean;
}

// TODO use correct types for signature / account ids (ss58 strings)
export interface ITransferExtrinsicMethod extends IGenericExtrinsicMethod {
  args: {
    dest: {
      Id: string;
    };
    value: string;
  };
}

// TODO use correct types for signature / account ids (ss58 strings)
export interface IMappedTransferExtrinsic extends IMappedBlockExtrinsic {
  method: ITransferExtrinsicMethod;
  signature: string;
  signer: {
    Id: string;
  };
}

export interface IGenericExtrinsicMethod {
  method: string;
  section: string;
  args: any;
}

export interface IBlockExtrinsic {
  isSigned: boolean;
  method: IGenericExtrinsicMethod;
}

export interface IMappedBlockExtrinsic extends IBlockExtrinsic {
  id: string;
  blockNumber: number;
  timestamp: number;
  isSuccess: boolean;
}

// TODO use correct types for signature / account ids (ss58 strings)
export interface ITransferExtrinsicMethod extends IGenericExtrinsicMethod {
  args: {
    dest: {
      Id: string;
    };
    value: string;
  };
}

// TODO use correct types for signature / account ids (ss58 strings)
export interface IMappedTransferExtrinsic extends IMappedBlockExtrinsic {
  method: ITransferExtrinsicMethod;
  signature: string;
  signer: {
    Id: string;
  };
}
