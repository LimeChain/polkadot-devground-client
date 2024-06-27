import type { IConsoleMessage } from './global';

export interface IEventBusDemoCode {
  type: '@@-example-code';
  data: number;
}

export interface IEventBusConsoleMessage {
  type: '@@-console-message';
  data: IConsoleMessage[];
}
export interface IEventBusConsoleMessageReset {
  type: '@@-console-message-reset';
}
