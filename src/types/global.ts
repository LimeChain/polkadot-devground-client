export interface IConsoleMessage {
  ts: number;
  message: string;
}

export interface IErrorItem {
  message: string;
  severity: number;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

declare global {
  interface Window {
    pivanov?: unknown; // for testing purposes
    PDStoreSizes: Record<string, number>;
    customPackages: Record<string, unknown>;
  }
}
