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
