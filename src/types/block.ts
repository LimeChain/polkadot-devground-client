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
