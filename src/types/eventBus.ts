import type { IConsoleMessage } from './global';

export interface IEventBusDemoCodeIndex {
  type: '@@-example-code-index';
  data: number;
}

export interface IEventBusDemoCode {
  type: '@@-example-code';
  data: string;
}

export interface IEventBusConsoleMessage {
  type: '@@-console-message';
  data: IConsoleMessage[];
}
export interface IEventBusConsoleMessageReset {
  type: '@@-console-message-reset';
}

export interface IEventBusIframeDestroy {
  type: '@@-iframe-destroy';
}
