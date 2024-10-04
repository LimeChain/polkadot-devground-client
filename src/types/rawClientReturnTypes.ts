export interface BlockHeader {
  parentHash: string;
  number: string;
  stateRoot: string;
  extrinsicsRoot: string;
  digest: {
    logs: string[];
  };
}

export interface Block {
  header: BlockHeader;
  extrinsics: string[];
  justification?: string;
}

export interface BlockDetails {
  block: Block;
  extrinsics: string[];
}
